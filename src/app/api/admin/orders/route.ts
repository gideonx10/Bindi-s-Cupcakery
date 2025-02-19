import connectDB from "@/lib/connectDB";
import Order from "@/models/Order";
import { NextRequest, NextResponse } from "next/server";
import jwt, { JwtPayload } from "jsonwebtoken";
import "@/models/Product";
import "@/models/User";
import "@/models/Category";
import nodemailer from "nodemailer";

// Create a nodemailer transporter using environment variables
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST, // e.g., "smtp.gmail.com"
  port: Number(process.env.SMTP_PORT), // e.g., 587
  secure: process.env.SMTP_SECURE === "true", // true for 465, false for other ports
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

async function sendStatusEmail(order: any, status: string) {
  let subject = "";
  let text = "";

  switch (status) {
    case "pending":
      subject = "Your Order is Pending";
      text = `Hello ${order.user.name},\n\nYour order ${order._id} has been received and is pending. We are preparing your items.\n\nThank you.`;
      break;
    case "ready to take-away":
      subject = "Your Order is Ready for Pick-up";
      text = `Hello ${order.user.name},\n\nGood news! Your order ${order._id} is now ready to take-away from our shop.\n\nThank you.`;
      break;
    case "delivered":
      subject = "Your Order has been Delivered";
      text = `Hello ${order.user.name},\n\nWe are happy to inform you that your order ${order._id} has been delivered. Enjoy your purchase!`;
      break;
    case "cancelled":
      subject = "Your Order has been Cancelled";
      text = `Hello ${order.user.name},\n\nWe regret to inform you that your order ${order._id} was cancelled due to unavoidable reasons. Please contact us for more details.`;
      break;
    default:
      return;
  }

  try {
    await transporter.sendMail({
      from: process.env.SMTP_FROM, // your email address as the sender
      to: order.user.email,
      subject,
      text,
    });
    console.log(`Email sent to ${order.user.email} for status ${status}`);
  } catch (error) {
    console.error("Error sending status email:", error);
  }
}

async function sendPaymentEmail(order: any, isVerified: boolean) {
  let subject = "";
  let text = "";

  if (isVerified) {
    subject = "Payment Verified";
    text = `Hello ${order.user.name},\n\nYour payment for order ${order._id} has been verified successfully. Thank you for your purchase.`;
  } else {
    subject = "Payment Not Verified";
    text = `Hello ${order.user.name},\n\nWe encountered an issue verifying the payment for order ${order._id}. Please contact support for further assistance.`;
  }

  try {
    await transporter.sendMail({
      from: process.env.SMTP_FROM,
      to: order.user.email,
      subject,
      text,
    });
    console.log(
      `Email sent to ${order.user.email} for payment verification update`
    );
  } catch (error) {
    console.error("Error sending payment email:", error);
  }
}
export async function GET(req: NextRequest) {
  try {
    await connectDB();
    const token = req.cookies.get("token")?.value;
    const searchParams = new URL(req.url).searchParams;
    const targetUserId = searchParams.get("userId");

    if (!token) {
      return NextResponse.json({
        authenticated: false,
        message: "No token found",
      });
    }

    // Decode the token to get admin user data
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;
    const adminUserId = decoded.userId;

    // Verify admin status
    const res = await fetch(
      `http://localhost:3000/api/user/details?userId=${adminUserId}`
    );
    const userData = await res.json();

    if (!userData || !userData.user.role || userData.user.role !== "admin") {
      return NextResponse.redirect("/admin/login");
    }

    // Create query object based on whether a specific user's orders are requested
    const query = targetUserId ? { user: targetUserId } : {};

    const orders = await Order.find(query)
      .populate({
        path: "user",
        select: "name email phone",
      })
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

    // Transform orders to handle deleted users
    const processedOrders = orders.map((order) => {
      const orderObj = order.toObject();

      if (!orderObj.user) {
        return {
          ...orderObj,
          user: {
            _id: "deleted",
            name: "(Deleted User)",
            email: "<Account Removed>",
            phone: "<Account Removed>",
          },
          userDeleted: true,
        };
      }
      return {
        ...orderObj,
        userDeleted: false,
      };
    });

    return NextResponse.json(processedOrders);
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

    // Send email notification based on update
    if (updateData.status) {
      sendStatusEmail(updatedOrder, updateData.status);
    }
    if (updateData.isPaymentVerified !== undefined) {
      sendPaymentEmail(updatedOrder, updateData.isPaymentVerified);
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
