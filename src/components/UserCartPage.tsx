"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import CartItem from "@/components/CartItem";
import UPIQrCode from "./UPIQrCode";
import { toast } from "react-toastify";

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

export default function CartPage({ userId }: { userId: string | undefined }) {
  const router = useRouter();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [checkingOut, setCheckingOut] = useState(false);
  const [customization, setCustomization] = useState("");
  const [showQR, setShowQR] = useState(false);
  const [transactionId, setTransactionId] = useState("");
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
        toast.error(error.message, {
          position: "top-center",
        });
      } else {
        toast.error("An unexpected error occurred. Please try again later.", {
          position: "top-center",
        });
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
    if (cartItems.length === 0)
      return toast.info("Your cart is empty!", {
        position: "top-center",
      });
    if (isHamper && getTotalQuantity() > 6) {
      return toast.error("Hamper orders cannot exceed 6 items in total!", {
        position: "top-center",
      });
    }
    if (paymentMethod === "Online" && !transactionId) {
      return toast.error("Please enter the transaction ID.", {
        position: "top-center",
      });
    }

    setCheckingOut(true);
    try {
      const userRes = await fetch(`/api/user/details?userId=${userId}`);
      if (!userRes.ok) throw new Error("Failed to fetch user details");
      const userData = await userRes.json();

      if (paymentMethod === "Online") {
        if (!transactionId || !/^\d{10,18}$/.test(transactionId)) {
          throw new Error(
            "Transaction ID must be a number between 10 and 18 digits"
          );
        }
      }

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
        isPaymentVerified: false,
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
          phoneNumber: "7600960068",
          message: `Order Confirmed! 📦\n\nOrder ID: ${orderId}\nUser ID: ${userId}\n📞 *Contact:* ${
            userData.user.phone
          }\n
          👤 *Customer:* ${userData.user.name}\nItems:\n${orderData.products
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
          to: userData.user.email,
          subject: "Order Confirmation - Your Order is Placed!",
          text: `Dear ${
            userData.user.name
          },\n\nThank you for your order! Your order has been placed successfully. Below are the details:\n\nOrder ID: ${orderId}\nTotal Amount: ₹${
            orderData.totalAmount
          }\nPayment Method: ${paymentMethod}\nTransaction ID: ${
            transactionId || "N/A"
          }\nCustomization: ${customization || "N/A"}\nHamper: ${
            isHamper ? "Yes" : "No"
          }\n\nItems Ordered:\n${orderData.products
            .map((p) => `- ${p.name} x${p.quantity}`)
            .join("\n")}\n\n${
            paymentMethod === "Online"
              ? "Your Payment will be verified soon"
              : ""
          }\nWe will notify you once your order is ready.\nHope you have a great time having cupcakes.\n\nBest regards,\nBindi's Cupcakery`,
        }),
      });

      await clearCart();
      toast.success(
        "Order placed successfully! A confirmation email has been sent.",
        {
          position: "top-center",
        }
      );
      router.push("/user?tab=orders");
    } catch (error) {
      console.error(error);
      toast.error("Checkout failed, please try again.", {
        position: "top-center",
      });
    } finally {
      setCheckingOut(false);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[200px] w-full bg-[#E0F2FE]">
        <p className="text-base sm:text-lg font-semibold text-blue-700 font-ancient">
          Loading...
        </p>
      </div>
    );
  }

  const handlePayOnlineClick = () => {
    setShowQR(!showQR);
  };
  return (
    <div className="min-h-screen pb-8">
      <div className="max-w-4xl mx-auto sm:px-4 lg:px-8">
        <div className="bg-transparent rounded-2xl p-6 sm:p-8">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold bg-clip-text text-blue-800 font-ancient">
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
          <div className="mb-6 bg-purple-50 p-4 rounded-xl border-2 border-blue-200">
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                className="sr-only peer"
                checked={isHamper}
                onChange={(e) => setIsHamper(e.target.checked)}
              />
              <div className="w-14 h-7 bg-blue-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[4px] after:bg-white after:border-blue-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-blue-600"></div>
              <span className="ml-4 text-lg font-medium text-blue-900">
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
              <p className="text-2xl text-blue-400 font-medium">
                Your cart is empty
              </p>
              <button
                onClick={() => router.push("/products")}
                className="mt-6 px-8 py-3 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition-colors duration-200 shadow-md hover:shadow-lg"
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

              <div className="mt-8 bg-blue-50 rounded-xl p-6 shadow-xl">
                <label className="block text-lg font-semibold mb-3 text-blue-700">
                  Customization Details:
                </label>
                <textarea
                  value={customization}
                  onChange={(e) => setCustomization(e.target.value)}
                  className="w-full p-4 border border-blue-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  placeholder="Enter any special requests or customization details..."
                  rows={3}
                />
              </div>

              <div className="mt-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
                <div className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-blue-600">
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
                    onClick={handlePayOnlineClick}
                    disabled={isQuantityExceeded}
                    className={`w-full sm:w-auto px-8 py-3 ${
                      showQR ? "bg-red-600" : "bg-blue-600"
                    } text-white font-semibold rounded-xl transform hover:-translate-y-1 transition-all duration-200 hover:shadow-lg disabled:opacity-50 disabled:transform-none`}
                  >
                    {showQR ? "Hide Payment QR" : "Pay Online"}
                  </button>
                </div>
              </div>

              {showQR && (
                <div className="mt-6 bg-[#EFF6FF] shadow-xl border-2 border-blue-200 rounded-xl p-6 text-center">
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
                  <p className="text-blue-600 mt-4">
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
                    className="mt-4 w-full p-3 border border-blue-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
