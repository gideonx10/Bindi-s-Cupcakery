import { NextResponse } from "next/server";
import Category from "@/models/Category";
import connectDB from "@/lib/connectDB";

// GET: Fetch all categories
export async function GET() {
  try {
    await connectDB();
    const categories = await Category.find({}, "name _id"); // Fetch only relevant fields
    return NextResponse.json(categories, { status: 200 });
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch categories" },
      { status: 500 }
    );
  }
}

// POST: Add a new category
export async function POST(req: Request) {
  try {
    await connectDB();
    const { name, description, image } = await req.json();

    // Check if category already exists
    const existingCategory = await Category.findOne({ name });
    if (existingCategory) {
      return NextResponse.json(
        { error: "Category already exists" },
        { status: 400 }
      );
    }

    // Create and save the new category
    const newCategory = new Category({ name, description, image });
    await newCategory.save();

    return NextResponse.json(newCategory, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "Failed to create category" },
      { status: 500 }
    );
  }
}
