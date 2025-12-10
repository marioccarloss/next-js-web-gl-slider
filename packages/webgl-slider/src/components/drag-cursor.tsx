"use client"

import type React from "react"
import { useRef, useState, useEffect } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import type { CursorConfig } from "../types"
import { DEFAULT_CURSOR_CONFIG } from "../types"

export interface DragCursorProps {
  /** Reference to the container element */
  containerRef: React.RefObject<HTMLDivElement | null>
  /** Whether the user is currently dragging */
  isDragging: boolean
  /** Cursor configuration options */
  config?: CursorConfig
}

/**
 * Custom drag cursor that follows the mouse within the slider container
 */
export function DragCursor({
  containerRef,
  isDragging,
  config = {},
}: DragCursorProps) {
  const cursorRef = useRef<HTMLDivElement>(null)
  const [isInside, setIsInside] = useState(false)
  const position = useRef({ x: 0, y: 0 })
  const target = useRef({ x: 0, y: 0 })

  // Merge with defaults
  const {
    enabled,
    size,
    color,
    text,
    showArrows,
    textColor,
  } = { ...DEFAULT_CURSOR_CONFIG, ...config }

  useEffect(() => {
    if (!enabled) return

    const container = containerRef.current
    if (!container) return

    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect()
      target.current = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      }
    }

    const handleMouseEnter = () => setIsInside(true)
    const handleMouseLeave = () => setIsInside(false)

    container.addEventListener("mousemove", handleMouseMove)
    container.addEventListener("mouseenter", handleMouseEnter)
    container.addEventListener("mouseleave", handleMouseLeave)

    let animationId: number
    const animate = () => {
      position.current.x += (target.current.x - position.current.x) * 0.12
      position.current.y += (target.current.y - position.current.y) * 0.12

      if (cursorRef.current) {
        cursorRef.current.style.transform = `translate(${position.current.x}px, ${position.current.y}px) translate(-50%, -50%) scale(${isDragging ? 0.75 : 1})`
      }

      animationId = requestAnimationFrame(animate)
    }
    animate()

    return () => {
      container.removeEventListener("mousemove", handleMouseMove)
      container.removeEventListener("mouseenter", handleMouseEnter)
      container.removeEventListener("mouseleave", handleMouseLeave)
      cancelAnimationFrame(animationId)
    }
  }, [containerRef, isDragging, enabled])

  if (!enabled) return null

  return (
    <div
      ref={cursorRef}
      className={`absolute top-0 left-0 z-50 pointer-events-none transition-opacity duration-300 ${isInside ? "opacity-100" : "opacity-0"}`}
    >
      <div
        className={`rounded-full flex items-center justify-center gap-2 transition-transform duration-200 ${isDragging ? "scale-90" : "scale-100"}`}
        style={{
          width: size,
          height: size,
          backgroundColor: color,
        }}
      >
        {showArrows && (
          <ChevronLeft 
            className="w-4 h-4" 
            style={{ color: textColor }}
            strokeWidth={2.5} 
          />
        )}
        <span 
          className="text-[11px] tracking-[0.3em] uppercase font-medium"
          style={{ color: textColor }}
        >
          {text}
        </span>
        {showArrows && (
          <ChevronRight 
            className="w-4 h-4" 
            style={{ color: textColor }}
            strokeWidth={2.5} 
          />
        )}
      </div>
    </div>
  )
}

export default DragCursor
