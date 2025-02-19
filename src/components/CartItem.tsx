interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  images: string[];
}

interface CartItemProps {
  item: {
    product: Product;
    quantity: number;
  };
  loading: boolean;
  updateQuantity: (productId: string, action: "increase" | "decrease") => void;
  removeItem: (productId: string) => void;
}

export default function CartItem({
  item,
  loading,
  updateQuantity,
  removeItem,
}: CartItemProps) {
  return (
    <div className="relative border border-blue-200 p-6 rounded-2xl shadow-lg bg-blue-50 backdrop-blur-lg hover:shadow-xl transition-all duration-300 ease-in-out transform hover:-translate-y-1">
      {/* Remove Button - Neumorphic Style */}
      <button
        onClick={() => removeItem(item.product._id)}
        className="absolute top-3 right-3 w-8 h-8 flex items-center justify-center bg-gray-100 rounded-full shadow-md transition-all duration-300 hover:bg-red-500 hover:text-white hover:shadow-red-400 hover:scale-110 active:scale-90"
      >
        ✖
      </button>

      {/* Product Name */}
      <h2 className="font-semibold text-xl text-gray-800">
        {item.product.name}
      </h2>
      <p className="text-gray-600 text-sm">{item.product.description}</p>

      {/* Price Section */}
      <div className="flex justify-between items-center mt-3">
        <p className="text-lg font-medium text-gray-700">
          ₹{item.product.price}
        </p>
        <p className="text-lg font-semibold text-gray-900">
          Total: ₹{(item.product.price * item.quantity).toFixed(2)}
        </p>
      </div>

      {/* Quantity Controls */}
      <div className="flex items-center gap-4 mt-4">
        <button
          onClick={() => updateQuantity(item.product._id, "decrease")}
          disabled={loading}
          className="px-4 py-2 bg-gray-800 text-white rounded-lg shadow-md transition-all duration-200 hover:bg-gray-900 active:scale-90 disabled:opacity-50"
        >
          -
        </button>
        <span className="text-lg font-bold text-gray-800">{item.quantity}</span>
        <button
          onClick={() => updateQuantity(item.product._id, "increase")}
          disabled={loading}
          className="px-4 py-2 bg-gray-800 text-white rounded-lg shadow-md transition-all duration-200 hover:bg-gray-900 active:scale-90 disabled:opacity-50"
        >
          +
        </button>
      </div>
    </div>
  );
}
