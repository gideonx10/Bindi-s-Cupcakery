"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import gsap from "gsap";

const FEATURE_MESSAGES = [
  { text: "Indulge in Pure, Eggless Bliss!", icon: "🧁" },
  { text: "100% Vegetarian, 100% Delicious!", icon: "🌱" },
  { text: "Preservative-Free, Home-Baked Goodness!", icon: "✨" },
  { text: "Handcrafted Delights, Made with Love", icon: "💝" },
];

// SVG Components
const SwirlyLineSVG = () => (
  <svg width="200" height="400" viewBox="0 0 200 400" fill="none" xmlns="http://www.w3.org/2000/svg">

    {/* Main elegant swirl */}
    <path
      d="M80 0C40 80 160 120 80 200C30 280 150 320 80 400"
      stroke="url(#swirl-gradient)"
      strokeWidth="3"
      strokeLinecap="round"
      fill="none"
      className="path-animate"
    >
      <animate
        attributeName="strokeDashoffset"
        values="1000;0"
        dur="10s"
        repeatCount="indefinite"
      />
    </path>

    {/* Secondary swirl for depth */}
    <path
      d="M80 0C50 70 140 110 80 180C40 250 130 290 80 360"
      stroke="url(#swirl-gradient-2)"
      strokeWidth="1.5"
      strokeLinecap="round"
      fill="none"
      opacity="0.6"
      className="path-animate"
    >
      <animate
        attributeName="strokeDashoffset"
        values="800;0"
        dur="8s"
        repeatCount="indefinite"
      />
    </path>

    {/* Gradient definitions */}
    <defs>
      <linearGradient id="swirl-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#FFD6E8" />
        <stop offset="50%" stopColor="#FFB6E1" />
        <stop offset="100%" stopColor="#FF9ECD" />
      </linearGradient>
      <linearGradient id="swirl-gradient-2" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#FFE4F1" />
        <stop offset="50%" stopColor="#FFD6E8" />
        <stop offset="100%" stopColor="#FFB6E1" />
      </linearGradient>
    </defs>
  </svg>
);

const HeartSVG = () => (
  <svg width="50" height="60" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path 
      d="M40 17C36-10 0 0 0 24C0 40 40 64 40 64C40 64 80 40 80 24C80 0 44-10 40 17Z" 
      fill="#FF9ECD" 
      opacity="0.6">
      <animate 
        attributeName="opacity" 
        values="0.6;0.9;0.6" 
        dur="2s" 
        repeatCount="indefinite"/>
      <animate 
        attributeName="d" 
        values="M40 17C36-10 0 0 0 24C0 40 40 64 40 64C40 64 80 40 80 24C80 0 44-10 40 17Z;
                M40 20C36-7 3 3 3 27C3 43 40 67 40 67C40 67 77 43 77 27C77 3 44-7 40 20Z;
                M40 17C36-10 0 0 0 24C0 40 40 64 40 64C40 64 80 40 80 24C80 0 44-10 40 17Z" 
        dur="2s" 
        repeatCount="indefinite"/>
    </path>
  </svg>
);

const SparkleElement = () => (
  <svg width="60" height="60" viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="30" cy="30" r="4" fill="#FF9ECD" className="animate-ping">
      <animate attributeName="opacity" values="1;0.2;1" dur="2s" repeatCount="indefinite"/>
    </circle>
    <circle cx="45" cy="15" r="3" fill="#FFB6E1">
      <animate attributeName="r" values="3;4;3" dur="1.5s" repeatCount="indefinite"/>
    </circle>
    <circle cx="15" cy="45" r="3" fill="#FF82B8">
      <animate attributeName="r" values="3;4;3" dur="2s" repeatCount="indefinite"/>
    </circle>
  </svg>
);

