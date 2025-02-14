import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import connectDB from "@/lib/connectDB";
import Review from "@/models/Review";

// GET - Retrieve all reviews (Admin only)
export async function GET() {
  try {
    await connectDB();
    const session = await getServerSession(authOptions);
    if (!session || session.user?.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    // Fetch all reviews sorted by most recent
    const reviews = await Review.find().sort({ createdAt: -1 });
    return NextResponse.json(reviews);
  } catch (error) {
    console.error("Error fetching reviews:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// POST - Create a new review (Publicly accessible)
export async function POST(request: Request) {
  try {
    await connectDB();
    // Parse the incoming JSON body
    const body = await request.json();
    const { userName, phone, email, comment } = body;
    
    // Validate required fields
    if (!userName || !phone || !email || !comment) {
      return NextResponse.json(
        { error: "All fields (userName, phone, email, comment) are required" },
        { status: 400 }
      );
    }
    
    // Create new review, default isApproved will be false as per schema
    const review = await Review.create({ userName, phone, email, comment });

    return NextResponse.json(review, { status: 201 });
  } catch (error) {
    console.error("Error creating review:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// PUT - Update review approval status (Admin only)
export async function PUT(request: Request) {
  try {
    await connectDB();
    const session = await getServerSession(authOptions);
    if (!session || session.user?.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const { searchParams } = new URL(request.url);
    const reviewId = searchParams.get("reviewId");
    if (!reviewId) {
      return NextResponse.json(
        { error: "Review ID is required" },
        { status: 400 }
      );
    }
    const body = await request.json();
    const { isApproved } = body;
    if (typeof isApproved !== "boolean") {
      return NextResponse.json(
        { error: "isApproved must be a boolean value" },
        { status: 400 }
      );
    }
    const updatedReview = await Review.findByIdAndUpdate(
      reviewId,
      { isApproved },
      { new: true, runValidators: true }
    );
    if (!updatedReview) {
      return NextResponse.json(
        { error: "Review not found" },
        { status: 404 }
      );
    }
    return NextResponse.json(updatedReview);
  } catch (error) {
    console.error("Error updating review approval:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}