"use client";

import React, { useEffect, useRef, useState } from "react";
import { ShoppingBag } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import gsap from "gsap";
import Cart from "./SidebarCart";
import { useSession } from "next-auth/react";
import { usePathname } from "next/navigation";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [delayedOpen, setDelayedOpen] = useState(false);

  const waveRef = useRef<HTMLDivElement>(null);
  const componentRef = useRef<HTMLDivElement>(null);
  const tabsRef = useRef<HTMLLIElement[]>([]);

  const { data: session } = useSession();
  const userId = (session?.user as { id: string })?.id;
  const pathname = usePathname();

  // ... (other state and refs)

  // Update date and time

  // Handle link clicks to close menu
  const handleLinkClick = () => {
    setIsMenuOpen(false);
  };

  useEffect(() => {
    // Select all tab elements
    const tabs = document.querySelectorAll(".tabs");

    // Event handlers for hover
    const handleMouseEnter = (e: Event) => {
      const tab = e.currentTarget as HTMLElement;
      gsap.to(tab, {
        x: 20,
        duration: 0.3,
        ease: "power2.out",
      });
    };

    const handleMouseLeave = (e: Event) => {
      const tab = e.currentTarget as HTMLElement;
      gsap.to(tab, {
        x: 0,
        duration: 0.3,
        ease: "power2.out",
      });
    };

    // Add event listeners to each tab
    tabs.forEach((tab) => {
      tab.addEventListener("mouseenter", handleMouseEnter);
      tab.addEventListener("mouseleave", handleMouseLeave);
    });

    // Cleanup function
    return () => {
      tabs.forEach((tab) => {
        tab.removeEventListener("mouseenter", handleMouseEnter);
        tab.removeEventListener("mouseleave", handleMouseLeave);
      });
    };
  }, [isMenuOpen]); // Re-run when menu opens/closes

  useEffect(() => {
    // Initial GSAP setup
    if (componentRef.current) {
      gsap.set(componentRef.current, { opacity: 0 });
    }

    // Set initial state for tabs
    gsap.set(".tabs", {
      opacity: 0,
      y: 20,
    });

    if (isMenuOpen && componentRef.current) {
      const tl = gsap.timeline();

      tl.to(componentRef.current, {
        opacity: 1,
        duration: 1,
        delay: 0.2,
      }).to(
        ".tabs",
        {
          opacity: 1,
          y: 0,
          duration: 0.5,
          stagger: 0.1,
          ease: "power2.out",
        },
        "-=0.5"
      );
    }
  }, [isMenuOpen]);

  // Initialize GSAP states and handle animations
  useEffect(() => {
    // Initial GSAP setup
    if (componentRef.current) {
      gsap.set(componentRef.current, { opacity: 0 });
    }

    // Set initial state for tabs
    gsap.set(".tabs", {
      opacity: 0,
      y: 20, // Start from below their final position
    });

    // Update animation when menu opens
    if (isMenuOpen && componentRef.current) {
      const tl = gsap.timeline();

      // Animate the component first
      tl.to(
        componentRef.current,
        {
          opacity: 1,
          duration: 2,
          delay: 0.4,
        },
        "<"
      )

        // Animate tabs with stagger
        .to(
          ".tabs",
          {
            opacity: 1,
            y: 0, // Move to their original position
            duration: 0.5,
            stagger: 0.1, // 0.1 second delay between each tab
            ease: "power2.out",
            delay: 0, // Smooth easing function
          },
          "<"
        ); // Start slightly before the previous animation ends
    }
  }, [isMenuOpen]);

  // Handle delayed open state
  useEffect(() => {
    setDelayedOpen(isMenuOpen);
  }, [isMenuOpen]);

  // Responsive circle count
  const [circleCount, setCircleCount] = useState(9);
  const [circleWidth, setCircleWidth] = useState("15%");

  useEffect(() => {
    const updateCircleCount = () => {
      if (window.innerWidth < 700) {
        setCircleCount(4);
        setCircleWidth("20%");
      } else if (window.innerWidth < 1000) {
        setCircleCount(6);
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

  const menuItems = [
    { href: "/user", text: "PROFILE" },
    { href: "/Products", text: "PRODUCTS" },
    { href: "/user?tab=cart", text: "CART" },
    { href: "/aboutUs", text: "ABOUT US" },
  ];

  return (
    <>
      {/* Main Navbar */}
      <nav className="w-full bg-transperent px-[5%] p-8 flex justify-between items-center fixed top-0 left-0 z-50">
        {/* Logo */}
        <Link
          href="/"
          onClick={handleLinkClick}
          className="logo flex flex-col items-start leading-none"
        >
          <span className="text-[3.8rem] font-bold text-[#3b0017] transform translate-y-1">
            B
          </span>
          <div className="absolute ml-[3.3rem]">
            <span className="text-[2.7rem] font-semibold text-[#3b0017]">
              indi&apos;s
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
          {pathname.startsWith("/products") && (
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

          {/* Menu Toggle Button */}
          <div
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className={`nav-toggler relative size-16 max-sm:size-12 grid place-items-center cursor-pointer transition-transform duration-300 ${
              isMenuOpen ? "rotate-90" : ""
            }`}
          >
            <svg
              className="absolute size-full text-[#3b0017] max-sm:size-12"
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

            {/* Hamburger Icon */}
            <div className="absolute flex flex-col items-center w-6 max-sm:w-4">
              {[...Array(3)].map((_, i) => (
                <div
                  key={i}
                  className={`absolute h-[3px] max-sm:h-[2px] w-[24px] max-sm:w-[18px] ${
                    isMenuOpen
                      ? "bg-yellow-400"
                      : pathname.startsWith("/Products")
                      ? "bg-[#3e7496]"
                      : "bg-yellow-400"
                  } rounded-full transition-all duration-300 ${
                    isMenuOpen
                      ? i === 1
                        ? "opacity-0 scale-0"
                        : i === 0
                        ? "rotate-45"
                        : "-rotate-45"
                      : i === 0
                      ? "translate-y-2"
                      : i === 2
                      ? "-translate-y-2"
                      : ""
                  }`}
                ></div>
              ))}
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
        <div className="h-full flex pt-[8%]">
          {/* Large Logo Section */}
          <div
            ref={componentRef}
            className="h-[70%] w-3/4 flex flex-col items-center justify-center component-section "
          >
            <div className="relative w-32 h-40  hover:scale-[115%] duration-300">
              <div className="absolute top-0 left-0 w-full z-10">
                <Image
                  src="/images/roof.png"
                  alt="Bindi's Cupcakery Roof"
                  width={128}
                  height={30}
                  className="transform"
                />
              </div>

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

            <div
              className="bindi font-[pacifico] hover:scale-105 duration-300"
              style={{
                fontSize: "3rem",
                letterSpacing: "0.05em",
              }}
            >
              Bindi&apos;s Cupcakery
            </div>
          </div>

          {/* Menu Items Section */}
          <div className="options w-1/2 h-full pt-[6%] pl-[5%]">
            <ul className="text-[#3b0017] text-6xl font-bold space-y-8">
              {menuItems.map((item, index) => (
                <li
                  key={index}
                  className="tabs opacity-0 cursor-pointer"
                  ref={(el) => {
                    if (el) tabsRef.current[index] = el;
                  }}
                >
                  <Link
                    href={item.href}
                    className="block"
                    onClick={handleLinkClick} // Add click handler to each link
                  >
                    {item.text}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Wave Animation */}
        <div
          ref={waveRef}
          style={{
            display: delayedOpen ? "flex" : "none",
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
      </div>

      {/* Cart Component */}
      <Cart
        userId={userId}
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
      />

      <style>{`
        @keyframes moveWave {
          0% {
            transform: translateX(0%);
          }
          100% {
            transform: translateX(-50%);
          }
        }

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
    </>
  );
};

export default Navbar;
