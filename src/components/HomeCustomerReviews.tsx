"use client";

import React, { useEffect, useState, useRef, useMemo } from "react";
import { motion, useMotionValue } from "framer-motion";

interface Review {
  id: number;
  message: string;
  author: string;
  color: string;
  textColor: string;
  shadow: string;
  isApproved: boolean; // Added to filter approved reviews
}

const generateAlternatingOffsets = (count: number) => {
  const offsets = [];
  let previousWasUp = false;

  for (let i = 0; i < count; i++) {
    const baseOffset = previousWasUp
      ? Math.random() * 15 + 5
      : -(Math.random() * 15 + 5);
    offsets.push({ translateY: baseOffset });

    previousWasUp = !previousWasUp;
    if (Math.random() > 0.7) {
      previousWasUp = !previousWasUp;
    }
  }

  return offsets;
};

const CustomerReviews = () => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await fetch("/api/reviews");
        console.log("API Response Data:", response);

        const data: Review[] = await response.json();
        console.log(data);
        const approvedReviews = data.filter((review) => review.isApproved); // Only include approved reviews
        console.log(approvedReviews);
        setReviews([
          ...approvedReviews,
          ...approvedReviews,
          ...approvedReviews,
        ]); // Tripling for infinite loop effect
      } catch (error) {
        console.error("Error fetching reviews:", error);
      }
    };

    fetchReviews();
  }, []);

  const handleDrag = (event: MouseEvent | TouchEvent, info: { delta: { x: number } }) => {
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

  const verticalOffsets = useMemo(
    () => generateAlternatingOffsets(reviews.length),
    [reviews.length]
  );

  return (
    <section className="bg-[#FCFBE4] pt-24 md:pt-32 lg:pt-40">
      <div className="flex flex-col gap-16 md:gap-20">
        {/* Header Section */}
        <div className="flex items-center justify-center">
          <div className="text-center px-4">
            <h2
              className="text-5xl xs:text-6xl sm:text-7xl md:text-8xl lg:text-9xl text-[#4A0D2C] uppercase tracking-tight leading-[1.1] font-black mb-6"
              style={{ fontFamily: "Barlow Condensed, sans-serif" }}
            >
              HAPPY CUSTOMERS.
            </h2>
            <div className="text-lg xs:text-xl sm:text-2xl md:text-3xl text-[#4A0D2C] tracking-wider font-medium">
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
              dragConstraints={{ left: -Infinity, right: Infinity }}
              dragElastic={0.1}
              dragTransition={{
                bounceStiffness: 400,
                bounceDamping: 40,
                power: 0.2,
              }}
              onDrag={handleDrag}
              className="flex gap-6 cursor-grab active:cursor-grabbing py-12"
            >
              {reviews.map((review, index) => (
                <motion.div
                  key={`${review.id}-${index}`}
                  className="relative flex-shrink-0 group"
                  initial={{ y: verticalOffsets[index]?.translateY }}
                  style={{ y: verticalOffsets[index]?.translateY }}
                  whileHover={{ scale: 1.02, transition: { duration: 0.3 } }}
                >
                  <div
                    className={`w-[300px] h-[300px] ${review.color} rounded-[32px] p-8 flex flex-col justify-between shadow-lg ${review.shadow}`}
                    style={{
                      fontFamily: "Barlow, sans-serif",
                      backdropFilter: "blur(10px)",
                    }}
                  >
                    <p
                      className={`text-lg ${review.textColor} font-bold leading-tight tracking-wide`}
                    >
                      &ldquo;{review.message}&ldquo;
                    </p>
                    <p
                      className={`text-base ${review.textColor} font-medium mt-4`}
                    >
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
