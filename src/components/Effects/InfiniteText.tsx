"use client";
import { FC, useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

interface Props {
  text: string;
  speed?: number;
}

const InfiniteText: FC<Props> = ({ text, speed = 0.1 }) => {
  const firstText = useRef<HTMLParagraphElement>(null);
  const secondText = useRef<HTMLParagraphElement>(null);
  const slider = useRef<HTMLDivElement>(null);
  let xPercent = 0;
  const directionRef = useRef(-1); // Use useRef to store direction

  const { contextSafe } = useGSAP();

  const animate = contextSafe(() => {
    if (xPercent < -100) xPercent = 0;
    if (xPercent > 0) xPercent = -100;

    if (firstText.current && secondText.current) {
      gsap.set(firstText.current, { xPercent });
      gsap.set(secondText.current, { xPercent });
    }

    xPercent += speed * directionRef.current; // Use directionRef.current
    requestAnimationFrame(animate);
  });

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    if (slider.current) {
      gsap.to(slider.current, {
        scrollTrigger: {
          trigger: document.documentElement,
          start: 0,
          scrub: 0.35,
          onUpdate: (e) => (directionRef.current = e.direction * -1), // Use directionRef.current
        },
        x: "-=300px",
      });
    }

    requestAnimationFrame(animate);
  }, [animate]);

  return (
    <div className="z-[10] h-[120px] sm:h-[160px] md:h-[200px] w-full">
      <div className="relative flex h-full items-center overflow-hidden bg-[#3D1C1A] text-[#F5E6D3] border-none">
        <div className="absolute">
          <div
            ref={slider}
            className="relative m-0 flex whitespace-nowrap"
          >
            <p
              ref={firstText}
              className="m-0 mr-3 text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black uppercase tracking-tight"
              style={{ fontFamily: 'Barlow Condensed, sans-serif' }}
            >
              {text}
            </p>
            <p
              ref={secondText}
              className="m-0 text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black uppercase tracking-tight"
              style={{ fontFamily: 'Barlow Condensed, sans-serif' }}
            >
              {text}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InfiniteText;