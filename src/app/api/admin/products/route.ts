import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import connectDB from "@/lib/connectDB";
import Product from "@/models/Product";
import "@/models/Category";

// In this single route file, we handle all CRUD operations.
// Product ID for GET (one), PUT and DELETE should be provided as a search parameter "id".
// When no "id" is provided, GET returns all products and POST creates a new product.
export async function GET(request: Request) {
  try {
    await connectDB();
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    if (id) {
      // Return specific product with populated category
      const product = await Product.findById(id).populate("category");
      if (!product) {
        return NextResponse.json({ error: "Product not found" }, { status: 404 });
      }
      return NextResponse.json(product);
    } else {
      // Return all products, with category populated
      const products = await Product.find().populate("category").sort({ createdAt: -1 });
      return NextResponse.json(products);
    }
  } catch (error) {
    console.error("Error fetching product(s):", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    await connectDB();
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const data = await request.json();

    // Remove _id if provided with an empty string to avoid casting error
    if (data._id === "") {
      delete data._id;
    }

    // Validate required fields
    if (!data.name || !data.price || !data.description || !data.category) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const product = await Product.create(data);
    return NextResponse.json(product, { status: 201 });
  } catch (error) {
    console.error("Error creating product:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    await connectDB();
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    if (!id) {
      return NextResponse.json({ error: "Product ID is required" }, { status: 400 });
    }
    const data = await request.json();
    // Validate required fields for update if needed
    if (!data.name || !data.price || !data.description || !data.category) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }
    const updatedProduct = await Product.findByIdAndUpdate(id, data, {
      new: true,
      runValidators: true,
    }).populate("category");
    if (!updatedProduct) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }
    return NextResponse.json(updatedProduct);
  } catch (error) {
    console.error("Error updating product:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    await connectDB();
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    if (!id) {
      return NextResponse.json({ error: "Product ID is required" }, { status: 400 });
    }
    const deletedProduct = await Product.findByIdAndDelete(id);
    if (!deletedProduct) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }
    return NextResponse.json({ message: "Product deleted successfully" });
  } catch (error) {
    console.error("Error deleting product:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}