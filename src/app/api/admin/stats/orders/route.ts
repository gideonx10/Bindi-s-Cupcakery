import connectDB from "@/lib/connectDB";
import Order from "@/models/Order";
import { NextRequest, NextResponse } from "next/server";
import jwt, { JwtPayload } from "jsonwebtoken";

export async function GET(req: NextRequest) {
  try {
    await connectDB();
    // Verify admin token
    const token = req.cookies.get("token")?.value;
    if (!token) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;
    // (Optionally) check admin role with decoded.userId and User model

    // Total orders count
    const totalOrders = await Order.countDocuments();

    // Get pending orders
    const pendingOrders = await Order.find({ status: "pending" });
    // For dashboard alerts, you might want to convert each pending order to a short message
    const pendingAlerts = pendingOrders.map(
      (order) => `Order ${order._id} is pending`
    );

    return NextResponse.json({ totalOrders, pendingAlerts });
  } catch (error: any) {
    console.error("Error in orders stats:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
