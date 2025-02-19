"use client";

import React, { useEffect, useRef, useState } from "react";
import { ShoppingBag } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import gsap from "gsap";
import Cart from "./SidebarCart";
import { usePathname } from "next/navigation";

const Navbar = () => {
  const pathname = usePathname();
  if (pathname?.startsWith("/admin")) return null;
  const [isPreloaderActive, setIsPreloaderActive] = useState(pathname === "/");

  useEffect(() => {
    if (pathname === "/") {
      const handlePreloaderComplete = () => {
        setIsPreloaderActive(false);
      };

      window.addEventListener("preloaderComplete", handlePreloaderComplete);
      return () => {
        window.removeEventListener(
          "preloaderComplete",
          handlePreloaderComplete
        );
      };
    } else {
      setIsPreloaderActive(false);
    }
  }, [pathname]);

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [delayedOpen, setDelayedOpen] = useState(false);
  const [showTextLogo, setShowTextLogo] = useState(!pathname?.startsWith("/")); // Initially show text logo except on homepage

  const waveRef = useRef<HTMLDivElement>(null);
  const componentRef = useRef<HTMLDivElement>(null);
  const tabsRef = useRef<HTMLLIElement[]>([]);
  const [user, setUser] = useState<{
    userId: string;
    phone: string;
    role: string;
  } | null>(null);
  useEffect(() => {
    const checkSession = async () => {
      const res = await fetch("/api/session", {
        method: "GET",
        credentials: "include", // ✅ Ensures cookies are sent with request
      });

      const data = await res.json();
      console.log(data);
      if (data.authenticated) {
        setUser({ userId: data.userId, phone: data.phone, role: data.role });
      } else {
        console.log("Not authenticated:", data.message);
      }
    };
    checkSession();
  }, []);
  const userId = user?.userId;

  // Handle scroll position for homepage
  useEffect(() => {
    const handleScroll = () => {
      if (pathname === "/") {
        const scrollPosition = window.scrollY;
        const windowHeight = window.innerHeight;
        setShowTextLogo(scrollPosition > windowHeight * 1); // 80vh threshold
      }
    };

    if (pathname === "/") {
      window.addEventListener("scroll", handleScroll);
      handleScroll(); // Initial check
    }

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [pathname]);

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
    { href: user ? "/user" : "/auth", text: user ? "PROFILE" : "SIGN IN" },
    { href: "/products", text: "PRODUCTS" },
    { href: "/user?tab=cart", text: "CART" },
    { href: "/about", text: "ABOUT US" },
  ];

  return (
    <>
      {/* Main Navbar */}
      <nav className="w-full bg-transperent px-[5%] p-8 flex justify-between items-center fixed top-0 left-0 z-50">
        {/* Conditional Logo Rendering */}
        <Link
          href="/"
          onClick={handleLinkClick}
          className="logo flex flex-col items-start leading-none"
        >
          {pathname === "/" && !showTextLogo ? (
            <Image
              src="/images/icon.png"
              alt="Bindi's Cupcakery"
              width={90}
              height={90}
              className="md:w-[95px] md:h-[85px] w-[65px] h-[60px] transition-opacity duration-300 -translate-y-2 md:translate-y-0"
            />
          ) : (
            <div className="transition-opacity duration-300 -translate-y-10">
              <span className="absolute md:text-[3.8rem] text-[3rem] font-bold text-[#193b6d] transform translate-y-1">
                B
              </span>
              <div className="absolute md:ml-[3.3rem] ml-[2.7rem]">
                <span className=" md:text-[2.7rem] text-[2.1rem] font-semibold text-[#193b6d]">
                  indi&apos;s
                </span>
              </div>
              <div className="absolute md:ml-[3.05rem] ml-[2.5rem] md:mt-[2.4rem] mt-[1.9rem]">
                <span className="md:text-[1.4rem] text-[1.1rem] font-semibold text-[#193b6d]">
                  cupcakery
                </span>
              </div>
            </div>
          )}
        </Link>

        {/* Right side icons */}
        <div className="flex items-center gap-7 max-sm:gap-2 max-sm:scale-85 -translate-y-[1vh]">
          {pathname.startsWith("/products") && (
            <button
              onClick={() => setIsCartOpen(!isCartOpen)}
              className="text-[#193b6d] p-4 max-sm:p-2"
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
            {/* Hamburger Icon */}
            <div className="absolute flex flex-col items-center w-6 max-sm:w-4 -translate-y-0.5">
              {[...Array(3)].map((_, i) => (
                <div
                  key={i}
                  className={`absolute h-[3px] max-sm:h-[2px] w-[24px] max-sm:w-[18px] ${
                    isMenuOpen ? "bg-[#193b6d]" : "bg-[#193b6d]"
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
        className={`fixed inset-0 bg-[#E6F7FF] transition-transform duration-300 z-40 ${
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
              className="bindi font-[pacifico] hover:scale-105 duration-300 text-[#1b3a67]"
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
            <ul className="text-[#2B4C7E] text-6xl font-bold space-y-8">
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
              backgroundColor: "#1f4276",
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
                  backgroundColor: "#1f4276",
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
