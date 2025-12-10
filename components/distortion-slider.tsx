"use client"

import type React from "react"
import { useRef, useState, useMemo, useEffect, useCallback } from "react"
import { Canvas, useFrame, useThree } from "@react-three/fiber"
import { useTexture } from "@react-three/drei"
import * as THREE from "three"
import { ChevronLeft, ChevronRight } from "lucide-react"

const vertexShader = `
  varying vec2 vUv;
  uniform float uEffectValue;

  void main() {
    vUv = uv;
    
    vec3 pos = position;
    pos.x += sin(uv.y * 3.141592) * (sin(uEffectValue / 400.0));
    
    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
  }
`

const fragmentShader = `
  varying vec2 vUv;
  uniform sampler2D uTexture;
  uniform float uAlpha;

  void main() {
    vec4 color = texture2D(uTexture, vUv);
    
    // Gradient oscuro en la parte inferior (0.0 = bottom, 1.0 = top)
    float gradientStart = 0.0;
    float gradientEnd = 0.5;
    float gradientStrength = smoothstep(gradientEnd, gradientStart, vUv.y);
    
    // Mezclar con negro en la parte inferior
    vec3 finalColor = mix(color.rgb, color.rgb * 0.3, gradientStrength * 0.8);
    
    gl_FragColor = vec4(finalColor, color.a * uAlpha);
  }
`

interface SlideData {
  id: number
  src: string
  title: string
  subtitle: string
  features: string[]
}

const PROPERTIES: SlideData[] = [
  {
    id: 1,
    src: "/luxury-modern-villa-with-pool-and-ocean-view-exter.jpg",
    title: "Villa Mediterránea",
    subtitle: "Marbella, España",
    features: ["5 Bedrooms", "Ocean View", "Private Pool"],
  },
  {
    id: 2,
    src: "/penthouse-apartment-city-skyline-sunset-luxury-int.jpg",
    title: "Penthouse Skyline",
    subtitle: "Miami, Florida",
    features: ["3 Bedrooms", "City View", "Rooftop Terrace"],
  },
  {
    id: 3,
    src: "/modern-mansion-with-infinity-pool-mountain-view-lu.jpg",
    title: "Mountain Retreat",
    subtitle: "Aspen, Colorado",
    features: ["6 Bedrooms", "Ski Access", "Wine Cellar"],
  },
  {
    id: 4,
    src: "/beachfront-luxury-home-tropical-palm-trees-modern-.jpg",
    title: "Casa del Mar",
    subtitle: "Tulum, México",
    features: ["4 Bedrooms", "Beachfront", "Jungle Garden"],
  },
  {
    id: 5,
    src: "/contemporary-glass-house-forest-nature-luxury-home.jpg",
    title: "Forest Glass House",
    subtitle: "Portland, Oregon",
    features: ["4 Bedrooms", "Floor-to-ceiling Glass", "Smart Home"],
  },
  {
    id: 6,
    src: "/italian-villa-tuscan-countryside-luxury-estate-ext.jpg",
    title: "Villa Toscana",
    subtitle: "Florencia, Italia",
    features: ["8 Bedrooms", "Vineyard", "Historic Estate"],
  },
]

// Cursor DRAG que sigue al mouse
function DragCursor({
  containerRef,
  isDragging,
}: {
  containerRef: React.RefObject<HTMLDivElement | null>
  isDragging: boolean
}) {
  const cursorRef = useRef<HTMLDivElement>(null)
  const [isInside, setIsInside] = useState(false)
  const position = useRef({ x: 0, y: 0 })
  const target = useRef({ x: 0, y: 0 })

  useEffect(() => {
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
  }, [containerRef, isDragging])

  return (
    <div
      ref={cursorRef}
      className={`absolute top-0 left-0 z-50 pointer-events-none transition-opacity duration-300 ${isInside ? "opacity-100" : "opacity-0"}`}
    >
      <div
        className={`w-28 h-28 rounded-full bg-[#e65c2e] flex items-center justify-center gap-2 transition-transform duration-200 ${isDragging ? "scale-90" : "scale-100"}`}
      >
        <ChevronLeft className="w-4 h-4 text-white" strokeWidth={2.5} />
        <span className="text-white text-[11px] tracking-[0.3em] uppercase font-medium">Drag</span>
        <ChevronRight className="w-4 h-4 text-white" strokeWidth={2.5} />
      </div>
    </div>
  )
}

