"use client";

import React, { useEffect, useRef, useState } from "react";
import { ShoppingBag, Menu, X, Star } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import gsap from "gsap";
import Cart from "./SidebarCart";
import { useSession } from "next-auth/react";
import { usePathname } from "next/navigation";
// import { authOptions } from "@/app/api/auth/[...nextauth]/route";
// import { getServerSession } from "next-auth";

const Navbar = () => {
  // const session = await getServerSession(authOptions);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false); // New state for login status
  const [userName, setUserName] = useState("John Doe"); // New state for user name
  const waveRef = useRef(null);
  const [delayedOpen, setDelayedOpen] = useState(false);
  const component = useRef(null);
  const { data: session } = useSession();
  const userId = (session?.user as { id: string })?.id;
  const pathname = usePathname();
  gsap.set(component.current, {
    opacity: 0,
  });
  gsap.set(".tabs", {
    opacity: 0,
  });

  useEffect(() => {
    if (isMenuOpen) {
      const tl = gsap.timeline();

      tl.to(
        component.current,
        {
          opacity: 1,
          duration: 1,
          delay: 0.2,
        },
        "<"
      );
      tl.to(
        ".tabs",
        {
          y: -20,
          duration: 1,
        },
        "<"
      );
      tl.to(
        ".tabs",
        {
          opacity: 1,
          duration: 1,
          stagger: 0.2,
        },
        "<"
      );
      // Show the element immediately
    }
  }, [isMenuOpen]);

  useEffect(() => {
    if (isMenuOpen) {
      setDelayedOpen(true); // Show the element immediately
    } else {
      setDelayedOpen(false);
    }
  }, [isMenuOpen]);

  const [circleCount, setCircleCount] = useState(9);
  const [circleWidth, setCircleWidth] = useState("15%");

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

  return (
    <>
      {/* Main Navbar */}
      <nav className="w-full bg-transperent px-[5%] p-8 flex justify-between items-center fixed top-0 left-0 z-50">
        {/* Logo */}
        <Link href="/" className="logo flex flex-col items-start leading-none">
          <span className="text-[3.8rem] font-bold text-[#3b0017] transform translate-y-1">
            B
          </span>
          <div className="absolute ml-[3.3rem]">
            <span className="text-[2.7rem] font-semibold text-[#3b0017]">
              indi's
            </span>
          </div>
          <div className="absolute ml-[3.05rem] mt-[2.4rem]">
            <span className="text-[1.4rem] font-semibold text-[#3b0017]">
              cupcakery
            </span>
          </div>
        </Link>

        {/* Right side icons */}
        <div className="flex items-center gap-7 max-sm:gap-2 max-sm:scale-85">
          {pathname.startsWith("/Products") && (
            <button
              onClick={() => setIsCartOpen(!isCartOpen)}
              className="text-[#3b0017] p-4 max-sm:p-2"
            >
              <ShoppingBag
                size={30}
                className="transform translate-x-3 max-sm:size-6"
              />
            </button>
          )}
          {/* {isLoggedIn ? (
            <div className="text-[#3b0017] px-4 py-3 bg-transparent rounded-xl border-[#3b0017] border-2 max-sm:px-2 max-sm:py-2 max-sm:text-sm">
              {userName}
            </div>
          ) : (
            <button
              onClick={() => setIsLoggedIn(true)}
              className="text-[#3b0017] font-semibold px-4 py-3 bg-transparent border-[#3b0017] border-2 rounded-xl max-sm:px-2 max-sm:py-2 max-sm:text-sm"
            >
              Login/Signup
            </button>
          )} */}

          <div
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className={`nav-toggler relative size-16 max-sm:size-12 grid place-items-center cursor-pointer transition-transform duration-300 ${
              isMenuOpen ? "rotate-90" : ""
            }`}
          >
            <svg
              className="absolute size-full text-[#3b0017] max-sm:size-10"
              width="105"
              height="105"
              viewBox="0 0 105 105"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M48.8442 3.23316C50.2513 0.06423 54.7487 0.0642385 56.1558 3.23317L63.2789 19.2749C64.1436 21.2224 66.3833 22.1501 68.3719 21.3845L84.7519 15.078C87.9876 13.8322 91.1677 17.0124 89.922 20.2481L83.6155 36.6281C82.8499 38.6167 83.7776 40.8564 85.7251 41.7211L101.767 48.8442C104.936 50.2513 104.936 54.7487 101.767 56.1558L85.7251 63.2789C83.7776 64.1436 82.8499 66.3833 83.6155 68.3719L89.922 84.7519C91.1678 87.9876 87.9876 91.1677 84.7519 89.922L68.3719 83.6155C66.3833 82.8499 64.1436 83.7776 63.2789 85.7251L56.1558 101.767C54.7487 104.936 50.2513 104.936 48.8442 101.767L41.7211 85.7251C40.8564 83.7776 38.6167 82.8499 36.6281 83.6155L20.2481 89.922C17.0124 91.1678 13.8323 87.9876 15.078 84.7519L21.3845 68.3719C22.1501 66.3833 21.2224 64.1436 19.2749 63.2789L3.23318 56.1558C0.0642462 54.7487 0.0642381 50.2513 3.23317 48.8442L19.2749 41.7211C21.2224 40.8564 22.1501 38.6167 21.3845 36.6281L15.078 20.2481C13.8322 17.0124 17.0124 13.8323 20.2481 15.078L36.6281 21.3845C38.6167 22.1501 40.8564 21.2224 41.7211 19.2749L48.8442 3.23316Z"
                fill="currentColor"
              />
            </svg>

            {/* Hamburger & Close Icon */}
            <div className="absolute flex flex-col items-center w-6 max-sm:w-4">
              <div
                className={`absolute h-[3px] max-sm:h-[2px] w-[24px] max-sm:w-[18px] bg-yellow-400 rounded-full transition-all duration-300 ${
                  isMenuOpen ? "rotate-45" : "translate-y-2"
                }`}
              ></div>
              <div
                className={`absolute h-[3px] max-sm:h-[2px] w-[24px] max-sm:w-[18px] bg-yellow-400 rounded-full transition-all duration-300 ${
                  isMenuOpen ? "opacity-0 scale-0" : "opacity-100"
                }`}
              ></div>
              <div
                className={`absolute h-[3px] max-sm:h-[2px] w-[24px] max-sm:w-[18px] bg-yellow-400 rounded-full transition-all duration-300 ${
                  isMenuOpen ? "-rotate-45" : "-translate-y-2"
                }`}
              ></div>
            </div>
          </div>
        </div>
      </nav>

      {/* Full screen menu */}
      <div
        className={`fixed inset-0 bg-yellow-400 transition-transform duration-300 z-40 ${
          isMenuOpen ? "translate-y-0" : "-translate-y-full"
        }`}
      >
        <div className="h-full flex pt-[8%] ">
          {/* Large Logo Section */}
          <div
            ref={component}
            className="h-[70%] w-3/4 flex flex-col items-center justify-center component-section"
          >
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
              Bindi's Cupcakery
            </div>
          </div>

          {/* Menu Items Section */}
          <div className="options w-1/2 h-full pt-[6%] pl-[5%]">
            <ul className="text-[#3b0017] text-6xl font-bold space-y-8">
              <li className="tabs hover:translate-x-4 transition-transform cursor-pointer">
                PROFILE
              </li>
              <li className="tabs hover:translate-x-4 transition-transform cursor-pointer">
                PRODUCTS
              </li>
              <li className="tabs hover:translate-x-4 transition-transform cursor-pointer">
                ABOUT US
              </li>
              <li className="tabs hover:translate-x-4 transition-transform cursor-pointer">
                BLOG
              </li>
              {/* {session?(
                <Link href="/api/auth/signout?callbackUrl=/"> Logout</Link>
              ):(
                <Link href="/api/auth/signin">Login</Link>
              )} */}
            </ul>
          </div>
        </div>
        <div
          ref={waveRef}
          style={{
            display: delayedOpen ? "flex" : "none", // Toggle visibility
            position: "absolute",
            width: "200%",
            height: "30%",
            overflow: "hidden",
            justifyContent: "center",
            top: "75%",
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
              animation: "moveWave 10s linear infinite",
            }}
          >
            {[...Array(2 * circleCount)].map((_, index) => (
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

      {/* Cart sidebar */}
      {/* <div
        className={`fixed top-0 right-0 h-full w-1/3 bg-yellow-400 shadow-lg transition-transform duration-300 z-30 ${
          isCartOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="pt-24 px-8">
          <h2 className="text-2xl font-bold text-[#3b0017] mb-6">Your Cart</h2> */}
      <Cart
        userId={userId}
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
      />
      {/* </div>
      </div> */}

      <style jsx>{`
        .rounded-star {
          clip-path: polygon(
            50% 0%,
            61% 35%,
            98% 35%,
            68% 57%,
            79% 91%,
            50% 70%,
            21% 91%,
            32% 57%,
            2% 35%,
            39% 35%
          );
        }
        @media (max-width: 800px) {
          .component-section {
            display: none;
          }
          .options {
            width: 100%;
            height: 70vh;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
          }
        }
      `}</style>
      <style jsx>{`
        @keyframes moveWave {
          0% {
            transform: translateX(0%);
          }
          100% {
            transform: translateX(-50%);
          } /* Move left by half */
        }
      `}</style>
    </>
  );
};

export default Navbar;
