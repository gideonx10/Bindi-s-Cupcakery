import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import connectDB from "@/lib/connectDB";
import Order from "@/models/Order";
import { NextRequest, NextResponse } from "next/server";
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

    if (!userData || !userData.user.role || userData.user.role !== "admin") {
      return NextResponse.redirect("/admin/login");
    }

    const orders = await Order.find()
      .populate({ path: "user", select: "name email phone" })
      .populate({
        path: "products.product",
        select: "name category",
        populate: {
          path: "category",
          select: "name",
        },
      })
      .select({
        _id: 1,
        products: 1,
        totalAmount: 1,
        status: 1,
        createdAt: 1,
        isHamper: 1,
        isPaymentVerified: 1,
        transactionId: 1,
        customization: 1,
        user: 1,
      })
      .sort({ createdAt: -1 });

    return NextResponse.json(orders);
  } catch (error) {
    console.error("Error fetching orders:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest) {
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

    if (!userData || !userData.user.role || userData.user.role !== "admin") {
      return NextResponse.redirect("/admin/login");
    }

    const { searchParams } = new URL(req.url);
    const orderId = searchParams.get("orderId");
    if (!orderId) {
      return NextResponse.json(
        { error: "Order ID is required" },
        { status: 400 }
      );
    }

    const body = await req.json();
    const updateData: any = {};

    // Handle order status update
    if (body.status !== undefined) {
      const validStatuses = [
        "pending",
        "ready to take-away",
        "delivered",
        "cancelled",
      ];
      if (!validStatuses.includes(body.status)) {
        return NextResponse.json({ error: "Invalid status" }, { status: 400 });
      }
      updateData.status = body.status;
    }

    // Handle payment verification update
    if (body.isPaymentVerified !== undefined) {
      if (typeof body.isPaymentVerified !== "boolean") {
        return NextResponse.json(
          { error: "isPaymentVerified must be a boolean" },
          { status: 400 }
        );
      }
      updateData.isPaymentVerified = body.isPaymentVerified;
    }

    // If no valid update fields provided
    if (Object.keys(updateData).length === 0) {
      return NextResponse.json(
        { error: "No valid update parameters provided" },
        { status: 400 }
      );
    }

    const updatedOrder = await Order.findByIdAndUpdate(orderId, updateData, {
      new: true,
      runValidators: true,
      populate: [
        { path: "user", select: "name email phone" },
        {
          path: "products.product",
          select: "name category",
          populate: {
            path: "category",
            select: "name",
          },
        },
      ],
    });

    if (!updatedOrder) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    return NextResponse.json(updatedOrder);
  } catch (error) {
    console.error("Error updating order:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
