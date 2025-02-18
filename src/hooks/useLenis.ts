"use client";

import { useEffect } from "react";
import Lenis from "@studio-freight/lenis";

const useLenis = () => {
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.5, // Increased duration for ultra-smooth scrolling
      easing: (t) => 1 - Math.pow(1 - t, 4), // More natural ease-out animation
      smoothWheel: true, // Smooth scroll on wheel
      syncTouch: true, // Synchronizes touch behavior for better smoothness
      lerp: 0.08, // Lower values make motion feel smoother
    });

    const update = (time: number) => {
      lenis.raf(time);
      requestAnimationFrame(update);
    };

    requestAnimationFrame(update);

    return () => {
      lenis.destroy();
    };
  }, []);
};

export default useLenis;
