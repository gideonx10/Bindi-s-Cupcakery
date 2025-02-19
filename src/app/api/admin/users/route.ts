import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/connectDB";
import User from "@/models/User";
import jwt, { JwtPayload } from "jsonwebtoken";

export async function GET(req: NextRequest) {
  try {
    await connectDB();
    const token = req.cookies.get("token")?.value;

    if (!token) {
      return NextResponse.json({
        authenticated: false,
        message: "No token found",
      });
    }

    // Decode the token to get user data
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;
    const userId = decoded.userId;
    console.log("Decoded UserId:", userId);

    // Fetch user details from the backend API using the userId
    const res = await fetch(
      `http://localhost:3000/api/user/details?userId=${userId}`
    );
    const userData = await res.json();
    console.log(userData);

    if (!userData || !userData.user?.role || userData.user.role !== "admin") {
      return NextResponse.redirect("/admin/login");
    }

    // Fetch all users and select only the required fields: name, email, phone, area
    const users = await User.find({}, "name email phone area");
    return NextResponse.json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}