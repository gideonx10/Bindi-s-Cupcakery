"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation"; // Import Next.js router

interface User {
  name: string;
  email: string;
  phone: string;
  area: string;
}

interface Order {
  _id: string;
  products: { product: { name: string }; quantity: number }[];
  createdAt: string;
}

const HomeTab = ({ userId }: { userId: string }) => {
  const [user, setUser] = useState<User | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter(); // Initialize router

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [userRes, ordersRes] = await Promise.all([
          fetch(`/api/user/details?userId=${userId}`),
          fetch(`/api/orders?userId=${userId}`),
        ]);

        const userData = await userRes.json();
        const ordersData = await ordersRes.json();

        setUser(userData);
        setOrders(ordersData.reverse()); // Ensure latest orders appear first
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [userId]);

  if (loading)
    return <p className="text-center text-lg font-semibold">Loading...</p>;

  return (
    <div className="p-6 space-y-6">
      {/* User Details */}
      {user ? (
        <div className="bg-white p-6 shadow-md rounded-lg border">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            User Details
          </h2>
          <div className="space-y-2 text-gray-700">
            <p>
              <span className="font-medium">Name:</span> {user.name}
            </p>
            <p>
              <span className="font-medium">Email:</span> {user.email}
            </p>
            <p>
              <span className="font-medium">Phone:</span> {user.phone}
            </p>
            <p>
              <span className="font-medium">Area:</span> {user.area}
            </p>
          </div>
        </div>
      ) : (
        <p className="text-center text-red-500 font-medium">User not found.</p>
      )}

      {/* Recent Orders */}
      <div className="bg-white p-6 shadow-md rounded-lg border">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">
          Recent Orders
        </h2>
        {orders.length > 0 ? (
          <>
            <ul className="space-y-4">
              {orders.slice(0, 3).map((order) => (
                <li
                  key={order._id}
                  className="p-4 border rounded-lg bg-gray-50 shadow-sm"
                >
                  <p className="font-medium text-gray-800">
                    Order ID: {order._id}
                  </p>
                  <p className="text-gray-600">
                    <strong>Placed On:</strong>{" "}
                    {new Date(order.createdAt).toLocaleDateString()}
                  </p>
                  <ul className="ml-4 space-y-1 text-gray-700">
                    {order.products.map((item, index) => (
                      <li key={index}>
                        - {item.product.name} (x{item.quantity})
                      </li>
                    ))}
                  </ul>
                </li>
              ))}
            </ul>

            {/* View More Button */}
            <div className="mt-4 text-right">
              <button
                onClick={() => router.push("/orders")}
                className="text-blue-600 font-medium hover:underline"
              >
                View More &gt;&gt;
              </button>
            </div>
          </>
        ) : (
          <p className="text-gray-600 text-center">No recent orders.</p>
        )}
      </div>
    </div>
  );
};

export default HomeTab;
