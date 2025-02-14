"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useDebounce } from "@/hooks/useDebounce";
import ProductCard from "../../components/ProductCard";
import { toast } from "react-hot-toast";
import { Plus, Minus, Search, ChevronRight, Filter } from "lucide-react";
import { useSession } from "next-auth/react";

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

interface CartItem {
  product: Product;
  quantity: number;
}

export default function ProductsPage() {
  const itemsRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const searchParams = useSearchParams();
  const { data: session } = useSession();

  // State variables
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const initialSearchQuery = searchParams.get("search") || "";
  const [searchQuery, setSearchQuery] = useState(initialSearchQuery);
  const debouncedSearchQuery = useDebounce(searchQuery, 500);

  const [filterSugarFree, setFilterSugarFree] = useState<boolean>(false);
  const [filterBestseller, setFilterBestseller] = useState<boolean>(false);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedPriceFilter, setSelectedPriceFilter] = useState<string | null>(
    null
  );

  const [cartQuantities, setCartQuantities] = useState<CartQuantities>({});
  const [updatingCart, setUpdatingCart] = useState<string | null>(null);

  const [categoryDropdownOpen, setCategoryDropdownOpen] = useState(false);
  const [priceDropdownOpen, setPriceDropdownOpen] = useState(false);
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  // Fetch products when filter conditions change
  useEffect(() => {
    async function fetchProducts() {
      setLoading(true);
      setError(null);

      try {
        // Build query parameters
        const queryParams = new URLSearchParams();

        if (debouncedSearchQuery) {
          queryParams.append("search", debouncedSearchQuery);
        }

        // Add selected categories
        selectedCategories.forEach((categoryId) => {
          queryParams.append("categories[]", categoryId);
        });

        // Add price filter
        if (selectedPriceFilter) {
          queryParams.append("priceFilter", selectedPriceFilter);
        }

        // Add sugar-free filter
        if (filterSugarFree) {
          queryParams.append("isSugarFree", "true");
        }

        // Add bestseller/featured filter
        if (filterBestseller) {
          queryParams.append("isFeatured", "true");
        }

        const response = await fetch(`/api/products?${queryParams.toString()}`);

        if (!response.ok) {
          throw new Error("Failed to fetch products");
        }

        const data = await response.json();

        if (!Array.isArray(data)) {
          throw new Error("Invalid response format");
        }

        setProducts(data);
      } catch (err) {
        setError((err as Error).message);
        console.error("Error fetching products:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchProducts();
  }, [
    debouncedSearchQuery,
    selectedCategories,
    selectedPriceFilter,
    filterSugarFree,
    filterBestseller,
  ]);

  // Fetch categories on component mount
  useEffect(() => {
    async function fetchCategories() {
      try {
        const response = await fetch("/api/categories");
        if (!response.ok) throw new Error("Failed to fetch categories");

        const data = await response.json();
        setCategories(data);
      } catch (err) {
        console.error("Error fetching categories:", err);
      }
    }

    fetchCategories();
  }, []);

  // Fetch cart quantities when user session changes
  useEffect(() => {
    async function fetchCartQuantities() {
      const userId = (session?.user as { id: string })?.id;
      if (!userId) {
        setCartQuantities({});
        return;
      }

      try {
        const response = await fetch(`/api/cart?userId=${userId}`);
        if (!response.ok) throw new Error("Failed to fetch cart");

        const cartData: { products: CartItem[] } = await response.json();
        const quantities: CartQuantities = {};

        cartData.products.forEach((item) => {
          quantities[item.product._id] = item.quantity;
        });

        setCartQuantities(quantities);
      } catch (err) {
        console.error("Error fetching cart quantities:", err);
      }
    }

    fetchCartQuantities();
  }, [session?.user]);

  // Set body overflow to prevent horizontal scroll
  useEffect(() => {
    document.body.style.overflowX = "hidden";
    return () => {
      document.body.style.overflowX = "auto";
    };
  }, []);

  // Add to cart function
  const addToCart = async (productId: string) => {
    setUpdatingCart(productId);

    try {
      const userId = (session?.user as { id: string })?.id;
      if (!userId) {
        router.push(
          `/signin?callbackUrl=${encodeURIComponent(window.location.href)}`
        );
        return;
      }

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

  // Update cart quantity function
  const updateCartQuantity = async (productId: string, newQuantity: number) => {
    if (newQuantity < 0) return;
    setUpdatingCart(productId);

    try {
      const userId = (session?.user as { id: string })?.id;

      if (!userId) {
        router.push(
          `/signin?callbackUrl=${encodeURIComponent(window.location.href)}`
        );
        return;
      }

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

      if (newQuantity === 0) {
        setCartQuantities((prev) => {
          const newQuantities = { ...prev };
          delete newQuantities[productId];
          return newQuantities;
        });
      } else {
        setCartQuantities((prev) => ({
          ...prev,
          [productId]: newQuantity,
        }));
      }

      toast.success("Cart updated successfully!");
    } catch (err) {
      toast.error("Failed to update cart");
      console.error("Error updating cart:", err);
    } finally {
      setUpdatingCart(null);
    }
  };

  // Toggle category selection
  const toggleCategory = (categoryId: string) => {
    setSelectedCategories((prev) => {
      if (prev.includes(categoryId)) {
        return prev.filter((id) => id !== categoryId);
      } else {
        return [...prev, categoryId];
      }
    });
  };

  // Render function for product cards
  const renderProductCards = () => {
    if (loading) {
      return (
        <div className="col-span-2 sm:col-span-2 lg:col-span-3 flex justify-center items-center min-h-[200px]">
          <p>Loading products...</p>
        </div>
      );
    }

    if (error) {
      return (
        <div className="col-span-2 sm:col-span-2 lg:col-span-3 flex justify-center items-center min-h-[200px]">
          <p className="text-red-500">{error}</p>
        </div>
      );
    }

    if (products.length === 0) {
      return (
        <div className="col-span-2 sm:col-span-2 lg:col-span-3 flex justify-center items-center min-h-[200px]">
          <p>No products available. Try changing your filters.</p>
        </div>
      );
    }

    return products.map((product) => (
      <div
        key={product._id}
        className=".carts bg-[#e2edff] bg-opacity-50 rounded-3xl p-4 shadow-lg max-w-[350px]"
      >
        <ProductCard product={product} />
        <div className="mt-3 flex justify-center">
          {cartQuantities[product._id] ? (
            <div className="flex items-center justify-between w-[60%] sm:w-[50%] mx-4 shadow-lg hover:shadow-xl transition-shadow rounded-md">
              {/* Decrease Quantity Button */}
              <button
                onClick={() =>
                  updateCartQuantity(
                    product._id,
                    Math.max((cartQuantities[product._id] || 0) - 1, 0)
                  )
                }
                disabled={updatingCart === product._id}
                className={`p-2 sm:p-3 rounded-l-xl ${
                  updatingCart === product._id
                    ? "opacity-50"
                    : "text-black font-semibold"
                }`}
              >
                <Minus className="w-4 h-4 sm:w-5 sm:h-5 hover:scale-125 sm:hover:scale-[130%] font-bold" />
              </button>

              {/* Quantity Count */}
              <span className="px-3 sm:px-4 py-2 bg-[#dcf5ff] font-medium text-sm sm:text-base">
                {cartQuantities[product._id]}
              </span>

              {/* Increase Quantity Button */}
              <button
                onClick={() =>
                  updateCartQuantity(
                    product._id,
                    (cartQuantities[product._id] || 0) + 1
                  )
                }
                disabled={updatingCart === product._id}
                className={`p-2 sm:p-3 rounded-r-xl rounded-l-sm ${
                  updatingCart === product._id
                    ? "opacity-50"
                    : "text-black font-semibold"
                }`}
              >
                <Plus className="w-4 h-4 sm:w-5 sm:h-5 hover:scale-125 sm:hover:scale-[130%] font-bold" />
              </button>
            </div>
          ) : (
            /* Add to Cart Button */
            <button
              onClick={() => addToCart(product._id)}
              disabled={updatingCart === product._id}
              className={`w-[80%] sm:w-[100%] p-2 sm:p-3 shadow-lg hover:shadow-xl transition-shadow rounded-b-2xl rounded-t-xl text-sm sm:text-base ${
                updatingCart === product._id
                  ? "opacity-50 tracking-wider font-semibold"
                  : "bg-[#d6ebfc] hover:bg-[#d8edff] text-black font-semibold"
              }`}
            >
              {updatingCart === product._id ? "Adding..." : "Add to Cart"}
            </button>
          )}
        </div>
      </div>
    ));
  };

  return (
    <div className="max-w-screen overflow-x-hidden min-h-screen bg-[#dcf5ff] pb-[8vh] min-px-[2%] font-ancient text-[#08410c]">
      {/* Category Filter */}
      <div className="flex-1 ">
        <div className="absolute top-0 left-0 right-0 bg-[#dcf5ff] z-20 pt-[114px]">
          {/* Mobile View */}
          <div className="md:hidden flex gap-4 p-4 items-center justify-center">
            <button
              onClick={() => setIsMobileFilterOpen((prev) => !prev)}
              className="flex items-center gap-2 p-2 bg-[#d1eafe] shadow-xl rounded-2xl min-w-[100px] text-center justify-center font-semibold "
            >
              <Filter size={20} />
              <span>Filters</span>
            </button>

            <div className="flex-1 relative max-w-[60%]">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search..."
                className="w-full p-2 pl-3 pr-10 border rounded-2xl bg-[#d1eafe] shadow-xl font-semibold "
              />
              <Search
                className="absolute right-3 top-1/2 -translate-y-1/2"
                size={20}
              />
            </div>
          </div>

          {/* Mobile Filter Modal */}
          <div
            className={`
              fixed left-1/2 -translate-x-[56%] top-[190px] w-[75%] duration-300 z-50 rounded-2xl
              ${
                isMobileFilterOpen
                  ? "opacity-100"
                  : "opacity-0 pointer-events-none"
              }
            `}
          >
            <div
              className={`
      bg-[#DCF5FF] rounded-2xl p-6 transition-transform duration-300 shadow-lg
      ${isMobileFilterOpen ? "translate-x-0" : "-translate-x-full"}
    `}
            >
              <div className="space-y-4">
                {/* Categories */}
                <div className="space-y-2">
                  <h3 className="font-semibold">Categories</h3>
                  <div className="flex flex-wrap gap-2">
                    {categories.map((category) => (
                      <button
                        key={category._id}
                        onClick={() => toggleCategory(category._id)}
                        className={`p-2 rounded-xl ${
                          selectedCategories.includes(category._id)
                            ? "border-2 border-black bg-[#d1eafe] shadow-xl"
                            : "bg-[#d1eafe] shadow-xl"
                        }`}
                      >
                        {category.name}
                      </button>
                    ))}
                  </div>
                </div>
                {/* Price Sort */}
                <div className="space-y-2">
                  <h3 className="font-semibold">Sort by Price</h3>
                  <ul className="rounded-xl bg-[#d1eafe] shadow-xl overflow-hidden">
                    <li>
                      <button
                        onClick={() => setSelectedPriceFilter(null)}
                        className="w-full p-3 text-left hover:bg-[#b0cfeb] transition-colors"
                      >
                        Default
                      </button>
                    </li>
                    <li className="border-t border-[#b0cfeb]">
                      <button
                        onClick={() => setSelectedPriceFilter("low-high")}
                        className="w-full p-3 text-left hover:bg-[#b0cfeb] transition-colors"
                      >
                        Low to High
                      </button>
                    </li>
                    <li className="border-t border-[#b0cfeb]">
                      <button
                        onClick={() => setSelectedPriceFilter("high-low")}
                        className="w-full p-3 text-left hover:bg-[#b0cfeb] transition-colors"
                      >
                        High to Low
                      </button>
                    </li>
                  </ul>
                </div>

                {/* Tags */}
                <div className="flex gap-4">
                  <button
                    onClick={() => setFilterSugarFree((prev) => !prev)}
                    className={`flex-1 p-2 rounded-xl ${
                      filterSugarFree
                        ? "bg-green-200 border-2 border-black"
                        : "bg-[#d1eafe] shadow-xl"
                    }`}
                  >
                    Sugar-Free
                  </button>
                  <button
                    onClick={() => setFilterBestseller((prev) => !prev)}
                    className={`flex-1 p-2 rounded-xl ${
                      filterBestseller
                        ? "bg-amber-300 border-2 border-black"
                        : "bg-[#d1eafe] shadow-xl"
                    }`}
                  >
                    Bestseller
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Desktop View */}
          <div className="hidden md:block">
            <div className="flex flex-wrap lg:gap-5 gap-2 items-center justify-center py-5">
              {/* Categories Dropdown */}
              <div
                className="relative group"
                onMouseEnter={() => setCategoryDropdownOpen(true)}
                onMouseLeave={() => setCategoryDropdownOpen(false)}
              >
                <button className="py-2 rounded-2xl w-40 bg-[#d1eafe] shadow-xl text-center font-semibold flex justify-center items-center ">
                  Categories{" "}
                  {selectedCategories.length > 0 &&
                    `(${selectedCategories.length})`}
                  <ChevronRight
                    className={`h-5.5 w-5.5 translate-y-0.5 transition-transform duration-300 ${
                      categoryDropdownOpen ? "rotate-90" : ""
                    }`}
                  />
                </button>

                <div
                  className={`
                    absolute z-50 bg-[#d1eafe] shadow-xl rounded-md w-64 mt-2 
                    transition-all duration-300 origin-top
                    ${
                      categoryDropdownOpen
                        ? "scale-y-100 opacity-100"
                        : "scale-y-0 opacity-0"
                    }
                  `}
                >
                  <div className="p-3 grid grid-cols-2 gap-2">
                    {categories.map((category) => (
                      <button
                        key={category._id}
                        onClick={() => toggleCategory(category._id)}
                        className={`p-2 text-center font-medium rounded-lg transition-all duration-300 ${
                          selectedCategories.includes(category._id)
                            ? "border-2 border-black"
                            : "bg-[#d1eafe] shadow-xl"
                        }`}
                      >
                        {category.name}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
              {/* Price Filter Dropdown */}
              <div
                className="relative group"
                onMouseEnter={() => setPriceDropdownOpen(true)}
                onMouseLeave={() => setPriceDropdownOpen(false)}
              >
                <button className="py-2 rounded-2xl w-40 bg-[#d1eafe] shadow-xl text-center font-semibold flex justify-center">
                  Sort by Price
                  <ChevronRight
                    className={`h-5.5 w-5.5 translate-y-0.5 transition-transform duration-300 ${
                      priceDropdownOpen ? "rotate-90" : ""
                    }`}
                  />
                </button>

                <div
                  className={`
                    absolute z-50 bg-[#d1eafe] shadow-xl rounded-md w-48 mt-2 
                    transition-all duration-300 origin-top
                    ${
                      priceDropdownOpen
                        ? "scale-y-100 opacity-100"
                        : "scale-y-0 opacity-0"
                    }
                  `}
                >
                  <div className="p-2 space-y-2">
                    {["Default", "Low to High", "High to Low"].map((option) => (
                      <button
                        key={option}
                        onClick={() => {
                          setSelectedPriceFilter(
                            option === "Default"
                              ? null
                              : option === "Low to High"
                              ? "low-high"
                              : "high-low"
                          );
                          setPriceDropdownOpen(false);
                        }}
                        className="w-full text-left p-2 hover:bg-[#b0cfeb] rounded-lg font-semibold"
                      >
                        {option}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Filter Tags */}
              <button
                onClick={() => setFilterSugarFree((prev) => !prev)}
                className={`px-4 py-2 rounded-2xl transition font-semibold ${
                  filterSugarFree
                    ? "bg-green-200 border-2 border-black"
                    : "bg-[#d1eafe] shadow-xl"
                }`}
              >
                Sugar-Free
              </button>

              <button
                onClick={() => setFilterBestseller((prev) => !prev)}
                className={`px-4 py-2 rounded-2xl transition font-semibold ${
                  filterBestseller
                    ? "bg-amber-300 border-2 border-black"
                    : "bg-[#d1eafe] shadow-xl"
                }`}
              >
                Bestseller
              </button>

              {/* Search Input */}
              <div className="relative flex-1 max-w-[400px]">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search for products..."
                  className="w-full p-2 pl-3 pr-10 rounded-2xl bg-[#d1eafe] shadow-xl placeholder-[#08410c] placeholder:font-semibold"
                />
                <Search
                  className="absolute right-3 top-1/2 -translate-y-1/2"
                  size={20}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="w-full pt-[175px] md:pt-[185px] ">
          <div ref={itemsRef} className="p-2 md:p-4 flex justify-center ">
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-2 md:gap-6">
              {renderProductCards()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
