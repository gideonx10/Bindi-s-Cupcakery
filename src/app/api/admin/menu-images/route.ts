import connectDB from "@/lib/connectDB";
import MenuImage from "@/models/MenuImage";
import { NextRequest, NextResponse } from "next/server";
import jwt, { JwtPayload } from "jsonwebtoken";

// Supports GET, POST, PUT, DELETE methods for menu images

export async function GET(req: NextRequest) {
  try {
    await connectDB();
    // Optionally add admin authentication here...
    const images = await MenuImage.find().sort({ createdAt: -1 });
    return NextResponse.json(images);
  } catch (error: any) {
    console.error("Error fetching menu images:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    // Admin authentication check
    const token = req.cookies.get("token")?.value;
    if (!token) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }
    jwt.verify(token, process.env.JWT_SECRET!);

    const body = await req.json();
    const { url } = body;
    if (!url) {
      return NextResponse.json({ error: "Image URL is required" }, { status: 400 });
    }
    const newImage = await MenuImage.create({ url });
    return NextResponse.json(newImage);
  } catch (error: any) {
    console.error("Error adding menu image:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    await connectDB();
    // Admin authentication check
    const token = req.cookies.get("token")?.value;
    if (!token) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }
    jwt.verify(token, process.env.JWT_SECRET!);

    const { searchParams } = new URL(req.url);
    const imageId = searchParams.get("imageId");
    if (!imageId) {
      return NextResponse.json({ error: "Image ID is required" }, { status: 400 });
    }
    const body = await req.json();
    const { url } = body;
    if (!url) {
      return NextResponse.json({ error: "New image URL is required" }, { status: 400 });
    }
    const updatedImage = await MenuImage.findByIdAndUpdate(
      imageId,
      { url },
      { new: true }
    );
    if (!updatedImage) {
      return NextResponse.json({ error: "Image not found" }, { status: 404 });
    }
    return NextResponse.json(updatedImage);
  } catch (error: any) {
    console.error("Error updating menu image:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    await connectDB();
    // Admin authentication check
    const token = req.cookies.get("token")?.value;
    if (!token) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }
    jwt.verify(token, process.env.JWT_SECRET!);

    const { searchParams } = new URL(req.url);
    const imageId = searchParams.get("imageId");
    if (!imageId) {
      return NextResponse.json({ error: "Image ID is required" }, { status: 400 });
    }
    const deletedImage = await MenuImage.findByIdAndDelete(imageId);
    if (!deletedImage) {
      return NextResponse.json({ error: "Image not found" }, { status: 404 });
    }
    return NextResponse.json({ message: "Image deleted successfully" });
  } catch (error: any) {
    console.error("Error deleting menu image:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}