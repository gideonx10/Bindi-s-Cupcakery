"use client";

import Image from "next/image";
import type { Product } from "@/app/Products/types/product";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  return (
    <div className="overflow-hidden shadow-xl hover:shadow-2xl transition-shadow duration-300 w-full max-w-[350px] mx-auto bg-[#BDC1B6] bg-opacity-35 p-1 rounded-xl">
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
        <div className="text-lg font-bold">${product.price.toFixed(2)}</div>
      </div>
      <div className="p-4 pt-0">
        <button className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
          Add to Cart
        </button>
      </div>
    </div>
  );
}
