import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import connectDB from "@/lib/connectDB";
import Product from "@/models/Product";
import "@/models/Category";
import { NextRequest, NextResponse } from "next/server";
import jwt, { JwtPayload } from "jsonwebtoken";

// In this single route file, we handle all CRUD operations.
// Product ID for GET (one), PUT and DELETE should be provided as a search parameter "id".
// When no "id" is provided, GET returns all products and POST creates a new product.
export async function GET(req: NextRequest) {
  try {
    await connectDB();
    const token = req.cookies.get("token")?.value;

    if (!token) {
      return NextResponse.json({
        authenticated: false,
        message: "No token found",
      });
    }

    // Decode the token to get user data
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;
    const userId = decoded.userId;
    console.log("Decoded UserId:", userId);

    // Fetch user details from the backend API using the userId
    const res = await fetch(
      `http://localhost:3000/api/user/details?userId=${userId}`
    );
    const userData = await res.json();
    console.log(userData);

    if (!userData || !userData.user.role || userData.user.role !== "admin") {
      return NextResponse.redirect("/admin/login");
    }
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (id) {
      // Return specific product with populated category
      const product = await Product.findById(id).populate("category");
      if (!product) {
        return NextResponse.json(
          { error: "Product not found" },
          { status: 404 }
        );
      }
      return NextResponse.json(product);
    } else {
      // Return all products, with category populated
      const products = await Product.find()
        .populate("category")
        .sort({ createdAt: -1 });
      return NextResponse.json(products);
    }
  } catch (error) {
    console.error("Error fetching product(s):", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const token = req.cookies.get("token")?.value;

    if (!token) {
      return NextResponse.json({
        authenticated: false,
        message: "No token found",
      });
    }

    // Decode the token to get user data
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;
    const userId = decoded.userId;
    console.log("Decoded UserId:", userId);

    // Fetch user details from the backend API using the userId
    const res = await fetch(
      `http://localhost:3000/api/user/details?userId=${userId}`
    );
    const userData = await res.json();
    console.log(userData);

    if (!userData || !userData.user.role || userData.user.role !== "admin") {
      return NextResponse.redirect("/admin/login");
    }
    const data = await req.json();

    // Remove _id if provided with an empty string to avoid casting error
    if (data._id === "") {
      delete data._id;
    }

    // Validate required fields
    if (!data.name || !data.price || !data.description || !data.category) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const product = await Product.create(data);
    return NextResponse.json(product, { status: 201 });
  } catch (error) {
    console.error("Error creating product:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest) {
  try {
    await connectDB();
    const token = req.cookies.get("token")?.value;

    if (!token) {
      return NextResponse.json({
        authenticated: false,
        message: "No token found",
      });
    }

    // Decode the token to get user data
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;
    const userId = decoded.userId;
    console.log("Decoded UserId:", userId);

    // Fetch user details from the backend API using the userId
    const res = await fetch(
      `http://localhost:3000/api/user/details?userId=${userId}`
    );
    const userData = await res.json();
    console.log(userData);

    if (!userData || !userData.user.role || userData.user.role !== "admin") {
      return NextResponse.redirect("/admin/login");
    }
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) {
      return NextResponse.json(
        { error: "Product ID is required" },
        { status: 400 }
      );
    }
    const data = await req.json();
    // Validate required fields for update if needed
    if (!data.name || !data.price || !data.description || !data.category) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
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
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  try {
    await connectDB();
    const token = req.cookies.get("token")?.value;

    if (!token) {
      return NextResponse.json({
        authenticated: false,
        message: "No token found",
      });
    }

    // Decode the token to get user data
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;
    const userId = decoded.userId;
    console.log("Decoded UserId:", userId);

    // Fetch user details from the backend API using the userId
    const res = await fetch(
      `http://localhost:3000/api/user/details?userId=${userId}`
    );
    const userData = await res.json();
    console.log(userData);

    if (!userData || !userData.user.role || userData.user.role !== "admin") {
      return NextResponse.redirect("/admin/login");
    }
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) {
      return NextResponse.json(
        { error: "Product ID is required" },
        { status: 400 }
      );
    }
    const deletedProduct = await Product.findByIdAndDelete(id);
    if (!deletedProduct) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }
    return NextResponse.json({ message: "Product deleted successfully" });
  } catch (error) {
    console.error("Error deleting product:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
