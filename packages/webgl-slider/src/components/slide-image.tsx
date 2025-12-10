"use client"

import { useRef, useMemo } from "react"
import { useFrame, useThree } from "@react-three/fiber"
import { useTexture } from "@react-three/drei"
import * as THREE from "three"
import { vertexShader, fragmentShader } from "../shaders"
import type { SlidePosition } from "../types"

export interface SlideImageProps {
  /** Image source URL */
  src: string
  /** Index of this slide */
  index: number
  /** Total number of slides */
  totalSlides: number
  /** Width of each slide in 3D units */
  slideWidth: number
  /** Reference to the effect value for distortion */
  effectValue: { current: number }
  /** Reference to the current progress */
  progress: { current: number }
  /** Callback to update screen position for overlay */
  onPositionUpdate: (index: number, screenPos: SlidePosition | null) => void
}

/**
 * Individual slide image rendered with WebGL shader effects
 */
export function SlideImage({
  src,
  index,
  totalSlides,
  slideWidth,
  effectValue,
  progress,
  onPositionUpdate,
}: SlideImageProps) {
  const meshRef = useRef<THREE.Mesh>(null)
  const materialRef = useRef<THREE.ShaderMaterial>(null)
  const { camera, size } = useThree()

  const texture = useTexture(src)

  const uniforms = useMemo(
    () => ({
      uTexture: { value: texture },
      uEffectValue: { value: 0 },
      uAlpha: { value: 1 },
    }),
    [texture],
  )

  const height = (slideWidth * 10) / 16

  useFrame(() => {
    if (!meshRef.current || !materialRef.current) return

    const wrapWidth = totalSlides * slideWidth
    const startX = index * slideWidth - (totalSlides * slideWidth) / 2 + slideWidth / 2

    let x = startX + progress.current * wrapWidth
    x = ((x % wrapWidth) + wrapWidth) % wrapWidth
    if (x > wrapWidth / 2) x -= wrapWidth

    meshRef.current.position.x = x

    // Calculate opacity based on distance from center
    const distanceFromCenter = Math.abs(x)
    const opacity = Math.max(0, 1 - distanceFromCenter / (slideWidth * 1.5))

    // Project mesh corners to screen coordinates
    const halfWidth = (slideWidth * 0.95) / 2
    const halfHeight = height / 2

    const bottomLeft = new THREE.Vector3(x - halfWidth, -halfHeight, 0)
    const topRight = new THREE.Vector3(x + halfWidth, halfHeight, 0)

    bottomLeft.project(camera)
    topRight.project(camera)

    // Convert NDC (-1 to 1) to screen pixels
    const screenX = ((bottomLeft.x + 1) / 2) * size.width
    const screenY = ((1 - topRight.y) / 2) * size.height
    const screenWidth = ((topRight.x - bottomLeft.x) / 2) * size.width
    const screenHeight = ((topRight.y - bottomLeft.y) / 2) * size.height

    // Report position if visible
    if (opacity > 0.01) {
      onPositionUpdate(index, {
        x: screenX,
        y: screenY,
        width: screenWidth,
        height: screenHeight,
        opacity,
      })
    } else {
      onPositionUpdate(index, null)
    }

    const currentVal = materialRef.current.uniforms.uEffectValue.value
    materialRef.current.uniforms.uEffectValue.value += (effectValue.current - currentVal) * 0.1
  })

  return (
    <mesh ref={meshRef} position={[0, 0, 0]}>
      <planeGeometry args={[slideWidth * 0.95, height, 32, 32]} />
      <shaderMaterial
        ref={materialRef}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
        transparent
      />
    </mesh>
  )
}

export default SlideImage
