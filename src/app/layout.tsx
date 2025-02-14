"use client";
import "./globals.css";
import { SessionProvider } from "next-auth/react";
// export const metadata: Metadata = {
//   title: "Bindi's Cupcakery",
//   description: "Generated by create next app",
// };

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <SessionProvider>
          {children}
        </SessionProvider>
      </body>
    </html>
  );
}
