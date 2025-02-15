import { NextRequest, NextResponse } from "next/server";
import Order from "@/models/Order";
import connectDB from "@/lib/connectDB";
import { Types } from "mongoose";

interface Product {
  product: string;
  quantity: number;
  name: string;
}

interface OrderRequest {
  userId: string;
  products: Product[];
  totalAmount: number;
  transactionId?: string;
  customization?: string;
  isHamper: boolean;
  isPaymentVerified: boolean;
}

interface OrderResponse {
  success: boolean;
  order: {
    _id: Types.ObjectId;
    user: string;
    products: Product[];
    totalAmount: number;
    status: string;
    transactionId: string | null;
    customization: string | null;
    isHamper: boolean;
    isPaymentVerified: boolean;
    createdAt: Date;
    updatedAt: Date;
  };
}

export async function GET(req: NextRequest) {
  try {
    await connectDB();

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
    const {
      userId,
      products,
      totalAmount,
      transactionId,
      customization,
      isHamper,
      isPaymentVerified,
    } = (await req.json()) as OrderRequest;

    // Validation
    if (!userId || !products || !totalAmount) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Create new order
    const newOrder = await Order.create({
      user: new Types.ObjectId(userId),
      products,
      totalAmount,
      status: "pending",
      transactionId: transactionId || null,
      customization: customization || null,
      isHamper,
      isPaymentVerified,
    });

    // Format the response
    const response: OrderResponse = {
      success: true,
      order: {
        _id: newOrder._id,
        user: newOrder.user.toString(),
        products: newOrder.products,
        totalAmount: newOrder.totalAmount,
        status: newOrder.status,
        transactionId: newOrder.transactionId,
        customization: newOrder.customization,
        isHamper: newOrder.isHamper,
        isPaymentVerified: newOrder.isPaymentVerified,
        createdAt: newOrder.createdAt,
        updatedAt: newOrder.updatedAt,
      },
    };

    return NextResponse.json(response, { status: 201 });
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
    await connectDB();

    const { orderId } = await req.json();

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

    order.status = "cancelled";
    await order.save();

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
