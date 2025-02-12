"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useDebounce } from "@/hooks/useDebounce";
import ProductCard from "../../components/ProductCard";
import { toast } from "react-hot-toast";
import { Plus, Minus, Search, ChevronRight, Filter } from "lucide-react";
import Navbar from "@/components/Navbar";

// ... (keep all interfaces the same)
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
  // ... (keep all state variables and other functions the same until updateCartQuantity)
  const contentRef = useRef<HTMLDivElement>(null);
  const filterRef = useRef<HTMLDivElement>(null);
  const itemsRef = useRef<HTMLDivElement>(null);

  const router = useRouter();
  const searchParams = useSearchParams();

  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [addingToCart, setAddingToCart] = useState<string | null>(null);

  const initialSearchQuery = searchParams.get("search") || "";
  const [searchQuery, setSearchQuery] = useState(initialSearchQuery);

  const [filterSugarFree, setFilterSugarFree] = useState<boolean>(false);
  const [filterBestseller, setFilterBestseller] = useState<boolean>(false);

  const debouncedSearchQuery = useDebounce(searchQuery, 500);
  const [cartQuantities, setCartQuantities] = useState<CartQuantities>({});
  const [updatingCart, setUpdatingCart] = useState<string | null>(null);

  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedPriceFilter, setSelectedPriceFilter] = useState<string | null>(
    null
  );
  const [categoryDropdownOpen, setCategoryDropdownOpen] = useState(false);
  const [priceDropdownOpen, setPriceDropdownOpen] = useState(false);

  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  const [isFilterSticky, setIsFilterSticky] = useState(false);

  // Refs for scroll handling
  const filterContainerRef = useRef<HTMLDivElement>(null);
  const productContainerRef = useRef<HTMLDivElement>(null);



  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      if (filterContainerRef.current) {
        const filterRect = filterContainerRef.current.getBoundingClientRect();
        const shouldBeSticky = filterRect.top <= 20;
        setIsFilterSticky(shouldBeSticky);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Handle category selection
  const toggleCategory = (categoryId: string) => {
    setSelectedCategories((prev) =>
      prev.includes(categoryId)
        ? prev.filter((id) => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  const addToCart = async (productId: string) => {
    setUpdatingCart(productId);

    try {
      const userId = "67a893e17d6b92f96ee990bf";
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
      const userId = "67a893e17d6b92f96ee990bf"; // Your user ID

      const response = await fetch("/api/cart", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId,
          productId,
          quantity: 1, // We'll always send 1 as we're incrementing/decrementing
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

  // ... (keep all other functions and useEffects the same)
  useEffect(() => {
    async function fetchCartQuantities() {
      try {
        const userId = "67a893e17d6b92f96ee990bf";
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
  }, []);

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
    <div className="w-screen min-h-screen bg-[#dcf5ff] pb-[8vh] min-px-[2%]">
      <Navbar />
      {/* Category Filter */}
      <div className="flex-1 ">
        <div className="fixed top-0 left-0 right-0 bg-[#dcf5ff] z-10 pt-[114px]">
          {/* Mobile View */}
          <div className="md:hidden flex gap-4 p-4 items-center justify-center">
            <button
              onClick={() => setIsMobileFilterOpen((prev) => !prev)}
              className="flex items-center gap-2 p-2 bg-[#c0dbf4] rounded-2xl min-w-[100px] text-center justify-center font-semibold"
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
                className="w-full p-2 pl-3 pr-10 border rounded-2xl bg-[#c0dbf4] font-semibold "
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
    fixed left-1/2 -translate-x-[55%] top-[160px] w-[75%] duration-300 z-50 rounded-2xl
    
    ${isMobileFilterOpen ? "opacity-100" : "opacity-0 pointer-events-none"}
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
                            ? "border-2 border-black"
                            : "bg-[#c0dbf4]"
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
                  <ul className="rounded-xl bg-[#c0dbf4] overflow-hidden">
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
                        ? "bg-lime-100 text-white"
                        : "bg-[#c0dbf4]"
                    }`}
                  >
                    Sugar-Free
                  </button>
                  <button
                    onClick={() => setFilterBestseller((prev) => !prev)}
                    className={`flex-1 p-2 rounded-xl ${
                      filterBestseller
                        ? "bg-yellow-600 text-white"
                        : "bg-[#c0dbf4]"
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
            <div className="flex flex-wrap gap-5 items-center justify-center py-5">
              {/* Categories Dropdown */}
              <div
                className="relative group"
                onMouseEnter={() => setCategoryDropdownOpen(true)}
                onMouseLeave={() => setCategoryDropdownOpen(false)}
              >
                <button className="p-2 rounded-2xl w-40 bg-[#c0dbf4] text-center font-semibold flex justify-center items-center">
                  Categories
                  <ChevronRight
                    className={`h-5.5 w-5.5 translate-y-0.5 transition-transform duration-300 ${
                      categoryDropdownOpen ? "rotate-90" : ""
                    }`}
                  />
                </button>

                <div
                  className={`
      absolute z-50 bg-[#c0dbf4] rounded-md w-64 mt-2 shadow-md
      transition-all duration-300 origin-top
      ${
        categoryDropdownOpen ? "scale-y-100 opacity-100" : "scale-y-0 opacity-0"
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
                            : "bg-[#c0dbf4] "
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
                <button className="p-2 rounded-2xl w-40 bg-[#c0dbf4] text-center font-semibold flex justify-center">
                  Sort by Price
                  <ChevronRight
                    className={`h-5.5 w-5.5 translate-y-0.5 transition-transform duration-300 ${
                      priceDropdownOpen ? "rotate-90" : ""
                    }`}
                  />
                </button>

                <div
                  className={`
          absolute z-50 bg-[#c0dbf4] rounded-md w-48 mt-2 shadow-md
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
                  filterSugarFree ? "bg-green-200" : "bg-[#c0dbf4]"
                }`}
              >
                Sugar-Free
              </button>

              <button
                onClick={() => setFilterBestseller((prev) => !prev)}
                className={`px-4 py-2 rounded-2xl transition font-semibold ${
                  filterBestseller ? "bg-amber-300" : "bg-[#c0dbf4]"
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
                  className="w-full p-2 pl-3 pr-10 rounded-2xl bg-[#c0dbf4] placeholder-black placeholder:font-semibold"
                />
                <Search
                  className="absolute right-3 top-1/2 -translate-y-1/2"
                  size={20}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="w-full pt-[170px] md:pt-[180px] ">
          <div ref={itemsRef} className="p-4 flex justify-center ">
            {error && <p className="text-red-500">{error}</p>}

            {filteredProducts.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProducts.map((product) => (
                  <div
                    key={product._id}
                    className=".carts bg-[#e2edff] bg-opacity-50 backdrop-blur-3xl rounded-3xl p-4 shadow-lg max-w-[350px]"
                  >
                    <ProductCard product={product} />
                    <div className="mt-3 flex justify-center">
                      {cartQuantities[product._id] ? (
                        <div className="flex items-center justify-between w-[50%] mx-4 shadow-lg hover:shadow-xl transition-shadow rounded-md">
                          <button
                            onClick={() =>
                              updateCartQuantity(
                                product._id,
                                (cartQuantities[product._id] || 0) - 1
                              )
                            }
                            disabled={updatingCart === product._id}
                            className={`p-2 rounded-l-xl ${
                              updatingCart === product._id
                                ? "animate-spin"
                                : "text-black font-semibold"
                            }`}
                          >
                            <Minus className="w-4 h-4 hover:scale-[130%] font-bold" />
                          </button>

                          <span className="px-4 py-2 bg-[#dcf5ff] font-medium">
                            {cartQuantities[product._id]}
                          </span>

                          <button
                            onClick={() =>
                              updateCartQuantity(
                                product._id,
                                (cartQuantities[product._id] || 0) + 1
                              )
                            }
                            disabled={updatingCart === product._id}
                            className={`p-2 rounded-r-xl rounded-l-sm  ${
                              updatingCart === product._id
                                ? "animate-spin"
                                : "text-black font-semibold"
                            }`}
                          >
                            <Plus className="w-4 h-4 hover:scale-[130%] font-bold" />
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => addToCart(product._id)}
                          disabled={updatingCart === product._id}
                          className={`w-full p-2 shadow-lg hover:shadow-xl transition-shadow rounded-b-2xl rounded-t-xl ${
                            updatingCart === product._id
                              ? "tracking-wider font-semibold"
                              : "bg-[#d6ebfc] hover:bg-[#d8edff] text-black font-semibold"
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
          </div>
        </div>
      </div>
    </div>
  );
}
