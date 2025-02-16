import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import connectDB from "@/lib/connectDB";
import Order from "@/models/Order";

export async function PUT(request: Request) {
  try {
    await connectDB();
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const orderId = searchParams.get("orderId");
    if (!orderId) {
      return NextResponse.json({ error: "Order ID is required" }, { status: 400 });
    }

    const body = await request.json();
    if (typeof body.isPaymentVerified !== "boolean") {
      return NextResponse.json(
        { error: "isPaymentVerified must be a boolean" },
        { status: 400 }
      );
    }

    const updatedOrder = await Order.findByIdAndUpdate(
      orderId,
      { isPaymentVerified: body.isPaymentVerified },
      { new: true, runValidators: true }
    );

    if (!updatedOrder) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    return NextResponse.json(updatedOrder);
  } catch (error) {
    console.error("Error updating payment verification:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}