'use client';

import { useEffect, useRef } from 'react';
import lottie from 'lottie-web';
import Link from 'next/link';
import RotatingText from './TextEffects/RotatingText';
import DecryptedText from './TextEffects/DecryptedText';

export default function Homepage() {
    const lottieContainer = useRef(null);
    const celebrateContainer = useRef(null);

    useEffect(() => {
        if (lottieContainer.current) {
            lottie.loadAnimation({
                container: lottieContainer.current,
                renderer: 'svg',
                loop: true,
                autoplay: true,
                path: '/lottie/home-cake2.json'
            });
        }
        if (celebrateContainer.current) {
            lottie.loadAnimation({
                container: celebrateContainer.current,
                renderer: 'svg',
                loop: true,
                autoplay: true,
                path: '/lottie/home-celebrate.json'
            });
        }
    }, []);

    return (
        <div className="h-screen bg-[#ef9aaa] text-[#3D1C1A] flex overflow-hidden">
            <div className="w-1/2 flex flex-col justify-center items-start p-12 relative z-10 ml-[3vw]">
                <div className="relative inline-block">
                    <h1 className="font-['Teko'] text-9xl font-bold leading-none text-[#3D1C1A] drop-shadow-lg">
                        BINDI'S
                        <span className="block text-9xl -mt-6 tracking-wide">CUPCAKERY</span>
                    </h1>
                    <div ref={celebrateContainer} className="absolute -top-16 left-64 w-80 h-80 pointer-events-none"></div>
                </div>
                
                <div className="space-y-6 mt-4 mb-10">
                    <div className="text-3xl font-medium max-w-xl leading-tight font-['Quicksand']">
                        <DecryptedText
                            text="Crafting Moments of Pure Bliss, One Cupcake at a Time ✨"
                            speed={80}
                            maxIterations={15}
                            characters="ABCDEFGHIJKLMNOPQRSTUVWXYZ"
                            className="revealed"
                            parentClassName="all-letters"
                            encryptedClassName="encrypted"
                            animateOn="view"
                            revealDirection="start"
                        />
                    </div>
                </div>

                <div className="flex flex-col gap-4">
                    <Link href="#order" className="w-80 text-center bg-[#3D1C1A] text-[#F5E6D3] px-12 py-4 rounded-2xl text-2xl font-bold shadow-lg hover:translate-y-[-3px] hover:shadow-xl transition-all">
                        Order Now 🧁
                    </Link>
                    
                    <div className="inline-block">
                        <RotatingText
                            texts={[
                                '100% Pure Veg',
                                '⭐ Top Rated 4.9',
                                'Premium Quality',
                                'Freshly Baked',
                                'Made with Love'
                            ]}
                            mainClassName="inline-flex px-12 py-4 bg-[#F5E6D3] text-[#3D1C1A] overflow-hidden justify-center rounded-2xl text-2xl font-['Montserrat'] font-semibold whitespace-nowrap"
                            staggerFrom="last"
                            initial={{ y: "100%" }}
                            animate={{ y: 0 }}
                            exit={{ y: "-120%" }}
                            staggerDuration={0.025}
                            splitLevelClassName="overflow-hidden"
                            transition={{ type: "spring", damping: 30, stiffness: 400 }}
                            rotationInterval={3000}
                        />
                    </div>
                </div>
            </div>
            
            <div className="absolute right-[6vw] bottom-2 w-[30%] h-full flex items-center justify-center">
                <div ref={lottieContainer} className="max-w-xl w-full"></div>
            </div>
        </div>
    );
}