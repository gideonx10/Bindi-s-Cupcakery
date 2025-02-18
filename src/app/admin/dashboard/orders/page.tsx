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
  userDeleted?: boolean; // Add this field
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
}: {
  products: OrderProduct[];
  customization?: string;
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

const getDeletedUserStyle = (isDeleted: boolean) => {
  if (isDeleted) {
    return "text-gray-500 italic";
  }
  return "";
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
      const res = await fetch("/api/admin/session", {
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
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-bold mb-4">Orders Management</h1>

      <div className="relative w-full max-w-sm">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-4 w-4 text-gray-400" />
        </div>
        <Input
          type="text"
          placeholder="Search by Order ID, Customer name, or Transaction ID..."
          className="pl-10"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {filteredOrders.length === 0 ? (
        <div className="text-center py-10">
          <p className="text-gray-500">
            {searchTerm
              ? "No orders found matching your search"
              : "No orders found"}
          </p>
        </div>
      ) : (
        <div className="border rounded-lg">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order ID</TableHead>
                <TableHead>Customer Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Products</TableHead>
                <TableHead>Total</TableHead>
                <TableHead>Payment Details</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Placed At</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredOrders.map((order) => (
                <TableRow key={order._id}>
                  <TableCell className="font-medium">{order._id}</TableCell>
                  <TableCell
                    className={getDeletedUserStyle(order.userDeleted ?? false)}
                  >
                    {order.user.name}
                    {order.userDeleted && (
                      <Badge variant="secondary" className="ml-2 text-xs">
                        Deleted Account
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell
                    className={getDeletedUserStyle(order.userDeleted ?? false)}
                  >
                    {order.user.email}
                  </TableCell>
                  <TableCell
                    className={getDeletedUserStyle(order.userDeleted ?? false)}
                  >
                    {order.user.phone}
                  </TableCell>
                  <TableCell>
                    <ProductsModal
                      products={order.products}
                      customization={order.customization}
                    />
                  </TableCell>
                  <TableCell>${order.totalAmount.toFixed(2)}</TableCell>
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
                          <span className="font-medium">Transaction ID:</span>
                          <br />
                          <span className="font-mono text-xs">
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
                          className="text-sm"
                        >
                          {order.isPaymentVerified
                            ? "Mark as Not Paid"
                            : "Mark as Paid"}
                        </Label>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="capitalize">{order.status}</TableCell>
                  <TableCell>
                    {new Date(order.createdAt).toLocaleString()}
                  </TableCell>
                  <TableCell>
                    <Select
                      value={order.status}
                      onValueChange={(newStatus) => {
                        updateOrderStatus(
                          order._id,
                          newStatus as Order["status"]
                        );
                      }}
                    >
                      <SelectTrigger className="w-[140px]">
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="ready to take-away">
                          Ready to take-away
                        </SelectItem>{" "}
                        <SelectItem value="delivered">Delivered</SelectItem>
                        <SelectItem value="cancelled">Cancelled</SelectItem>
                      </SelectContent>
                    </Select>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}
