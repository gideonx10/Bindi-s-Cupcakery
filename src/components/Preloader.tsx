"use client";
import React, { useState, useEffect, useLayoutEffect, useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
// import { delay } from "framer-motion";

const PreLoader = () => {
  const component = useRef(null);
  const roofRef = useRef(null);
  const baseRef = useRef(null);
  const textRef = useRef(null);
  const waveRef = useRef(null);

  const [circleCount, setCircleCount] = useState(9);
  const [circleWidth, setCircleWidth] = useState("15%");

  useLayoutEffect(() => {
    document.documentElement.style.overflow = "hidden";
    document.body.style.overflow = "hidden";

    return () => {
      document.documentElement.style.overflow = "";
      document.body.style.overflow = "";
    };
  }, []);

  useEffect(() => {
    const updateCircleCount = () => {
      if (window.innerWidth < 700) {
        setCircleCount(5);
        setCircleWidth("20%");
      } else if (window.innerWidth < 1000) {
        setCircleCount(7);
        setCircleWidth("15%");
      } else {
        setCircleCount(9);
        setCircleWidth("15%");
      }
    };

    // Run on mount
    updateCircleCount();

    // Add event listener
    window.addEventListener("resize", updateCircleCount);

    // Cleanup
    return () => window.removeEventListener("resize", updateCircleCount);
  }, []);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      // Ensure roofRef has initial background color
      gsap.set(roofRef.current, {
        opacity: 0,
      });

      gsap.set([baseRef.current, textRef.current], {
        opacity: 0,
      });

      gsap.set(baseRef.current, {
        y: -15,
      });

      gsap.set(textRef.current, {
        y: 15,
      });

      // Animation sequence
      const tl = gsap.timeline();

      tl.to(roofRef.current, {
        opacity: 1, // Transition background color to transparent
        duration: 0.8,
        ease: "power2.inOut",
      })
        .to(baseRef.current, {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: "power2.out",
        })
        .to(textRef.current, {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: "power2.out",
        }) // Pause for 2 seconds before running the animations

        .to(
          [roofRef.current, baseRef.current], // Animate all three together
          {
            opacity: 0,
            y: -80,
            duration: 1,
            ease: "expo.out",
            delay: 1,
          },
          "<" // Ensures they run together
        )
        .to(
            [textRef.current], // Animate all three together
            {
              opacity: 0,
              y: -100,
              scale: 0.5,
              duration: 1,
              ease: "expo.out",
            },
            "<" // Ensures they run together
          )
        .to(
          waveRef.current,
          {
            top: "75%",
            duration: 0.4,
            ease: "slow(0.7,0.7,false)",
          },
          "<"
        )
        .to(
            waveRef.current,
            {
              top: "100%",
              delay:0.4,
              duration: 0.4,
              ease: "slow(0.7,0.7,false)",
            },"<"
          );
    }, component);
  }, []);

  return (
    <div
      ref={component}
      className=" h-screen w-full flex flex-col items-center justify-center bg-[#fcfbe4] overflow-hidden"
    >
      <div className="relative w-32 h-40">
        {/* Roof image */}
        <div
          ref={roofRef}
          className="absolute top-0 left-0 w-full z-10"
          style={{
            transition: "background-color 1s ease-in-out",
          }}
        >
          <Image
            src="/images/roof.png"
            alt="Bindi's Cupcakery Roof"
            width={128}
            height={30}
            className="transform"
          />
        </div>

        {/* Storefront base */}
        <svg
          ref={baseRef}
          viewBox="0 0 130 150"
          className="w-full h-full absolute top-0 left-0"
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
        className="bindi font-[pacifico]"
        style={{
          fontSize: "3rem",
          letterSpacing: "0.05em",
        }}
      >
        Bindi&apos;s Cupcakery
      </div>

      <div
        ref={waveRef}
        style={{
          position: "absolute",
          width: "100%",
          height: "30%",
          overflow: "hidden",
          display: "flex",
          justifyContent: "center",
          top: "100%",
        }}
      >
        <div
          style={{
            display: "flex",
            position: "absolute",
            width: "100%",
            height: "30vh",
            backgroundColor: "#3A0015",
            top: "100px",
          }}
        >
          {[...Array(circleCount)].map((_, index) => (
            <div
              className="circle"
              key={index}
              style={{
                width: circleWidth,
                height: "145px",
                borderRadius: "50%",
                backgroundColor: "#3A0015",
                position: "relative",
                top: "-65px",
              }}
            ></div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PreLoader;
