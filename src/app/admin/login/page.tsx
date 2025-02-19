"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

const AdminLogin = () => {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [otp, setOtp] = useState("");
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  useEffect(() => {
    const checkSession = async () => {
      try {
        const res = await fetch("/api/session", {
          method: "GET",
          credentials: "include",
        });
        const data = await res.json();

        if (data.authenticated) {
          const response = await fetch(
            `/api/user/details?userId=${data.userId}`
          );
          if (!response.ok) throw new Error("Failed to fetch user details");
          const user = await response.json();

          if (user.user.role === "admin") {
            router.push("/admin/dashboard");
          }
        }
      } catch (error) {
        console.error("Session check failed:", error);
      }
    };

    checkSession();
  }, []);

  const handleSendOtp = async (e: any) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // Validate phone number format
      if (!/^\d{9,11}$/.test(phoneNumber)) {
        toast.error("Phone number must be between 9 and 11 digits", {
          position: "top-center",
        });
        return;
      }

      const response = await fetch("/api/admin/send-otp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ phoneNumber }),
      });

      const data = await response.json();
      console.log("data", data);

      if (!response.ok) {
        throw new Error(data.message || "Failed to send OTP");
      }

      setIsOtpSent(true);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e: any) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      console.log("hello");
      const response = await fetch("/api/admin/verify-otp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ phoneNumber, otp }),
      });
      console.log("hi");

      const data = await response.json();
      console.log("Data", data);
      if (!response.ok) {
        throw new Error(data.message || "Invalid OTP");
      }

      if (data.role === "admin") {
        router.push("/admin/dashboard");
      } else {
        throw new Error("You are not authorized as an admin");
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#D9F0FA]">
      <div className="max-w-md w-full mx-4">
        {/* Header Section */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-slate-800 mb-2">
            Administrative Portal
          </h1>
        </div>

        {/* Card Container */}
        <div className="bg-[#EDF6F5] p-8 rounded-3xl shadow-xl border border-slate-200">
          {/* Welcome Message */}
          <div className="mb-8 text-center">
            <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-8 h-8 text-indigo-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8V7a4 4 0 00-8 0"
                />
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-slate-800 mb-1">
              Secure Admin Access
            </h2>
            <p className="text-slate-600 text-sm">
              <span className="font-semibold text-black">Hello Boss ! </span>
              Please verify your phone number to access the administrative
              dashboard
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-4 p-3 bg-red-100 border border-red-200 text-red-700 rounded-lg text-sm">
              {error}
            </div>
          )}

          {/* OTP Form */}
          {!isOtpSent ? (
            <form onSubmit={handleSendOtp} className="space-y-8">
              <div>
                <label
                  htmlFor="phoneNumber"
                  className="block text-lg font-semibold text-slate-700 mb-2"
                >
                  Phone Number
                </label>
                <input
                  id="phoneNumber"
                  type="tel"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  className="w-full px-4 py-3 text-gray-700 rounded-lg border border-slate-300 bg-gray-100 transition-colors"
                  placeholder="Enter your phone number"
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full bg-indigo-700 hover:bg-indigo-800 hover:scale-[102%] text-white py-3 px-6 rounded-lg shadow-2xl font-medium transition-colors flex items-center justify-center"
                disabled={loading}
              >
                {loading ? (
                  <svg
                    className="animate-spin h-5 w-5 mr-3"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                ) : null}
                Send OTP
              </button>
            </form>
          ) : (
            <form onSubmit={handleVerifyOtp} className="space-y-4">
              <div>
                <label
                  htmlFor="otp"
                  className="block text-sm font-medium text-slate-700 mb-2"
                >
                  Enter OTP
                </label>
                <input
                  id="otp"
                  type="text"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg bg-gray-100 border border-slate-300 transition-colors text-gray-700 mb-3"
                  placeholder="Enter the OTP sent to your phone"
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 px-6 rounded-lg shadow-2xl font-medium transition-colors flex items-center justify-center"
                disabled={loading}
              >
                {loading ? (
                  <svg
                    className="animate-spin h-5 w-5 mr-3"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                ) : null}
                Verify OTP
              </button>
            </form>
          )}

          {/* Footer */}
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-800 transition-colors">
              Contact Developers for administrative access
            </p>
          </div>
        </div>

        {/* Security Notice */}
        <div className="mt-6 text-center text-sm text-slate-600">
          <p className="flex items-center justify-center gap-2">
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8V7a4 4 0 00-8 0"
              />
            </svg>
            Secured by OTP verification
          </p>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