export default function HomeLanding() {
  const topLeftRef = useRef<HTMLDivElement>(null);
  const bottomLeftRef = useRef<HTMLDivElement>(null);
  const topRightRef = useRef<HTMLDivElement>(null);
  const topRightRefmob = useRef<HTMLDivElement>(null);
  const featureTextRef = useRef<HTMLDivElement>(null);
  const [currentFeature, setCurrentFeature] = useState(0);

  // Original animations for floating images
  useEffect(() => {
    const ctx = gsap.context(() => {
      if (topLeftRef.current) {
        gsap.to(topLeftRef.current, {
          y: "+=10",
          x: "+=15",
          repeat: -1,
          yoyo: true,
          duration: 2,
          ease: "power1.inOut",
        });
      }

      if (bottomLeftRef.current) {
        gsap.to(bottomLeftRef.current, {
          y: "-=10",
          x: "+=15",
          repeat: -1,
          yoyo: true,
          duration: 2,
          ease: "power1.inOut",
        });
      }

      if (topRightRef.current) {
        gsap.to(topRightRef.current, {
          y: "-=10",
          x: "-=15",
          repeat: -1,
          yoyo: true,
          duration: 2,
          ease: "power1.inOut",
        });
      }
    });

    return () => ctx.revert(); // Cleanup
  }, []);

  // Original mobile animation
  useEffect(() => {
    const ctx = gsap.context(() => {
      if (topRightRefmob.current) {
        gsap.to(topRightRefmob.current, {
          y: "+=20",
          repeat: -1,
          yoyo: true,
          duration: 2,
          ease: "power1.inOut",
        });
      }
    });

    return () => ctx.revert(); // Cleanup
  }, []);

  // Feature text animation
  useEffect(() => {
    const interval = setInterval(() => {
      if (featureTextRef.current) {
        gsap.to(featureTextRef.current, {
          opacity: 0,
          y: -10,
          duration: 0.3,
          onComplete: () => {
            setCurrentFeature((prev) => (prev + 1) % FEATURE_MESSAGES.length);
            gsap.fromTo(
              featureTextRef.current,
              { 
                opacity: 0, 
                y: 10,
                scale: 0.95
              },
              {
                opacity: 1,
                y: 0,
                scale: 1,
                duration: 0.4,
                ease: "back.out(1.7)"
              }
            );
          }
        });
      }
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div
      className="min-h-screen w-full bg-cover bg-center relative overflow-hidden"
      style={{ backgroundImage: `url('/images/landing_bg.jpg')` }}
    >
      {/* Decorative Left Side Elements */}
      <div className="absolute left-0 top-0 h-full w-40 pointer-events-none overflow-hidden">
        <div className="absolute top-[20%] left-4 transform rotate-12">
          <SwirlyLineSVG />
        </div>
        <div className="absolute top-[30%] left-8">
          <HeartSVG />
        </div>
        <div className="absolute top-[50%] left-12">
          <HeartSVG />
        </div>
        <div className="absolute top-[70%] left-6">
          <SparkleElement />
        </div>
      </div>

      {/* Decorative Right Side Elements */}
      <div className="absolute right-0 top-0 h-full w-40 pointer-events-none overflow-hidden">
        <div className="absolute top-[25%] right-4 transform -rotate-12">
          <SwirlyLineSVG />
        </div>
        <div className="absolute top-[40%] right-8">
          <HeartSVG />
        </div>
        <div className="absolute top-[60%] right-12">
          <HeartSVG />
        </div>
        <div className="absolute top-[80%] right-6">
          <SparkleElement />
        </div>
      </div>

      {/* Gradient overlays */}
      <div className="absolute inset-y-0 left-0 w-40 bg-gradient-to-r from-pink-100/30 to-transparent pointer-events-none" />
      <div className="absolute inset-y-0 right-0 w-40 bg-gradient-to-l from-pink-100/30 to-transparent pointer-events-none" />

      {/* Main Content */}
      <div className="absolute w-[1920px] h-[1080px] left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
        {/* Left Top Image */}
        <div
          ref={topLeftRef}
          className="absolute w-[180px] h-[180px] rotate-[20deg] md:block hidden"
          style={{
            left: "580px",
            top: "240px",
          }}
        >
          <Image
            src="/images/home_cup.png"
            alt="Bindi's Cupcakery aboutus"
            height={1080}
            width={1080}
            className="h-auto"
          />
        </div>

        {/* Left Bottom Image */}
        <div
          ref={bottomLeftRef}
          className="absolute w-[180px] h-[180px] -rotate-[20deg] md:block hidden"
          style={{
            left: "580px",
            top: "560px",
          }}
        >
          <Image
            src="/images/home_cake.png"
            alt="Bindi's Cupcakery aboutus"
            height={1080}
            width={1080}
            className="h-auto"
          />
        </div>

        {/* Right Image */}
        <div
          ref={topRightRef}
          className="absolute w-[260px] h-[260px] -rotate-[20deg] hidden md:block"
          style={{
            right: "520px",
            top: "360px",
          }}
        >
          <Image
            src="/images/home_ice.png"
            alt="Bindi's Cupcakery aboutus"
            height={1080}
            width={1080}
            className="h-auto"
          />
        </div>

        {/* Centered Image for Small Screens */}
        <div
          className="flex md:hidden justify-center items-center -translate-y-[14vh] absolute inset-0"
          ref={topRightRefmob}
        >
          <Image
            src="/images/home_cake.png"
            alt="Bindi's Cupcakery aboutus"
            height={1080}
            width={1080}
            className="w-[320px] h-auto"
          />
        </div>

        {/* Center Text */}
        <div className="maintext absolute left-1/2 top-[60%] md:top-[48%] -translate-x-1/2 -translate-y-[35%] whitespace-nowrap text-center">
          <h1 className="text-[160px] font-semibold leading-none text-[#c23471] scale-x-[0.7] scale-y-[1.1] md:scale-y-[1.2] md:scale-x-100 transform-gpu">
            BINDI&apos;S
          </h1>
          <h2 className="text-[85px] font-light font-Ananda text-[#c23471] text-center mt-6 scale-x-[0.7] scale-y-[0.9] md:scale-x-100 transform-gpu">
            Cupcakery
          </h2>

          {/* Animated Feature Text with Glass Effect */}
          <div className="relative mt-28 md:mt-36 -translate-y-[10vh]">
            {/* Glass Effect Background */}
            <div className="absolute inset-0 w-full h-full rounded-xl 
                          bg-white/5 backdrop-blur-[2px] 
                          border border-white/10
                          shadow-[0_4px_24px_0_rgba(31,38,135,0.10)]"
                 style={{ WebkitBackdropFilter: "blur(2px)" ,}}
            />
            
            {/* Animated Content */}
            <div className="relative px-6 py-3 w-fit mx-auto">
              <div 
                ref={featureTextRef}
                className="flex items-center justify-center gap-3"
              >
                <span className="text-2xl md:text-3xl animate-bounce">
                  {FEATURE_MESSAGES[currentFeature].icon}
                </span>
                <p className="font-ancient text-lg md:text-xl text-[#c23471] font-medium whitespace-normal min-w-[200px] md:min-w-[300px]">
                  {FEATURE_MESSAGES[currentFeature].text}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}