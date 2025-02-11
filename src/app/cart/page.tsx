"use client";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  images: string[];
}

interface CartItem {
  product: Product;
  quantity: number;
}

export default function CartPage() {
  const router = useRouter();
  const { data: session } = useSession();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [checkingOut, setCheckingOut] = useState(false);
  const userId = (session?.user as { id: string })?.id;

  useEffect(() => {
    if (userId) fetchCart();
  }, [userId]);

  async function fetchCart() {
    try {
      const res = await fetch(`/api/cart?userId=${userId}`);
      if (!res.ok) throw new Error("Failed to fetch cart");
      const data = await res.json();
      setCartItems(data.products);
    } catch (error) {
      console.error(error);
    }
  }

  async function updateQuantity(
    productId: string,
    action: "increase" | "decrease"
  ) {
    setLoading(true);
    try {
      const res = await fetch("/api/cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, productId, quantity: 1, action }),
      });
      if (!res.ok) throw new Error("Failed to update cart");
      const data = await res.json();
      setCartItems(data.cart.products);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  async function removeItem(productId: string) {
    setLoading(true);
    try {
      console.log("Removing product:", productId);

      const res = await fetch("/api/cart/removeItem", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, productId }), // Pass userId & productId
      });

      const data = await res.json();
      console.log("Response:", data);

      if (!res.ok) throw new Error(data.error || "Failed to remove item");

      // Update UI state
      setCartItems((prev) =>
        prev.filter((item) => item.product._id !== productId)
      );
    } catch (error: any) {
      console.error("Error:", error);
      alert(error.message);
    } finally {
      setLoading(false);
    }
  }

  async function clearCart() {
    setLoading(true);
    try {
      const res = await fetch(`/api/cart?userId=${userId}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed to clear cart");
      setCartItems([]);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  async function handleCheckout() {
    if (cartItems.length === 0) return alert("Your cart is empty!");

    setCheckingOut(true);
    try {
      const orderData = {
        userId,
        products: cartItems.map(({ product, quantity }) => ({
          product: product._id,
          quantity,
        })),
        totalAmount: cartItems.reduce(
          (total, item) => total + item.product.price * item.quantity,
          0
        ),
      };

      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderData),
      });

      if (!res.ok) throw new Error("Failed to place order");

      await clearCart();
      alert("Order placed successfully!");
      router.push("/orders");
    } catch (error) {
      console.error(error);
      alert("Checkout failed, please try again.");
    } finally {
      setCheckingOut(false);
    }
  }

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Your Cart</h1>
        {cartItems.length > 0 && (
          <button
            onClick={clearCart}
            disabled={loading}
            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 disabled:opacity-50"
          >
            Clear Cart
          </button>
        )}
      </div>

      {cartItems.length === 0 ? (
        <p className="text-gray-500">No items in cart</p>
      ) : (
        <div className="space-y-4">
          {cartItems.map((item) => (
            <div
              key={item.product._id}
              className="relative border p-4 rounded-lg shadow-sm"
            >
              {/* Cross button for removing item */}
              <button
                onClick={() => removeItem(item.product._id)}
                className="absolute top-2 right-2 text-red-500 hover:text-red-700"
              >
                ❌
              </button>
              <h2 className="font-semibold">{item.product.name}</h2>
              <p className="text-gray-600">{item.product.description}</p>
              <p className="font-medium">Price: ${item.product.price}</p>
              <div className="flex items-center gap-2 mt-2">
                <button
                  onClick={() => updateQuantity(item.product._id, "decrease")}
                  disabled={loading}
                  className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
                >
                  -
                </button>
                <span>{item.quantity}</span>
                <button
                  onClick={() => updateQuantity(item.product._id, "increase")}
                  disabled={loading}
                  className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
                >
                  +
                </button>
              </div>
            </div>
          ))}
          <div className="mt-6 flex justify-between items-center">
            <h2 className="text-xl font-semibold">
              Total: $
              {cartItems
                .reduce(
                  (total, item) => total + item.product.price * item.quantity,
                  0
                )
                .toFixed(2)}
            </h2>
            <button
              onClick={handleCheckout}
              disabled={checkingOut || loading}
              className="px-6 py-3 bg-green-500 text-white font-semibold rounded-lg hover:bg-green-600 disabled:opacity-50"
            >
              {checkingOut ? "Processing..." : "Checkout"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
