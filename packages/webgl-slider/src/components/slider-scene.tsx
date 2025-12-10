"use client"

import { useThree } from "@react-three/fiber"
import { SlideImage } from "./slide-image"
import type { SlideData, SlidePosition } from "../types"

export interface SliderSceneProps {
  /** Array of slide data */
  slides: SlideData[]
  /** Reference to the effect value for distortion */
  effectValue: { current: number }
  /** Reference to the current progress */
  progress: { current: number }
  /** Callback to update screen positions for overlays */
  onPositionUpdate: (index: number, screenPos: SlidePosition | null) => void
}

/**
 * Three.js scene containing all slide images
 */
export function SliderScene({
  slides,
  effectValue,
  progress,
  onPositionUpdate,
}: SliderSceneProps) {
  const { viewport } = useThree()
  const slideWidth = Math.min(viewport.width * 0.5, 6)

  return (
    <>
      {slides.map((slide, i) => (
        <SlideImage
          key={slide.id}
          src={slide.src}
          index={i}
          totalSlides={slides.length}
          slideWidth={slideWidth}
          effectValue={effectValue}
          progress={progress}
          onPositionUpdate={onPositionUpdate}
        />
      ))}
    </>
  )
}

export default SliderScene