function SlideImage({
  src,
  index,
  totalSlides,
  slideWidth,
  effectValue,
  progress,
  onPositionUpdate,
}: {
  src: string
  index: number
  totalSlides: number
  slideWidth: number
  effectValue: { current: number }
  progress: { current: number }
  onPositionUpdate: (
    index: number,
    screenPos: { x: number; y: number; width: number; height: number; opacity: number } | null,
  ) => void
}) {
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

    // Calcular opacidad basada en distancia al centro
    const distanceFromCenter = Math.abs(x)
    const opacity = Math.max(0, 1 - distanceFromCenter / (slideWidth * 1.5))

    // Proyectar las esquinas del mesh a coordenadas de pantalla
    const halfWidth = (slideWidth * 0.95) / 2
    const halfHeight = height / 2

    // Esquina inferior izquierda y superior derecha
    const bottomLeft = new THREE.Vector3(x - halfWidth, -halfHeight, 0)
    const topRight = new THREE.Vector3(x + halfWidth, halfHeight, 0)

    bottomLeft.project(camera)
    topRight.project(camera)

    // Convertir NDC (-1 a 1) a píxeles de pantalla
    const screenX = ((bottomLeft.x + 1) / 2) * size.width
    const screenY = ((1 - topRight.y) / 2) * size.height
    const screenWidth = ((topRight.x - bottomLeft.x) / 2) * size.width
    const screenHeight = ((topRight.y - bottomLeft.y) / 2) * size.height

    // Reportar posición si está visible
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

// SliderScene que contiene los slides
function SliderScene({
  effectValue,
  progress,
  onPositionUpdate,
}: {
  effectValue: { current: number }
  progress: { current: number }
  onPositionUpdate: (
    index: number,
    screenPos: { x: number; y: number; width: number; height: number; opacity: number } | null,
  ) => void
}) {
  const { viewport } = useThree()
  const slideWidth = Math.min(viewport.width * 0.5, 6)

  return (
    <>
      {PROPERTIES.map((property, i) => (
        <SlideImage
          key={property.id}
          src={property.src}
          index={i}
          totalSlides={PROPERTIES.length}
          slideWidth={slideWidth}
          effectValue={effectValue}
          progress={progress}
          onPositionUpdate={onPositionUpdate}
        />
      ))}
    </>
  )
}

function ExploreButton({ className }: { className?: string }) {
  return (
    <button
      className={`group relative w-14 h-14 md:w-16 md:h-16 transition-all duration-300 hover:scale-110 pointer-events-auto ${className}`}
      aria-label="Explore property"
    >
      {/* Background circle with primary color */}
      <div className="absolute inset-0 rounded-full bg-amber-500/90 backdrop-blur-sm transition-all duration-300 group-hover:bg-amber-400 group-hover:shadow-lg group-hover:shadow-amber-500/30" />

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
      <svg viewBox="0 0 24 24" fill="none" className="absolute inset-0 w-full h-full p-4 md:p-5">
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

export default function DistortionSlider() {
  const containerRef = useRef<HTMLDivElement>(null)
  const sliderRef = useRef<HTMLDivElement>(null)
  const [isReady, setIsReady] = useState(false)
  const [isDragging, setIsDragging] = useState(false)
  const [slidePositions, setSlidePositions] = useState<
    Map<number, { x: number; y: number; width: number; height: number; opacity: number }>
  >(new Map())

  const effectValue = useRef(0)
  const progress = useRef(0)
  const velocity = useRef(0)
  const isDraggingRef = useRef(false)
  const lastX = useRef(0)
  const autoPlaySpeed = 0.00015

  const handlePositionUpdate = useCallback(
    (index: number, pos: { x: number; y: number; width: number; height: number; opacity: number } | null) => {
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

  useEffect(() => {
    let animationId: number

    const animate = () => {
      if (!isDraggingRef.current) {
        if (Math.abs(velocity.current) < 0.0001) {
          // No momentum, apply auto-play
          progress.current += autoPlaySpeed
          // Small effect value for subtle distortion during auto-play
          effectValue.current = 15
        } else {
          // Apply momentum from drag
          progress.current += velocity.current
          velocity.current *= 0.95
        }
      }

      // Decay effect value
      effectValue.current *= 0.92

      animationId = requestAnimationFrame(animate)
    }
    animate()

    return () => cancelAnimationFrame(animationId)
  }, [])

  const handlePointerDown = useCallback((e: React.PointerEvent) => {
    isDraggingRef.current = true
    setIsDragging(true)
    lastX.current = e.clientX
    velocity.current = 0
    ;(e.target as HTMLElement).setPointerCapture(e.pointerId)
  }, [])

  const handlePointerMove = useCallback((e: React.PointerEvent) => {
    if (!isDraggingRef.current) return

    const deltaX = e.clientX - lastX.current
    lastX.current = e.clientX

    const dragSensitivity = 0.0008
    progress.current += deltaX * dragSensitivity
    velocity.current = deltaX * dragSensitivity

    effectValue.current = deltaX * 8
  }, [])

  const handlePointerUp = useCallback(() => {
    isDraggingRef.current = false
    setIsDragging(false)
  }, [])

  return (
    <section ref={containerRef} className="relative w-full h-screen bg-[#0a0a0a] overflow-hidden">
      <DragCursor containerRef={sliderRef} isDragging={isDragging} />

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
          camera={{ position: [0, 0, 10], fov: 45 }}
          gl={{ antialias: true, alpha: true }}
          onCreated={() => setIsReady(true)}
        >
          <SliderScene effectValue={effectValue} progress={progress} onPositionUpdate={handlePositionUpdate} />
        </Canvas>
      </div>

      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {PROPERTIES.map((property, index) => {
          const pos = slidePositions.get(index)
          if (!pos) return null

          return (
            <div
              key={property.id}
              className="absolute"
              style={{
                left: pos.x,
                top: pos.y,
                width: pos.width,
                height: pos.height,
                opacity: pos.opacity,
              }}
            >
              <div className="absolute top-4 right-4 md:top-6 md:right-6">
                <ExploreButton />
              </div>

              {/* Contenido del texto en la parte inferior */}
              <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
                <p className="text-white/60 text-[10px] md:text-xs tracking-[0.25em] uppercase mb-1 md:mb-2">
                  {property.subtitle}
                </p>
                <h3 className="text-white text-xl md:text-2xl lg:text-3xl font-light mb-2 md:mb-3">{property.title}</h3>
                <div className="flex flex-wrap gap-x-3 gap-y-1">
                  {property.features.map((feature, i) => (
                    <span key={i} className="text-white/70 text-xs md:text-sm">
                      {feature}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Loading */}
      {!isReady && (
        <div className="absolute inset-0 bg-[#0a0a0a] flex items-center justify-center z-40">
          <div className="w-8 h-8 border-2 border-[#e65c2e] border-t-transparent rounded-full animate-spin" />
        </div>
      )}
    </section>
  )
}
