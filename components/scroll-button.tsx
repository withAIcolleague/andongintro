"use client"

import type { ReactNode } from "react"

export function ScrollButton({
  targetId,
  className = "",
  style,
  children,
}: {
  targetId: string
  className?: string
  style?: React.CSSProperties
  children: ReactNode
}) {
  const handleClick = () => {
    const el = document.querySelector(`#${targetId}`)
    el?.scrollIntoView({ behavior: "smooth" })
  }

  return (
    <button className={className} style={style} onClick={handleClick}>
      {children}
    </button>
  )
}
