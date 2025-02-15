"use client";

import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { useRouter } from "next/navigation";

interface CartItem {
  product: {
    _id: string;
    name: string;
    price: number;
    images: string[];
  };
  quantity: number;
}

export default function Cart({
  isOpen,
  onClose,
  userId,
}: {
  isOpen: boolean;
  onClose: () => void;
  userId: string;
}) {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  useEffect(() => {
    if (isOpen) {
      fetchCartItems();
    }
  }, [isOpen, userId]);

  const fetchCartItems = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/cart?userId=${userId}`);
      const data = await response.json();
      setCartItems(data.products || []);
    } catch (error) {
      console.error("Error fetching cart items:", error);
      setError("Failed to load cart");
    }
    setLoading(false);
  };

  // Calculate total price
  const totalPrice = cartItems.reduce(
    (total, item) => total + item.product.price * item.quantity,
    0
  );

  return (
    <div
      className={`fixed inset-0 bg-black bg-opacity-50 transition-opacity duration-300 z-50 ${
        isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
      }`}
      onClick={onClose}
    >
      <div
        className={`fixed top-[12vh] bottom-10 right-0 h-auto w-full max-w-md md:w-96 bg-[#f0faff] rounded-l-xl shadow-xl transition-transform duration-300 ease-in-out z-30 ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex flex-col h-full">
          {/* Cart Header */}
          <div className="flex justify-between items-center p-4 shadow-xl rounded-bl-xl">
            <h2 className="text-2xl font-bold text-[#3b0017]">Your Cart</h2>
            <button
              onClick={onClose}
              className="p-2 hover:border-sky-300 rounded-full transition-colors duration-200"
            >
              <X size={24} className="text-[#3b0017]" />
            </button>
          </div>

          {/* Cart Content */}
          <div className="flex-1 overflow-y-auto px-3 py-4 scrollbar-hide shiny-background">
            {loading ? (
              <p className="text-[#3b0017] text-center">Loading...</p>
            ) : error ? (
              <p className="text-red-600 text-center">{error}</p>
            ) : cartItems.length === 0 ? (
              <p className="text-[#3b0017] text-center">Your cart is empty.</p>
            ) : (
              <div className="space-y-2">
                {cartItems.map((item) => (
                  <div
                    key={item.product._id}
                    className="flex items-center bg-white px-2 py-3 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200"
                  >
                    <div className="flex-1 ml-4">
                      <h3 className="text-lg font-semibold text-[#3b0017] mb-1">
                        {item.product.name}
                      </h3>
                      <div className="flex justify-between items-center">
                        <p className="text-sm text-gray-700">
                          ₹ {item.product.price.toFixed(2)} × {item.quantity}
                        </p>
                        <p className="font-semibold text-[#3b0017]">
                          ₹ {(item.product.price * item.quantity).toFixed(2)}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Cart Footer - Sticky Checkout Button */}
          {cartItems.length > 0 && (
            <div className="fixed bottom-0 right-0 w-full max-w-md md:w-96 p-4 rounded-s-2xl shadow-[0_-10px_15px_-3px_rgba(0,0,0,0.1)]">
              <div className="flex justify-between text-lg font-semibold text-[#3b0017] mb-4">
                <span>Total:</span>
                <span>₹{totalPrice.toFixed(2)}</span>
              </div>
              <button
                onClick={() => router.push("/user?tab=cart")}
                className="w-full text-black shadow-2xl bg-[#c3e3fe] py-3 rounded-xl font-semibold hover:bg-[#abd5f8] transition-colors duration-300"
              >
                Proceed to Checkout
              </button>
            </div>
          )}
        </div>
      </div>
      <style>{`
        .shiny-background {
          background: linear-gradient(
            135deg,
            rgba(255, 255, 255, 0.2) 25%,
            rgba(255, 255, 255, 0.1) 25%,
            rgba(255, 255, 255, 0.1) 50%,
            rgba(255, 255, 255, 0.2) 50%,
            rgba(255, 255, 255, 0.2) 75%,
            rgba(255, 255, 255, 0.1) 75%,
            rgba(255, 255, 255, 0.1) 100%
          );
          background-size: 200% 200%;
          animation: shiny 1.5s infinite linear;
        }

        @keyframes shiny {
          from {
            background-position: 0 0;
          }
          to {
            background-position: 100% 100%;
          }
        }

        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }

        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
}
