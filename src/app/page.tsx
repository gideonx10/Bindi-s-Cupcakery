"use client";

import { useState, useEffect, useRef } from "react";
import gsap from "gsap";
import PreLoader from "@/components/PreLoader";
import HomeLanding from "@/components/HomeLanding";
import { InfiniteName } from "@/components/HomeInfiniteName";
import TopCategories from "@/components/HomeTopCategories";
import ImageGallery from "@/components/HomeImageGallery";
import CustomerReviews from "@/components/HomeCustomerReviews";
import TopItems from "@/components/HomeTopItems";
import FAQs from "@/components/HomeFaqs";
import Footer from "@/components/Footer";

// Create a custom event for preloader state
const preloaderEvent = new Event("preloaderComplete");

export default function Home() {
  const [isLoading, setIsLoading] = useState(true);
  const [shouldRender, setShouldRender] = useState(true);
  const homeRef = useRef(null);
  const preloaderRef = useRef(null);

  useEffect(() => {
    // Show preloader for both first visit and reloads
    setIsLoading(true);
    setShouldRender(true);

    setTimeout(() => {
      // Fade out preloader
      gsap.to(preloaderRef.current, {
        opacity: 0,
        duration: 0.8,
        onComplete: () => {
          setIsLoading(false);
          setShouldRender(false);
          // Dispatch event when preloader is complete
          window.dispatchEvent(preloaderEvent);
        },
      });

      // Fade in homepage
      gsap.fromTo(
        homeRef.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 1, delay: 0.3, ease: "power2.out" }
      );
    }, 1800);
  }, []);

  return (
    <>
      {shouldRender && (
        <div
          ref={preloaderRef}
          data-preloader
          className="fixed top-0 left-0 w-full h-screen bg-[#fcfbe4] flex items-center justify-center z-50"
        >
          <PreLoader />
        </div>
      )}

      <div ref={homeRef} className="relative opacity-0">
        {/* Landing Page */}
        <HomeLanding />

        {/* Infinite Name (Placed Between Landing & Categories) */}

        <InfiniteName />

        {/* Top Categories Section */}
        <div className="relative bg-gradient-to-b from-[#E6F7FF] to-[#F5F3FF] z-0">
          <TopCategories />
          <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-b from-transparent to-[#F5F3FF]" />
        </div>

        {/* Image Gallery Section */}
        <div className="relative bg-gradient-to-b from-[#F5F3FF] to-[#FFF0F7]">
          <ImageGallery />
          <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-b from-transparent to-[#FFF0F7]" />
        </div>

        {/* Top Items Section */}
        <div className="relative bg-gradient-to-b from-[#F1F5ED] to-[#FCFBE4] ">
          <TopItems />
          <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-b from-transparent to-[#FCFBE4] " />
        </div>

        {/* Customer Reviews Section */}
        <div className="relative bg-gradient-to-b from-[#FCFBE4] to-[#FFF0F7]">
          <CustomerReviews />
          <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-b from-transparent to-[#FFF0F7]" />
        </div>

        {/* FAQs Section */}
        <div className="relative bg-gradient-to-b from-[#FFF0F7] to-[#FFE4F0]">
          <FAQs />
          <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-b from-transparent to-[#FCFBE4] " />
        </div>

        <div className="relative bg-gradient-to-b from-[#FCFBE4] to-[#FFF0F7]">
          <Footer />
        </div>
      </div>
    </>
  );
}
