'use client';

import React, { useRef, useMemo } from 'react';
import { motion, useMotionValue } from 'framer-motion';

const reviews = [
  {
    id: 1,
    message: "THE BERRY BLISS FLAVOR IS A MUST-TRY! IT'S REFRESHING AND PACKED WITH NUTRIENTS.",
    author: "Amit Patil",
    color: "bg-[#81B5EE]",
    textColor: "text-[#1A365D]",
    shadow: "shadow-[rgba(129,181,238,0.3)]"
  },
  {
    id: 2,
    message: "THE TROPICAL TWIST PROTEIN POWDER IS FANTASTIC! IT ADDS A BURST OF FLAVOR TO MY MORNING ROUTINE.",
    author: "Rina Desai",
    color: "bg-[#FFDE17]",
    textColor: "text-[#4A3F00]",
    shadow: "shadow-[rgba(255,222,23,0.3)]"
  },
  {
    id: 3,
    message: "NICE PRODUCT DELIVERED AT REASONABLE PRICES. OAT MILK IS HEALTHY FOR EVERYONE. ALTCO IS DOING AMAZING WORK.",
    author: "Rohit Jain",
    color: "bg-[#EF9AAA]",
    textColor: "text-[#4A1721]",
    shadow: "shadow-[rgba(239,154,170,0.3)]"
  },
  {
    id: 4,
    message: "AS A VEGAN, I ENJOY DRINKING OAT MILK BECAUSE I LOVE THE FLAVOR. THANK YOU ALTCO FOR SUPPLYING ME WITH THIS 6-PACK COMBO PACK.",
    author: "Deepshikha Modi",
    color: "bg-[#B16CDF]",
    textColor: "text-[#2D0F3F]",
    shadow: "shadow-[rgba(177,108,223,0.3)]"
  }
];

const generateAlternatingOffsets = (count: number) => {
  const offsets = [];
  let previousWasUp = false;
  
  for (let i = 0; i < count; i++) {
    // Alternate between up and down with smaller random variations
    const baseOffset = previousWasUp ? 
      Math.random() * 15 + 5 : // Down (5 to 20)
      -(Math.random() * 15 + 5); // Up (-5 to -20)
    
    offsets.push({
      translateY: baseOffset
    });
    
    // Randomly decide next direction but avoid too many consecutive ups or downs
    previousWasUp = !previousWasUp;
    if (Math.random() > 0.7) { // 30% chance to break the pattern
      previousWasUp = !previousWasUp;
    }
  }
  
  return offsets;
};

const CustomerReviews = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  
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

  const allReviews = [...reviews, ...reviews, ...reviews];
  // Use useMemo to ensure offsets don't change on re-renders
  const verticalOffsets = useMemo(() => 
    generateAlternatingOffsets(allReviews.length), 
    [allReviews.length]
  );

  return (
    <section className="bg-[#FCFBE4] pt-24 md:pt-32 lg:pt-40">
      <div className="flex flex-col gap-16 md:gap-20">
        {/* Header Section */}
        <div className="flex items-center justify-center">
          <div className="text-center px-4">
            <h2 
              className="text-5xl xs:text-6xl sm:text-7xl md:text-8xl lg:text-9xl text-[#4A0D2C] uppercase tracking-tight leading-[1.1] font-black mb-6"
              style={{ fontFamily: 'Barlow Condensed, sans-serif' }}
            >
              HAPPY CUSTOMERS.
            </h2>
            <div 
              className="text-lg xs:text-xl sm:text-2xl md:text-3xl text-[#4A0D2C] tracking-wider font-medium"
              style={{ fontFamily: 'Barlow, sans-serif' }}
            >
              Share Your Experience With Us
            </div>
          </div>
        </div>

        {/* Reviews Section */}
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
              onDrag={handleDrag}
              className="flex gap-6 cursor-grab active:cursor-grabbing py-12"
            >
              {allReviews.map((review, index) => (
                <motion.div
                  key={`${review.id}-${index}`}
                  className="relative flex-shrink-0 group"
                  initial={{ y: verticalOffsets[index].translateY }}
                  // Remove animate prop to keep initial position
                  style={{ y: verticalOffsets[index].translateY }}
                  whileHover={{ 
                    scale: 1.02,
                    transition: { duration: 0.3 }
                  }}
                >
                  <div 
                    className={`w-[300px] h-[300px] ${review.color} rounded-[32px] p-8 flex flex-col justify-between shadow-lg ${review.shadow}`}
                    style={{
                      fontFamily: 'Barlow, sans-serif',
                      backdropFilter: 'blur(10px)',
                    }}
                  >
                    <p className={`text-lg ${review.textColor} font-bold leading-tight tracking-wide`}>
                      "{review.message}"
                    </p>
                    <p className={`text-base ${review.textColor} font-medium mt-4`}>
                      -{review.author}
                    </p>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CustomerReviews;