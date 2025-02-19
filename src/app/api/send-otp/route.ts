import { NextResponse } from "next/server";
import Otp from "@/models/OTP";
import twilio from "twilio";
import bcrypt from "bcryptjs";
import connectDB from "@/lib/connectDB";

export async function POST(req: Request) {
  try {
    await connectDB();
    const { phone } = await req.json();

    if (!phone)
      return NextResponse.json(
        { error: "Phone number required" },
        { status: 400 }
      );

    // Generate 6-digit OTP
    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();

    // Hash OTP for security
    const hashedOtp = await bcrypt.hash(otpCode, 10);

    // Save OTP in DB with 2-minute expiry
    await Otp.create({
      phoneNumber: phone,
      otp: hashedOtp,
      expiresAt: new Date(Date.now() + 2 * 60000),
    });

    // Send OTP via Twilio
    const client = twilio(
      process.env.TWILIO_ACCOUNT_SID,
      process.env.TWILIO_AUTH_TOKEN
    );
    const response = await client.messages.create({
      body: `Your OTP code is ${otpCode}`,
      from: process.env.TWILIO_PHONE_NUMBER_SMS,
      to: `+91${phone}`,
    });
    console.log("Twilio Response:", response);

    return NextResponse.json({ message: "OTP sent successfully" });
  } catch (error) {
    console.log("Error: ", error);
    return NextResponse.json({ error: "Failed to send OTP" }, { status: 500 });
  }
}
