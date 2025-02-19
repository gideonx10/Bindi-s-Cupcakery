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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
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

// Helper functions for payment status
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

// Modal component to display order products and any customization notes
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

export default function PendingOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [pendingOrders, setPendingOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [totalOrders, setTotalOrders] = useState<number>(0);
  const [pendingAlerts, setPendingAlerts] = useState<number>(0);
  const { toast } = useToast();
  const router = useRouter();

  // Fetch the stats for total orders and pending alerts
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const ordersRes = await fetch("/api/admin/stats/orders", {
          credentials: "include",
        });
        if (!ordersRes.ok) throw new Error("Failed to fetch total orders");
        const ordersData = await ordersRes.json();
        setTotalOrders(ordersData.totalOrders);
        setPendingAlerts(ordersData.pendingAlerts);
      } catch (error) {
        console.error(error);
        toast({
          title: "Error",
          description: error instanceof Error ? error.message : "Failed to fetch stats",
          variant: "destructive",
        });
      }
    };
    fetchStats();
  }, [toast]);

  // Fetch orders and then filter for pending orders sorted by createdAt (newest first)
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await fetch("/api/admin/orders", { cache: "no-cache" });
        if (!res.ok) throw new Error("Failed to fetch orders");
        const data: Order[] = await res.json();
        setOrders(data);
        const pending = data.filter((order) => order.status === "pending");
        pending.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        setPendingOrders(pending);
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
    };
    fetchOrders();
  }, [toast]);

  // Function to update the order status if needed
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
      // After updating, refetch the orders list
      const updatedOrders = orders.map((order) =>
        order._id === orderId ? { ...order, status } : order
      );
      setOrders(updatedOrders);
      const pending = updatedOrders.filter((order) => order.status === "pending");
      pending.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      setPendingOrders(pending);
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

  // Function to update payment verification status if needed
  async function updatePaymentVerification(orderId: string, isVerified: boolean) {
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
      // Update local state after verification change
      const updatedOrders = orders.map((order) =>
        order._id === orderId ? { ...order, isPaymentVerified: isVerified } : order
      );
      setOrders(updatedOrders);
      const pending = updatedOrders.filter((order) => order.status === "pending");
      pending.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      setPendingOrders(pending);
    } catch (error) {
      console.error("Error updating payment verification:", error);
      toast({
        title: "Error",
        description:
          error instanceof Error ? error.message : "Failed to update payment verification",
        variant: "destructive",
      });
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        Loading pending orders...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 p-8">
      <header className="mb-8">
        <h1 className="text-4xl font-bold text-slate-900 dark:text-slate-100">
          Pending Orders
        </h1>
        <p className="text-slate-600 dark:text-slate-400">
          Total Orders: {totalOrders} | Pending Alerts: {pendingAlerts}
        </p>
      </header>
      <Table>
        <TableHeader>
          <TableRow className="bg-slate-50 dark:bg-slate-800">
            <TableHead className="font-semibold text-slate-700 dark:text-slate-300">Order ID</TableHead>
            <TableHead className="font-semibold text-slate-700 dark:text-slate-300">Customer</TableHead>
            <TableHead className="font-semibold text-slate-700 dark:text-slate-300">Products</TableHead>
            <TableHead className="font-semibold text-slate-700 dark:text-slate-300">Payment</TableHead>
            <TableHead className="font-semibold text-slate-700 dark:text-slate-300">Status</TableHead>
            <TableHead className="font-semibold text-slate-700 dark:text-slate-300">Date</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {pendingOrders.map((order) => (
            <TableRow key={order._id} className="hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">
              <TableCell className="font-medium text-slate-900 dark:text-slate-100">{order._id}</TableCell>
              <TableCell>
                <div className="text-slate-900 dark:text-slate-100 font-medium">
                  {order.user.name}
                </div>
              </TableCell>
              <TableCell>
                <ProductsModal products={order.products} customization={order.customization} />
              </TableCell>
              <TableCell>
                <div className="space-y-3">
                  <Badge className={`${getPaymentStatusColor(getPaymentStatus(order))} font-medium`}>
                    {getPaymentStatus(order)}
                  </Badge>
                  {order.transactionId && (
                    <div className="text-xs text-slate-500 dark:text-slate-400">
                      Transaction ID: {order.transactionId}
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
                      {order.isPaymentVerified ? "Not Paid" : "Paid"}
                    </Label>
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <Badge variant="outline" className="capitalize font-medium">
                  {order.status}
                </Badge>
                <div className="mt-2">
                  <Select
                    value={order.status}
                    onValueChange={(newStatus) =>
                      updateOrderStatus(order._id, newStatus as Order["status"])
                    }
                  >
                    <SelectTrigger className="w-[180px] bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700">
                      <SelectValue placeholder="Update status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="ready to take-away">Ready to take-away</SelectItem>
                      <SelectItem value="delivered">Delivered</SelectItem>
                      <SelectItem value="cancelled">Cancelled</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </TableCell>
              <TableCell>
                <div className="text-sm text-slate-600 dark:text-slate-400">
                  {new Date(order.createdAt).toLocaleString()}
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}