"use client";

import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";

const Footer = () => {
  const waveRef = useRef(null);
  const [circleCount, setCircleCount] = useState(9);
  const [circleWidth, setCircleWidth] = useState("15%");

  useEffect(() => {
    const updateCircleCount = () => {
      if (window.innerWidth < 670) {
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

    updateCircleCount();
    window.addEventListener("resize", updateCircleCount);
    return () => window.removeEventListener("resize", updateCircleCount);
  }, []);

  return (
    <footer className="absolute flex flex-col h-[75vh] bg-[#EF9AAA] w-full bottom-0 rounded-t-[40px] overflow-hidden">
      <div className="padd flex-1 flex justify-between px-[10vw] relative">
        {/* Left Links */}
        <div className="flex flex-col text-center gap-y-4 sm:gap-y-6 mt-[7rem]">
          <a
            className="uppercase text-[2rem] text-[#3B0017] font-semibold"
            href=""
          >
            PROFILE
          </a>
          <a
            className="uppercase text-[2rem] text-[#3B0017] font-semibold whitespace-nowrap"
            href=""
          >
            PRODUCTS
          </a>
          <a
            className="uppercase text-[2rem] text-[#3B0017] font-semibold"
            href=""
          >
            ABOUT US
          </a>
          <a
            className="uppercase text-[2rem] text-[#3B0017] font-semibold"
            href=""
          >
            BLOGS
          </a>
        </div>
        <div className="component-section h-[70%] w-3/4 flex flex-col items-center justify-center max-[1000px]:hidden">
          <div className="relative w-32 h-40">
            {/* Roof image */}
            <div
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
            className="bindi font-[pacifico]"
            style={{
              fontSize: "3rem",
              letterSpacing: "0.05em",
            }}
          >
            Bindi&apos;s Cupcakery
          </div>
        </div>
        {/* Right Links */}
        <div className="flex flex-col text-center gap-y-3 sm:gap-y-5 mt-[7rem]">
          <a
            className="uppercase text-[2rem] text-[#3B0017] font-medium flex items-center gap-2"
            href=""
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 448 512"
              className="w-10 h-10 translate-y-0.5"
            >
              <path d="M224.1 141c-63.6 0-114.9 51.3-114.9 114.9s51.3 114.9 114.9 114.9S339 319.5 339 255.9 287.7 141 224.1 141zm0 189.6c-41.1 0-74.7-33.5-74.7-74.7s33.5-74.7 74.7-74.7 74.7 33.5 74.7 74.7-33.6 74.7-74.7 74.7zm146.4-194.3c0 14.9-12 26.8-26.8 26.8-14.9 0-26.8-12-26.8-26.8s12-26.8 26.8-26.8 26.8 12 26.8 26.8zm76.1 27.2c-1.7-35.9-9.9-67.7-36.2-93.9-26.2-26.2-58-34.4-93.9-36.2-37-2.1-147.9-2.1-184.9 0-35.8 1.7-67.6 9.9-93.9 36.1s-34.4 58-36.2 93.9c-2.1 37-2.1 147.9 0 184.9 1.7 35.9 9.9 67.7 36.2 93.9s58 34.4 93.9 36.2c37 2.1 147.9 2.1 184.9 0 35.9-1.7 67.7-9.9 93.9-36.2 26.2-26.2 34.4-58 36.2-93.9 2.1-37 2.1-147.8 0-184.8zM398.8 388c-7.8 19.6-22.9 34.7-42.6 42.6-29.5 11.7-99.5 9-132.1 9s-102.7 2.6-132.1-9c-19.6-7.8-34.7-22.9-42.6-42.6-11.7-29.5-9-99.5-9-132.1s-2.6-102.7 9-132.1c7.8-19.6 22.9-34.7 42.6-42.6 29.5-11.7 99.5-9 132.1-9s102.7-2.6 132.1 9c19.6 7.8 34.7 22.9 42.6 42.6 11.7 29.5 9 99.5 9 132.1s2.7 102.7-9 132.1z" />
            </svg>
            <span>instagram</span>
          </a>
          <a
            className="uppercase text-[2rem] text-[#3B0017] font-medium flex items-center gap-2"
            href=""
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 448 512"
              className="w-10 h-10 translate-y-0.5"
            >
              <path d="M64 32C28.7 32 0 60.7 0 96V416c0 35.3 28.7 64 64 64h98.2V334.2H109.4V256h52.8V222.3c0-87.1 39.4-127.5 125-127.5c16.2 0 44.2 3.2 55.7 6.4V172c-6-.6-16.5-1-29.6-1c-42 0-58.2 15.9-58.2 57.2V256h83.6l-14.4 78.2H255V480H384c35.3 0 64-28.7 64-64V96c0-35.3-28.7-64-64-64H64z" />
            </svg>
            facebook
          </a>
          <p className="dec uppercase text-[2rem] text-[#3B0017] font-medium flex items-center gap-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 448 512"
              className="w-10 h-10 translate-y-0.5"
            >
              <path d="M380.9 97.1C339 55.1 283.2 32 223.9 32c-122.4 0-222 99.6-222 222 0 39.1 10.2 77.3 29.6 111L0 480l117.7-30.9c32.4 17.7 68.9 27 106.1 27h.1c122.3 0 224.1-99.6 224.1-222 0-59.3-25.2-115-67.1-157zm-157 341.6c-33.2 0-65.7-8.9-94-25.7l-6.7-4-69.8 18.3L72 359.2l-4.4-7c-18.5-29.4-28.2-63.3-28.2-98.2 0-101.7 82.8-184.5 184.6-184.5 49.3 0 95.6 19.2 130.4 54.1 34.8 34.9 56.2 81.2 56.1 130.5 0 101.8-84.9 184.6-186.6 184.6zm101.2-138.2c-5.5-2.8-32.8-16.2-37.9-18-5.1-1.9-8.8-2.8-12.5 2.8-3.7 5.6-14.3 18-17.6 21.8-3.2 3.7-6.5 4.2-12 1.4-32.6-16.3-54-29.1-75.5-66-5.7-9.8 5.7-9.1 16.3-30.3 1.8-3.7 .9-6.9-.5-9.7-1.4-2.8-12.5-30.1-17.1-41.2-4.5-10.8-9.1-9.3-12.5-9.5-3.2-.2-6.9-.2-10.6-.2-3.7 0-9.7 1.4-14.8 6.9-5.1 5.6-19.4 19-19.4 46.3 0 27.3 19.9 53.7 22.6 57.4 2.8 3.7 39.1 59.7 94.8 83.8 35.2 15.2 49 16.5 66.6 13.9 10.7-1.6 32.8-13.4 37.4-26.4 4.6-13 4.6-24.1 3.2-26.4-1.3-2.5-5-3.9-10.5-6.6z" />
            </svg>
            9978677790
          </p>
          <p className="dec uppercase text-[2rem] text-[#3B0017] font-medium flex items-center gap-3">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 448 512"
              className="w-9 h-9 translate-y-0.5 translate-x-1"
            >
              <path d="M164.9 24.6c-7.7-18.6-28-28.5-47.4-23.2l-88 24C12.1 30.2 0 46 0 64C0 311.4 200.6 512 448 512c18 0 33.8-12.1 38.6-29.5l24-88c5.3-19.4-4.6-39.7-23.2-47.4l-96-40c-16.3-6.8-35.2-2.1-46.3 11.6L304.7 368C234.3 334.7 177.3 277.7 144 207.3L193.3 167c13.7-11.2 18.4-30 11.6-46.3l-40-96z" />
            </svg>
            8849730189
          </p>
        </div>
      </div>

      {/* Wave Effect */}
      <div
        ref={waveRef}
        className="absolute w-[200%] h-[30%] overflow-hidden flex justify-center"
        style={{
          top: "70%",
        }}
      >
        <div
          className="absolute w-full h-[30vh] bg-[#3A0015] flex"
          style={{
            top: "100px",
            animation: "moveWave 10s linear infinite",
          }}
        >
          {[...Array(2 * circleCount)].map((_, index) => (
            <div
              key={index}
              className="circle"
              style={{
                width: circleWidth,
                height: "145px",
                borderRadius: "50%",
                backgroundColor: "#3A0015",
                position: "relative",
                top: "-65px",
              }}
            />
          ))}
        </div>
      </div>
      <div className="text-center mt-8 absolute bottom-7 w-full flex flex-col md:flex-row justify-between items-center md:px-[13vw] px-4">
        <p className="text-[#EF9AAA] text-base md:text-xl mb-2 md:mb-0">
          &copy; 2025 Bindi&apos;s Cupcakery. All rights reserved.
        </p>
        <p className="text-[#EF9AAA] text-base md:text-xl flex items-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 512 512"
            fill="#EF9AAA"
            className="w-5 h-5 md:w-7 md:h-7 inline-block md:-translate-x-1 md:-translate-y-0.5 "
          >
            <path d="M64 112c-8.8 0-16 7.2-16 16l0 22.1L220.5 291.7c20.7 17 50.4 17 71.1 0L464 150.1l0-22.1c0-8.8-7.2-16-16-16L64 112zM48 212.2L48 384c0 8.8 7.2 16 16 16l384 0c8.8 0 16-7.2 16-16l0-171.8L322 328.8c-38.4 31.5-93.7 31.5-132 0L48 212.2zM0 128C0 92.7 28.7 64 64 64l384 0c35.3 0 64 28.7 64 64l0 256c0 35.3-28.7 64-64 64L64 448c-35.3 0-64-28.7-64-64L0 128z" />
          </svg>{" "}
          bindis_cupcakery@gmail.com
        </p>
      </div>

      <style jsx>{`
        @keyframes moveWave {
          0% {
            transform: translateX(0%);
          }
          100% {
            transform: translateX(-50%);
          }
        }

        @media (max-width: 520px) {
          .padd {
            padding: 0 5vw;
          }
            a, .dec {
            font-size: 1.5rem;!important;
          }
        }
      `}</style>
    </footer>
  );
};

export default Footer;
