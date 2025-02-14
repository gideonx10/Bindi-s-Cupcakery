"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import CartItem from "@/components/CartItem";
import { useSession } from "next-auth/react";

import UPIQrCode from "./UPIQrCode";

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
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [checkingOut, setCheckingOut] = useState(false);
  const [customization, setCustomization] = useState("");
  const [showQR, setShowQR] = useState(false);
  const [transactionId, setTransactionId] = useState("");
  const { data: session, status } = useSession();
  const userId = (session?.user as { id: string })?.id;
  const upiId = process.env.UPI_ID as string | "";
  const upiName = process.env.UPI_NAME;
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

  async function handleCheckout(paymentMethod: "Pay on Takeway" | "Online") {
    if (cartItems.length === 0) return alert("Your cart is empty!");

    if (paymentMethod === "Online" && !transactionId) {
      return alert("Please enter the transaction ID.");
    }

    setCheckingOut(true);
    try {
      const userRes = await fetch(`/api/user/details?userId=${userId}`);
      if (!userRes.ok) throw new Error("Failed to fetch user details");
      const userData = await userRes.json();

      const orderData = {
        userId,
        userName: userData.name,
        userPhone: userData.phoneNumber,
        products: cartItems.map(({ product, quantity }) => ({
          product: product._id,
          name: product.name,
          quantity,
        })),
        totalAmount: cartItems.reduce(
          (total, item) => total + item.product.price * item.quantity,
          0
        ),
        customization,
        paymentMethod,
        transactionId: paymentMethod === "Online" ? transactionId : null,
      };

      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderData),
      });

      if (!res.ok) throw new Error("Failed to place order");
      const orderResponse = await res.json();
      const orderId = orderResponse.order._id; // Get the order ID

      // Send WhatsApp message with order details
      await fetch("/api/send-message", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          phoneNumber: "+917600960068", // Send to user's phone number
          message: `Order Confirmed! 📦\n\nOrder ID: ${orderId}\nUser ID: ${userId}\n📞 *Contact:* ${
            userData.phone
          }\n
          👤 *Customer:* ${userData.name}\nItems:\n${orderData.products
            .map((p) => `- ${p.name} x${p.quantity}`)
            .join("\n")}\n\nTotal: ₹${orderData.totalAmount}\nCustomization:${
            customization || "N/A"
          }\nPayment: ${paymentMethod}\nTransaction ID: ${
            transactionId || "N/A"
          }`,
        }),
      });

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
          <div className="mt-6">
            <label className="block text-lg font-semibold mb-2">
              Add Customization (Optional):
            </label>
            <textarea
              value={customization}
              onChange={(e) => setCustomization(e.target.value)}
              className="w-full p-3 border rounded-lg"
              placeholder="Enter any customization details for your order..."
              rows={3}
            />
          </div>

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
            <div className="mt-4 flex flex-col space-y-3">
              <button
                onClick={() => handleCheckout("Pay on Takeway")}
                disabled={checkingOut || loading}
                className="px-6 py-3 bg-gray-700 text-white font-semibold rounded-lg hover:bg-gray-800 disabled:opacity-50"
              >
                Pay on Takeway
              </button>

              <button
                onClick={() => setShowQR(true)}
                className="px-6 py-3 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600"
              >
                Pay Online
              </button>

              {showQR && (
                <div className="mt-4 text-center">
                  <UPIQrCode
                    upiId={upiId}
                    name={upiName}
                    amount={Number(
                      cartItems
                        .reduce(
                          (total, item) =>
                            total + item.product.price * item.quantity,
                          0
                        )
                        .toFixed(2)
                    )}
                  />
                  <p className="text-gray-600 mt-2">
                    Scan the QR and pay ₹
                    {cartItems
                      .reduce(
                        (total, item) =>
                          total + item.product.price * item.quantity,
                        0
                      )
                      .toFixed(2)}
                  </p>
                  <input
                    type="text"
                    placeholder="Enter Transaction ID"
                    value={transactionId}
                    onChange={(e) => setTransactionId(e.target.value)}
                    className="mt-2 w-full p-2 border rounded"
                  />
                  <button
                    onClick={() => handleCheckout("Online")}
                    disabled={checkingOut || loading}
                    className="mt-3 px-6 py-3 bg-green-500 text-white font-semibold rounded-lg hover:bg-green-600 disabled:opacity-50"
                  >
                    Confirm Payment
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
