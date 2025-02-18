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

export default function OrdersPage({ userId }: { userId: string | undefined }) {
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
            phoneNumber: "7600960068",
            message: `🚫 *Order Cancelled!*\n\n📦 *Order ID:* ${orderId}\n👤 *Customer:* ${userData.user.name}\n📞 *Contact:* ${userData.user.phone}\n\nYour order has been successfully cancelled. If this was a mistake, please contact support.`,
          }),
        });

        await fetch("/api/send-email", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            to: userData.user.email,
            subject: "Order Cancellation Confirmation",
            text: `Dear ${userData.user.name},\n\nYour order (Order ID: ${orderId}) has been successfully cancelled.\n\nIf this was done by mistake, please contact our support team immediately.\n\nBest regards,\nBindi's Cupcakery`,
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
          className:
            "bg-green-100 text-green-800 hover:bg-green-200 transition-colors duration-200",
        };
      case "pending":
        return {
          variant: "warning" as const,
          className:
            "bg-yellow-100 text-yellow-800 hover:bg-yellow-200 transition-colors duration-200",
        };
      case "cancelled":
        return {
          variant: "destructive" as const,
          className:
            "bg-red-100 text-red-800 hover:bg-red-200 transition-colors duration-200",
        };
      default:
        return {
          variant: "secondary" as const,
          className:
            "bg-gray-100 text-gray-800 hover:bg-gray-200 transition-colors duration-200",
        };
    }
  };

  const getPaymentBadgeProps = (isVerified: boolean, transactionId: number) => {
    if (isVerified && transactionId) {
      return {
        variant: "success" as const,
        className:
          "bg-green-100 text-green-800 hover:bg-green-200 transition-colors duration-200",
        label: "Payment Verified",
      };
    } else if (isVerified && !transactionId) {
      return {
        variant: "success" as const,
        className:
          "bg-green-100 text-green-800 hover:bg-green-200 transition-colors duration-200",
        label: "Payment Received",
      };
    } else if (!isVerified && transactionId) {
      return {
        variant: "warning" as const,
        className:
          "bg-yellow-100 text-yellow-800 hover:bg-yellow-200 transition-colors duration-200",
        label: "Payment Not Verified",
      };
    } else {
      return {
        variant: "warning" as const,
        className:
          "bg-yellow-100 text-yellow-800 hover:bg-yellow-200 transition-colors duration-200",
        label: "Payment Pending",
      };
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-pink-500"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-8 text-gray-800 flex items-center gap-2">
        <Package className="w-6 h-6 text-pink-500" />
        My Orders
      </h1>
      {orders.length === 0 ? (
        <Card className="bg-white/40">
          <CardContent className="flex flex-col items-center justify-center p-8">
            <Package className="w-16 h-16 text-pink-300 mb-4" />
            <p className="text-lg text-gray-600">No orders found.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <Card
              key={order._id}
              className={`bg-white/40 transition-all duration-300 ${
                order.isHamper
                  ? "bg-gradient-to-r from-pink-50/30 to-transparent hover:from-pink-100/40 hover:to-white/40"
                  : "hover:bg-white/50"
              }`}
            >
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <div className="space-y-1">
                  <p className="text-sm font-medium text-gray-500">Order ID</p>
                  <p className="text-lg font-semibold text-gray-800">
                    {order._id}
                  </p>
                </div>
                <div className="flex gap-2">
                  {order.isHamper && (
                    <Badge className="bg-pink-100 text-pink-800 hover:bg-pink-200 transition-colors duration-200">
                      Hamper
                    </Badge>
                  )}
                  <Badge
                    {...getPaymentBadgeProps(
                      order.isPaymentVerified,
                      order.transactionId
                    )}
                  >
                    {
                      getPaymentBadgeProps(
                        order.isPaymentVerified,
                        order.transactionId
                      ).label
                    }
                  </Badge>
                  <Badge {...getStatusBadgeProps(order.status)}>
                    {order.status.charAt(0).toUpperCase() +
                      order.status.slice(1)}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4">
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    <div className="flex items-center gap-2 p-2 rounded-lg transition-all duration-200 hover:bg-white/30">
                      <CreditCard className="w-4 h-4 text-pink-500" />
                      <div>
                        <p className="text-sm font-medium text-gray-500">
                          Payment Mode
                        </p>
                        <p className="font-semibold text-gray-800">
                          {order.transactionId > 0
                            ? "Online"
                            : "Pay on take away"}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 p-2 rounded-lg transition-all duration-200 hover:bg-white/30">
                      <Clock className="w-4 h-4 text-pink-500" />
                      <div>
                        <p className="text-sm font-medium text-gray-500">
                          Placed On
                        </p>
                        <p className="font-semibold text-gray-800">
                          {new Date(order.createdAt).toLocaleString()}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 p-2 rounded-lg transition-all duration-200 hover:bg-white/30">
                      <AlertCircle className="w-4 h-4 text-pink-500" />
                      <div>
                        <p className="text-sm font-medium text-gray-500">
                          Total Amount
                        </p>
                        <p className="font-semibold text-gray-800">
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
                            className="flex justify-between items-center p-3 bg-white/40 rounded-lg hover:bg-white/50 transition-all duration-200"
                          >
                            <span className="font-medium text-gray-800">
                              {product.name}
                            </span>
                            <div className="flex items-center gap-4">
                              <span className="text-gray-600">x{quantity}</span>
                              <span className="font-semibold text-gray-800">
                                ₹{(product.price * quantity).toFixed(2)}
                              </span>
                            </div>
                          </div>
                        ) : (
                          <div
                            key={quantity}
                            className="p-3 bg-rose-50 text-rose-700 rounded-lg"
                          >
                            Product details unavailable
                          </div>
                        )
                      )}
                    </div>
                  </div>

                  {order.status === "pending" && (
                    <button
                      onClick={() =>
                        handleCancelOrder(order._id, order.createdAt)
                      }
                      disabled={isCanceling}
                      className="mt-4 w-full md:w-auto px-6 py-2 bg-pink-500 text-white rounded-lg
                      hover:bg-pink-600 active:translate-y-[1px]
                      transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed
                      disabled:hover:bg-pink-500 disabled:active:translate-y-0"
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
