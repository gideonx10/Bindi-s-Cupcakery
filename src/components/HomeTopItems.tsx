"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

interface Category {
  id: number;
  name: string;
  image: string;
  description: string;
  colors: {
    bgGradient: string;
    buttonBg: string;
    buttonText: string;
    buttonHoverBg: string;
    buttonHoverText: string;
    title: string;
    description: string;
  };
}

const categories: Category[] = [
  {
    id: 1,
    name: "Peanut Butter Fudge",
    image: "/images/img1.jpg",
    description: "Timeless collection of traditional favorites",
    colors: {
      bgGradient: "from-[#F3E8FF] to-[#E9D5FF]",
      buttonBg: "bg-[#9F7AEA]",
      buttonText: "text-white",
      buttonHoverBg: "hover:bg-[#805AD5]",
      buttonHoverText: "hover:text-white",
      title: "text-[#553C9A]",
      description: "text-[#6B46C1]/80",
    },
  },
  {
    id: 2,
    name: "Chocolate Fudge Cupcake",
    image: "/images/img2.jpg",
    description: "Unique and innovative combinations",
    colors: {
      bgGradient: "from-[#FEF3C7] to-[#FDE68A]",
      buttonBg: "bg-[#F59E0B]",
      buttonText: "text-white",
      buttonHoverBg: "hover:bg-[#D97706]",
      buttonHoverText: "hover:text-white",
      title: "text-[#92400E]",
      description: "text-[#B45309]/80",
    },
  },
  {
    id: 3,
    name: "Lemon Zest Cake Pop",
    image: "/images/img3.jpg",
    description: "Elegant and sophisticated choices",
    colors: {
      bgGradient: "from-[#FFE6E6] to-[#FFCCD6]",
      buttonBg: "bg-[#FF8B9C]",
      buttonText: "text-white",
      buttonHoverBg: "hover:bg-[#FF7088]",
      buttonHoverText: "hover:text-white",
      title: "text-[#D23F57]",
      description: "text-[#FF6B8B]/80",
    },
  },
  {
    id: 4,
    name: "Walnut Crunch Brownie",
    image: "/images/img4.jpg",
    description: "Limited edition seasonal delights",
    colors: {
      bgGradient: "from-[#E0F4FF] to-[#B5E8FF]",
      buttonBg: "bg-[#5AAFDB]",
      buttonText: "text-white",
      buttonHoverBg: "hover:bg-[#4A9CC7]",
      buttonHoverText: "hover:text-white",
      title: "text-[#2B6CB0]",
      description: "text-[#3182CE]/80",
    },
  },
];

const evenFloatingAnimation = {
  animate: {
    y: [0, -10, 0],
    transition: {
      duration: 3,
      repeat: Infinity,
      repeatType: "reverse" as const,
      ease: "easeInOut",
    },
  },
};

const oddFloatingAnimation = {
  animate: {
    y: [0, 10, 0],
    transition: {
      duration: 3,
      repeat: Infinity,
      repeatType: "reverse" as const,
      ease: "easeInOut",
    },
  },
};

const TopItems = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], [100, -100]);
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);

  useEffect(() => {
    cardsRef.current.forEach((card) => {
      if (!card) return;

      gsap.set(card, {
        opacity: 0,
        y: 100,
        scale: 0.9,
      });

      gsap.to(card, {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 1,
        ease: "power2.out",
        scrollTrigger: {
          trigger: card,
          start: "top bottom-=100",
          end: "top center",
          toggleActions: "play none none reverse",
          scrub: 1,
        },
      });
    });
  }, []);

  return (
    <section
      ref={sectionRef}
      className="pb-20 px-4 bg-[#FFF0F7] relative overflow-hidden min-h-screen"
    >
      <motion.div
        style={{ y, opacity }}
        className="max-w-7xl mx-auto relative z-10"
      >
        <div className=" pb-16 flex-shrink-0">
          <h1
            className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl xl:text-9xl text-center text-[#9B2C5D] uppercase tracking-tight leading-none font-black"
            style={{ fontFamily: "Barlow Condensed, sans-serif" }}
          >
            TOP ITEMS
          </h1>
          <div className="text-base sm:text-lg md:text-xl lg:text-2xl text-center mt-4 text-[#9B2C5D] tracking-wider font-medium font-ancient">
            EXPLORE OUR HANDCRAFTED COLLECTION
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {categories.map((category, index) => (
            <motion.div
              key={category.id}
              ref={(el) => {
                cardsRef.current[index] = el || null;
              }}
              className="relative group cursor-pointer h-[450px]"
              variants={
                index % 2 === 0 ? evenFloatingAnimation : oddFloatingAnimation
              }
              animate="animate"
              initial="initial"
            >
              <div className="relative bg-[#FFF0F7] rounded-xl shadow-2xl h-full flex flex-col transform transition-all duration-500 hover:shadow-[0_15px_30px_rgba(0,0,0,0.15)]">
                <div className="relative h-[250px] rounded-t-xl overflow-hidden flex-shrink-0">
                  <Image
                    src={category.image}
                    alt={category.name}
                    fill
                    className="object-cover transform transition-transform duration-700 group-hover:scale-110"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                </div>

                <div className="p-6 flex flex-col flex-grow justify-between">
                  <div>
                    <h3
                      className={`text-2xl font-bold ${category.colors.title} mb-3 transition-colors duration-300`}
                      style={{ fontFamily: "Barlow Condensed, sans-serif" }}
                    >
                      {category.name}
                    </h3>
                    <p className={`${category.colors.description} mb-4`}>
                      {category.description}
                    </p>
                  </div>
                  {/* <button
                    className={`
                    w-full ${category.colors.buttonBg} ${category.colors.buttonText} 
                    font-semibold py-3 px-4 rounded-lg
                    transform transition-all duration-300
                    ${category.colors.buttonHoverBg} ${category.colors.buttonHoverText}
                    hover:shadow-md
                  `}
                  >
                    View Details
                  </button> */}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  );
};

export default TopItems;
