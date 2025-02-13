import Image from "next/image";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";

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

interface ProductCardProps {
  product: Product;
}

export function convertDriveLink(driveUrl: string): string {
  const match = driveUrl.match(/\/d\/([^/]+)\//);
  return match
    ? `https://drive.google.com/uc?export=view&id=${match[1]}`
    : driveUrl;
}

export default function ProductCard({ product }: ProductCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    if (cardRef.current) {
      gsap.fromTo(
        cardRef.current,
        { opacity: 0, y: 50 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          scrollTrigger: {
            trigger: cardRef.current,
            start: "top 95%",
            end: "bottom 15%",
            toggleActions: "play none none reverse",
          },
        }
      );
    }
  }, []);

  return (
    <div
      ref={cardRef}
      className="product-card relative rounded-t-xl rounded-b-xl overflow-hidden shadow-md hover:shadow-2xl transition-shadow h-[25vh] sm:h-[40vh] flex flex-col gap-2"
    >
      {/* Labels for Sugar-Free & Bestseller */}
      {product.isSugarFree && (
        <span className="absolute top-2 left-2 bg-green-600 text-black text-[10px] sm:text-xs font-semibold px-1 py-[0.15rem] sm:px-2 sm:py-1 rounded-md z-10 shadow-3xl">
          Sugar-Free
        </span>
      )}
      {product.isFeatured && (
        <span className="absolute top-2 right-2 bg-[#ffe923d8] text-black text-[10px] sm:text-xs font-semibold px-2 py-1 rounded-md z-10">
          Bestseller
        </span>
      )}

      {/* Product Image */}
      <div className="w-full h-[20vh] sm:h-48 relative">
        <Image
          src={convertDriveLink(product.images[0]) || "/placeholder.jpg"}
          alt={product.name}
          layout="fill"
          objectFit="cover"
          className="rounded-t-lg sm:grayscale-[30%] hover:grayscale-0 hover:scale-[102%] transition-transform duration-200 min-h-[120px]"
        />
      </div>

      {/* Product Details */}
      <div className="px-3 sm:px-4 py-2 sm:py-3">
        <h3 className="text-sm sm:text-xl font-semibold">{product.name}</h3>
        <p className="text-xs sm:text-sm text-gray-700 hidden sm:block">
          {product.description}
        </p>
        <p className="text-base sm:text-lg text-black font-semibold mt-2">
          ₹{product.price}
        </p>
      </div>
    </div>
  );
}
