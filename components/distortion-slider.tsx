"use client"

import { useRef, useEffect } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"

// Vertex shader con distorsión de barril
const vertexShader = `
  precision mediump float;

  attribute vec3 aVertexPosition;
  attribute vec2 aTextureCoord;

  uniform mat4 uMVMatrix;
  uniform mat4 uPMatrix;
  uniform mat4 planeTextureMatrix;

  varying vec3 vVertexPosition;
  varying vec2 vTextureCoord;

  uniform float uEffectValue;

  void main() {
    vec3 vertexPosition = aVertexPosition;
    
    // Distorsión de barril: curva los bordes basándose en la velocidad del drag
    // La función seno crea una curva que es máxima en el centro vertical (y=0) y mínima en los bordes
    vertexPosition.x += sin(((vertexPosition.y + 1.0) / 2.0) * 3.141592) * (sin(uEffectValue / 400.0));

    gl_Position = uPMatrix * uMVMatrix * vec4(vertexPosition, 1.0);

    vVertexPosition = vertexPosition;
    vTextureCoord = (planeTextureMatrix * vec4(aTextureCoord, 0.0, 1.0)).xy;
  }
`

const fragmentShader = `
  precision mediump float;

  varying vec3 vVertexPosition;
  varying vec2 vTextureCoord;

  uniform sampler2D planeTexture;
  uniform float uAlpha;

  void main() {
    vec3 color = texture2D(planeTexture, vTextureCoord).rgb;
    gl_FragColor = vec4(color, uAlpha);
  }
`

interface SlideData {
  id: number
  src: string
  title: string
  location: string
  price: string
}

const PROPERTIES: SlideData[] = [
  {
    id: 1,
    src: "/luxury-modern-villa-with-pool-and-ocean-view-exter.jpg",
    title: "Villa Mediterránea",
    location: "Marbella, España",
    price: "€2,450,000",
  },
  {
    id: 2,
    src: "/penthouse-apartment-city-skyline-sunset-luxury-int.jpg",
    title: "Penthouse Skyline",
    location: "Miami, Florida",
    price: "$4,200,000",
  },
  {
    id: 3,
    src: "/modern-mansion-with-infinity-pool-mountain-view-lu.jpg",
    title: "Mountain Retreat",
    location: "Aspen, Colorado",
    price: "$8,500,000",
  },
  {
    id: 4,
    src: "/beachfront-luxury-home-tropical-palm-trees-modern-.jpg",
    title: "Casa del Mar",
    location: "Tulum, México",
    price: "$3,100,000",
  },
  {
    id: 5,
    src: "/contemporary-glass-house-forest-nature-luxury-home.jpg",
    title: "Forest Glass House",
    location: "Portland, Oregon",
    price: "$2,800,000",
  },
  {
    id: 6,
    src: "/italian-villa-tuscan-countryside-luxury-estate-ext.jpg",
    title: "Villa Toscana",
    location: "Florencia, Italia",
    price: "€5,900,000",
  },
]

