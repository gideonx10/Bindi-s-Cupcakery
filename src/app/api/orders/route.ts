import { NextRequest, NextResponse } from "next/server";
import Order from "@/models/Order"; // Import your Order model
import { getServerSession } from "next-auth"; // If using authentication
import connectDB from "@/lib/connectDB";
import Product from "@/models/Product";

export async function GET(req: NextRequest) {
  try {
    await connectDB(); // Connect to the database

    const url = new URL(req.url);
    const userId = url.searchParams.get("userId");

    if (!userId) {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 }
      );
    }

    const orders = await Order.find({ user: userId }).populate(
      "products.product"
    );

    return NextResponse.json(orders, { status: 200 });
  } catch (error) {
    console.error("Error fetching orders:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  await connectDB();
  try {
    const { userId, products, totalAmount } = await req.json();

    if (!userId || !products || !totalAmount) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const newOrder = await Order.create({
      user: userId,
      products,
      totalAmount,
      status: "pending",
    });

    return NextResponse.json(
      { success: true, order: newOrder },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating order:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
export async function PATCH(req: NextRequest) {
  try {
    await connectDB(); // Ensure database is connected

    const { orderId } = await req.json(); // Get order ID from request body

    if (!orderId) {
      return NextResponse.json(
        { error: "Order ID is required" },
        { status: 400 }
      );
    }

    const order = await Order.findById(orderId);
    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    order.status = "cancelled"; // Update order status
    await order.save(); // Save changes to the database

    return NextResponse.json(
      { success: true, message: "Order cancelled successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error cancelling order:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
