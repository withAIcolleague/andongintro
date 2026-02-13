"use client"

import { useEffect, useState } from "react"

const slides = [
  "/assets/hero_hahoe.png",
  "/assets/wolyeonggyo.png",
  "/assets/seowon.png",
]

export function HeroSlider() {
  const [current, setCurrent] = useState(0)

  useEffect(() => {
    if (slides.length <= 1) return
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length)
    }, 5000)
    return () => clearInterval(timer)
  }, [])

  return (
    <div className="hero-slider">
      {slides.map((src, i) => (
        <div
          key={src}
          className={`hero-slide ${i === current ? "active" : ""}`}
          style={{ backgroundImage: `url('${src}')` }}
        />
      ))}
    </div>
  )
}
