import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import OTP from "@/models/OTP";
import User from "@/models/User";
import connectDB from "@/lib/connectDB";

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    const { phoneNumber, otp } = await request.json();
    const phone = phoneNumber;
    console.log(phone);
    if (!phoneNumber || !otp) {
      return NextResponse.json(
        { error: "Phone number and OTP are required" },
        { status: 400 }
      );
    }

    // Ensure JWT_SECRET is available
    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
      console.error("JWT_SECRET is not defined in environment variables");
      return NextResponse.json(
        { error: "Server configuration error" },
        { status: 500 }
      );
    }

    // Find the latest OTP record for the phone number
    const otpRecord = await OTP.findOne({ phoneNumber }).sort({
      createdAt: -1,
    });

    if (!otpRecord || otpRecord.expiresAt < new Date()) {
      return NextResponse.json(
        { error: "OTP expired or not found" },
        { status: 400 }
      );
    }

    // Compare OTP using bcrypt
    const isValidOTP = await bcrypt.compare(otp, otpRecord.otp);
    if (!isValidOTP) {
      return NextResponse.json({ error: "Invalid OTP" }, { status: 400 });
    }

    // Find the user and verify admin status
    const user = await User.findOne({ phone });
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }
    console.log("User", user);

    // Strict admin role check
    if (user.role !== "admin") {
      return NextResponse.json(
        { error: "Unauthorized - Admin access required" },
        { status: 403 }
      );
    }

    // Delete the used OTP record
    await OTP.deleteOne({ _id: otpRecord._id });

    // Generate admin session token with role claim
    const token = jwt.sign(
      {
        userId: user._id,
        role: "admin", // Explicitly include role in token
        sessionTime: new Date().getTime(),
      },
      jwtSecret,
      {
        expiresIn: "1d",
        algorithm: "HS256",
      }
    );

    // Create response with secure cookie
    const response = NextResponse.json({
      message: "Admin authentication successful",
      userId: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    });

    // Set secure HTTP-only cookie
    response.cookies.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 86400, // 1 day in seconds
      path: "/",
    });

    console.log(`Admin user authenticated: ${user._id}`);
    return response;
  } catch (error) {
    console.error("Admin OTP verification error:", error);
    return NextResponse.json(
      { error: "Internal server error during authentication" },
      { status: 500 }
    );
  }
}
