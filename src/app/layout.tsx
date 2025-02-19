"use client";
import { Suspense } from "react";
import Navbar from "@/components/Navbar";
import "./globals.css";
import { SessionProvider } from "next-auth/react";
import useLenis from "@/hooks/useLenis";
import { ToastContainer } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";



export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  useLenis();

  return (
    <html lang="en">
      <body>
        <SessionProvider>
          <Suspense fallback={<div>Loading...</div>}>
            <Navbar />
            <div data-scroll-container>{children}</div>
          </Suspense>
          <ToastContainer />
        </SessionProvider>
      </body>
    </html>
  );
}
