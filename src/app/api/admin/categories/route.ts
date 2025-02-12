import { NextResponse } from "next/server";
import connectDB from "@/lib/connectDB";
import { ObjectId } from "mongodb";

export async function GET() {
  try {
    const db = await connectDB();
    const categories = await db.collection("categories").find().toArray();
    return NextResponse.json(categories);
  } catch (error) {
    console.error("Error fetching categories:", error);
    return NextResponse.json(
      { error: "Failed to fetch categories" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const db = await connectDB();
    
    const result = await db.collection("categories").insertOne({
      ...body,
      productCount: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error("Error creating category:", error);
    return NextResponse.json(
      { error: "Failed to create category" },
      { status: 500 }
    );
  }
}