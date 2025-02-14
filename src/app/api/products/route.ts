import { NextResponse } from "next/server";
import Product from "@/models/Product";
import connectDB from "@/lib/connectDB";

// GET: Fetch all products
export async function GET(req: Request) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);

    const search = searchParams.get("search") || "";
    const categories = searchParams.getAll("categories[]"); // Get all selected categories

    const query: Record<string, unknown> = {}; // Replaced 'any' with a stricter type

    // Handle search
    if (search) {
      query.name = { $regex: search, $options: "i" }; // Case-insensitive search
    }

    // Handle multiple categories
    if (categories && categories.length > 0) {
      query.category = { $in: categories }; // Match any of the selected categories
    }

    const products = await Product.find(query);
    return NextResponse.json(products, { status: 200 });
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch products" },
      { status: 500 }
    );
  }
}

// POST: Add a new product
export async function POST(req: Request) {
  try {
    await connectDB();
    const body = await req.json();

    // Validate required fields
    if (!body.name || !body.price || !body.category) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Create a new product
    const newProduct = new Product({
      name: body.name,
      description: body.description || "",
      price: body.price,
      category: body.category, // Should be a valid ObjectId
      images: body.images || [],
      isFeatured: body.isFeatured || false,
      customizationOptions: body.customizationOptions || [],
      isSugarFree: body.isSugarFree || false,
    });

    await newProduct.save();
    return NextResponse.json(
      { message: "Product added successfully", product: newProduct },
      { status: 201 }
    );
  } catch {
    return NextResponse.json(
      { error: "Failed to add product" },
      { status: 500 }
    );
  }
}
