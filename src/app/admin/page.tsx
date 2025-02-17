"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { DotLottieReact } from "@lottiefiles/dotlottie-react"; // Import the Lottie animation component

export default function AdminDashboard() {
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState<string>("");
  const router = useRouter();

  useEffect(() => {
    // Simulate a delay before checking the session and loading data
    const delayLoading = setTimeout(() => {
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
          router.push("/admin/login");
          setLoading(false);
        }
      };

      checkSession();
    }, 2000); // Delay of 2 seconds

    return () => clearTimeout(delayLoading);
  }, [router]);

  useEffect(() => {
    if (!userId) return;

    const fetchData = async () => {
      try {
        const [userRes] = await Promise.all([
          fetch(`/api/user/details?userId=${userId}`),
        ]);

        const userData = await userRes.json();
        console.log(userData);
        if (!userData || userData.user.role !== "admin") {
          router.push("/admin/login");
          setLoading(false);
        } else {
          router.push("/admin/dashboard");
          setLoading(false);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        // setLoading(false);
      }
    };

    fetchData();
  }, [userId, router]);

  if (loading) {
    return (
      <div>
        {/* Lottie animation displayed during loading */}
        <DotLottieReact
          src="https://lottie.host/47b39909-6fe6-4eb5-aa5e-b7daadef22fc/tFSD54oLDo.lottie"
          loop
          autoplay
          style={{ width: "100%", height: "100%" }}
        />
      </div>
    );
  }
}
