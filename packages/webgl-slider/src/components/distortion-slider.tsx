"use client"

import type React from "react"
import { useRef, useState, useEffect, useCallback } from "react"
import { Canvas } from "@react-three/fiber"
import { DragCursor } from "./drag-cursor"
import { SliderScene } from "./slider-scene"
import { ExploreButton } from "./explore-button"
import type { 
  DistortionSliderProps, 
  SlideData, 
  SlidePosition,
  CursorConfig,
  TimingConfig,
  SliderTheme,
} from "../types"
import { 
  DEFAULT_CURSOR_CONFIG, 
  DEFAULT_TIMING_CONFIG, 
  DEFAULT_THEME 
} from "../types"

/**
 * WebGL-powered image slider with distortion effects
 * 
 * @example
 * ```tsx
 * <DistortionSlider
 *   slides={[
 *     { id: 1, src: '/image1.jpg', title: 'Title 1', subtitle: 'Subtitle 1' },
 *     { id: 2, src: '/image2.jpg', title: 'Title 2', subtitle: 'Subtitle 2' },
 *   ]}
 *   timing={{ autoPlay: true, autoPlaySpeed: 0.0002 }}
 *   cursor={{ color: '#3b82f6', text: 'SWIPE' }}
 * />
 * ```
 */
export function DistortionSlider({
  slides,
  cursor: cursorConfig = {},
  timing: timingConfig = {},
  theme: themeConfig = {},
  className = "",
  height = "100vh",
  cameraFov = 45,
  onSlideChange,
  onDragStart,
  onDragEnd,
  renderSlideContent,
  renderExploreButton,
  showExploreButton = true,
}: DistortionSliderProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const sliderRef = useRef<HTMLDivElement>(null)
  const [isReady, setIsReady] = useState(false)
  const [isDragging, setIsDragging] = useState(false)
  const [slidePositions, setSlidePositions] = useState<Map<number, SlidePosition>>(new Map())
  const [activeSlideIndex, setActiveSlideIndex] = useState(0)

  // Merge configs with defaults
  const cursor: Required<CursorConfig> = { ...DEFAULT_CURSOR_CONFIG, ...cursorConfig }
  const timing: Required<TimingConfig> = { ...DEFAULT_TIMING_CONFIG, ...timingConfig }
  const theme: Required<SliderTheme> = { ...DEFAULT_THEME, ...themeConfig }

  const effectValue = useRef(0)
  const progress = useRef(0)
  const velocity = useRef(0)
  const isDraggingRef = useRef(false)
  const lastX = useRef(0)
  const lastActiveIndex = useRef(-1)

  const handlePositionUpdate = useCallback(
    (index: number, pos: SlidePosition | null) => {
      setSlidePositions((prev) => {
        const newMap = new Map(prev)
        if (pos) {
          newMap.set(index, pos)
        } else {
          newMap.delete(index)
        }
        return newMap
      })
    },
    [],
  )

  // Track active slide changes
  useEffect(() => {
    // Find slide with highest opacity (most centered)
    let maxOpacity = 0
    let activeIndex = 0
    slidePositions.forEach((pos, index) => {
      if (pos.opacity > maxOpacity) {
        maxOpacity = pos.opacity
        activeIndex = index
      }
    })

    if (activeIndex !== lastActiveIndex.current && maxOpacity > 0.5) {
      lastActiveIndex.current = activeIndex
      setActiveSlideIndex(activeIndex)
      onSlideChange?.(activeIndex, slides[activeIndex])
    }
  }, [slidePositions, slides, onSlideChange])

  // Animation loop
  useEffect(() => {
    let animationId: number

    const animate = () => {
      if (!isDraggingRef.current) {
        if (Math.abs(velocity.current) < 0.0001) {
          // No momentum, apply auto-play if enabled
          if (timing.autoPlay) {
            progress.current += timing.autoPlaySpeed
            // Small effect value for subtle distortion during auto-play
            effectValue.current = 15
          }
        } else {
          // Apply momentum from drag
          progress.current += velocity.current
          velocity.current *= timing.momentumDecay
        }
      }

      // Decay effect value
      effectValue.current *= timing.effectDecay

      animationId = requestAnimationFrame(animate)
    }
    animate()

    return () => cancelAnimationFrame(animationId)
  }, [timing.autoPlay, timing.autoPlaySpeed, timing.momentumDecay, timing.effectDecay])

  const handlePointerDown = useCallback((e: React.PointerEvent) => {
    isDraggingRef.current = true
    setIsDragging(true)
    lastX.current = e.clientX
    velocity.current = 0
    ;(e.target as HTMLElement).setPointerCapture(e.pointerId)
    onDragStart?.()
  }, [onDragStart])

  const handlePointerMove = useCallback((e: React.PointerEvent) => {
    if (!isDraggingRef.current) return

    const deltaX = e.clientX - lastX.current
    lastX.current = e.clientX

    progress.current += deltaX * timing.dragSensitivity
    velocity.current = deltaX * timing.dragSensitivity

    effectValue.current = deltaX * 8
  }, [timing.dragSensitivity])

  const handlePointerUp = useCallback(() => {
    isDraggingRef.current = false
    setIsDragging(false)
    onDragEnd?.()
  }, [onDragEnd])

  // Default slide content renderer
  const defaultRenderSlideContent = (slide: SlideData, _position: SlidePosition) => (
    <>
      {showExploreButton && (
        <div className="absolute top-4 right-4 md:top-6 md:right-6">
          {renderExploreButton ? renderExploreButton(slide) : <ExploreButton />}
        </div>
      )}

      {/* Text content at bottom */}
      <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
        <p className="text-white/60 text-[10px] md:text-xs tracking-[0.25em] uppercase mb-1 md:mb-2">
          {slide.subtitle}
        </p>
        <h3 className="text-white text-xl md:text-2xl lg:text-3xl font-light mb-2 md:mb-3">
          {slide.title}
        </h3>
        {slide.features && slide.features.length > 0 && (
          <div className="flex flex-wrap gap-x-3 gap-y-1">
            {slide.features.map((feature, i) => (
              <span key={i} className="text-white/70 text-xs md:text-sm">
                {feature}
              </span>
            ))}
          </div>
        )}
      </div>
    </>
  )

  return (
    <section 
      ref={containerRef} 
      className={`relative w-full overflow-hidden ${className}`}
      style={{ 
        height,
        backgroundColor: theme.backgroundColor,
      }}
    >
      <DragCursor 
        containerRef={sliderRef} 
        isDragging={isDragging} 
        config={cursor}
      />

      {/* Canvas Three.js */}
      <div
        ref={sliderRef}
        className="absolute inset-0 cursor-none touch-none"
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerLeave={handlePointerUp}
      >
        <Canvas
          camera={{ position: [0, 0, 10], fov: cameraFov }}
          gl={{ antialias: true, alpha: true }}
          onCreated={() => setIsReady(true)}
        >
          <SliderScene 
            slides={slides}
            effectValue={effectValue} 
            progress={progress} 
            onPositionUpdate={handlePositionUpdate} 
          />
        </Canvas>
      </div>

      {/* Overlay content for each slide */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {slides.map((slide, index) => {
          const pos = slidePositions.get(index)
          if (!pos) return null

          // Use custom render function if provided, otherwise use default
          const content = slide.renderOverlay 
            ? slide.renderOverlay(slide)
            : renderSlideContent 
              ? renderSlideContent(slide, pos)
              : defaultRenderSlideContent(slide, pos)

          return (
            <div
              key={slide.id}
              className="absolute"
              style={{
                left: pos.x,
                top: pos.y,
                width: pos.width,
                height: pos.height,
                opacity: pos.opacity,
              }}
            >
              {content}
            </div>
          )
        })}
      </div>

      {/* Loading indicator */}
      {!isReady && (
        <div 
          className="absolute inset-0 flex items-center justify-center z-40"
          style={{ backgroundColor: theme.backgroundColor }}
        >
          <div 
            className="w-8 h-8 border-2 border-t-transparent rounded-full animate-spin"
            style={{ borderColor: cursor.color, borderTopColor: 'transparent' }}
          />
        </div>
      )}
    </section>
  )
}

export default DistortionSlider
