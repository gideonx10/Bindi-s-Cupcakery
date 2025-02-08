import { NextResponse } from "next/server";
import connectDB from "@/lib/connectDB";
import Category from "@/models/Category";

export async function GET() {
  await connectDB();
  try {
    const categories = await Category.find();
    return NextResponse.json({ success: true, data: categories });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  await connectDB();
  try {
    const body = await request.json();
    const { name, description, image } = body;

    // Check if category exists
    const existingCategory = await Category.findOne({ name });
    if (existingCategory) {
      return NextResponse.json({ success: false, message: "Category already exists" }, { status: 400 });
    }

    const category = new Category({ name, description, image });
    await category.save();
    return NextResponse.json({ success: true, data: category }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
