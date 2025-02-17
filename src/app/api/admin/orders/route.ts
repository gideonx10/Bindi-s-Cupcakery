import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import connectDB from "@/lib/connectDB";
import Order from "@/models/Order";
import "@/models/Product";
import "@/models/User";
import "@/models/Category";
export async function GET() {
  try {
    await connectDB();
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const orders = await Order.find()
      .populate({
        path: "user",
        select: "name email phone",
      })
      .populate({
        path: "products.product",
        select: "name category",
        populate: {
          path: "category",
          select: "name"
        }
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
        user: 1
      })
      .sort({ createdAt: -1 });

    // Transform orders to handle deleted users
    const processedOrders = orders.map(order => {
      const orderObj = order.toObject();
      
      if (!orderObj.user) {
        return {
          ...orderObj,
          user: {
            _id: 'deleted',
            name: '(Deleted User)',
            email: '<Account Removed>',
            phone: '<Account Removed>'
          },
          userDeleted: true // Add a flag to indicate deleted user
        };
      }
      return {
        ...orderObj,
        userDeleted: false
      };
    });
      
    return NextResponse.json(processedOrders);
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
    const updateData: any = {};

    // Handle order status update
    if (body.status !== undefined) {
      const validStatuses = ["pending", "ready to take-away", "delivered", "cancelled"];
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

    const updatedOrder = await Order.findByIdAndUpdate(
      orderId,
      updateData,
      { 
        new: true, 
        runValidators: true,
        populate: [
          { path: "user", select: "name email phone" },
          {
            path: "products.product",
            select: "name category",
            populate: {
              path: "category",
              select: "name"
            }
          }
        ]
      }
    );

    if (!updatedOrder) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    return NextResponse.json(updatedOrder);
  } catch (error) {
    console.error("Error updating order:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}