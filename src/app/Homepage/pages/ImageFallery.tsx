'use client';

import { useRef, useState } from 'react';
import Image from 'next/image';
import { motion, useAnimationFrame, useMotionValue, useTransform } from 'framer-motion';

interface GalleryImage {
  id: number;
  src: string;
  alt: string;
  title: string;
}

const galleryImages: GalleryImage[] = [
  {
    id: 1,
    src: "/images/smoothie-1.jpg",
    alt: "Purple smoothie with blueberries",
    title: "Blueberry Bliss Smoothie"
  },
  {
    id: 2,
    src: "/images/smoothie-2.jpg",
    alt: "Creamy oat drink",
    title: "Golden Oat Latte"
  },
  {
    id: 3,
    src: "/images/smoothie-3.jpg",
    alt: "Iced coffee drink",
    title: "Classic Iced Coffee"
  },
  {
    id: 4,
    src: "/images/smoothie-4.jpg",
    alt: "Green smoothie",
    title: "Green Energy Boost"
  }
];

const ImageGallery = () => {
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  
  // Function to wrap the position within bounds
  const wrap = (min: number, max: number, v: number) => {
    const rangeSize = max - min;
    return ((((v - min) % rangeSize) + rangeSize) % rangeSize) + min;
  };

  const handleDragStart = () => {
    setIsDragging(true);
  };

  const handleDragEnd = () => {
    setIsDragging(false);
  };

  const handleDrag = (event: any, info: any) => {
    if (!containerRef.current) return;
    
    const containerWidth = containerRef.current.scrollWidth / 3;
    let newX = x.get() + info.delta.x;
    
    // Wrap the position for infinite scroll effect
    if (newX < -containerWidth) {
      newX = wrap(-containerWidth, 0, newX);
    } else if (newX > 0) {
      newX = wrap(-containerWidth, 0, newX);
    }
    
    x.set(newX);
  };

  // Triple the images for smooth infinite scroll
  const images = [...galleryImages, ...galleryImages, ...galleryImages];

  return (
    <section className="min-h-screen bg-[#FCFBE4] py-20 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-16">
          <h1 className="text-6xl font-black text-[#4A5568] mb-4">
            Our Recipe Gallery
          </h1>
          <p className="text-xl text-[#718096]">
            Explore our collection of delicious recipes
          </p>
        </div>

        <div className="relative w-full">
          <motion.div
            ref={containerRef}
            style={{ x }}
            drag="x"
            dragConstraints={{
              left: -(containerRef.current?.scrollWidth || 0) / 3,
              right: 0
            }}
            dragElastic={0.1}
            dragTransition={{ bounceStiffness: 100, bounceDamping: 10 }}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
            onDrag={handleDrag}
            className="flex gap-8 cursor-grab active:cursor-grabbing"
          >
            {images.map((image, index) => (
              <motion.div
                key={`${image.id}-${index}`}
                className="relative flex-shrink-0 group"
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.3 }}
              >
                <div className="w-[400px] h-[600px] relative rounded-2xl overflow-hidden">
                  <Image
                    src={image.src}
                    alt={image.alt}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 400px"
                    draggable="false"
                    priority={index < 4}
                  />
                  <div 
                    className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent 
                             opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  />
                  <div 
                    className="absolute bottom-0 left-0 w-full p-6 transform translate-y-full 
                             group-hover:translate-y-0 transition-transform duration-300"
                  >
                    <h3 className="text-2xl font-bold text-white">
                      {image.title}
                    </h3>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default ImageGallery;