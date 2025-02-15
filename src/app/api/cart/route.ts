import { NextResponse } from "next/server";
import Cart from "@/models/Cart";
import Product from "@/models/Product";
import { Types } from "mongoose";
import connectDB from "@/lib/connectDB";

interface ProductCategory {
  _id: Types.ObjectId;
  isHamperAble: boolean;
}

interface ProductItem {
  _id: Types.ObjectId;
  category?: ProductCategory;
  equals: (id: Types.ObjectId) => boolean;
}

interface CartProduct {
  product: ProductItem;
  quantity: number;
}

// GET request with hamper filtering
export async function GET(req: Request) {
  await connectDB();

  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");
    const isHamper = searchParams.get("isHamper") === "true";

    if (!userId || !Types.ObjectId.isValid(userId)) {
      return NextResponse.json({ error: "Invalid user ID" }, { status: 400 });
    }

    const cart = await Cart.findOne({ user: userId }).populate({
      path: "products.product",
      populate: {
        path: "category",
        select: "isHamperAble",
      },
    });

    if (!cart) {
      return NextResponse.json({ error: "Cart not found" }, { status: 404 });
    }

    // If hamper mode is enabled, filter out non-hamperable products
    if (isHamper) {
      cart.products = cart.products.filter(
        (item: CartProduct) => item.product.category?.isHamperAble === true
      );
    }

    return NextResponse.json(cart, { status: 200 });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { error: "Failed to fetch cart items" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  await connectDB();

  try {
    const { userId, productId, quantity, action, isHamper } = await req.json();

    // Validate input data
    if (!userId || !productId || !action) {
      return NextResponse.json({ error: "Invalid data" }, { status: 400 });
    }

    // Check if the product exists and populate its category
    const product = await Product.findById(productId).populate("category");
    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    // If hamper mode is enabled, check if the product is hamper-able
    if (isHamper && !product.category?.isHamperAble) {
      return NextResponse.json(
        { error: "This product cannot be added to a hamper" },
        { status: 400 }
      );
    }

    // Find the user's cart
    let cart = await Cart.findOne({ user: userId });

    if (!cart) {
      // Create a new cart if the user doesn't have one
      if (action === "decrease") {
        return NextResponse.json({ error: "Cart not found" }, { status: 404 });
      }
      cart = new Cart({
        user: userId,
        products: [{ product: productId, quantity }],
      });
    } else {
      // Find the product in the cart
      const existingProductIndex = cart.products.findIndex(
        (item: CartProduct) =>
          item.product._id.equals(Types.ObjectId.createFromHexString(productId))
      );

      if (existingProductIndex !== -1) {
        // Update quantity based on action
        if (action === "increase") {
          cart.products[existingProductIndex].quantity += quantity;
        } else if (action === "decrease") {
          cart.products[existingProductIndex].quantity -= quantity;

          // Remove product if quantity becomes 0 or less
          if (cart.products[existingProductIndex].quantity <= 0) {
            cart.products.splice(existingProductIndex, 1);
          }
        }
      } else {
        // Add new product to the cart if increasing
        if (action === "increase") {
          cart.products.push({ product: productId, quantity });
        } else {
          return NextResponse.json(
            { error: "Product not found in cart" },
            { status: 404 }
          );
        }
      }
    }

    // Save the updated cart
    await cart.save();

    // Fetch the updated cart with populated product details and categories
    const updatedCart = await Cart.findOne({ user: userId }).populate({
      path: "products.product",
      populate: {
        path: "category",
        select: "isHamperAble",
      },
    });

    // If hamper mode is enabled, filter the response
    if (isHamper) {
      updatedCart.products = updatedCart.products.filter(
        (item: CartProduct) => item.product?.category?.isHamperAble === true
      );
    }

    return NextResponse.json(
      {
        message: `Product ${action}d in cart`,
        cart: updatedCart,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating cart:", error);
    return NextResponse.json(
      { error: "Failed to update cart" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: Request) {
  await connectDB();

  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");
    const productId = searchParams.get("productId");
    const isHamper = searchParams.get("isHamper") === "true";

    if (!userId || !Types.ObjectId.isValid(userId)) {
      return NextResponse.json({ error: "Invalid user ID" }, { status: 400 });
    }

    const cart = await Cart.findOne({ user: userId }).populate({
      path: "products.product",
      populate: {
        path: "category",
        select: "isHamperAble",
      },
    });

    if (!cart) {
      return NextResponse.json({ error: "Cart not found" }, { status: 404 });
    }

    if (productId) {
      // Remove only the specified product
      cart.products = cart.products.filter(
        (item: CartProduct) => item.product._id.toString() !== productId
      );
    } else if (isHamper) {
      // Remove all non-hamperable products
      cart.products = cart.products.filter(
        (item: CartProduct) => item.product?.category?.isHamperAble === true
      );
    } else {
      // Clear the entire cart
      cart.products = [];
    }

    await cart.save();

    return NextResponse.json(
      {
        message: productId
          ? "Product removed from cart"
          : isHamper
          ? "Non-hamperable products removed from cart"
          : "Cart cleared successfully",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error clearing cart:", error);
    return NextResponse.json(
      { error: "Failed to clear cart" },
      { status: 500 }
    );
  }
}
