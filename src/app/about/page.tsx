"use client";

import React, { useEffect } from "react";
import { MoveUpRight } from "lucide-react";
import Image from "next/image";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import Link from "next/link";

import { Phone, Mail, MapPin } from "lucide-react";
import { Banknote, Award } from "lucide-react";
import UserReviewForm from "@/components/UserReviewForm";

export default function About() {
  const promises = [
    {
      icon: <p className="text-5xl pb-1.5">🎂</p>,
      title: "AUTHENTIC RECIPES",
      description:
        "Our products are based on traditional home-style recipes, using fresh ingredients.",
    },
    {
      icon: <p className="text-5xl pb-1.5">❤️</p>,
      title: "BAKED WITH LOVE",
      description:
        "Our passion for baking is poured into every recipe, serving smiles on a plate everyday.",
    },
    {
      icon: <Banknote className="w-14 h-14 text-rose-500" />,
      title: "HONESTLY PRICED",
      description:
        "We constantly strive to offer the best products at the right prices.",
    },
    {
      icon: <Award className="w-14 h-14 text-rose-500" />,
      title: "COMMITTED TO QUALITY",
      description:
        "From our ingredients to our kitchen operations & guest services, we always prioritize quality.",
    },
  ];

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const fadeUpElements = document.querySelectorAll(".fade-up");
    fadeUpElements.forEach((element) => {
      gsap.fromTo(
        element,
        { opacity: 0, y: 50 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          scrollTrigger: {
            trigger: element,
            start: "top 80%",
            end: "bottom 20%",
            toggleActions: "play none none reverse",
          },
        }
      );
    });

    const promiseElements = document.querySelectorAll(".promise");
    gsap.fromTo(
      promiseElements,
      { opacity: 0, y: 50, scale: 0.8 },
      {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 1,
        stagger: 0.2,
        scrollTrigger: {
          trigger: promiseElements,
          start: "top 70%",
          end: "bottom 20%",
          toggleActions: "play none none reverse",
        },
      }
    );

    const feedbackForm = document.querySelector(".feedback-form");
    if (feedbackForm) {
      gsap.fromTo(
        feedbackForm,
        { opacity: 0, y: 50, scale: 0.8 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 1,
          scrollTrigger: {
            trigger: feedbackForm,
            start: "top 90%",
            end: "bottom 20%",
            toggleActions: "play none none reverse",
            onEnter: () => ScrollTrigger.refresh(),
          },
        }
      );
    }

    const contactInfo = document.querySelector(".contact-info");
    if (contactInfo) {
      gsap.fromTo(
        contactInfo,
        { opacity: 0, x: 50 },
        {
          opacity: 1,
          x: 0,
          duration: 1,
          scrollTrigger: {
            trigger: contactInfo,
            start: "top 70%",
            end: "bottom 20%",
            toggleActions: "play none none reverse",
            onEnter: () => ScrollTrigger.refresh(),
          },
        }
      );
    }

    ScrollTrigger.refresh();
  }, []);

  return (
    <>
      <main className="bg-[#FFF0F8]  max-w-full overflow-hidden ">
        {/* About Us Hero Section */}
        <section className="w-[85%] pt-16 flex justify-center py-10 mx-auto overflow-hidden">
          <div className="container mx-auto px-4 translate-y-10 fade-up">
            <h1
              className="text-7xl md:text-8xl text-gray-800 mt-[6vh] text-center md:text-left lg:translate-y-10 drop-shadow-2xl"
              style={{ fontFamily: "Barlow Condensed, sans-serif" }}
            >
              About Us
            </h1>
            <div className="flex flex-col-reverse md:flex-row items-center justify-between gap-[2rem] md:gap-[4rem] md:translate-y-10">
              {/* Text Content - Left Side */}
              <div className="md:w-1/2 flex flex-col items-center md:items-start text-center md:text-left xl:-translate-y-[3rem]">
                <p className="text-lg lg:text-2xl md:text-xl text-gray-700 leading-relaxed font-semibold drop-shadow-2xl font-ancient">
                  Bindi&apos;s Cupcakery was born out of a passion for baking
                  and a commitment to providing high-quality, homemade desserts
                  that everyone can enjoy. Located in the heart of Parle Point,
                  Surat, our cloud kitchen serves as a haven for dessert lovers
                  looking for fresh, natural, and preservative-free goodies.
                </p>

                {/* Responsive Shop Now Button */}
                <Link
                  href="/products"
                  className="bg-[#fee5f2] text-black px-6 py-3 rounded-full text-lg duration-300 hover:bg-[#fbd4e9] shadow-xl hover:shadow-2xl transition-shadow mt-6 
                max-w-[250px] md:w-auto md:inline-block mx-auto md:mx-0 font-semibold font-ancient"
                >
                  Shop Now
                  <MoveUpRight className="h-5 w-5 inline-block translate-x-2 -translate-y-0.5" />
                </Link>
              </div>

              {/* Image - Right Side */}
              <div className="md:w-1/2 flex justify-center">
                <Image
                  src="/images/AboutUs_header.png"
                  alt="Bindi's Cupcakery aboutus"
                  height={1080}
                  width={1080}
                  className="w-[75%] md:w-[100%] h-auto md:-translate-y-[6rem]"
                />
              </div>
            </div>
          </div>
        </section>
      </main>
      <div className="absolute left-0 w-full h-32 bg-gradient-to-b from-[#FFF0F8] to-[#F4EADE]" />
      <section className="py-10 bg-[#F4EADE] overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16 mt-12 mx-5">
            <h2
              className="text-amber-700 mb-4 pt-6 text-7xl md:text-8xl font-serif"
              style={{ fontFamily: "Barlow Condensed, sans-serif" }}
            >
              Our Promise
            </h2>
            <div className="flex justify-center">
              <div className="flex gap-2">
                {[...Array(4)].map((_, i) => (
                  <div
                    key={i}
                    className="w-2 h-2 bg-blue-200 transform rotate-45"
                  />
                ))}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {promises.map((promise, index) => (
              <div
                key={index}
                className="flex flex-col items-center text-center promise gap-2"
              >
                <div className="mb-4">{promise.icon}</div>
                <h3 className=" font-bold text-amber-700 mb-2 font-ancient text-xl">
                  {promise.title}
                </h3>
                <p className="text-gray-700 font-ancient font-semibold">
                  {promise.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
      <div className="w-full flex justify-center mb-5 overflow-hidden">
        <Image
          src="/images/about-section.png"
          alt="Bindi's Cupcakery aboutus"
          height={1080}
          width={1080}
          className="relative w-full max-w-full h-auto md:scale-x-100 md:-translate-y-[10vh] -z-10 object-cover"
        />
      </div>
      <section className="bg-white md:mx-8 mb-5  md:-translate-y-[7vh]">
        <div className="container mx-auto max-w-6xl ">
          <div className="flex flex-col md:flex-row gap-12 items-center bg-[#FFF0F8] p-10 md:rounded-3xl shadow-2xl feedback-form">
            {/* Left side - Text content */}
            <div className="md:w-1/2">
              <h2 className="text-4xl md:text-5xl  font-serif mb-14">
                SWEETEN OUR STORY WITH YOUR THOUGHTS
              </h2>
              <p className="text-lg text-gray-700 leading-relaxed font-semibold font-ancient">
                Every delightful review adds a special ingredient to our
                bakery&apos;s journey. Share how our desserts made your day a
                little sweeter, and help future guests discover their next
                favorite treat. Your thoughtful feedback helps us perfect our
                craft with each passing day.
              </p>
            </div>

            {/* Right side - Form */}
            <div className="md:w-1/2 w-full">
              <UserReviewForm />
            </div>
          </div>
        </div>
      </section>
      <section className="mb:py-[15vh] py-[6vh] bg-[#FFF0F8] md:mt-[8vh] border-t-0 rounded-t-xl md:rounded-t-[4rem] fade-up overflow-hidden">
        <div className="container mx-auto max-w-6xl px-8">
          <div className="flex flex-col md:flex-row gap-8">
            {/* Left side - Map */}
            <div className="md:w-[60vw] h-[35vh] md:h-[63vh] overflow-hidden">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3720.564594000922!2d72.78889622526047!3d21.169719080515115!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3be04de625fbddad%3A0xce09f32af9cfbeb4!2sParle%20Point%2C%20City%20Light%20Town%2C%20Athwa%2C%20Surat%2C%20Gujarat%20395007!5e0!3m2!1sen!2sin!4v1739370337983!5m2!1sen!2sin"
                className="w-full h-full rounded-2xl shadow-lg"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>

            {/* Right side - Contact Info */}
            <div className="md:w-1/2 bg-[#F6F5F5] p-8 rounded-2xl shadow-lg contact-info overflow-hidden">
              <h2 className="text-3xl font-bold text-[#c23471] mb-6 font-ancient">
                Contact Information
              </h2>

              <div className="space-y-6">
                {/* Address */}
                <div className="flex items-start gap-4">
                  <MapPin className="w-6 h-6 text-[#c23471] mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold text-xl text-[#c23471] mb-2 font-ancient">
                      Our Location
                    </h3>
                    <p className="text-gray-600 leading-relaxed font-ancient font-semibold">
                      Cloud Kitchen at Parle Point
                      <br />
                      Surat - 395007,
                      <br />
                      Gujarat, India
                    </p>
                  </div>
                </div>

                {/* Phone */}
                <div className="flex items-start gap-4">
                  <Phone className="w-6 h-6 text-[#c23471] mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="text-xl text-[#c23471] mb-2 font-ancient font-semibold">
                      Phone
                    </h3>
                    <p className="text-gray-600">
                      <a
                        href="tel:+918849130189"
                        className="hover:text-[#c23471] transition-colors font-ancient font-semibold"
                      >
                        +91 8849130189
                      </a>
                    </p>
                  </div>
                </div>

                {/* Email */}
                <div className="flex items-start gap-4">
                  <Mail className="w-6 h-6 text-[#c23471] mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="text-xl text-[#c23471] mb-2 font-ancient font-semibold">
                      Email
                    </h3>
                    <p className="text-gray-600">
                      <a
                        href="mailto:bindis_cupcakery@gmail.com"
                        className="hover:text-[#c23471] transition-colors font-ancient font-semibold"
                      >
                        bindis_cupcakery@gmail.com
                      </a>
                    </p>
                  </div>
                </div>

                {/* Business Hours */}
                <div className="mt-8 pt-6 border-t border-[#c23471]">
                  <h3 className="text-xl text-[#c23471] mb-3 font-ancient font-semibold">
                    Business Hours
                  </h3>
                  <div className="space-y-2 text-gray-600 font-ancient font-semibold">
                    <p>Monday - Saturday: 9:00 AM - 8:00 PM</p>
                    <p>Sunday: 10:00 AM - 6:00 PM</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
