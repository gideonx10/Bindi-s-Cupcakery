import { useEffect, useState, useCallback } from "react";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Clock, Package, CreditCard, AlertCircle } from "lucide-react";

interface Product {
  _id: string;
  name: string;
  price: number;
}

interface Order {
  _id: string;
  products: { product: Product; quantity: number }[];
  totalAmount: number;
  createdAt: string;
  status: string;
  transactionId: number;
  isPaymentVerified: boolean;
  isHamper: boolean;
}

export default function OrdersPage({ userId }: { userId: string }) {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCanceling, setIsCanceling] = useState(false);

  useEffect(() => {
    if (!userId) return;

    const fetchOrders = async () => {
      try {
        const res = await fetch(`/api/orders?userId=${userId}`);
        if (!res.ok) throw new Error("Failed to fetch orders");
        const data = await res.json();

        const sortedOrders = data.sort((a: Order, b: Order) => {
          if (a.status === "pending" && b.status !== "pending") return -1;
          if (a.status !== "pending" && b.status === "pending") return 1;
          return (
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );
        });

        setOrders(sortedOrders);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [userId]);

  const handleCancelOrder = useCallback(
    async (orderId: string, createdAt: string) => {
      const orderTime = new Date(createdAt).getTime();
      const currentTime = new Date().getTime();
      const fiveHours = 5 * 60 * 60 * 1000;

      if (currentTime - orderTime > fiveHours) {
        alert(
          "You cannot cancel this order. The 5-hour cancellation window has passed."
        );
        return;
      }

      setIsCanceling(true);

      try {
        const res = await fetch(`/api/orders`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ orderId }),
        });

        if (!res.ok) throw new Error("Failed to cancel order");

        setOrders((prevOrders) =>
          prevOrders.map((order) =>
            order._id === orderId ? { ...order, status: "cancelled" } : order
          )
        );

        const userRes = await fetch(`/api/user/details?userId=${userId}`);
        if (!userRes.ok) throw new Error("Failed to fetch user details");
        const userData = await userRes.json();

        await fetch("/api/send-message", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            phoneNumber: "+917600960068",
            message: `🚫 *Order Cancelled!*\n\n📦 *Order ID:* ${orderId}\n👤 *Customer:* ${userData.name}\n📞 *Contact:* ${userData.phone}\n\nYour order has been successfully cancelled. If this was a mistake, please contact support.`,
          }),
        });

        await fetch("/api/send-email", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            to: userData.email,
            subject: "Order Cancellation Confirmation",
            text: `Dear ${userData.name},\n\nYour order (Order ID: ${orderId}) has been successfully cancelled.\n\nIf this was done by mistake, please contact our support team immediately.\n\nBest regards,\nBindi's Cupcakery`,
          }),
        });

        alert("Order has been cancelled successfully, and notifications sent.");
      } catch (error) {
        console.error(error);
        alert("Failed to cancel order. Please try again.");
      } finally {
        setIsCanceling(false);
      }
    },
    []
  );

  const getStatusBadgeProps = (status: string) => {
    switch (status) {
      case "delivered":
        return {
          variant: "success" as const,
          className: "bg-green-100 text-green-800",
        };
      case "pending":
        return {
          variant: "warning" as const,
          className: "bg-yellow-100 text-yellow-800",
        };
      case "cancelled":
        return {
          variant: "destructive" as const,
          className: "bg-red-100 text-red-800",
        };
      default:
        return {
          variant: "secondary" as const,
          className: "bg-gray-100 text-gray-800",
        };
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-8 text-gray-800">My Orders</h1>
      {orders.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center p-8">
            <Package className="w-16 h-16 text-gray-400 mb-4" />
            <p className="text-lg text-gray-600">No orders found.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <Card
              key={order._id}
              className={`transform transition-all duration-200 hover:shadow-lg ${
                order.isHamper ? "bg-purple-50" : ""
              }`}
            >
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <div className="space-y-1">
                  <p className="text-sm font-medium text-gray-500">Order ID</p>
                  <p className="text-lg font-semibold">{order._id}</p>
                </div>
                <div className="flex gap-2">
                  {order.isHamper && (
                    <Badge className="bg-purple-100 text-purple-800">
                      Hamper
                    </Badge>
                  )}
                  <Badge {...getStatusBadgeProps(order.status)}>
                    {order.status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4">
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    <div className="flex items-center gap-2">
                      <CreditCard className="w-4 h-4 text-gray-500" />
                      <div>
                        <p className="text-sm font-medium text-gray-500">
                          Payment Mode
                        </p>
                        <p className="font-semibold">
                          {order.transactionId > 0
                            ? "Online"
                            : "Pay on take away"}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-gray-500" />
                      <div>
                        <p className="text-sm font-medium text-gray-500">
                          Placed On
                        </p>
                        <p className="font-semibold">
                          {new Date(order.createdAt).toLocaleString()}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 text-gray-500" />
                      <div>
                        <p className="text-sm font-medium text-gray-500">
                          Total Amount
                        </p>
                        <p className="font-semibold">
                          ₹{order.totalAmount.toFixed(2)}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4">
                    <p className="text-sm font-medium text-gray-500 mb-2">
                      Products
                    </p>
                    <div className="grid gap-2">
                      {order.products.map(({ product, quantity }) =>
                        product ? (
                          <div
                            key={product._id}
                            className="flex justify-between items-center p-3 bg-white rounded-lg border border-gray-200"
                          >
                            <span className="font-medium">{product.name}</span>
                            <div className="flex items-center gap-4">
                              <span className="text-gray-600">x{quantity}</span>
                              <span className="font-semibold">
                                ₹{(product.price * quantity).toFixed(2)}
                              </span>
                            </div>
                          </div>
                        ) : (
                          <div
                            key={quantity}
                            className="p-3 bg-red-50 text-red-700 rounded-lg border border-red-200"
                          >
                            Product details unavailable
                          </div>
                        )
                      )}
                    </div>
                  </div>

                  {order.status === "pending" && (
                    <button
                      className="mt-4 w-full md:w-auto px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                      onClick={() =>
                        handleCancelOrder(order._id, order.createdAt)
                      }
                      disabled={isCanceling}
                    >
                      {isCanceling ? "Cancelling..." : "Cancel Order"}
                    </button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
