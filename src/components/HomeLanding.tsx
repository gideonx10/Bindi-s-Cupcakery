// Landing.tsx
"use client";

import { useEffect, useRef } from "react";
import lottie from "lottie-web";
import Link from "next/link";

export default function Landing() {
  const lottieContainer = useRef<HTMLDivElement | null>(null);
  const celebrateContainer = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (lottieContainer.current && !lottieContainer.current.hasChildNodes()) {
      lottie.loadAnimation({
        container: lottieContainer.current,
        renderer: "svg",
        loop: true,
        autoplay: true,
        path: "/lottie/home-cake2.json",
      });
    }
    if (
      celebrateContainer.current &&
      !celebrateContainer.current.hasChildNodes()
    ) {
      lottie.loadAnimation({
        container: celebrateContainer.current,
        renderer: "svg",
        loop: true,
        autoplay: true,
        path: "/lottie/home-celebrate.json",
      });
    }
  }, []);

  return (
    <div className="h-screen bg-[#ef9aaa] text-[#3D1C1A] flex overflow-hidden">
      <div className="w-1/2 flex flex-col justify-center items-start p-12 relative z-10">
        <div className="relative inline-block">
          <h1 className="font-['Teko'] text-9xl font-bold leading-none text-[#3D1C1A] drop-shadow-lg">
            BINDI&apos;S
            <span className="block text-9xl -mt-6 tracking-wide">
              CUPCAKERY
            </span>
          </h1>
          <div
            ref={celebrateContainer}
            className="absolute -top-16 left-64 w-80 h-80 pointer-events-none"
          ></div>
        </div>

        <div className="space-y-6 mt-8 mb-10">
          <div className="text-4xl font-medium max-w-xl leading-tight font-['Quicksand']">
            Crafting Moments of Pure Bliss, One Cupcake at a Time ✨
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <Link
            href="#order"
            className="w-80 text-center bg-[#3D1C1A] text-[#F5E6D3] px-12 py-4 rounded-full text-2xl font-bold shadow-lg hover:translate-y-[-3px] hover:shadow-xl transition-all"
          >
            Order Now 🧁
          </Link>
        </div>
      </div>

      <div className="absolute right-0 top-0 w-1/2 h-full flex items-center justify-center">
        <div ref={lottieContainer} className="max-w-xl w-full"></div>
      </div>
    </div>
  );
}
