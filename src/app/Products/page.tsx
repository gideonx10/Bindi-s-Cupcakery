"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronDown } from "lucide-react";
import { products } from "@/app/Products/data/products";
import type { ProductType } from "@/app/Products/types/product";
import Image from "next/image";
import { motion } from "framer-motion";
import gsap from "gsap";

export default function ProductsPage() {
  const [selectedTypes, setSelectedTypes] = useState<ProductType[]>([]);
  const [showBestsellers, setShowBestsellers] = useState(false);
  const [showSugarFree, setShowSugarFree] = useState(false);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc" | null>(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [PricedropdownOpen, setPriceDropdownOpen] = useState(false);
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

  const allTypes = [
    "All Products",
    ...Array.from(new Set(products.map((product) => product.type))),
  ];

  const toggleTypeSelection = (type: ProductType) => {
    setSelectedTypes((prev) => {
      if (type === "All Products") {
        return [];
      }
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
      if (showBestsellers && !product.isBestseller) {
        return false;
      }
      if (showSugarFree && !product.isSugarFree) {
        return false;
      }
      return true;
    })
    .sort((a, b) => {
      if (sortOrder === "asc") {
        return a.price - b.price;
      } else if (sortOrder === "desc") {
        return b.price - a.price;
      }
      return 0;
    });

  return (
    <div className="min-h-screen w-full bg-[#E9E8E4]">
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
          Homemade | Eggless | preservative free | 100% natural
          <br />
          Customizable dessert hampers for your special moments
        </div>
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
              onClick={() => setPriceDropdownOpen(!PricedropdownOpen)}
            >
              Sort by Price
              <ChevronDown className="transform translate-x-2 translate-y-0.5" />
            </button>
            {PricedropdownOpen && (
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
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 justify-center">
          {filteredProducts.map((product) => (
            <div
              key={product.id}
              className="overflow-hidden shadow-xl hover:shadow-2xl transition-shadow duration-300 w-full max-w-[350px] mx-auto bg-[#BDC1B6] bg-opacity-35 p-1 rounded-xl"
            >
              <div className="relative aspect-[4/3]">
                <img
                  src={product.image || "/placeholder.svg"}
                  alt={product.name}
                  className="object-cover w-full h-full rounded-xl hover:scale-[102%] transition-transform duration-400 hover:shadow-md"
                />
                <div className="absolute top-2 left-2 flex flex-col gap-2">
                  {product.isBestseller && (
                    <div className="bg-yellow-400 text-black text-xs px-2 py-1 rounded">
                      Bestseller
                    </div>
                  )}
                  {product.isSugarFree && (
                    <div className="bg-green-500 text-white text-xs px-2 py-1 rounded">
                      Sugar Free
                    </div>
                  )}
                </div>
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-lg mb-2">{product.name}</h3>
                <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                  {product.description}
                </p>
                <div className="text-lg font-bold">
                  ${product.price.toFixed(2)}
                </div>
              </div>
              <div className="p-4 pt-0">
                <button className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
                  Add to Cart
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
