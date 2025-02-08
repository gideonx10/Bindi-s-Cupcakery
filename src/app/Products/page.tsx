"use client";

import { useEffect, useRef, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { ChevronDown } from "lucide-react";
import { products } from "@/app/Products/data/products";
import type { ProductType } from "@/app/Products/types/product";
import Image from "next/image";
import gsap from "gsap";
import ProductCard from "@/components/ProductCard";
import { useDebounce } from "@/hooks/useDebounce";

export default function ProductsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const query = searchParams.get("search") || "";

  const [searchTerm, setSearchTerm] = useState(query);
  const debouncedSearchTerm = useDebounce(searchTerm, 700); // 700ms delay

  const [selectedTypes, setSelectedTypes] = useState<ProductType[]>([]);
  const [showBestsellers, setShowBestsellers] = useState(false);
  const [showSugarFree, setShowSugarFree] = useState(false);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc" | null>(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [priceDropdownOpen, setPriceDropdownOpen] = useState(false);
  const imageRef = useRef(null);
  const imageRef2 = useRef(null);

  useEffect(() => {
    gsap.to(imageRef.current, {
      rotation: 12,
      yoyo: true,
      repeat: -1,
      duration: 2,
      ease: "power1.inOut",
    });
    gsap.from(imageRef2.current, {
      rotation: 12,
      yoyo: true,
      repeat: -1,
      duration: 2,
      ease: "power1.inOut",
    });
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(searchParams);
    if (debouncedSearchTerm) {
      params.set("search", debouncedSearchTerm);
    } else {
      params.delete("search");
    }
    router.replace(`?${params.toString()}`);
  }, [debouncedSearchTerm, router, searchParams]);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const allTypes = [
    "All Products",
    ...Array.from(new Set(products.map((product) => product.type))),
  ];

  const toggleTypeSelection = (type: ProductType) => {
    setSelectedTypes((prev) => {
      if (type === "All Products") return [];
      return prev.includes(type)
        ? prev.filter((t) => t !== type)
        : [...prev, type];
    });
  };

  const filteredProducts = products
    .filter((product) => {
      if (
        selectedTypes.length > 0 &&
        !selectedTypes.includes(product.type) &&
        !selectedTypes.includes("All Products")
      ) {
        return false;
      }
      if (showBestsellers && !product.isBestseller) return false;
      if (showSugarFree && !product.isSugarFree) return false;
      if (
        debouncedSearchTerm &&
        !product.name.toLowerCase().includes(debouncedSearchTerm.toLowerCase())
      ) {
        return false;
      }
      return true;
    })
    .sort((a, b) => {
      if (sortOrder === "asc") return a.price - b.price;
      if (sortOrder === "desc") return b.price - a.price;
      return 0;
    });

  return (
    <div className="min-h-screen w-full bg-[#E9E8E4]">
      {/* Hero Section */}
      <div className="w-full h-[30vh] bg-[#F7DB9B] bg-opacity-35 flex items-center justify-center text-[#23221F] text-center text-[1.6rem] font-semibold font-ancient">
        <Image
          ref={imageRef}
          src="/images/leaves.png"
          alt="leaves"
          width={270}
          height={270}
          className="absolute z-50 -rotate-12 origin-[50%_0%] -translate-y-4 left-[9%] top-0 max-[750px]:left-[5%] max-[750px]:h-[150px] max-[750px]:w-auto"
        />
        <Image
          ref={imageRef2}
          src="/images/small_leavs.png"
          alt="leaves"
          width={150}
          height={150}
          className="absolute z-1 -rotate-12 origin-[50%_0%] -translate-y-4 right-[13%] max-[750px]:right-[8%] top-0 max-[750px]:h-[80px] max-[750px]:w-auto"
        />
        <div className="relative z-80">
          Homemade | Eggless | Preservative-Free | 100% Natural
          <br />
          Customizable dessert hampers for your special moments
        </div>
      </div>

      {/* Search Input */}
      <div className="flex justify-center mt-4">
        <input
          type="text"
          value={searchTerm}
          onChange={handleSearchChange}
          placeholder="Search products..."
          className="px-4 py-2 w-[80%] md:w-[50%] border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#F7DB9B]"
        />
      </div>

      <div className="max-w-[1400px] mx-auto px-6 py-8">
        {/* Filter Section - Centered */}
        <div className="flex flex-wrap gap-8 mb-8 justify-start">
          {/* Category Multi-Select Dropdown */}
          <div className="relative ">
            <button
              className="px-8 py-3 font-semibold border rounded-2xl bg-[#BDC1B6] bg-opacity-35 flex justify-center items-center min-w-[200px]"
              onClick={() => setDropdownOpen(!dropdownOpen)}
            >
              Products
              <ChevronDown className="transform translate-x-2 translate-y-0.5" />
            </button>

            {dropdownOpen && (
              <div className="absolute w-[250px] mt-2 bg-[#E9E8E4] border rounded-2xl shadow-lg z-50 opacity-90">
                <ul className="py-2">
                  {allTypes.map((type) => (
                    <li
                      key={type}
                      className={`px-4 py-2 text-center font-semibold cursor-pointer transition ${
                        selectedTypes.includes(type as ProductType)
                          ? "bg-green-500 text-white"
                          : "hover:bg-[#e0e6d6]"
                      }`}
                      onClick={() => toggleTypeSelection(type as ProductType)}
                    >
                      {type}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Bestsellers Button */}
          <button
            className={`min-w-[120px] px-4 py-3 font-semibold border rounded-2xl ${
              showBestsellers
                ? "bg-blue-500 text-white"
                : "bg-[#BDC1B6] bg-opacity-35"
            }`}
            onClick={() => setShowBestsellers(!showBestsellers)}
          >
            {showBestsellers ? "✓ " : ""}Bestsellers
          </button>

          {/* Sugar-Free Button */}
          <button
            className={`min-w-[120px] px-4 py-3 border font-semibold rounded-2xl ${
              showSugarFree
                ? "bg-green-500 text-white"
                : "bg-[#BDC1B6] bg-opacity-35"
            }`}
            onClick={() => setShowSugarFree(!showSugarFree)}
          >
            {showSugarFree ? "✓ " : ""}Sugar Free
          </button>

          {/* Sort Dropdown */}
          <div className="relative inline-block">
            <button
              className="px-8 py-3 font-semibold border rounded-2xl bg-[#BDC1B6] bg-opacity-35 flex items-center justify-centre min-w-[200px]"
              onClick={() => setPriceDropdownOpen(!priceDropdownOpen)}
            >
              Sort by Price
              <ChevronDown className="transform translate-x-2 translate-y-0.5" />
            </button>
            {priceDropdownOpen && (
              <ul className="absolute left-0 mt-2 w-[200px] bg-[#E9E8E4] backdrop-blur-md border rounded-2xl shadow-lg z-50 opacity-90">
                <li
                  className={`px-4 py-2 text-center font-semibold cursor-pointer ${
                    sortOrder === "asc" ? "bg-gray-200" : "hover:bg-[#e0e6d6]"
                  }`}
                  onClick={() => setSortOrder("asc")}
                >
                  Low to High
                </li>
                <li
                  className={`px-4 py-2 text-center font-semibold cursor-pointer ${
                    sortOrder === "desc" ? "bg-gray-200" : "hover:bg-[#e0e6d6]"
                  }`}
                  onClick={() => setSortOrder("desc")}
                >
                  High to Low
                </li>
              </ul>
            )}
          </div>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 justify-center p-4">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </div>
  );
}
