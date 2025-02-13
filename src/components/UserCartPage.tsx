"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import CartItem from "./CartItem";

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

export default function CartPage({ userId }: { userId: string }) {
  const router = useRouter();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [checkingOut, setCheckingOut] = useState(false);
  const [isHamper, setIsHamper] = useState(false); // Toggle State

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
      const res = await fetch("/api/cart/removeItem", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, productId }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to remove item");

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
        isHamper, // Include hamper state
      };

      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderData),
      });

      if (!res.ok) throw new Error("Failed to place order");

      await clearCart();
      alert("Order placed successfully!");
      router.push("/user?tab=orders");
    } catch (error) {
      console.error(error);
      alert("Checkout failed, please try again.");
    } finally {
      setCheckingOut(false);
    }
  }

  async function toggleHamper() {
    setIsHamper((prev) => !prev);

    try {
      await fetch("/api/orders/update-hamper", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, isHamper: !isHamper }),
      });
    } catch (error) {
      console.error(error);
      alert("Failed to update hamper status.");
      setIsHamper((prev) => !prev);
    }
  }

  return (
    <div className="p-4 max-w-3xl mx-auto">
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
            <CartItem
              key={item.product._id}
              item={item}
              loading={loading}
              updateQuantity={updateQuantity}
              removeItem={removeItem}
            />
          ))}

          {/* Toggle Switch for Hamper */}
          <div className="mt-6 flex items-center">
            <span className="mr-2 text-lg font-semibold">
              Make it a Hamper?
            </span>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={isHamper}
                onChange={toggleHamper}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-300 rounded-full peer dark:bg-gray-600 peer-checked:after:translate-x-5 peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>

          <div className="mt-6 flex justify-between items-center">
            <h2 className="text-xl font-semibold">
              Total: ₹
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

      {/* Redirect to Products Page */}
      {cartItems.length > 0 && (
        <div className="mt-6 flex justify-center">
          <button
            onClick={() => router.push("/products")}
            className="px-6 py-3 bg-black text-white font-semibold rounded-lg"
          >
            Missing Something?
          </button>
        </div>
      )}
    </div>
  );
}
