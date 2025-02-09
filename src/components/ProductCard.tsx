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
    <div className="relative border border-gray-200 rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow">
      {/* Labels for Sugar-Free & Bestseller */}
      {product.isSugarFree && (
        <span className="absolute top-2 left-2 bg-green-500 text-white text-xs font-bold px-2 py-1 rounded-md z-10">
          Sugar-Free
        </span>
      )}
      {product.isFeatured && (
        <span className="absolute top-2 right-2 bg-yellow-500 text-white text-xs font-bold px-2 py-1 rounded-md z-10">
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
          className="rounded-t-lg"
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
