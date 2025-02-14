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
          start: "top 80%",
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
            start: "top 80%",
            end: "bottom 20%",
            toggleActions: "play none none reverse",
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
            start: "top 80%",
            end: "bottom 20%",
            toggleActions: "play none none reverse",
          },
        }
      );
    }
  }, []);

  return (
    <>
      <main className="bg-[#F4EADE] min-h-screen max-w-[100vw]">
        {/* About Us Hero Section */}
        <section className="w-[85%] pt-16 flex justify-center py-10 mx-auto">
          <div className="container mx-auto px-4 translate-y-10 fade-up">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mt-[6vh] text-center md:text-left lg:translate-y-10 drop-shadow-2xl font-ancient">
              About Us
            </h1>
            <div className="flex flex-col-reverse md:flex-row items-center justify-between gap-[2rem] md:gap-[4rem] md:translate-y-10">
              {/* Text Content - Left Side */}
              <div className="md:w-1/2 flex flex-col items-center md:items-start text-center md:text-left xl:-translate-y-[3rem]">
                <p className="text-lg lg:text-2xl md:text-xl text-gray-700 leading-relaxed font-semibold drop-shadow-2xl">
                  Bindi&apos;s Cupcakery was born out of a passion for baking
                  and a commitment to providing high-quality, homemade desserts
                  that everyone can enjoy. Located in the heart of Parle Point,
                  Surat, our cloud kitchen serves as a haven for dessert lovers
                  looking for fresh, natural, and preservative-free goodies.
                </p>

                {/* Responsive Shop Now Button */}
                <Link
                  href="/Products"
                  className="bg-[#fdecd8] text-black px-6 py-3 rounded-full text-lg duration-300 hover:bg-[#fce8d2] shadow-xl hover:shadow-2xl transition-shadow mt-6 
                max-w-[250px] md:w-auto md:inline-block mx-auto md:mx-0 font-mono"
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
      <section className="py-16 bg-[#EDF6F5]">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16 mt-12 mx-5">
            <h2 className="text-4xl font-bold text-amber-700 mb-4 font-ancient">
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
                <p className="text-gray-700">{promise.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      <div className="w-full flex justify-center mb-8 fade-up">
        <Image
          src="/images/about-section.png"
          alt="Bindi's Cupcakery aboutus"
          height={1080}
          width={1080}
          className="relative w-full max-w-full h-auto md:scale-x-100 md:-translate-y-[10vh] -z-10 object-cover"
        />
      </div>
      <section className="bg-white md:mx-8 mb-10">
        <div className="container mx-auto max-w-6xl">
          <div className="flex flex-col md:flex-row gap-12 items-center bg-[#EDF6F5] p-10 md:rounded-3xl shadow-2xl feedback-form">
            {/* Left side - Text content */}
            <div className="md:w-1/2">
              <h2 className="text-4xl md:text-5xl font-serif mb-6">
                REACH OUT AND LET&apos;S CONNECT!
              </h2>
              <p className="text-lg text-gray-700 leading-relaxed font-ancient">
                Drop us a message, and let&apos;s start a conversation about
                your experience with our desserts. We value your feedback and
                are always looking to improve.
              </p>
            </div>

            {/* Right side - Form */}
            <div className="md:w-1/2 w-full">
              <UserReviewForm />
            </div>
          </div>
        </div>
      </section>
      <section className="mb:py-[15vh] py-[6vh] bg-[#EDF6F5] md:mt-[15vh] border-t-0 rounded-t-xl md:rounded-t-[4rem] fade-up">
        <div className="container mx-auto max-w-6xl px-8">
          <div className="flex flex-col md:flex-row gap-8">
            {/* Left side - Map */}
            <div className="md:w-[60vw] h-[35vh] md:h-[63vh]">
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
            <div className="md:w-1/2 bg-[#F6F5F5] p-8 rounded-2xl shadow-lg contact-info">
              <h2 className="text-3xl font-bold text-amber-700 mb-6 font-ancient">
                Contact Information
              </h2>

              <div className="space-y-6">
                {/* Address */}
                <div className="flex items-start gap-4">
                  <MapPin className="w-6 h-6 text-amber-700 mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold text-lg text-gray-800 mb-2 font-ancient">
                      Our Location
                    </h3>
                    <p className="text-gray-600 leading-relaxed">
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
                  <Phone className="w-6 h-6 text-amber-700 mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold text-lg text-gray-800 mb-2 font-ancient">
                      Phone
                    </h3>
                    <p className="text-gray-600">
                      <a
                        href="tel:+919876543210"
                        className="hover:text-amber-700 transition-colors"
                      >
                        +91 8849130189
                      </a>
                    </p>
                  </div>
                </div>

                {/* Email */}
                <div className="flex items-start gap-4">
                  <Mail className="w-6 h-6 text-amber-700 mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold text-lg text-gray-800 mb-2 font-ancient">
                      Email
                    </h3>
                    <p className="text-gray-600">
                      <a
                        href="mailto:info@bindiscupcakery.com"
                        className="hover:text-amber-700 transition-colors"
                      >
                        bindis_cupcakery@gmail.com
                      </a>
                    </p>
                  </div>
                </div>

                {/* Business Hours */}
                <div className="mt-8 pt-6 border-t border-amber-700">
                  <h3 className="font-semibold text-lg text-gray-800 mb-3 font-ancient">
                    Business Hours
                  </h3>
                  <div className="space-y-2 text-gray-600">
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
