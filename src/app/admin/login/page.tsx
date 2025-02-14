"use client";

import React, { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

const AdminLogin = () => {
  const [credentials, setCredentials] = useState({
    identifier: "",
    password: "",
  });
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await signIn("credentials", {
      identifier: credentials.identifier,
      password: credentials.password,
      redirect: false,
    });

    if (res?.ok) {
      router.push("/admin");
    } else {
      alert("Invalid credentials or you are not authorized as admin.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-300 to-indigo-50">
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
              Please verify your credentials to access the administrative
              dashboard
            </p>
          </div>

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="identifier"
                className="block text-sm font-medium text-slate-700 mb-2"
              >
                Email or Phone
              </label>
              <input
                id="identifier"
                type="text"
                value={credentials.identifier}
                onChange={(e) =>
                  setCredentials({
                    ...credentials,
                    identifier: e.target.value,
                  })
                }
                className="w-full px-4 py-3 text-gray-700 rounded-lg border border-slate-300 bg-gray-100 transition-colors "
                placeholder="Enter your email or phone number"
                required
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-slate-700 mb-2"
              >
                Password
              </label>
              <input
                id="password"
                type="password"
                value={credentials.password}
                onChange={(e) =>
                  setCredentials({
                    ...credentials,
                    password: e.target.value,
                  })
                }
                className="w-full px-4 py-3 rounded-lg bg-gray-100 border border-slate-300 transition-colors text-gray-700 mb-3"
                placeholder="Enter your password"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 px-6 rounded-lg shadow-2xl font-medium transition-colors"
            >
              Access Dashboard
            </button>
          </form>

          {/* Footer */}
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-800 transition-colors">
              Contect Developers for administrative credentials
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
            Secured by enterprise-grade encryption
          </p>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
