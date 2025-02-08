import { NextResponse } from "next/server";
import connectDB from "@/lib/connectDB";
import Category from "@/models/Category";

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  await connectDB();
  try {
    const body = await request.json();
    const updatedCategory = await Category.findByIdAndUpdate(params.id, body, { new: true });

    if (!updatedCategory) {
      return NextResponse.json({ success: false, message: "Category not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: updatedCategory });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  await connectDB();
  try {
    const deletedCategory = await Category.findByIdAndDelete(params.id);

    if (!deletedCategory) {
      return NextResponse.json({ success: false, message: "Category not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: "Category deleted" });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
