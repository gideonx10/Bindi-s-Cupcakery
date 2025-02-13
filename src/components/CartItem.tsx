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
    <div className="relative border p-4 rounded-lg shadow-sm">
      {/* Remove Button */}
      <button
        onClick={() => removeItem(item.product._id)}
        className="absolute top-2 right-2 text-red-500 hover:text-red-700"
      >
        ❌
      </button>

      {/* Product Name */}
      <h2 className="font-semibold">{item.product.name}</h2>
      <p className="text-gray-600">{item.product.description}</p>

      {/* Price Section */}
      <div className="flex justify-between items-center mt-2">
        <p className="font-medium text-gray-700">
          Price: ₹{item.product.price}
        </p>
        <p className="font-medium text-gray-900">
          Total: ₹{(item.product.price * item.quantity).toFixed(2)}
        </p>
      </div>

      {/* Quantity Controls */}
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
  );
}
