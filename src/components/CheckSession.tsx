"use client";

import { useSession, signOut } from "next-auth/react";
import { DefaultSession } from "next-auth";

// Extend next-auth types properly

declare module "next-auth" {
  interface User {
    id: string; // Required field
    role?: string | null;
    provider?: string | null;
  }

  interface Session {
    user: {
      id: string;
      role?: string | null;
      provider?: string | null;
    } & DefaultSession["user"];
  }
}

import Link from "next/link";

export default function Navbar() {
  const { data: session } = useSession();

  return (
    <nav className="bg-white shadow-lg">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <div className="flex space-x-4">
            <Link href="/" className="text-gray-700 hover:text-gray-900">
              Home
            </Link>
            {session && (
              <Link
                href="/dashboard"
                className="text-gray-700 hover:text-gray-900"
              >
                Dashboard
              </Link>
            )}
            {session?.user?.role === "admin" && (
              <Link href="/admin" className="text-gray-700 hover:text-gray-900">
                Admin Panel
              </Link>
            )}
          </div>

          <div className="flex items-center space-x-4">
            {session ? (
              <div className="flex items-center space-x-4">
                <span className="text-gray-700">
                  {session.user?.name} ({session.user?.role})
                </span>
                <button
                  onClick={() => signOut({ callbackUrl: "/" })}
                  className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <Link
                href="/signin"
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              >
                Sign In
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
