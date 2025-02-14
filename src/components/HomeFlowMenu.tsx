"use client"
import React from 'react';
import FlowingMenu from "@/components/Effects/FlowingMenu";

const FlowMenu = () => {
  const demoItems = [
    { link: '#', text: 'Mojave', image: 'https://picsum.photos/600/400?random=1' },
    { link: '#', text: 'Sonoma', image: 'https://picsum.photos/600/400?random=2' },
    { link: '#', text: 'Monterey', image: 'https://picsum.photos/600/400?random=3' },
    { link: '#', text: 'Sequoia', image: 'https://picsum.photos/600/400?random=4' }
  ];

  return (
    <div className="h-screen bg-green-50 flex flex-col">
      <div className="container mx-auto px-4 flex flex-col h-full">
        <div className="pt-12 pb-16 flex-shrink-0">
          <h1 
            className="text-8xl md:text-9xl text-center text-green-900 uppercase tracking-tight leading-none font-black"
            style={{
              fontFamily: 'Barlow Condensed, sans-serif',
            }}
          >
            VEGAN DELIGHT
          </h1>
          <div 
            className="text-xl md:text-2xl text-center mt-4 text-green-800 tracking-wider font-medium"
            style={{
              fontFamily: 'Barlow, sans-serif',
            }}
          >
            NATURE&apos;S FINEST SELECTION
          </div>
        </div>
        <div className="flex-1 h-[calc(100vh-theme('spacing.28')-theme('spacing.16'))]">
          <FlowingMenu items={demoItems} />
        </div>
      </div>
    </div>
  );
};

export default FlowMenu;