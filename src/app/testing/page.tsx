"use client";
import { useEffect, useState } from "react";

export default function Dashboard() {
  const [userId, setUserId] = useState<string>("");
  const [user, setUser] = useState<{
    userId: string;
    phone: string;
    role: string;
    name: string;
    email: string;
  } | null>(null);

  const handleLogout = async () => {
    await fetch("/api/logout", { method: "POST" });
    window.location.reload();
  };

  useEffect(() => {
    const checkSession = async () => {
      const res = await fetch("/api/session", {
        method: "GET",
        credentials: "include", // ✅ Ensures cookies are sent with request
      });

      const sessionData = await res.json();
      console.log(sessionData);
      if (sessionData.authenticated) {
        setUserId(sessionData.userId);
      } else {
        console.log("Not authenticated:", sessionData.message);
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
        setUser({
          userId: userData.user.userId,
          phone: userData.user.phone,
          role: userData.user.role,
          name: userData.user.name,
          email: userData.user.email,
        }); // Setting the user data here

        // setOrders(ordersData.reverse()); // If you plan to use orders
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        // setLoading(false);
      }
    };
    fetchData();
  }, [userId]);

  return (
    <div>
      {user ? (
        <h1>
          Welcome, {user.phone}! Your ID: {user.userId} email: {user.email}{" "}
          role: {user.role} name: {user.name}
        </h1>
      ) : (
        <h1>Please log in</h1>
      )}
      <button onClick={handleLogout} className="bg-red-500 text-white p-2">
        Logout
      </button>
    </div>
  );
}
