"use client"

import { useEffect, useState } from "react"

const sections = [
  { id: "hero", label: "Hero" },
  { id: "memory", label: "Memory" },
  { id: "walk", label: "Walk" },
  { id: "art", label: "Art" },
  { id: "stay", label: "Stay" },
]

export function YekkiScrollIndicator() {
  const [active, setActive] = useState("hero")

  useEffect(() => {
    const handleScroll = () => {
      let current = "hero"
      for (const section of sections) {
        const el = document.getElementById(section.id)
        if (el && window.scrollY >= el.offsetTop - 200) {
          current = section.id
        }
      }
      setActive(current)
    }

    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <div className="indicator">
      {sections.map((s) => (
        <a
          key={s.id}
          href={`#${s.id}`}
          className={`indicator-dot ${active === s.id ? "active" : ""}`}
          aria-label={s.label}
        />
      ))}
    </div>
  )
}
