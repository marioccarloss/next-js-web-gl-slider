import DistortionSlider from "@/components/distortion-slider"

export default function Home() {
  return (
    <main className="min-h-screen bg-[#0a0a0a]">
      {/* Hero Section */}
      <section className="h-[50vh] flex items-center justify-center border-b border-white/10">
        <div className="text-center">
          <p className="text-amber-500 text-sm tracking-[0.4em] uppercase mb-4">Premium Real Estate</p>
          <h1 className="text-white text-5xl md:text-7xl font-light tracking-tight mb-6">Elite Properties</h1>
          <p className="text-white/50 max-w-md mx-auto">
            Curated luxury residences across the world's most prestigious locations
          </p>
        </div>
      </section>

      {/* Distortion Slider Section */}
      <DistortionSlider />

      {/* Footer Section */}
      <section className="h-[30vh] flex items-center justify-center">
        <p className="text-white/30 text-sm tracking-widest uppercase">Scroll to explore more</p>
      </section>
    </main>
  )
}
