"use client";
import React, { useEffect, useRef } from "react";
import Image from "next/image";
import gsap from "gsap";

const PreLoader = () => {
  const component = useRef(null);
  const roofRef = useRef(null);
  const baseRef = useRef(null);
  const textRef = useRef(null);

  useEffect(() => {
    const tl = gsap.timeline();

    tl.to(roofRef.current, {
      opacity: 1,
      duration: 0.6,
      ease: "power2.inOut",
    })
      .to(baseRef.current, {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: "power2.out",
      })
      .to(
        textRef.current,
        {
          opacity: 1,
          y: -20,
          duration: 0.8,
          ease: "power2.out",
        },
        "-=0.4"
      )
      .to(
        [roofRef.current, baseRef.current, textRef.current],
        {
          opacity: 0,
          y: -80,
          duration: 1,
          ease: "expo.out",
          delay: 1,
        },
        "<"
      )
      .to(
        component.current,
        {
          opacity: 0,
          duration: 1,
          ease: "expo.out",
        },
        "<"
      );
  }, []);

  return (
    <div
      ref={component}
      className=" h-screen w-full flex flex-col items-center justify-center bg-[#F5E6ED] overflow-hidden"
    >
      <div className="relative w-32 h-40">
        {/* Roof image */}
        <div
          ref={roofRef}
          className="absolute top-0 left-0 w-full z-10"
          style={{
            opacity: 0,
          }}
        >
          <Image
            src="/images/roof.png"
            alt="Bindi's Cupcakery Roof"
            width={128}
            height={30}
          />
        </div>

        {/* Storefront base */}
        <svg
          ref={baseRef}
          viewBox="0 0 130 150"
          className="w-full h-full absolute top-0 left-0 -translate-y-5"
          style={{
            opacity: 0,
          }}
        >
          <path
            d="M8 39 L8 110 L124 110 L124 39"
            stroke="black"
            strokeWidth="4"
            fill="none"
          />
          <rect
            x="25"
            y="58"
            width="23"
            rx={2}
            ry={2}
            height="30"
            stroke="black"
            strokeWidth="4"
            fill="none"
          />
          <rect
            x="25"
            y="88"
            width="23"
            height="8"
            rx={1}
            ry={1}
            stroke="black"
            strokeWidth="4"
            fill="none"
          />
          <path
            d="M75 110 L75 55 A20 10 0 0 1 105 55 L105 110"
            stroke="black"
            strokeWidth="4"
            fill="none"
          />
        </svg>
      </div>

      {/* Company name */}
      <div
        ref={textRef}
        className="bindi font-[pacifico] text-center"
        style={{
          fontSize: "3rem",
          letterSpacing: "0.05em",
          opacity: 0,
        }}
      >
        Bindi&apos;s Cupcakery
      </div>
    </div>
  );
};

export default PreLoader;
