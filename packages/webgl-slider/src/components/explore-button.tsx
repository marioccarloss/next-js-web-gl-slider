"use client"

import type React from "react"

export interface ExploreButtonProps {
  /** Additional CSS classes */
  className?: string
  /** Click handler */
  onClick?: () => void
  /** Primary color (CSS color value) */
  color?: string
  /** Hover color (CSS color value) */
  hoverColor?: string
  /** Size variant */
  size?: 'sm' | 'md' | 'lg'
}

const sizeClasses = {
  sm: 'w-10 h-10',
  md: 'w-14 h-14 md:w-16 md:h-16',
  lg: 'w-18 h-18 md:w-20 md:h-20',
}

const paddingClasses = {
  sm: 'p-2.5',
  md: 'p-4 md:p-5',
  lg: 'p-5 md:p-6',
}

/**
 * Animated explore/action button with rotating border
 */
export function ExploreButton({ 
  className = '',
  onClick,
  color = 'rgb(245 158 11)', // amber-500
  hoverColor = 'rgb(251 191 36)', // amber-400
  size = 'md',
}: ExploreButtonProps) {
  return (
    <button
      className={`group relative ${sizeClasses[size]} transition-all duration-300 hover:scale-110 pointer-events-auto ${className}`}
      aria-label="Explore"
      onClick={onClick}
      style={{
        // CSS custom properties for dynamic colors
        '--btn-color': color,
        '--btn-hover-color': hoverColor,
      } as React.CSSProperties}
    >
      {/* Background circle with primary color */}
      <div 
        className="absolute inset-0 rounded-full backdrop-blur-sm transition-all duration-300 group-hover:shadow-lg"
        style={{
          backgroundColor: `color-mix(in srgb, ${color} 90%, transparent)`,
        }}
      />

      {/* Rotating border */}
      <svg viewBox="0 0 120 120" fill="none" className="absolute inset-0 w-full h-full">
        <circle
          cx="60"
          cy="60"
          r="56"
          stroke="rgba(255,255,255,0.4)"
          strokeWidth="1"
          strokeDasharray="8 4"
          fill="none"
          className="origin-center animate-[spin_8s_linear_infinite]"
        />
      </svg>

      {/* Arrow icon */}
      <svg viewBox="0 0 24 24" fill="none" className={`absolute inset-0 w-full h-full ${paddingClasses[size]}`}>
        <path
          d="M7 17L17 7M17 7H9M17 7V15"
          stroke="white"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="transition-transform duration-300 origin-center group-hover:translate-x-[1px] group-hover:-translate-y-[1px]"
        />
      </svg>
    </button>
  )
}

export default ExploreButton
