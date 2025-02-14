"use client";

import { useEffect, useState, useCallback } from "react";

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


  // Handle Order Cancellation
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

        // Fetch user details
        const userRes = await fetch(`/api/user/details?userId=${userId}`);
        if (!userRes.ok) throw new Error("Failed to fetch user details");
        const userData = await userRes.json();

        // Send WhatsApp message
        await fetch("/api/send-message", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            phoneNumber: "+917600960068", // Send to the user's registered phone number
            message: `🚫 *Order Cancelled!*\n\n📦 *Order ID:* ${orderId}\n👤 *Customer:* ${userData.name}\n📞 *Contact:* ${userData.phone}\n\nYour order has been successfully cancelled. If this was a mistake, please contact support.`,
          }),
        });

        // Send Email Notification
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case "delivered":
        return "text-green-500 font-bold";
      case "pending":
        return "text-yellow-500 font-bold";
      case "cancelled":
        return "text-red-500 font-bold";
      default:
        return "text-gray-500";
    }
  };

  if (loading) return <p className="text-center mt-4">Loading orders...</p>;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-semibold mb-4">My Orders</h1>
      {orders.length === 0 ? (
        <p>No orders found.</p>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div key={order._id} className="border p-4 rounded-lg shadow">
              <p className="font-semibold">Order ID: {order._id}</p>
              <p className={`text-gray-500 ${getStatusColor(order.status)}`}>
                Status: {order.status}
              </p>
              <p className="text-gray-500">
                Total Amount: ₹{order.totalAmount.toFixed(2)}
              </p>
              <p className="text-gray-500">
                Placed On: {new Date(order.createdAt).toLocaleString()}
              </p>
              <p className="text-gray-500">
                Payment Mode:{" "}
                <span className="font-semibold">
                  {order.transactionId > 0 ? "Online" : "Pay on take away"}
                </span>
              </p>

              {order.transactionId > 0 && (
                <p className="text-gray-500">
                  Transaction ID:{" "}
                  <span className="font-semibold">{order.transactionId}</span>
                </p>
              )}

              {/* <p className="text-gray-500">
                Payment Status:{" "}
                <span
                  className={`font-semibold ${
                    order.isPaymentVerified ? "text-green-500" : "text-red-500"
                  }`}
                >
                  {order.isPaymentVerified ? "Verified" : "Pending"}
                </span>
              </p> */}

              <ul className="mt-2 space-y-2">
                {order.products.map(({ product, quantity }) =>
                  product ? (
                    <li
                      key={product._id}
                      className="border p-2 rounded bg-gray-100"
                    >
                      <p>
                        {product.name} (x{quantity}) - ₹
                        {(product.price * quantity).toFixed(2)}
                      </p>
                    </li>
                  ) : (
                    <li
                      key={quantity}
                      className="border p-2 rounded bg-gray-100 text-red-500"
                    >
                      <p>Product details unavailable</p>
                    </li>
                  )
                )}
              </ul>

              {order.status === "pending" && (
                <button
                  className="mt-2 bg-red-500 text-white py-1 px-3 rounded hover:bg-red-700 disabled:opacity-50"
                  onClick={() => handleCancelOrder(order._id, order.createdAt)}
                  disabled={isCanceling}
                >
                  {isCanceling ? "Cancelling..." : "Cancel Order"}
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
