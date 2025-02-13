"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

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
}

export default function OrdersPage({ userId }: { userId: string }) {
  const router = useRouter();

  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

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

  const handleCancelOrder = async (orderId: string, createdAt: string) => {
    const orderTime = new Date(createdAt).getTime();
    const currentTime = new Date().getTime();
    const fiveHours = 5 * 60 * 60 * 1000;

    if (currentTime - orderTime > fiveHours) {
      alert(
        "You cannot cancel this order. The 5-hour cancellation window has passed."
      );
      return;
    }

    try {
      const res = await fetch(`/api/orders`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ orderId }),
      });

      if (!res.ok) throw new Error("Failed to cancel order");

      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order._id === orderId ? { ...order, status: "cancelled" } : order
        )
      );
      alert("Order has been cancelled successfully.");
    } catch (error) {
      console.error(error);
      alert("Failed to cancel order. Please try again.");
    }
  };
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
              <ul className="mt-2 space-y-2">
                {order.products.map(({ product, quantity }) => (
                  <li
                    key={product._id}
                    className="border p-2 rounded bg-gray-100"
                  >
                    <p>
                      {product.name} (x{quantity}) - ₹
                      {(product.price * quantity).toFixed(2)}
                    </p>
                  </li>
                ))}
              </ul>
              {order.status === "pending" && (
                <button
                  className="mt-2 bg-red-500 text-white py-1 px-3 rounded hover:bg-red-700"
                  onClick={() => handleCancelOrder(order._id, order.createdAt)}
                >
                  Cancel Order
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
