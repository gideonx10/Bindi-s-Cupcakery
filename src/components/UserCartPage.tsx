"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import CartItem from "@/components/CartItem";
import WhatsAppQR from "./WhatsAppQR";
import UPIQrCode from "./UPIQrCode";

interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  images: string[];
  category: {
    _id: string;
    isHamperAble: boolean;
  };
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
  const [customization, setCustomization] = useState("");
  const [showQR, setShowQR] = useState(false);
  const [transactionId, setTransactionId] = useState("");
  const [showWhatsAppQR, setShowWhatsAppQR] = useState(false);
  const [whatsAppMessage, setWhatsAppMessage] = useState("");
  const [isHamper, setIsHamper] = useState(false);
  const upiId = process.env.NEXT_PUBLIC_UPI_ID as string | "";
  const upiName = process.env.NEXT_PUBLIC_UPI_NAME;

  const getTotalQuantity = () => {
    return displayedCartItems.reduce((total, item) => total + item.quantity, 0);
  };

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

  const displayedCartItems = isHamper
    ? cartItems.filter((item) => item.product.category?.isHamperAble)
    : cartItems;

  const isQuantityExceeded = isHamper && getTotalQuantity() > 6;

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
    } catch (error: unknown) {
      console.error("Error:", error);
      if (error instanceof Error) {
        alert(error.message);
      } else {
        alert("An unexpected error occurred. Please try again later.");
      }
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
    if (isHamper && getTotalQuantity() > 6) {
      return alert("Hamper orders cannot exceed 6 items in total!");
    }
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
        userEmail: userData.email,
        products: displayedCartItems.map(({ product, quantity }) => ({
          product: product._id,
          name: product.name,
          quantity,
        })),
        totalAmount: displayedCartItems.reduce(
          (total, item) => total + item.product.price * item.quantity,
          0
        ),
        customization,
        paymentMethod,
        transactionId: paymentMethod === "Online" ? transactionId : null,
        isHamper,
        isPaymentVerified: paymentMethod === "Online",
      };

      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderData),
      });

      if (!res.ok) throw new Error("Failed to place order");
      const orderResponse = await res.json();
      const orderId = orderResponse.order._id;

      await fetch("/api/send-message", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          phoneNumber: "+917600960068",
          message: `Order Confirmed! 📦\n\nOrder ID: ${orderId}\nUser ID: ${userId}\n📞 *Contact:* ${
            userData.phoneNumber
          }\n
          👤 *Customer:* ${userData.name}\nItems:\n${orderData.products
            .map((p) => `- ${p.name} x${p.quantity}`)
            .join("\n")}\n\nTotal: ₹${orderData.totalAmount}\nCustomization:${
            customization || "N/A"
          }\nPayment: ${paymentMethod}\nTransaction ID: ${
            transactionId || "N/A"
          }\nHamper: ${isHamper ? "Yes" : "No"}`,
        }),
      });

      await fetch("/api/send-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          to: userData.email,
          subject: "Order Confirmation - Your Order is Placed!",
          text: `Dear ${
            userData.name
          },\n\nThank you for your order! Your order has been placed successfully. Below are the details:\n\nOrder ID: ${orderId}\nTotal Amount: ₹${
            orderData.totalAmount
          }\nPayment Method: ${paymentMethod}\nTransaction ID: ${
            transactionId || "N/A"
          }\nCustomization: ${customization || "N/A"}\nHamper: ${
            isHamper ? "Yes" : "No"
          }\n\nItems Ordered:\n${orderData.products
            .map((p) => `- ${p.name} x${p.quantity}`)
            .join(
              "\n"
            )}\n\nWe will notify you once your order is ready.\n\nBest regards,\nBindi's Cupcakery`,
        }),
      });

      await clearCart();
      alert("Order placed successfully! A confirmation email has been sent.");
      router.push("/user?tab=orders");
    } catch (error) {
      console.error(error);
      alert("Checkout failed, please try again.");
    } finally {
      setCheckingOut(false);
    }
  }
  const generateWhatsAppOrderMessage = async () => {
    if (isHamper && getTotalQuantity() > 6) {
      alert("Hamper orders cannot exceed 6 items in total!");
      return;
    }
    try {
      const userRes = await fetch(`/api/user/details?userId=${userId}`);
      if (!userRes.ok) throw new Error("Failed to fetch user details");
      const userData = await userRes.json();

      const message = `Order Details:
🛍️ Order from: Bindi's Cupcakery
👤 Customer: ${userData.name}
📞 Contact: ${userData.phoneNumber}
📦 Items:
${displayedCartItems
  .map((item) => `- ${item.product.name} x${item.quantity}`)
  .join("\n")}
💰 Total Amount: ₹${displayedCartItems.reduce(
        (total, item) => total + item.product.price * item.quantity,
        0
      )}
📝 Customization: ${customization || "N/A"}
🎁 Is Hamper: ${isHamper ? "Yes" : "No"}
💳 Payment Method: Pay on Takeaway`;

      setWhatsAppMessage(message);
      setShowWhatsAppQR(true);
    } catch (error) {
      console.log(error);
      console.error("Failed to fetch user details for WhatsApp order.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-2xl shadow-xl p-6 sm:p-8">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-pink-600">
              Your Cart
            </h1>
            {cartItems.length > 0 && (
              <button
                onClick={clearCart}
                disabled={loading}
                className="px-4 py-2 bg-red-500 text-white rounded-lg transform hover:scale-105 transition-transform duration-200 hover:bg-red-600 disabled:opacity-50 shadow-md hover:shadow-lg"
              >
                Clear Cart
              </button>
            )}
          </div>

          {/* Hamper Toggle with enhanced styling */}
          <div className="mb-6 bg-gray-50 p-4 rounded-xl">
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                className="sr-only peer"
                checked={isHamper}
                onChange={(e) => setIsHamper(e.target.checked)}
              />
              <div className="w-14 h-7 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[4px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-blue-600"></div>
              <span className="ml-4 text-lg font-medium text-gray-900">
                Make it a Hamper 🎁
              </span>
            </label>
          </div>

          {/* Hamper Warning with enhanced styling */}
          {isHamper && (
            <div
              className={`mb-6 p-4 rounded-xl border-2 ${
                isQuantityExceeded
                  ? "bg-red-50 border-red-300"
                  : "bg-blue-50 border-blue-300"
              }`}
            >
              <p
                className={`text-base font-medium ${
                  isQuantityExceeded ? "text-red-600" : "text-blue-600"
                }`}
              >
                {isQuantityExceeded
                  ? "⚠️ Hamper orders cannot exceed 6 items in total!"
                  : `🎁 Current hamper quantity: ${getTotalQuantity()}/6 items`}
              </p>
            </div>
          )}

          {displayedCartItems.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-2xl text-gray-400 font-medium">
                Your cart is empty
              </p>
              <button
                onClick={() => router.push("/products")}
                className="mt-6 px-8 py-3 bg-purple-600 text-white font-semibold rounded-xl hover:bg-purple-700 transition-colors duration-200 shadow-md hover:shadow-lg"
              >
                Start Shopping
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              {displayedCartItems.map((item) => (
                <CartItem
                  key={item.product._id}
                  item={item}
                  loading={loading}
                  updateQuantity={updateQuantity}
                  removeItem={removeItem}
                />
              ))}

              <div className="mt-8 bg-gray-50 rounded-xl p-6">
                <label className="block text-lg font-semibold mb-3 text-gray-700">
                  Customization Details:
                </label>
                <textarea
                  value={customization}
                  onChange={(e) => setCustomization(e.target.value)}
                  className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                  placeholder="Enter any special requests or customization details..."
                  rows={3}
                />
              </div>

              <div className="mt-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
                <div className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-pink-600">
                  Total: ₹
                  {displayedCartItems
                    .reduce(
                      (total, item) =>
                        total + item.product.price * item.quantity,
                      0
                    )
                    .toFixed(2)}
                </div>

                <div className="flex flex-col gap-3 w-full sm:w-auto">
                  <button
                    onClick={() => handleCheckout("Pay on Takeway")}
                    disabled={checkingOut || loading || isQuantityExceeded}
                    className="w-full sm:w-auto px-8 py-3 bg-black text-white font-semibold rounded-xl transform hover:-translate-y-1 transition-all duration-200 hover:shadow-lg disabled:opacity-50 disabled:transform-none"
                  >
                    Pay on Takeaway
                  </button>

                  <button
                    onClick={() => setShowQR(true)}
                    disabled={isQuantityExceeded}
                    className="w-full sm:w-auto px-8 py-3 bg-blue-600 text-white font-semibold rounded-xl transform hover:-translate-y-1 transition-all duration-200 hover:shadow-lg disabled:opacity-50 disabled:transform-none"
                  >
                    Pay Online
                  </button>

                  <button
                    onClick={generateWhatsAppOrderMessage}
                    disabled={isQuantityExceeded}
                    className="w-full sm:w-auto px-8 py-3 bg-green-600 text-white font-semibold rounded-xl transform hover:-translate-y-1 transition-all duration-200 hover:shadow-lg disabled:opacity-50 disabled:transform-none"
                  >
                    Order via WhatsApp
                  </button>
                </div>
              </div>

              {showQR && (
                <div className="mt-6 bg-gray-50 rounded-xl p-6 text-center">
                  <UPIQrCode
                    upiId={upiId}
                    name={upiName}
                    amount={Number(
                      displayedCartItems
                        .reduce(
                          (total, item) =>
                            total + item.product.price * item.quantity,
                          0
                        )
                        .toFixed(2)
                    )}
                  />
                  <p className="text-gray-600 mt-4">
                    Scan QR to pay ₹
                    {displayedCartItems
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
                    className="mt-4 w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                  <button
                    onClick={() => handleCheckout("Online")}
                    disabled={checkingOut || loading}
                    className="mt-4 px-8 py-3 bg-green-600 text-white font-semibold rounded-xl transform hover:-translate-y-1 transition-all duration-200 hover:shadow-lg disabled:opacity-50"
                  >
                    Confirm Payment
                  </button>
                </div>
              )}

              {showWhatsAppQR && (
                <div className="mt-6 bg-gray-50 rounded-xl p-6 text-center">
                  <WhatsAppQR
                    phoneNumber="+917600960068"
                    message={whatsAppMessage}
                  />
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
