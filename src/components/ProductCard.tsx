import Image from "next/image";

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
  return (
    <div className="relative rounded-t-xl rounded-b-xl overflow-hidden shadow-md hover:shadow-2xl transition-shadow h-[40vh] flex flex-col gap-2">
      {/* Labels for Sugar-Free & Bestseller */}
      {product.isSugarFree && (
        <span className="absolute top-2 left-2 bg-green-600 text-black text-xs font-semibold px-2 py-1 rounded-md z-10 shadow-3xl">
          Sugar-Free
        </span>
      )}
      {product.isFeatured && (
        <span className="absolute top-2 right-2 bg-[#ffe923d8] text-black text-xs font-semibold px-2 py-1 rounded-md z-10">
          Bestseller
        </span>
      )}

      {/* Product Image */}
      <div className="w-full h-48 relative">
        <Image
          src={convertDriveLink(product.images[0]) || "/placeholder.jpg"}
          alt={product.name}
          layout="fill"
          objectFit="cover"
          className="rounded-t-lg grayscale-[30%] hover:grayscale-0 hover:scale-[102%] transition-transform duration-200"
        />
      </div>

      {/* Product Details */}
      <div className="p-4">
        <h3 className="text-lg font-semibold">{product.name}</h3>
        <p className="text-gray-600 text-sm">{product.description}</p>
        <p className="text-blue-600 font-bold mt-2">${product.price}</p>
      </div>
    </div>
  );
}
