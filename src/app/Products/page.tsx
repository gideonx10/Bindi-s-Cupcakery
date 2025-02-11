"use client";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useDebounce } from "@/hooks/useDebounce";
import ProductCard from "../../components/ProductCard";
import { toast } from "react-hot-toast";
import { Plus, Minus } from "lucide-react";
import { signOut, useSession } from "next-auth/react";

interface Product {
  _id: string;
  name: string;
  description?: string;
  price: number;
  images: string[];
  isFeatured?: boolean;
  isSugarFree?: boolean;
  category: string;
}

interface Category {
  _id: string;
  name: string;
}

interface CartQuantities {
  [key: string]: number;
}

export default function ProductsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { data: session, status } = useSession();

  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [addingToCart, setAddingToCart] = useState<string | null>(null);

  const initialSearchQuery = searchParams.get("search") || "";
  const [searchQuery, setSearchQuery] = useState(initialSearchQuery);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedPriceFilter, setSelectedPriceFilter] = useState<string | null>(
    null
  );
  const [filterSugarFree, setFilterSugarFree] = useState<boolean>(false);
  const [filterBestseller, setFilterBestseller] = useState<boolean>(false);

  const debouncedSearchQuery = useDebounce(searchQuery, 500);
  const [cartQuantities, setCartQuantities] = useState<CartQuantities>({});
  const [updatingCart, setUpdatingCart] = useState<string | null>(null);

  const handleCartAction = async (
    productId: string,
    action: "add" | "update",
    newQuantity?: number
  ) => {
    if (status === "unauthenticated") {
      toast.error("Please sign in to add items to cart");
      router.push("/signin");
      return;
    }

    if (action === "add") {
      await addToCart(productId);
    } else if (action === "update" && typeof newQuantity === "number") {
      await updateCartQuantity(productId, newQuantity);
    }
  };

  const addToCart = async (productId: string) => {
    setUpdatingCart(productId);

    try {
      const userId = (session?.user as { id: string })?.id;
      const response = await fetch("/api/cart", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId,
          productId,
          quantity: 1,
          action: "increase",
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to add to cart");
      }

      setCartQuantities((prev) => ({
        ...prev,
        [productId]: 1,
      }));

      toast.success("Added to cart!");
    } catch (err) {
      toast.error("Failed to add to cart");
      console.error("Error adding to cart:", err);
    } finally {
      setUpdatingCart(null);
    }
  };

  const updateCartQuantity = async (productId: string, newQuantity: number) => {
    if (newQuantity < 0) return;
    setUpdatingCart(productId);

    try {
      const userId = (session?.user as { id: string })?.id;

      const response = await fetch("/api/cart", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId,
          productId,
          quantity: 1,
          action:
            newQuantity > (cartQuantities[productId] || 0)
              ? "increase"
              : "decrease",
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to update cart");
      }

      setCartQuantities((prev) => ({
        ...prev,
        [productId]: newQuantity,
      }));

      toast.success("Cart updated successfully!");
    } catch (err) {
      toast.error("Failed to update cart");
      console.error("Error updating cart:", err);
    } finally {
      setUpdatingCart(null);
    }
  };

  // ... (keep all useEffects and other functions the same)
  useEffect(() => {
    async function fetchCartQuantities() {
      if (!session || !session.user) return; // Ensure session exists
      const userId = (session.user as { id: string })?.id;

      if (!userId) return; // Avoid making a request if userId is undefined

      try {
        const response = await fetch(`/api/cart?userId=${userId}`);

        if (!response.ok) throw new Error("Failed to fetch cart");

        const cartData = await response.json();
        const quantities: CartQuantities = {};

        cartData.products.forEach((item: any) => {
          quantities[item.product._id] = item.quantity;
        });

        setCartQuantities(quantities);
      } catch (err) {
        console.error("Error fetching cart quantities:", err);
      }
    }

    fetchCartQuantities();
  }, [session]); // Add `session` as a dependency

  // Fetch products
  useEffect(() => {
    async function fetchProducts() {
      setLoading(true);
      try {
        const queryParams = new URLSearchParams();
        if (debouncedSearchQuery)
          queryParams.append("search", debouncedSearchQuery);
        if (selectedCategory) queryParams.append("category", selectedCategory);
        if (selectedPriceFilter)
          queryParams.append("priceFilter", selectedPriceFilter);

        const response = await fetch(`/api/products?${queryParams.toString()}`);
        if (!response.ok) throw new Error("Failed to fetch products");

        const data: Product[] = await response.json();
        setProducts(data);
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    }

    fetchProducts();
  }, [debouncedSearchQuery, selectedCategory, selectedPriceFilter]);

  // Fetch categories
  useEffect(() => {
    async function fetchCategories() {
      try {
        const response = await fetch("/api/categories");
        if (!response.ok) throw new Error("Failed to fetch categories");

        const data: Category[] = await response.json();
        setCategories(data);
      } catch (err) {
        console.error("Error fetching categories:", err);
      }
    }

    fetchCategories();
  }, []);

  // Filter and sort functions
  const sortByPrice = (products: Product[]) => {
    if (selectedPriceFilter === "high-low") {
      return products.sort((a, b) => b.price - a.price);
    } else if (selectedPriceFilter === "low-high") {
      return products.sort((a, b) => a.price - b.price);
    }
    return products;
  };

  const filterProducts = (products: Product[]) => {
    let filtered = sortByPrice(products);
    if (filterSugarFree) {
      filtered = filtered.filter((product) => product.isSugarFree);
    }
    if (filterBestseller) {
      filtered = filtered.filter((product) => product.isFeatured);
    }
    return filtered;
  };

  const filteredProducts = filterProducts(products);

  return (
    <div className="container mx-auto p-4">
      {/* ... (keep all filters and search components the same) */}
      <h1 className="text-2xl font-bold mb-4">Our Products</h1>

      {/* Search Bar */}
      <input
        type="text"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        placeholder="Search for products..."
        className="w-full p-2 mb-4 border border-gray-300 rounded-md"
      />

      {/* Category Filter */}
      <select
        value={selectedCategory || ""}
        onChange={(e) => setSelectedCategory(e.target.value || null)}
        className="w-full p-2 mb-4 border border-gray-300 rounded-md"
      >
        <option value="">All Categories</option>
        {categories.map((category) => (
          <option key={category._id} value={category._id}>
            {category.name}
          </option>
        ))}
      </select>

      {/* Price Filter */}
      <select
        value={selectedPriceFilter || ""}
        onChange={(e) => setSelectedPriceFilter(e.target.value || null)}
        className="w-full p-2 mb-4 border border-gray-300 rounded-md"
      >
        <option value="">Sort by Price</option>
        <option value="low-high">Low to High</option>
        <option value="high-low">High to Low</option>
      </select>

      {/* Additional Filters */}
      <div className="flex gap-2 mb-4">
        <button
          onClick={() => setFilterSugarFree((prev) => !prev)}
          className={`px-4 py-2 text-white rounded-md transition ${
            filterSugarFree ? "bg-green-600" : "bg-gray-400"
          }`}
        >
          {filterSugarFree ? "✔ Sugar-Free" : "Sugar-Free"}
        </button>

        <button
          onClick={() => setFilterBestseller((prev) => !prev)}
          className={`px-4 py-2 text-white rounded-md transition ${
            filterBestseller ? "bg-yellow-600" : "bg-gray-400"
          }`}
        >
          {filterBestseller ? "✔ Bestseller" : "Bestseller"}
        </button>
      </div>

      {loading && <p>Loading products...</p>}
      {error && <p className="text-red-500">{error}</p>}

      {filteredProducts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <div key={product._id} className="border rounded-lg p-4 shadow-sm">
              <ProductCard product={product} />
              <div className="mt-2">
                {cartQuantities[product._id] ? (
                  // Show quantity controls if item is in cart
                  <div className="flex items-center justify-between">
                    <button
                      onClick={() =>
                        handleCartAction(
                          product._id,
                          "update",
                          (cartQuantities[product._id] || 0) - 1
                        )
                      }
                      disabled={updatingCart === product._id}
                      className={`p-2 rounded-l-md ${
                        updatingCart === product._id
                          ? "bg-gray-300"
                          : "bg-blue-600 hover:bg-blue-700 text-white"
                      }`}
                    >
                      <Minus className="w-4 h-4" />
                    </button>

                    <span className="px-4 py-2 bg-gray-100 font-medium">
                      {cartQuantities[product._id]}
                    </span>

                    <button
                      onClick={() =>
                        handleCartAction(
                          product._id,
                          "update",
                          (cartQuantities[product._id] || 0) + 1
                        )
                      }
                      disabled={updatingCart === product._id}
                      className={`p-2 rounded-r-md ${
                        updatingCart === product._id
                          ? "bg-gray-300"
                          : "bg-blue-600 hover:bg-blue-700 text-white"
                      }`}
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  // Show Add to Cart button if item is not in cart
                  <button
                    onClick={() => handleCartAction(product._id, "add")}
                    disabled={updatingCart === product._id}
                    className={`w-full p-2 rounded-md ${
                      updatingCart === product._id
                        ? "bg-gray-300"
                        : "bg-blue-600 hover:bg-blue-700 text-white"
                    }`}
                  >
                    Add to Cart
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        !loading && <p>No products available.</p>
      )}
      {session && (
        <button
          onClick={() => signOut()}
          className="px-4 py-2 bg-red-500 text-white rounded"
        >
          Logout
        </button>
      )}
    </div>
  );
}
