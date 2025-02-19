"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

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
  const router = useRouter();

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

        setOrders(ordersData.reverse());
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [userId]);

  if (loading)
    return (
      <div className="flex items-center justify-center min-h-[200px]">
        <p className="text-lg font-semibold text-pink-700">Loading...</p>
      </div>
    );

  return (
    <div className="p-4 sm:p-6 space-y-4 sm:space-y-6 min-h-screen w-full">
      {/* User Info & Total Orders */}
      <div className="flex flex-col lg:flex-row gap-4 sm:gap-6">
        {/* User Details */}
        <div className="p-4 sm:p-6 lg:p-8 rounded-2xl border border-pink-200 bg-white/80 backdrop-blur-sm w-full lg:w-3/4 font-ancient transition-all duration-300 hover:shadow-lg hover:border-pink-300">
          <h2 className="text-xl sm:text-2xl font-semibold mb-4 sm:mb-6 text-pink-800">
            User Details
          </h2>
          <div className="space-y-3 sm:space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
              <span className="font-semibold text-pink-700">Name:</span>
              <span className="text-gray-700">{user?.name}</span>
            </div>
            <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
              <span className="font-semibold text-pink-700">Email:</span>
              <span className="text-gray-700 break-all">{user?.email}</span>
            </div>
            <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
              <span className="font-semibold text-pink-700">Phone:</span>
              <span className="text-gray-700">{user?.phone}</span>
            </div>
          </div>
        </div>

        {/* Total Orders Box - Visible on all screens */}
        <div className="p-4 sm:p-6 lg:p-8 rounded-2xl border border-pink-200 bg-white/80 backdrop-blur-sm w-full lg:w-1/3 flex flex-row lg:flex-col items-center justify-between lg:justify-center transition-all duration-300 hover:shadow-lg hover:border-pink-300">
          <h2 className="text-xl sm:text-2xl font-semibold text-pink-800 font-ancient">Total Orders</h2>
          <p className="text-3xl sm:text-4xl lg:text-5xl font-bold text-pink-600 lg:mt-4">{orders.length}</p>
        </div>
      </div>

      {/* Recent Orders */}
      <div className="bg-white/80 backdrop-blur-sm p-4 sm:p-6 lg:p-8 rounded-2xl border border-pink-200 transition-all duration-300 hover:shadow-lg hover:border-pink-300">
        <h2 className="text-xl sm:text-2xl font-semibold text-pink-800 mb-4 sm:mb-6 font-ancient">
          Recent Orders
        </h2>
        {orders.length > 0 ? (
          <>
            <ul className="space-y-3 sm:space-y-4 font-ancient">
              {orders.slice(0, 3).map((order) => (
                <li
                  key={order._id}
                  className="p-4 sm:p-6 border border-pink-200 rounded-xl bg-gradient-to-r from-pink-50 to-white transition-all duration-300 hover:shadow-md hover:border-pink-300"
                >
                  <p className="font-medium text-pink-800 mb-2 text-sm sm:text-base">
                    Order ID: {order._id}
                  </p>
                  <p className="text-gray-600 mb-3 text-sm sm:text-base">
                    <strong className="text-pink-700">Placed On:</strong>{" "}
                    {new Date(order.createdAt).toLocaleDateString()}
                  </p>
                  <ul className="ml-4 space-y-2">
                    {order.products.map((item, index) => (
                      <li
                        key={index}
                        className="flex flex-wrap items-center text-gray-700 text-sm sm:text-base before:content-['•'] before:mr-2 before:text-pink-400"
                      >
                        <span className="break-all">{item.product.name}</span>
                        <span className="ml-2 px-2 py-0.5 bg-pink-100 text-pink-700 rounded-full text-xs sm:text-sm">
                          x{item.quantity}
                        </span>
                      </li>
                    ))}
                  </ul>
                </li>
              ))}
            </ul>

            {/* View More Button */}
            <div className="mt-6 flex justify-end">
              <button
                onClick={() => router.push("/user?tab=orders")}
                className=" font-ancient w-full sm:w-auto bg-gradient-to-r from-pink-500 to-pink-600 text-white px-4 sm:px-6 py-2.5 rounded-lg shadow-md hover:from-pink-600 hover:to-pink-700 transition-all duration-300 font-medium text-sm sm:text-base"
              >
                View All Orders
              </button>
            </div>
          </>
        ) : (
          <div className="text-center py-6 sm:py-8 font-ancient">
            <p className="text-gray-600 text-base sm:text-lg">No orders yet</p>
            <p className="text-pink-600 mt-2 text-sm sm:text-base">Time to order some cupcakes! 🧁</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default HomeTab;