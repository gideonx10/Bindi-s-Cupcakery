"use client";
import { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Search } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useRouter } from "next/navigation";

interface Category {
  _id: string;
  name: string;
}

interface OrderProduct {
  product: {
    _id: string;
    name: string;
    category: Category | string;
  };
  quantity: number;
}

interface User {
  _id: string;
  name: string;
  email: string;
  phone: string;
}

export interface Order {
  _id: string;
  user: User;
  products: OrderProduct[];
  totalAmount: number;
  status: "pending" | "ready to take-away" | "delivered" | "cancelled";
  createdAt: string;
  isHamper: boolean;
  isPaymentVerified: boolean;
  transactionId?: string;
  customization?: string;
}

const getPaymentStatus = (order: Order) => {
  if (order.isPaymentVerified) {
    return order.transactionId ? "Payment Verified" : "Payment Received";
  } else {
    return order.transactionId ? "Payment Not Verified" : "Payment Pending";
  }
};

const getPaymentStatusColor = (status: string) => {
  switch (status) {
    case "Payment Verified":
      return "bg-green-100 text-green-800";
    case "Payment Received":
      return "bg-blue-100 text-blue-800";
    case "Payment Not Verified":
      return "bg-yellow-100 text-yellow-800";
    case "Payment Pending":
      return "bg-gray-100 text-gray-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

const ProductsModal = ({
  products,
  customization,
  isHamper,
}: {
  products: OrderProduct[];
  customization?: string;
  isHamper: boolean;
}) => {
  return (
<Dialog>
      <DialogTrigger>
        <Badge
          variant="secondary"
          className="cursor-pointer hover:bg-secondary/80"
        >
          {products.length} items
        </Badge>
      </DialogTrigger>
      <DialogContent className="max-w-[400px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Order Products</DialogTitle>
        </DialogHeader>
        {/* Attractive Hamper Notification */}
        {isHamper && (
          <div className="p-2 bg-purple-200 text-purple-800 rounded text-center transition-colors duration-200 hover:bg-purple-300 my-4">
            <span className="font-semibold text-sm">Hamper Order</span>
          </div>
        )}
        <div className="space-y-4 mt-4">
          {products.map((item, idx) => (
            <div
              key={idx}
              className="rounded-lg border p-4 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="font-semibold text-lg">{item.product.name}</div>
              <div className="text-gray-600 mt-1">
                Category:{" "}
                {typeof item.product.category === "object" &&
                item.product.category !== null
                  ? (item.product.category as Category).name
                  : item.product.category}
              </div>
              <div className="text-gray-600 mt-1">
                Quantity: {item.quantity}
              </div>
            </div>
          ))}
          {customization && (
            <div className="mt-4 p-4 bg-gray-50 rounded-lg">
              <h4 className="font-semibold mb-2">Customization Notes:</h4>
              <p className="text-gray-600">{customization}</p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const { toast } = useToast();
  const [userId, setUserId] = useState<string>("");
  const router = useRouter();

  useEffect(() => {
    const checkSession = async () => {
      const res = await fetch("/api/session", {
        method: "GET",
        credentials: "include", // ✅ Ensures cookies are sent with request
      });

      const sessionData = await res.json();
      console.log(sessionData);
      if (sessionData.authenticated) {
        setUserId(sessionData.userId);
      } else {
        console.log("Not authenticated:", sessionData.message);
        router.push("/admin/login");
      }
    };
    checkSession();
  }, []);

  useEffect(() => {
    if (!userId) return;

    const fetchData = async () => {
      try {
        const [userRes] = await Promise.all([
          fetch(`/api/user/details?userId=${userId}`),
          // fetch(`/api/orders?userId=${userId}`),
        ]);

        const userData = await userRes.json();
        console.log(userData);
        if (!userData || userData.user.role !== "admin") {
          router.push("/admin/login");
        }

        // setOrders(ordersData.reverse()); // If you plan to use orders
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        // setLoading(false);
      }
    };
    fetchData();
  }, [userId]);

  useEffect(() => {
    fetchOrders();
  }, []);

  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredOrders(orders);
    } else {
      const term = searchTerm.toLowerCase();
      const filtered = orders.filter(
        (order) =>
          order._id.toLowerCase().includes(term) ||
          order.user.name.toLowerCase().includes(term) ||
          (order.transactionId &&
            order.transactionId.toLowerCase().includes(term))
      );
      setFilteredOrders(filtered);
    }
  }, [searchTerm, orders]);

  async function fetchOrders() {
    try {
      const res = await fetch("/api/admin/orders", { cache: "no-cache" });
      if (!res.ok) throw new Error("Failed to fetch orders");
      const data = await res.json();
      setOrders(data);
      setFilteredOrders(data);
    } catch (error) {
      console.error("Error fetching orders:", error);
      toast({
        title: "Error",
        description: "Failed to fetch orders",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }

  async function updateOrderStatus(orderId: string, status: Order["status"]) {
    try {
      const res = await fetch(`/api/admin/orders?orderId=${orderId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (!res.ok) throw new Error("Failed to update order status");
      toast({
        title: "Success",
        description: "Order status updated successfully",
      });
      await fetchOrders();
    } catch (error) {
      console.error("Error updating order:", error);
      toast({
        title: "Error",
        description:
          error instanceof Error ? error.message : "Failed to update order",
        variant: "destructive",
      });
    }
  }

  async function updatePaymentVerification(
    orderId: string,
    isVerified: boolean
  ) {
    try {
      const res = await fetch(`/api/admin/orders?orderId=${orderId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isPaymentVerified: isVerified }),
      });
      if (!res.ok) throw new Error("Failed to update payment verification");
      toast({
        title: "Success",
        description: "Payment verification status updated successfully",
      });
      await fetchOrders();
    } catch (error) {
      console.error("Error updating payment verification:", error);
      toast({
        title: "Error",
        description:
          error instanceof Error
            ? error.message
            : "Failed to update payment verification",
        variant: "destructive",
      });
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        Loading orders...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      <div className="p-8 space-y-8 max-w-8xl mx-auto">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between space-y-4 md:space-y-0 pb-6 border-b border-slate-200 dark:border-slate-700">
          <div className="space-y-1">
            <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-700 dark:from-slate-100 dark:to-slate-300">
              Orders Management
            </h1>
            <p className="text-slate-500 dark:text-slate-400">
              Track and manage customer orders
            </p>
          </div>

          <div className="relative w-full md:w-96">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-slate-400" />
            </div>
            <Input
              type="text"
              placeholder="Search orders..."
              className="pl-10 bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm border-slate-200 dark:border-slate-700 focus:ring-slate-400 dark:focus:ring-slate-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-pulse space-y-4">
              <div className="h-4 w-32 bg-slate-200 dark:bg-slate-700 rounded"></div>
              <div className="h-4 w-24 bg-slate-200 dark:bg-slate-700 rounded"></div>
            </div>
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="text-center py-16 bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm rounded-lg border border-slate-200 dark:border-slate-700">
            <p className="text-slate-500 dark:text-slate-400">
              {searchTerm
                ? "No orders found matching your search"
                : "No orders found"}
            </p>
          </div>
        ) : (
          <div className="relative">
            <div className="absolute inset-0 bg-white/30 dark:bg-slate-800/30 backdrop-blur-sm rounded-xl"></div>

            <div className="relative overflow-hidden rounded-xl border border-slate-200 dark:border-slate-700 bg-white/50 dark:bg-slate-900/50 backdrop-blur-md">
              <div className="overflow-x-auto scrollbar-thin scrollbar-thumb-slate-200 dark:scrollbar-thumb-slate-700">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-slate-50/50 dark:bg-slate-800/50 hover:bg-slate-100/50 dark:hover:bg-slate-700/50">
                      <TableHead className="font-semibold text-slate-700 dark:text-slate-300">
                        Order ID
                      </TableHead>
                      <TableHead className="font-semibold text-slate-700 dark:text-slate-300">
                        Customer
                      </TableHead>
                      <TableHead className="font-semibold text-slate-700 dark:text-slate-300">
                        Contact
                      </TableHead>
                      <TableHead className="font-semibold text-slate-700 dark:text-slate-300">
                        Products
                      </TableHead>
                      <TableHead className="font-semibold text-slate-700 dark:text-slate-300">
                        Total
                      </TableHead>
                      <TableHead className="font-semibold text-slate-700 dark:text-slate-300">
                        Payment
                      </TableHead>
                      <TableHead className="font-semibold text-slate-700 dark:text-slate-300">
                        Status
                      </TableHead>
                      <TableHead className="font-semibold text-slate-700 dark:text-slate-300">
                        Date
                      </TableHead>
                      <TableHead className="font-semibold text-slate-700 dark:text-slate-300">
                        Actions
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredOrders.map((order) => (
                      <TableRow
                        key={order._id}
                        className="transition-all duration-200 hover:bg-slate-50/50 dark:hover:bg-slate-800/50"
                      >
                        <TableCell className="font-medium text-slate-900 dark:text-slate-100">
                          {order._id}
                        </TableCell>
                        <TableCell>
                          <div className="font-medium text-slate-900 dark:text-slate-100">
                            {order.user.name}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="space-y-1">
                            <div className="text-sm text-slate-600 dark:text-slate-400">
                              {order.user.email}
                            </div>
                            <div className="text-sm text-slate-600 dark:text-slate-400">
                              {order.user.phone}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <ProductsModal
                            isHamper={order.isHamper}
                            products={order.products}
                            customization={order.customization}
                          />
                        </TableCell>
                        <TableCell>
                          <span className="font-medium text-slate-900 dark:text-slate-100">
                            ${order.totalAmount.toFixed(2)}
                          </span>
                        </TableCell>
                        <TableCell>
                          <div className="space-y-3">
                            <Badge
                              className={`${getPaymentStatusColor(
                                getPaymentStatus(order)
                              )} font-medium`}
                            >
                              {getPaymentStatus(order)}
                            </Badge>
                            {order.transactionId && (
                              <div className="text-sm">
                                <span className="font-medium text-slate-600 dark:text-slate-400">
                                  Transaction ID:
                                </span>
                                <br />
                                <span className="font-mono text-xs text-slate-500 dark:text-slate-500">
                                  {order.transactionId}
                                </span>
                              </div>
                            )}
                            <div className="flex items-center space-x-2">
                              <Switch
                                checked={order.isPaymentVerified}
                                onCheckedChange={(checked) =>
                                  updatePaymentVerification(order._id, checked)
                                }
                                id={`payment-verify-${order._id}`}
                              />
                              <Label
                                htmlFor={`payment-verify-${order._id}`}
                                className="text-sm text-slate-600 dark:text-slate-400"
                              >
                                {order.isPaymentVerified
                                  ? "Mark as Not Paid"
                                  : "Mark as Paid"}
                              </Label>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant="outline"
                            className="capitalize font-medium"
                          >
                            {order.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm text-slate-600 dark:text-slate-400">
                            {new Date(order.createdAt).toLocaleString()}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Select
                            value={order.status}
                            onValueChange={(newStatus) =>
                              updateOrderStatus(
                                order._id,
                                newStatus as Order["status"]
                              )
                            }
                          >
                            <SelectTrigger className="w-[180px] bg-white/50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700">
                              <SelectValue placeholder="Update status" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="pending">Pending</SelectItem>
                              <SelectItem value="ready to take-away">
                                Ready to take-away
                              </SelectItem>
                              <SelectItem value="delivered">
                                Delivered
                              </SelectItem>
                              <SelectItem value="cancelled">
                                Cancelled
                              </SelectItem>
                            </SelectContent>
                          </Select>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}