import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { isValidObjectId } from "mongoose";

import connectDB from "@/lib/connectDB";
import Review from "@/models/Review";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    if (!isValidObjectId(params.id)) {
      return NextResponse.json({ error: "Invalid review ID" }, { status: 400 });
    }
    const review = await Review.findById(params.id);
    if (!review) {
      return NextResponse.json({ error: "Review not found" }, { status: 404 });
    }
    return NextResponse.json(review);
  } catch (error) {
    console.error("Error fetching review:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    if (!isValidObjectId(params.id)) {
      return NextResponse.json({ error: "Invalid review ID" }, { status: 400 });
    }
    const data = await request.json();
    if (typeof data.featured !== "boolean") {
      return NextResponse.json(
        { error: "Invalid or missing featured status" },
        { status: 400 }
      );
    }
    const updatedReview = await Review.findByIdAndUpdate(
      params.id,
      { featured: data.featured },
      { new: true, runValidators: true }
    );
    if (!updatedReview) {
      return NextResponse.json({ error: "Review not found" }, { status: 404 });
    }
    return NextResponse.json(updatedReview);
  } catch (error) {
    console.error("Error updating review:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}