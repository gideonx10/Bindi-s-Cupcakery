import { NextResponse } from "next/server";
import Review from "@/models/Review";
import connectDB from "@/lib/connectDB";

export async function GET() {
  try {
    await connectDB();
    const reviews = await Review.find().sort({ createdAt: -1 });

    const colors = [
      {
        bg: "bg-blue-300",
        text: "text-blue-900",
        shadow: "shadow-blue-300/30",
      },
      {
        bg: "bg-yellow-300",
        text: "text-yellow-900",
        shadow: "shadow-yellow-300/30",
      },
      {
        bg: "bg-pink-300",
        text: "text-pink-900",
        shadow: "shadow-pink-300/30",
      },
      {
        bg: "bg-purple-300",
        text: "text-purple-900",
        shadow: "shadow-purple-300/30",
      },
    ];

    const formattedFeedback = reviews.map((review, index) => ({
      id: review._id.toString(),
      message: review.comment.toUpperCase(),
      author: review.userName,
      isApproved: review.isApproved,
      color: colors[index % colors.length].bg,
      textColor: colors[index % colors.length].text,
      shadow: colors[index % colors.length].shadow,
    }));

    return NextResponse.json(formattedFeedback);
  } catch (error) {
    console.error("Error fetching feedback:", error);
    return NextResponse.json(
      { error: "Failed to fetch feedback" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    await connectDB();
    const { userName, phone, email, comment } = await req.json();

    if (!userName || !email || !comment) {
      return NextResponse.json(
        { message: "Missing required fields" },
        { status: 400 }
      );
    }

    const newReview = new Review({ userName, phone, email, comment });
    await newReview.save();

    return NextResponse.json(
      { message: "Review submitted successfully" },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error submitting review:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
