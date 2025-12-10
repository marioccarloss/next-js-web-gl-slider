"use client"

import { useState } from "react"
import DistortionSlider from "@/components/distortion-slider"
import { Github, Package, BookOpen, Check, Copy } from "lucide-react"

// Feature card component
function FeatureCard({ icon, title, description }: { icon: string; title: string; description: string }) {
  return (
    <div className="group p-6 rounded-2xl bg-white/5 border border-white/10 hover:border-[#e65c2e]/50 transition-all duration-300 hover:bg-white/[0.07]">
      <div className="text-3xl mb-4">{icon}</div>
      <h3 className="text-white font-medium text-lg mb-2">{title}</h3>
      <p className="text-white/50 text-sm leading-relaxed">{description}</p>
    </div>
  )
}

// Code block component
function CodeBlock({ code }: { code: string }) {
  const [copied, setCopied] = useState(false)

  const handleCopy = () => {
    navigator.clipboard.writeText(code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="relative group">
      <pre className="bg-black/50 border border-white/10 rounded-xl p-4 overflow-x-auto">
        <code className="text-sm text-white/80 font-mono">{code}</code>
      </pre>
      <button
        onClick={handleCopy}
        className="absolute top-3 right-3 p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors opacity-0 group-hover:opacity-100"
        aria-label="Copy code"
      >
        {copied ? (
          <Check className="w-4 h-4 text-green-400" />
        ) : (
          <Copy className="w-4 h-4 text-white/50" />
        )}
      </button>
    </div>
  )
}

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-[#0a0a0a]">
      {/* Hero Section with Slider */}
      <section className="relative h-screen">
        {/* Navigation */}
        <nav className="absolute top-0 left-0 right-0 z-30 p-6 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#e65c2e] to-[#ff8f6b] flex items-center justify-center">
              <span className="text-white font-bold text-sm">DS</span>
            </div>
            <span className="text-white font-medium">Distortion Slider</span>
          </div>
          
          <div className="flex items-center gap-4">
            <a
              href="https://github.com/mariocarloss/react-webgl-distortion-slider"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors text-white/80 text-sm"
            >
              <Github className="w-4 h-4" />
              <span className="hidden sm:inline">GitHub</span>
            </a>
            <a
              href="https://www.npmjs.com/package/react-webgl-distortion-slider"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors text-white/80 text-sm"
            >
              <Package className="w-4 h-4" />
              <span className="hidden sm:inline">npm</span>
            </a>
            <a
              href="/storybook/index.html"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#e65c2e] hover:bg-[#ff7043] transition-colors text-white text-sm font-medium"
            >
              <BookOpen className="w-4 h-4" />
              <span className="hidden sm:inline">Storybook</span>
            </a>
          </div>
        </nav>

        {/* Slider Demo */}
        <DistortionSlider />

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-30 flex flex-col items-center gap-2 animate-bounce">
          <span className="text-white/50 text-xs tracking-widest uppercase">Scroll</span>
          <svg className="w-5 h-5 text-white/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-[#e65c2e] text-sm tracking-[0.3em] uppercase mb-4">Features</p>
            <h2 className="text-white text-4xl md:text-5xl font-light mb-4">
              Everything you need
            </h2>
            <p className="text-white/50 max-w-lg mx-auto">
              A fully-featured WebGL slider with customizable animations, touch support, and TypeScript definitions.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <FeatureCard
              icon="🎨"
              title="Customizable Cursor"
              description="Configure cursor color, size, text label, and arrow visibility to match your brand."
            />
            <FeatureCard
              icon="⚡"
              title="WebGL Performance"
              description="Smooth 60fps animations powered by Three.js and @react-three/fiber."
            />
            <FeatureCard
              icon="📱"
              title="Touch Support"
              description="Full touch and drag support for mobile devices with momentum scrolling."
            />
            <FeatureCard
              icon="🔄"
              title="Auto-play Control"
              description="Enable or disable auto-play with configurable speed and timing options."
            />
            <FeatureCard
              icon="🎯"
              title="TypeScript Ready"
              description="Full TypeScript support with exported types for type-safe development."
            />
            <FeatureCard
              icon="📦"
              title="Tree-shakeable"
              description="Import only what you need. Optimized for minimal bundle size."
            />
          </div>
        </div>
      </section>

      {/* Installation Section */}
      <section className="py-24 px-6 bg-white/[0.02]">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-[#e65c2e] text-sm tracking-[0.3em] uppercase mb-4">Installation</p>
            <h2 className="text-white text-4xl md:text-5xl font-light mb-4">
              Get started in seconds
            </h2>
          </div>

          <div className="space-y-6">
            <div>
              <p className="text-white/60 text-sm mb-3">Install with npm, yarn, or pnpm:</p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <CodeBlock code="npm install react-webgl-distortion-slider" />
                <CodeBlock code="yarn add react-webgl-distortion-slider" />
                <CodeBlock code="pnpm add react-webgl-distortion-slider" />
              </div>
            </div>

            <div>
              <p className="text-white/60 text-sm mb-3">Peer dependencies:</p>
              <CodeBlock code="npm install react react-dom three @react-three/fiber @react-three/drei" />
            </div>

            <div>
              <p className="text-white/60 text-sm mb-3">Basic usage:</p>
              <CodeBlock
                code={`import { DistortionSlider } from 'react-webgl-distortion-slider'

const slides = [
  { id: 1, src: '/image1.jpg', title: 'Title', subtitle: 'Subtitle' },
  { id: 2, src: '/image2.jpg', title: 'Title', subtitle: 'Subtitle' },
]

function App() {
  return (
    <DistortionSlider
      slides={slides}
      timing={{ autoPlay: true }}
      cursor={{ color: '#e65c2e' }}
    />
  )
}`}
              />
            </div>
          </div>
        </div>
      </section>

      {/* API Reference Section */}
      <section className="py-24 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-[#e65c2e] text-sm tracking-[0.3em] uppercase mb-4">API</p>
            <h2 className="text-white text-4xl md:text-5xl font-light mb-4">
              Configuration Options
            </h2>
          </div>

          <div className="space-y-8">
            {/* Cursor Config */}
            <div className="p-6 rounded-2xl bg-white/5 border border-white/10">
              <h3 className="text-white font-medium text-lg mb-4">CursorConfig</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div className="flex justify-between">
                  <code className="text-[#e65c2e]">enabled</code>
                  <span className="text-white/50">boolean (true)</span>
                </div>
                <div className="flex justify-between">
                  <code className="text-[#e65c2e]">color</code>
                  <span className="text-white/50">string (#e65c2e)</span>
                </div>
                <div className="flex justify-between">
                  <code className="text-[#e65c2e]">size</code>
                  <span className="text-white/50">number (112)</span>
                </div>
                <div className="flex justify-between">
                  <code className="text-[#e65c2e]">text</code>
                  <span className="text-white/50">string (DRAG)</span>
                </div>
                <div className="flex justify-between">
                  <code className="text-[#e65c2e]">showArrows</code>
                  <span className="text-white/50">boolean (true)</span>
                </div>
              </div>
            </div>

            {/* Timing Config */}
            <div className="p-6 rounded-2xl bg-white/5 border border-white/10">
              <h3 className="text-white font-medium text-lg mb-4">TimingConfig</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div className="flex justify-between">
                  <code className="text-[#e65c2e]">autoPlay</code>
                  <span className="text-white/50">boolean (true)</span>
                </div>
                <div className="flex justify-between">
                  <code className="text-[#e65c2e]">autoPlaySpeed</code>
                  <span className="text-white/50">number (0.00015)</span>
                </div>
                <div className="flex justify-between">
                  <code className="text-[#e65c2e]">momentumDecay</code>
                  <span className="text-white/50">number (0.95)</span>
                </div>
                <div className="flex justify-between">
                  <code className="text-[#e65c2e]">dragSensitivity</code>
                  <span className="text-white/50">number (0.0008)</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 border-t border-white/10">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded bg-gradient-to-br from-[#e65c2e] to-[#ff8f6b] flex items-center justify-center">
              <span className="text-white font-bold text-xs">DS</span>
            </div>
            <span className="text-white/60 text-sm">react-webgl-distortion-slider</span>
          </div>

          <div className="flex items-center gap-6">
            <a
              href="https://github.com/mariocarloss/react-webgl-distortion-slider"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white/50 hover:text-white transition-colors text-sm"
            >
              GitHub
            </a>
            <a
              href="https://www.npmjs.com/package/react-webgl-distortion-slider"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white/50 hover:text-white transition-colors text-sm"
            >
              npm
            </a>
            <a
              href="/storybook/index.html"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white/50 hover:text-white transition-colors text-sm"
            >
              Storybook
            </a>
          </div>

          <p className="text-white/30 text-sm">
            MIT © {new Date().getFullYear()} Mario Carlos
          </p>
        </div>
      </footer>
    </main>
  )
}
