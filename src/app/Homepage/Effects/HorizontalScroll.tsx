"use client"

import { useRef, useEffect } from "react"
import { motion } from "framer-motion"

const flavors = [
  { name: "Berry Blast", color: "bg-red-200" },
  { name: "Vanilla Dream", color: "bg-amber-100" },
  { name: "Chocolate Delight", color: "bg-amber-900" },
  { name: "Mint Fresh", color: "bg-green-200" },
  { name: "Caramel Swirl", color: "bg-amber-600" },
  { name: "Strawberry Fields", color: "bg-pink-300" },
  { name: "Blueberry Heaven", color: "bg-blue-300" },
  { name: "Mango Tango", color: "bg-yellow-400" },
]

export default function HorizontalScroll() {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const element = containerRef.current
    if (!element) return

    const onWheel = (e: WheelEvent) => {
      if (e.deltaY == 0) return
      e.preventDefault()
      element.scrollTo({
        left: element.scrollLeft + e.deltaY,
        behavior: "smooth",
      })
    }

    element.addEventListener("wheel", onWheel)
    return () => element.removeEventListener("wheel", onWheel)
  }, [])

  return (
    <div className="w-full h-screen bg-cream overflow-hidden">
      <div
        ref={containerRef}
        className="flex overflow-x-auto scrollbar-hide py-20 px-10 gap-8"
        style={{
          scrollSnapType: "x mandatory",
          WebkitOverflowScrolling: "touch",
        }}
      >
        {flavors.map((flavor, index) => (
          <motion.div
            key={flavor.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="flex-none w-[300px] h-[400px] rounded-2xl"
            style={{
              scrollSnapAlign: "center",
            }}
          >
            <div className={`w-full h-full ${flavor.color} rounded-2xl shadow-lg flex items-center justify-center`}>
              <h3 className="text-2xl font-bold text-gray-800">{flavor.name}</h3>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}

