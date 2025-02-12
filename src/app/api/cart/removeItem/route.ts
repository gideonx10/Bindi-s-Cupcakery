import { NextResponse } from "next/server";
import Cart from "@/models/Cart";
import { Types } from "mongoose";
import connectDB from "@/lib/connectDB";

export async function DELETE(req: Request) {
  await connectDB();

  try {
    const body = await req.json();
    console.log("Received data:", body); // Log the received data

    const { userId, productId } = body;

    if (!userId || !Types.ObjectId.isValid(userId)) {
      console.log("Invalid user ID:", userId);
      return NextResponse.json({ error: "Invalid user ID" }, { status: 400 });
    }
    if (!productId || !Types.ObjectId.isValid(productId)) {
      console.log("Invalid product ID:", productId);
      return NextResponse.json(
        { error: "Invalid product ID" },
        { status: 400 }
      );
    }

    const cart = await Cart.findOne({ user: userId });

    if (!cart) {
      console.log("Cart not found for user:", userId);
      return NextResponse.json({ error: "Cart not found" }, { status: 404 });
    }

    console.log("Before removal:", cart.products);

    // Remove the product from the cart
    cart.products = cart.products.filter(
      (item: { product: Types.ObjectId }) =>
        item.product.toString() !== productId
    );

    console.log("After removal:", cart.products);

    await cart.save();

    return NextResponse.json(
      { message: "Item removed successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error removing item from cart:", error);
    return NextResponse.json(
      { error: "Failed to remove item" },
      { status: 500 }
    );
  }
}