export default function DistortionSlider() {
  const containerRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLDivElement>(null)
  const sliderRef = useRef<HTMLDivElement>(null)
  const slidesContainerRef = useRef<HTMLDivElement>(null)
  const slidesRef = useRef<(HTMLDivElement | null)[]>([])
  const planesRef = useRef<any[]>([])
  const curtainsRef = useRef<any>(null)
  const animationRef = useRef<any>(null)
  const draggableRef = useRef<any>(null)
  const stateRef = useRef({
    isDragging: false,
    isThrowing: false,
    currentVelocity: 0,
    slideWidth: 0,
    wrapWidth: 0,
    slideInitialXs: [] as number[],
  })

  useEffect(() => {
    let gsapModule: any
    let ScrollTriggerModule: any
    let DraggableModule: any
    let CurtainsModule: any
    let PlaneModule: any

    const initSlider = async () => {
      // Importar módulos dinámicamente
      const [gsapImport, curtainsImport] = await Promise.all([import("gsap"), import("curtainsjs")])

      gsapModule = gsapImport.gsap || gsapImport.default
      CurtainsModule = curtainsImport.Curtains
      PlaneModule = curtainsImport.Plane

      // Importar plugins de GSAP
      const [ScrollTriggerImport, DraggableImport] = await Promise.all([
        import("gsap/ScrollTrigger"),
        import("gsap/Draggable"),
      ])

      ScrollTriggerModule = ScrollTriggerImport.ScrollTrigger || ScrollTriggerImport.default
      DraggableModule = DraggableImport.Draggable || DraggableImport.default

      gsapModule.registerPlugin(ScrollTriggerModule, DraggableModule)

      if (!canvasRef.current || !sliderRef.current || !slidesContainerRef.current) return

      // Inicializar Curtains
      const curtains = new CurtainsModule({
        container: canvasRef.current,
        pixelRatio: Math.min(1.5, window.devicePixelRatio),
      })

      curtainsRef.current = curtains

      curtains.onError(() => {
        console.warn("Curtains WebGL error")
        if (containerRef.current) {
          containerRef.current.classList.add("no-webgl")
        }
      })

      // Setup slider
      const slides = slidesRef.current.filter(Boolean) as HTMLDivElement[]
      const totalSlides = slides.length
      if (totalSlides === 0) return

      const slideWidth = slides[0].offsetWidth
      const slideHeight = slides[0].offsetHeight
      stateRef.current.slideWidth = slideWidth

      const wrapWidth = totalSlides * slideWidth
      stateRef.current.wrapWidth = wrapWidth

      const wrapProgress = gsapModule.utils.wrap(0, 1)

      // Configurar posiciones iniciales
      gsapModule.set(sliderRef.current, { xPercent: -50 })
      gsapModule.set([sliderRef.current], { height: slideHeight })
      gsapModule.set(slidesContainerRef.current, { left: -slideWidth })

      stateRef.current.slideInitialXs = []

      slides.forEach((slide, i) => {
        const initX = (i + 1) * slideWidth
        stateRef.current.slideInitialXs.push(initX)
        gsapModule.set(slide, {
          x: initX,
          width: slideWidth,
          height: slideHeight,
        })
      })

      // Animación infinita
      const animation = gsapModule.to(slides, {
        repeat: -1,
        duration: totalSlides * 10,
        x: `+=${wrapWidth}`,
        ease: "none",
        modifiers: {
          x: (x: string) => {
            let val = Number.parseFloat(x)
            val = val % wrapWidth
            return `${val}px`
          },
        },
        onUpdate: () => {
          if (planesRef.current.length > 0 && !stateRef.current.isDragging && !stateRef.current.isThrowing) {
            updatePlanesPositions(5)
          }
        },
      })

      animationRef.current = animation

      // Draggable
      const proxy = document.createElement("div")

      const updateProgress = (deltaX: number) => {
        const simpleDragValue = deltaX / wrapWidth
        const currentProgressAnim = animation.progress()
        const endProgress = wrapProgress(currentProgressAnim + simpleDragValue)
        animation.progress(endProgress)

        if (planesRef.current.length > 0) {
          updatePlanesPositions(deltaX)
        }
      }

      const startInertia = () => {
        stateRef.current.isThrowing = true
        const tracker = { v: stateRef.current.currentVelocity }

        gsapModule.to(tracker, {
          v: 0,
          duration: 1,
          ease: "power2.out",
          onUpdate: () => {
            if (Math.abs(tracker.v) > 0.1) {
              updateProgress(tracker.v)
            }
          },
          onComplete: () => {
            stateRef.current.isThrowing = false
            animation.paused(false)
          },
        })
      }

      const draggable = DraggableModule.create(proxy, {
        type: "x",
        trigger: sliderRef.current,
        onPress: () => {
          stateRef.current.isDragging = true
          stateRef.current.isThrowing = false
          animation.paused(true)
        },
        onDrag: function (this: any) {
          stateRef.current.currentVelocity = this.deltaX
          updateProgress(this.deltaX)
        },
        onRelease: () => {
          stateRef.current.isDragging = false
          startInertia()
        },
      })[0]

      draggableRef.current = draggable

      // Crear planes WebGL
      const planeElements = slides.map((slide) => slide.querySelector(".plane-element"))

      const params = {
        vertexShader,
        fragmentShader,
        widthSegments: 10,
        heightSegments: 10,
        alwaysDraw: true,
        uniforms: {
          effectValue: {
            name: "uEffectValue",
            type: "1f",
            value: 0,
          },
          alpha: {
            name: "uAlpha",
            type: "1f",
            value: 1,
          },
        },
      }

      planeElements.forEach((element, i) => {
        if (!element) return
        const plane = new PlaneModule(curtains, element, params)
        planesRef.current.push(plane)

        plane.onReady(() => {
          updatePlanesPositions(0)
          plane.updatePosition()

          if (i === planeElements.length - 1) {
            setTimeout(() => {
              if (containerRef.current) {
                containerRef.current.classList.add("is-planes-loaded")
              }
            }, 100)
          }
        })
      })

      // Función para actualizar posiciones de los planes
      function updatePlanesPositions(deltaX: number) {
        const currentProgress = animation.progress()
        const { wrapWidth, slideWidth, slideInitialXs } = stateRef.current

        planesRef.current.forEach((plane, i) => {
          if (!plane) return

          const startX = slideInitialXs[i]
          const theoreticalX = startX + currentProgress * wrapWidth
          const wrappedX = theoreticalX % wrapWidth
          const shift = wrappedX - startX

          plane.relativeTranslation.x = shift

          // Lerp del efecto de distorsión para suavizar
          const currentVal = plane.uniforms.effectValue.value
          plane.uniforms.effectValue.value = curtains.lerp(currentVal, deltaX, 0.1)
        })
      }
    }

    initSlider()

    return () => {
      if (animationRef.current) {
        animationRef.current.kill()
      }
      if (draggableRef.current) {
        draggableRef.current.kill()
      }
      if (curtainsRef.current) {
        curtainsRef.current.dispose()
      }
    }
  }, [])

  return (
    <section ref={containerRef} className="c-slider-images relative w-full bg-[#0a0a0a] overflow-hidden">
      {/* Canvas WebGL */}
      <div ref={canvasRef} className="fixed top-0 left-0 w-screen h-screen z-[1] pointer-events-none" />

      {/* Header */}
      <div className="relative z-[3] px-8 pt-16 pb-8 md:px-16">
        <p className="text-amber-500 text-sm tracking-[0.3em] uppercase mb-2">Exclusive Properties</p>
        <h2 className="text-white text-4xl md:text-5xl font-light tracking-tight">Discover Luxury Living</h2>
      </div>

      {/* Slider Container */}
      <div className="c-slider-images__box-slider relative z-[2] w-full my-[10vh]">
        {/* Spacer para definir altura */}
        <div
          className="block"
          style={{
            width: "clamp(320px, 47.5vw, 600px)",
            paddingBottom: "56.25%",
          }}
        />

        {/* Slider Track */}
        <div
          ref={sliderRef}
          className="absolute top-0 left-1/2 w-full overflow-visible cursor-grab active:cursor-grabbing touch-pan-y"
        >
          <div ref={slidesContainerRef} className="relative w-full h-auto">
            {PROPERTIES.map((property, i) => (
              <div
                key={property.id}
                ref={(el) => {
                  slidesRef.current[i] = el
                }}
                className="absolute left-0 top-0"
                style={{
                  width: "clamp(320px, 47.5vw, 600px)",
                  paddingBottom: "56.25%",
                }}
              >
                <div className="absolute inset-0 px-3">
                  <div className="plane-element relative w-full h-full overflow-hidden">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={property.src || "/placeholder.svg"}
                      alt={property.title}
                      className="absolute inset-0 w-full h-full object-cover"
                      crossOrigin="anonymous"
                      data-sampler="planeTexture"
                      draggable={false}
                    />
                  </div>

                  {/* Property Info Overlay */}
                  <div className="absolute bottom-0 left-3 right-3 p-6 bg-gradient-to-t from-black/80 via-black/40 to-transparent pointer-events-none">
                    <p className="text-amber-400 text-xs tracking-[0.2em] uppercase mb-1">{property.location}</p>
                    <h3 className="text-white text-xl font-light mb-2">{property.title}</h3>
                    <p className="text-white/80 text-lg font-medium">{property.price}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Drag Button (Center) */}
      <div className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-[100] pointer-events-none">
        <div className="w-24 h-24 md:w-28 md:h-28 rounded-full bg-amber-600 flex items-center justify-center gap-3 shadow-2xl">
          <ChevronLeft className="w-5 h-5 text-white" />
          <span className="text-white text-xs tracking-[0.25em] uppercase font-medium">Drag</span>
          <ChevronRight className="w-5 h-5 text-white" />
        </div>
      </div>

      {/* Hide original images when WebGL is loaded */}
      <style jsx>{`
        .c-slider-images.is-planes-loaded img[data-sampler] {
          opacity: 0;
        }
        .c-slider-images.no-webgl img[data-sampler] {
          opacity: 1;
        }
      `}</style>
    </section>
  )
}
