import { NextResponse } from "next/server";
import User from "@/models/User";
import connectDB from "@/lib/connectDB";
import { getSession } from "next-auth/react";

export async function GET() {
  try {
    const session = await getSession();
    if (!session || session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();
    const total = await User.countDocuments();
    const active = await User.countDocuments({ profileComplete: true });
    const admins = await User.countDocuments({ role: "admin" });

    return NextResponse.json({
      total,
      active,
      admins,
    });
  } catch (error) {
    console.error("Error fetching user stats:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
