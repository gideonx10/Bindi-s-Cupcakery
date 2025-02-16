import { NextResponse } from "next/server";
import Product from "@/models/Product";
import connectDB from "@/lib/connectDB";

// GET: Fetch all products
export async function GET(req: Request) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);

    const search = searchParams.get("search") || "";
    const categories = searchParams.getAll("categories[]");
    const priceFilter = searchParams.get("priceFilter");
    const isSugarFree = searchParams.get("isSugarFree");
    const isFeatured = searchParams.get("isFeatured");

    const query: Record<string, unknown> = {};

    // Handle search
    if (search) {
      query.name = { $regex: search, $options: "i" };
    }

    // Handle multiple categories
    if (categories && categories.length > 0) {
      query.category = { $in: categories };
    }

    // Handle sugar-free filter
    if (isSugarFree === "true") {
      query.isSugarFree = true;
    }

    // Handle bestseller/featured filter
    if (isFeatured === "true") {
      query.isFeatured = true;
    }

    // Get products with initial filters
    let products = await Product.find(query);

    // Handle price sorting after fetching products
    if (priceFilter) {
      products = products.sort((a, b) => {
        if (priceFilter === "low-high") {
          return a.price - b.price;
        } else if (priceFilter === "high-low") {
          return b.price - a.price;
        }
        return 0;
      });
    }

    return NextResponse.json(products, { status: 200 });
  } catch (error) {
    console.error("Error fetching products:", error);
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
