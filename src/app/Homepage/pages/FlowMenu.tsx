"use client"
import React from 'react';
import FlowingMenu from "../Effects/FlowingMenu";

interface MenuItem {
  text: string;
}

const FlowMenu = () => {
  const demoItems: MenuItem[] = [
    { text: '🥕 VEGGIE ECSTASY' },
    { text: '🚫 ZERO CHEMICALS' },
    { text: '👵 SOUL RECIPES' },
    { text: '🌱 FARM-TO-BITE' }
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
            NATURE'S FINEST SELECTION
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