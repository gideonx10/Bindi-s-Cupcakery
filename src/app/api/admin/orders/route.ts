import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import connectDB from "@/lib/connectDB";
import Order from "@/models/Order";

export async function GET() {
  try {
    await connectDB();
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    // Fetch orders, populating user details, product details, and category details
    const orders = await Order.find()
      .populate({ path: "user", select: "name email phone" })
      .populate({
        path: "products.product",
        select: "name category",
        populate: {
          path: "category",
          select: "name"
        }
      })
      .sort({ createdAt: -1 });
      
    return NextResponse.json(orders);
  } catch (error) {
    console.error("Error fetching orders:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

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
    
    // Handle status update
    if (body.status !== undefined) {
      const validStatuses = ["pending", "Ready to Take-away", "delivered", "cancelled"];
      if (!validStatuses.includes(body.status)) {
        return NextResponse.json({ error: "Invalid status" }, { status: 400 });
      }

      const updatedOrder = await Order.findByIdAndUpdate(
        orderId,
        { status: body.status },
        { new: true, runValidators: true }
      );

      if (!updatedOrder) {
        return NextResponse.json({ error: "Order not found" }, { status: 404 });
      }

      return NextResponse.json(updatedOrder);
    }
    
    // Handle payment verification update
    if (body.isPaymentVerified !== undefined) {
      const updatedOrder = await Order.findByIdAndUpdate(
        orderId,
        { isPaymentVerified: body.isPaymentVerified },
        { new: true, runValidators: true }
      );

      if (!updatedOrder) {
        return NextResponse.json({ error: "Order not found" }, { status: 404 });
      }

      return NextResponse.json(updatedOrder);
    }

    return NextResponse.json(
      { error: "Invalid update parameters" },
      { status: 400 }
    );
  } catch (error) {
    console.error("Error updating order:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}