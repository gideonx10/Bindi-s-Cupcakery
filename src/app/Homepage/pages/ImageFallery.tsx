'use client';

import { useRef, useState } from 'react';
import Image from 'next/image';
import { motion, useMotionValue } from 'framer-motion';

interface GalleryImage {
  id: number;
  src: string;
  alt: string;
}

const galleryImages: GalleryImage[] = [
  {
    id: 1,
    src: "/images/dalal_street_poster.png",
    alt: "Dalal Street Movie Poster",
  },
  {
    id: 2,
    src: "/images/ctc_poster.png",
    alt: "CTC Movie Poster",
  },
  {
    id: 3,
    src: "/images/drone_poster.png",
    alt: "Drone Movie Poster",
  },
  {
    id: 4,
    src: "/images/jumanji_poster.png",
    alt: "Jumanji Movie Poster",
  }
];

const ImageGallery = () => {
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  
  const handleDragStart = () => setIsDragging(true);
  
  const handleDragEnd = () => {
    setIsDragging(false);
    if (!containerRef.current) return;

    const currentX = x.get();
    const containerWidth = containerRef.current.scrollWidth / 3;

    if (currentX < -containerWidth) {
      x.set(currentX + containerWidth);
    } else if (currentX > 0) {
      x.set(currentX - containerWidth);
    }
  };

  const handleDrag = (event: any, info: any) => {
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

  const images = [...galleryImages, ...galleryImages, ...galleryImages, ...galleryImages, ...galleryImages];

  return (
    <section className="bg-[#2C1810] pt-24 md:pt-32 lg:pt-40">
      <div className="flex flex-col gap-16 md:gap-20">
        {/* Header Section */}
        <div className="flex items-center justify-center">
          <div className="text-center px-4">
            <h1 
              className="text-7xl sm:text-8xl md:text-9xl text-[#E6C9A8] uppercase tracking-tight leading-[1.1] font-black mb-6"
              style={{ fontFamily: 'Barlow Condensed, sans-serif' }}
            >
              Visual Wonders
            </h1>
            <div 
              className="text-xl sm:text-2xl md:text-3xl text-[#D4B08C] tracking-wider font-medium"
              style={{ fontFamily: 'Barlow, sans-serif' }}
            >
              Experience Our Cinematic Magic 🎬
            </div>
          </div>
        </div>

        {/* Gallery Section */}
        <div className="w-full">
          <div className="relative overflow-hidden px-4">
            <motion.div
              ref={containerRef}
              style={{ x }}
              drag="x"
              dragConstraints={{
                left: -Infinity,
                right: Infinity
              }}
              dragElastic={0.1}
              dragTransition={{ 
                bounceStiffness: 400, 
                bounceDamping: 40,
                power: 0.2
              }}
              onDragStart={handleDragStart}
              onDragEnd={handleDragEnd}
              onDrag={handleDrag}
              className="flex gap-4 sm:gap-6 md:gap-8 cursor-grab active:cursor-grabbing"
            >
              {images.map((image, index) => (
                <motion.div
                  key={`${image.id}-${index}`}
                  className="relative flex-shrink-0 group"
                  whileHover={{ scale: 1.02 }}
                  transition={{ 
                    duration: 0.3,
                    type: "tween",
                    ease: "easeOut"
                  }}
                >
                  <div className="w-[280px] h-[280px] sm:w-[300px] sm:h-[300px] md:w-[320px] md:h-[320px] relative rounded-xl overflow-hidden shadow-[0_0_20px_rgba(0,0,0,0.3)]">
                    <Image
                      src={image.src}
                      alt={image.alt}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                      sizes="(max-width: 640px) 280px, (max-width: 768px) 300px, 320px"
                      draggable="false"
                      priority={index < 8}
                    />
                    <div 
                      className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    />
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>

        {/* Footer Section */}
        <div className="flex items-center justify-center px-4 pb-16">
          <p 
            className="text-2xl sm:text-3xl md:text-4xl text-[#BF9E7B] tracking-wider font-medium text-center"
            style={{ fontFamily: 'Barlow, sans-serif' }}
          >
            Unveil The Stories That Move You
          </p>
        </div>
      </div>
    </section>
  );
};

export default ImageGallery;