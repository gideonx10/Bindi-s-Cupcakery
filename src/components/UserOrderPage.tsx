import { useEffect, useState, useCallback } from "react";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Clock, Package, CreditCard, AlertCircle } from "lucide-react";
import { toast } from "react-toastify";

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
        toast.error(
          "You cannot cancel this order. The 5-hour cancellation window has passed.",
          {
            position: "top-center",
          }
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

        toast.success(
          "Order has been cancelled successfully, and notifications sent.",
          {
            position: "top-center",
          }
        );
      } catch (error) {
        console.error(error);
        toast.error("Failed to cancel order. Please try again.", {
          position: "top-center",
        });
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
      <div className="flex items-center justify-center min-h-[200px] w-full bg-[#E0F2FE]">
        <p className="text-base sm:text-lg font-semibold text-blue-700 font-ancient">
          Loading...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full px-4 sm:px-6 md:px-8 py-4 sm:py-6 md:py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold mb-6 sm:mb-8 text-blue-800 flex items-center gap-2 font-ancient">
          <Package className="w-6 h-6 sm:w-7 sm:h-7 text-blue-800" />
          My Orders
        </h1>

        {orders.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center p-8 sm:p-12">
              <Package className="w-12 h-12 sm:w-16 sm:h-16 text-blue-300 mb-4" />
              <p className="text-base sm:text-lg text-blue-700 font-ancient">
                No orders found.
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4 sm:space-y-6">
            {orders.map((order) => (
              <Card
                key={order._id}
                className={`${
                  order.isHamper
                    ? "bg-purple-50 border border-purple-500"
                    : "border-blue-200"
                }`}
              >
                <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-3 sm:space-y-0 pb-2">
                  <div className="space-y-1">
                    <p className="text-xs sm:text-sm font-medium text-blue-700">
                      Order ID
                    </p>
                    <p className="text-sm sm:text-lg font-semibold text-gray-800 break-all">
                      {order._id}
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {order.isHamper && (
                      <Badge className="bg-purple-100 text-purple-800 hover:bg-purple-200 transition-colors duration-200">
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
                  <div className="space-y-4 sm:space-y-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                      <div className="flex items-center gap-2 p-2 sm:p-3 rounded-lg bg-white/40 transition-all duration-200 hover:bg-white/60">
                        <CreditCard className="w-4 h-4 sm:w-5 sm:h-5 text-blue-500" />
                        <div className="font-ancient">
                          <p className="text-xs sm:text-sm font-medium text-blue-700">
                            Payment Mode
                          </p>
                          <p className="text-sm sm:text-base font-semibold text-gray-800">
                            {order.transactionId > 0
                              ? "Online"
                              : "Pay on take away"}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 p-2 sm:p-3 rounded-lg bg-white/40 transition-all duration-200 hover:bg-white/60">
                        <Clock className="w-4 h-4 sm:w-5 sm:h-5 text-blue-500" />
                        <div className="font-ancient">
                          <p className="text-xs sm:text-sm font-medium text-blue-700">
                            Placed On
                          </p>
                          <p className="text-sm sm:text-base font-semibold text-gray-800">
                            {new Date(order.createdAt).toLocaleString()}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 p-2 sm:p-3 rounded-lg bg-white/40 transition-all duration-200 hover:bg-white/60">
                        <AlertCircle className="w-4 h-4 sm:w-5 sm:h-5 text-blue-500" />
                        <div className="font-ancient">
                          <p className="text-xs sm:text-sm font-medium text-blue-700">
                            Total Amount
                          </p>
                          <p className="text-sm sm:text-base font-semibold text-gray-800">
                            ₹{order.totalAmount.toFixed(2)}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="font-ancient">
                      <p className="text-xs sm:text-sm font-medium text-blue-700 mb-2 sm:mb-3">
                        Products
                      </p>
                      <div className="space-y-2 sm:space-y-3">
                        {order.products.map(({ product, quantity }) =>
                          product ? (
                            <div
                              key={product._id}
                              className="flex flex-col sm:flex-row sm:items-center justify-between p-3 sm:p-4 bg-white/40 rounded-lg hover:bg-white/60 transition-all duration-200"
                            >
                              <span className="font-medium text-gray-800 text-sm sm:text-base mb-2 sm:mb-0">
                                {product.name}
                              </span>
                              <div className="flex items-center justify-between sm:gap-6">
                                <span className="text-blue-600 text-sm sm:text-base">
                                  x{quantity}
                                </span>
                                <span className="font-semibold text-gray-800 text-sm sm:text-base">
                                  ₹{(product.price * quantity).toFixed(2)}
                                </span>
                              </div>
                            </div>
                          ) : (
                            <div
                              key={quantity}
                              className="p-3 sm:p-4 bg-blue-50 text-blue-700 rounded-lg text-sm sm:text-base"
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
                        className="w-full sm:w-auto px-4 sm:px-6 py-2 sm:py-2.5 bg-gradient-to-r from-blue-500 to-blue-600 
                        text-white rounded-lg text-sm sm:text-base font-medium
                        hover:from-blue-600 hover:to-blue-700 active:translate-y-[1px]
                        transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed
                        disabled:hover:from-blue-500 disabled:hover:to-blue-600 disabled:active:translate-y-0
                        font-ancient"
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
    </div>
  );
}
