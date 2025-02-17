import { NextResponse } from "next/server";
import Otp from "@/models/OTP";
import User from "@/models/User";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import connectDB from "@/lib/connectDB";

export async function POST(req: Request) {
  try {
    await connectDB();
    const { phone, otp } = await req.json();
    const phoneNumber = phone;

    if (!phone || !otp) {
      return NextResponse.json(
        { error: "Phone and OTP required" },
        { status: 400 }
      );
    }

    console.log("Verifying OTP for phone:", phone);

    // Fetch the latest OTP record for the given phone number
    const otpRecord = await Otp.findOne({ phoneNumber }).sort({
      createdAt: -1,
    });

    if (!otpRecord || otpRecord.expiresAt < new Date()) {
      return NextResponse.json(
        { error: "OTP expired or invalid" },
        { status: 400 }
      );
    }

    // Compare OTP
    const isMatch = await bcrypt.compare(otp, otpRecord.otp);
    if (!isMatch) {
      return NextResponse.json({ error: "Invalid OTP" }, { status: 400 });
    }

    // Delete OTP after successful verification
    // await Otp.deleteOne({ _id: otpRecord._id });

    // Check if user exists, if not, create one
    let user = await User.findOne({ phone });
    if (!user) {
      user = await User.create({ phone });
    }

    // Generate JWT Token with userId
    const token = jwt.sign(
      {
        userId: user._id,
        phone: user.phone,
        // role: user.role,
        name: user.name,
        email: user.email,
      },
      process.env.JWT_SECRET as string,
      { expiresIn: "1d" }
    );

    // Store token in HttpOnly cookie
    const response = NextResponse.json({ message: "OTP verified" });
    response.cookies.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 86400, // 1 day
      path: "/",
    });

    console.log("User logged in:", user._id);
    return response;
  } catch (error) {
    console.log("OTP verification error:", error);
    return NextResponse.json(
      { error: "Failed to verify OTP" },
      { status: 500 }
    );
  }
}
