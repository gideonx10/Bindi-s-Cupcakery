// This is a server component; no "use client" here.
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";

export default async function AdminPanel() {
  const session = await getServerSession(authOptions);

  // If there is no session or the user is not an admin, redirect to the admin login page.
  if (!session || session.user.role !== "admin") {
    redirect("/admin/login");
  }

  // Render the protected admin panel.
  return (
    <div style={{ padding: "2rem" }}>
      <h1>Admin Panel</h1>
      <p>Welcome, {session.user.name}</p>
      {/* Render additional admin functionalities here */}
    </div>
  );
}
