"use client";

import { useRef, useState, useEffect } from "react";
import Image from "next/image";
import { motion, useMotionValue, animate } from "framer-motion";

interface GalleryImage {
  id: number;
  src: string;
  alt: string;
}

const galleryImages: GalleryImage[] = [
  { id: 1, src: "/images/img1.jpg", alt: "Dalal Street Movie Poster" },
  { id: 2, src: "/images/img2.jpg", alt: "CTC Movie Poster" },
  { id: 3, src: "/images/img3.jpg", alt: "Drone Movie Poster" },
  { id: 4, src: "/images/img4.jpg", alt: "Jumanji Movie Poster" },
];

const generateOffset = (index: number) => {
  const offsets = [0, -10, 10, -10, 10];
  return offsets[index % offsets.length];
};

const ImageGallery = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const [isDragging, setIsDragging] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const startAutoScroll = () => {
      if (!containerRef.current || isDragging) return;

      timeoutRef.current = setTimeout(() => {
        const currentX = x.get();
        const imageWidth = 340;

        animate(x, currentX - imageWidth, {
          duration: 0.8,
          ease: "easeInOut",
          onComplete: () => {
            if (!containerRef.current) return;
            const containerWidth = containerRef.current.scrollWidth / 3;

            if (currentX < -containerWidth) {
              x.set(currentX + containerWidth);
            }

            startAutoScroll();
          },
        });
      }, 3000);
    };

    if (!isDragging) {
      startAutoScroll();
    }

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [isDragging, x]);

  const handleDragStart = () => {
    setIsDragging(true);
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
  };

  const handleDragEnd = () => {
    if (!containerRef.current) return;

    const currentX = x.get();
    const containerWidth = containerRef.current.scrollWidth / 3;

    if (currentX < -containerWidth) {
      x.set(currentX + containerWidth);
    } else if (currentX > 0) {
      x.set(currentX - containerWidth);
    }

    setIsDragging(false);
  };

  const handleDrag = (
    event: MouseEvent | TouchEvent,
    info: { delta: { x: number } }
  ) => {
    if (!containerRef.current) return;

    const containerWidth = containerRef.current.scrollWidth / 3;
    let newX = x.get() + info.delta.x;

    if (newX < -containerWidth) {
      newX += containerWidth;
    } else if (newX > 0) {
      newX -= containerWidth;
    }

    x.set(newX);
  };

  return (
    <section className="bg-[#F5F3FF] min-h-screen pt-8 md:pt-10 lg:pt-12 pb-20">
      <div className="flex flex-col gap-8 md:gap-10 h-full">
        {/* Header Section */}
        <div className="flex items-center justify-center">
          <div className="text-center px-4">
            <h1
              className="text-7xl sm:text-8xl md:text-9xl text-[#4C1D95] uppercase tracking-tight leading-[1.1] font-black mb-4"
              style={{ fontFamily: "Barlow Condensed, sans-serif" }}
            >
              Visual Wonders
            </h1>
            <div
              className="text-xl sm:text-2xl md:text-3xl text-[#6D28D9] tracking-wider font-medium"
              style={{ fontFamily: "Barlow, sans-serif" }}
            >
              Experience Our Cinematic Magic 🎬
            </div>
          </div>
        </div>

        {/* Gallery Section */}
        <div className="w-full flex-1">
          <div className="relative h-full px-4 overflow-hidden">
            <motion.div
              ref={containerRef}
              style={{ x }}
              drag="x"
              dragConstraints={{
                left: -Infinity,
                right: Infinity,
              }}
              dragElastic={0.1}
              dragTransition={{
                bounceStiffness: 400,
                bounceDamping: 40,
                power: 0.2,
              }}
              onDragStart={handleDragStart}
              onDragEnd={handleDragEnd}
              onDrag={handleDrag}
              className="flex gap-4 sm:gap-6 md:gap-8 cursor-grab active:cursor-grabbing py-6"
            >
              {[...galleryImages, ...galleryImages, ...galleryImages].map(
                (image, index) => (
                  <motion.div
                    key={`${image.id}-${index}`}
                    className="relative flex-shrink-0"
                    style={{
                      y: generateOffset(index),
                    }}
                  >
                    <div
                      className="w-[280px] h-[280px] sm:w-[300px] sm:h-[300px] md:w-[320px] md:h-[320px] 
                                relative rounded-xl overflow-hidden"
                    >
                      <Image
                        src={image.src}
                        alt={image.alt}
                        fill
                        className="object-cover"
                        sizes="(max-width: 640px) 280px, (max-width: 768px) 300px, 320px"
                        draggable="false"
                        priority={index < 4}
                      />
                    </div>
                  </motion.div>
                )
              )}
            </motion.div>
          </div>
        </div>

        {/* Footer Section */}
        <div className="flex items-center justify-center pb-12 md:pb-16">
          <p
            className="text-2xl sm:text-3xl md:text-4xl text-[#6D28D9] tracking-wider font-medium text-center font-ancient"
          >
            Unveiling Art, One Frame at a Time. 🎭✨
          </p>
        </div>
      </div>
    </section>
  );
};

export default ImageGallery;
