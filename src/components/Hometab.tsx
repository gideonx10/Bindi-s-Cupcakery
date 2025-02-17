"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation"; // Import Next.js router

interface User {
  name: string;
  email: string;
  phone: string;
}

interface Order {
  _id: string;
  products: { product: { name: string }; quantity: number }[];
  createdAt: string;
}

const HomeTab = ({ userId }: { userId: string | undefined }) => {
  const [user, setUser] = useState<User>({ name: "", email: "", phone: "" });
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter(); // Initialize router

  useEffect(() => {
    if (!userId) return;

    const fetchData = async () => {
      try {
        const [userRes, ordersRes] = await Promise.all([
          fetch(`/api/user/details?userId=${userId}`),
          fetch(`/api/orders?userId=${userId}`),
        ]);

        const userData = await userRes.json();
        const ordersData = await ordersRes.json();

        setUser({
          name: userData.user.name,
          email: userData.user.email,
          phone: userData.user.phone,
        });

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
      {/* User Info & Total Orders - Side by Side for lg+ */}
      <div className="flex flex-col lg:flex-row gap-6">
        {/* User Details */}
        <div className="p-6 shadow-lg rounded-lg border border-transparent bg-[#FFF0F7] lg:w-3/4 font-ancient">
          <h2 className="text-2xl font-semibold mb-4">User Details</h2>
          <div className="space-y-3 text-lg">
            {" "}
            {/* Increased text size */}
            <p>
              <span className="font-semibold">Name :</span> {user?.name}
            </p>
            <p>
              <span className="font-semibold">Email :</span> {user?.email}
            </p>
            <p>
              <span className="font-semibold">Phone :</span> {user?.phone}
            </p>
          </div>
        </div>

        {/* Total Orders Box */}
        <div className="p-6 shadow-lg hidden lg:flex rounded-lg border border-transparent bg-[#FFF0F7] lg:w-1/3 flex-col items-center justify-center">
          <h2 className="text-2xl font-semibold text-gray-800">Total Orders</h2>
          <p className="text-4xl font-bold text-blue-600 mt-2">
            {orders.length}
          </p>
        </div>
      </div>

      {/* Recent Orders */}
      <div className="bg-[#FFF0F7] p-6 shadow-lg rounded-lg border border-gray-200">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">
          Recent Orders
        </h2>
        {orders.length > 0 ? (
          <>
            <ul className="space-y-4">
              {orders.slice(0, 3).map((order) => (
                <li
                  key={order._id}
                  className="p-4 border rounded-lg bg-neutral-50 shadow-xl"
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
                onClick={() => router.push("/user?tab=orders")}
                className="bg-[#88b4ff] text-black px-4 py-2 rounded-lg shadow-xl hover:bg-blue-600 transition-all duration-200"
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
