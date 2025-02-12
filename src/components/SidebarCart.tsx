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
    } catch (err) {
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
    <div>
      <div
        className={`fixed top-0 right-0 h-full w-1/3 md:w-96 bg-yellow-400 shadow-xl transition-transform duration-300 ease-in-out z-30 ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full mt-20">
          {/* Cart Header */}
          <div className="flex justify-between items-center p-6 border-b border-yellow-500">
            <h2 className="text-2xl font-bold text-[#3b0017]">Your Cart</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-yellow-500 rounded-full transition-colors duration-200"
            >
              <X size={24} className="text-[#3b0017]" />
            </button>
          </div>

          {/* Cart Content */}
          <div className="flex-1 overflow-y-auto px-6 py-4 mb-24 scrollbar-hide">
            {loading ? (
              <p className="text-[#3b0017] text-center">Loading...</p>
            ) : error ? (
              <p className="text-red-600 text-center">{error}</p>
            ) : cartItems.length === 0 ? (
              <p className="text-[#3b0017] text-center">Your cart is empty.</p>
            ) : (
              <div className="space-y-4">
                {cartItems.map((item) => (
                  <div
                    key={item.product._id}
                    className="flex items-center bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200"
                  >
                    {/* <img
                      src={item.product.images[0]}
                      alt={item.product.name}
                      className="w-16 h-16 object-cover rounded-md"
                    /> */}
                    <div className="flex-1 ml-4">
                      <h3 className="text-lg font-semibold text-[#3b0017] mb-1">
                        {item.product.name}
                      </h3>
                      <div className="flex justify-between items-center">
                        <p className="text-sm text-gray-700">
                          ${item.product.price.toFixed(2)} × {item.quantity}
                        </p>
                        <p className="font-semibold text-[#3b0017]">
                          ${(item.product.price * item.quantity).toFixed(2)}
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
            <div className="fixed bottom-0 right-0 w-1/3 md:w-96 bg-yellow-300 p-6 border-t rounded-2xl border-yellow-500 shadow-lg">
              <div className="flex justify-between text-lg font-semibold text-[#3b0017] mb-4">
                <span>Total:</span>
                <span>${totalPrice.toFixed(2)}</span>
              </div>
              <button
                onClick={() => router.push("/user?tab=cart")}
                className="w-full bg-[#3b0017] text-white py-3 rounded-xl font-semibold hover:bg-[#570025] transition-colors duration-200"
              >
                Proceed to Checkout
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
