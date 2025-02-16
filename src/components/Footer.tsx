"use client";

import React from "react";
import Image from "next/image";
import { Phone, Mail } from "lucide-react";

const Footer = () => {
  return (
    <footer className="relative flex flex-col min-h-[60vh] bg-[#F1F5ED] w-full bottom-0 rounded-t-[40px] overflow-hidden justify-center">
      <div className="flex flex-col md:flex-row justify-between p-8 md:px-20 gap-8 -translate-y-8">
        {/* First Section - Logo and Company Name */}
        <div className="flex flex-row md:flex-col md:w-[40%] items-center justify-center">
          {/* Store Icon */}
          <div className="relative w-32 h-40 -translate-x-5 translate-y-8 md:translate-x-0 md:translate-y-0">
            <div className="absolute top-0 left-0 w-full z-10">
              <Image
                src="/images/icon.png"
                alt="Bindi's Cupcakery Roof"
                width={128}
                height={128}
                className="transform"
              />
            </div>
          </div>

          {/* Company Name and Tagline */}
          <div className="flex flex-col items-center text-center justify-center">
            <h2 className="font-[Ananda] text-[1.8rem] md:text-5xl text-gray-900">
              Bindi&apos;s Cupcakery
            </h2>
            <p className="text-gray-900 font-mono text-[0.9rem] md:text-2xl italic mt-5 hidden md:block">
              &quot;Baked with Love, Egg-Free Always!&quot;
            </p>
            <div className="flex items-center gap-3 mt-3">
              <span className="text-gray-900 font-medium text-lg md:text-xl text-center">
                Cloud Kitchen at Parle Point, Surat
              </span>
            </div>
          </div>
        </div>

        {/* Wrapper for Quick Links and QR Code + Contact */}
        <div className="flex flex-col md:flex-row justify-between w-full md:w-2/3 gap-8">
          {/* Quick Links Section */}
          <div className="flex flex-col items-center md:items-center w-full md:w-1/2 justify-center">
            <h3 className="text-gray-900 text-3xl md:text-4xl font-semibold mb-6 font-serif">
              Quick Links
            </h3>
            <div className="flex flex-col gap-4 md:gap-6 items-center">
              <a
                className="text-gray-900 text-2xl md:text-3xl font-medium hover:underline"
                href=""
              >
                PROFILE
              </a>
              <a
                className="text-gray-900 text-2xl md:text-3xl font-medium hover:underline"
                href=""
              >
                PRODUCTS
              </a>
              <a
                className="text-gray-900 text-2xl md:text-3xl font-medium hover:underline"
                href=""
              >
                ABOUT US
              </a>
            </div>
          </div>

          {/* QR Code and Contact Section */}
          <div className="flex flex-col items-center w-full md:w-1/2 gap-6 justify-center">
            {/* QR Code */}
            <div className="w-36 h-36 p-2">
              <Image
                src="/images/footerQR.png"
                alt="Bindi's Cupcakery Roof"
                width={140}
                height={140}
                className="transform"
              />
            </div>
            <span className="text-gray-900 font-medium text-xl md:text-2xl">
              Scan QR to Order
            </span>

            {/* Contact Info */}
            <div className="flex items-center gap-3">
              <Phone className="w-6 h-6 text-gray-900" />
              <span className="text-gray-900 font-medium text-lg md:text-xl">
                +91-8849130189
              </span>
            </div>
            <div className="flex justify-center gap-6">
              <a href="" className="text-gray-900">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 448 512"
                  className="w-10 h-10"
                >
                  <path
                    fill="currentColor"
                    d="M224.1 141c-63.6 0-114.9 51.3-114.9 114.9s51.3 114.9 114.9 114.9S339 319.5 339 255.9 287.7 141 224.1 141zm0 189.6c-41.1 0-74.7-33.5-74.7-74.7s33.5-74.7 74.7-74.7 74.7 33.5 74.7 74.7-33.6 74.7-74.7 74.7zm146.4-194.3c0 14.9-12 26.8-26.8 26.8-14.9 0-26.8-12-26.8-26.8s12-26.8 26.8-26.8 26.8 12 26.8 26.8zm76.1 27.2c-1.7-35.9-9.9-67.7-36.2-93.9-26.2-26.2-58-34.4-93.9-36.2-37-2.1-147.9-2.1-184.9 0-35.8 1.7-67.6 9.9-93.9 36.1s-34.4 58-36.2 93.9c-2.1 37-2.1 147.9 0 184.9 1.7 35.9 9.9 67.7 36.2 93.9s58 34.4 93.9 36.2c37 2.1 147.9 2.1 184.9 0 35.9-1.7 67.7-9.9 93.9-36.2 26.2-26.2 34.4-58 36.2-93.9 2.1-37 2.1-147.8 0-184.8zM398.8 388c-7.8 19.6-22.9 34.7-42.6 42.6-29.5 11.7-99.5 9-132.1 9s-102.7 2.6-132.1-9c-19.6-7.8-34.7-22.9-42.6-42.6-11.7-29.5-9-99.5-9-132.1s-2.6-102.7 9-132.1c7.8-19.6 22.9-34.7 42.6-42.6 29.5-11.7 99.5-9 132.1-9s102.7-2.6 132.1 9c19.6 7.8 34.7 22.9 42.6 42.6 11.7 29.5 9 99.5 9 132.1s2.7 102.7-9 132.1z"
                  />
                </svg>
              </a>
              <a href="" className="text-gray-900">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 448 512"
                  className="w-10 h-10"
                >
                  <path
                    fill="currentColor"
                    d="M64 32C28.7 32 0 60.7 0 96V416c0 35.3 28.7 64 64 64h98.2V334.2H109.4V256h52.8V222.3c0-87.1 39.4-127.5 125-127.5c16.2 0 44.2 3.2 55.7 6.4V172c-6-.6-16.5-1-29.6-1c-42 0-58.2 15.9-58.2 57.2V256h83.6l-14.4 78.2H255V480H384c35.3 0 64-28.7 64-64V96c0-35.3-28.7-64-64-64H64z"
                  />
                </svg>
              </a>
              <a href="" className="text-gray-900">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 448 512"
                  className="w-10 h-10"
                >
                  <path
                    fill="currentColor"
                    d="M164.9 24.6c-7.7-18.6-28-28.5-47.4-23.2l-88 24C12.1 30.2 0 46 0 64C0 311.4 200.6 512 448 512c18 0 33.8-12.1 38.6-29.5l24-88c5.3-19.4-4.6-39.7-23.2-47.4l-96-40c-16.3-6.8-35.2-2.1-46.3 11.6L304.7 368C234.3 334.7 177.3 277.7 144 207.3L193.3 167c13.7-11.2 18.4-30 11.6-46.3l-40-96z"
                  />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Copyright Section */}
      <div className="bg-[#eeffdc] absolute bottom-0 w-full p-4 mt-8 rounded-t-3xl shadow-[0_-10px_15px_-3px_rgba(0,0,0,0.1)]">
        <div className="flex flex-col md:flex-row justify-between items-center max-w-7xl mx-auto px-4">
          <p className="text-gray-900 text-lg md:text-xl mb-2 md:mb-0">
            &copy; 2025 Bindi&apos;s Cupcakery. All rights reserved.
          </p>
          <p className="text-gray-900 text-lg md:text-xl flex items-center gap-2">
            <Mail className="w-6 h-6" />
            bindis_cupcakery@gmail.com
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
