import { NextRequest, NextResponse } from "next/server";
import twilio from "twilio";
import bcrypt from "bcryptjs";
import OTP from "@/models/OTP";
import User from "@/models/User";
import connectDB from "@/lib/connectDB";

// Initialize Twilio client
const twilioClient = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

// Rate limiting map (in a production environment, use Redis or similar)
const rateLimitMap = new Map();

// Rate limit configuration
const RATE_LIMIT_WINDOW = 15 * 60 * 1000; // 15 minutes
const MAX_ATTEMPTS = 3;

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    const { phoneNumber } = await request.json();

    // Input validation
    if (!phoneNumber || typeof phoneNumber !== "string") {
      return NextResponse.json(
        { error: "Valid phone number is required" },
        { status: 400 }
      );
    }

    // Normalize phone number (remove spaces, ensure +country code format)
    // const normalizedPhone = phoneNumber.replace(/\s+/g, "");
    // if (!/^\+\d{10,15}$/.test(normalizedPhone)) {
    //   return NextResponse.json(
    //     {
    //       error:
    //         "Invalid phone number format. Use international format (+country code)",
    //     },
    //     { status: 400 }
    //   );
    // }

    // Check rate limiting
    const now = Date.now();
    const userAttempts = rateLimitMap.get(phoneNumber) || [];

    // Clean up old attempts
    const recentAttempts = userAttempts.filter(
      (timestamp: number) => now - timestamp < RATE_LIMIT_WINDOW
    );

    if (recentAttempts.length >= MAX_ATTEMPTS) {
      return NextResponse.json(
        {
          error: "Too many OTP requests. Please try again later.",
          waitTime: Math.ceil(
            (RATE_LIMIT_WINDOW - (now - recentAttempts[0])) / 60000
          ),
        },
        { status: 429 }
      );
    }

    // Check if phone number is registered as admin
    const user = await User.findOne({ phone: phoneNumber, role: "admin" });
    if (!user) {
      return NextResponse.json(
        { error: "Phone number not registered as admin" },
        { status: 403 }
      );
    }

    // Delete any existing OTP for this phone number
    await OTP.deleteMany({ phoneNumber: phoneNumber });

    // Generate a random 6-digit OTP
    const generatedOtp = Math.floor(100000 + Math.random() * 900000).toString();

    // Hash the OTP before storing
    const hashedOtp = await bcrypt.hash(generatedOtp, 10);

    // Save hashed OTP to database
    const otpRecord = new OTP({
      phoneNumber: phoneNumber,
      otp: hashedOtp,
      expiresAt: new Date(Date.now() + 5 * 60 * 1000), // 5 minutes expiry
      attempts: 0,
      createdAt: new Date(),
    });

    await otpRecord.save();

    // Update rate limiting
    rateLimitMap.set(phoneNumber, [...recentAttempts, now]);

    // Send OTP via Twilio with improved message
    try {
      await twilioClient.messages.create({
        body: `Your ADMIN login OTP is: ${generatedOtp}. Valid for 5 minutes. Do not share this code with anyone.`,
        from: process.env.TWILIO_PHONE_NUMBER_SMS,
        to: `+91${phoneNumber}`,
      });
    } catch (twilioError) {
      // If Twilio fails, delete the OTP record
      await OTP.deleteOne({ _id: otpRecord._id });
      console.error("Twilio error:", twilioError);

      return NextResponse.json(
        { error: "Failed to send OTP message" },
        { status: 500 }
      );
    }

    // Log successful OTP send (exclude actual OTP from logs)
    console.log(`Admin OTP sent to ${phoneNumber.slice(0, -4)}****`);

    return NextResponse.json(
      {
        message: "OTP sent successfully",
        expiresIn: 300, // 5 minutes in seconds
        remainingAttempts: MAX_ATTEMPTS - recentAttempts.length - 1,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error in send-otp:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// Cleanup function for rate limiting map (call this periodically)
export function cleanupRateLimitMap() {
  const now = Date.now();
  for (const [phone, attempts] of rateLimitMap.entries()) {
    const validAttempts = attempts.filter(
      (timestamp: number) => now - timestamp < RATE_LIMIT_WINDOW
    );
    if (validAttempts.length === 0) {
      rateLimitMap.delete(phone);
    } else {
      rateLimitMap.set(phone, validAttempts);
    }
  }
}
