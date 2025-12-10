# React WebGL Distortion Slider

A stunning, high-performance WebGL-powered image slider component for React applications. Features beautiful distortion effects, smooth animations, and full touch support.

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg?style=for-the-badge)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-Ready-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-18%2B-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)

## ✨ Features

- 🎨 **WebGL Distortion Effects** - Smooth, GPU-accelerated distortion transitions
- 📱 **Touch Support** - Full swipe gesture support for mobile devices
- ⚡ **High Performance** - Optimized Three.js rendering with minimal overhead
- 🎯 **Custom Cursor** - Optional custom circular cursor with smooth animations
- 🔄 **Auto-play** - Configurable automatic slide advancement
- 📐 **Responsive** - Adapts perfectly to any container size
- 🎛️ **Highly Customizable** - Extensive props for fine-tuning behavior and appearance
- 📦 **TypeScript Ready** - Full type definitions included

## 🚀 Quick Start

```bash
npm install webgl-distortion-slider-workspace
```

```tsx
import { WebGLSlider } from "webgl-distortion-slider-workspace";

function App() {
  const images = [
    "/images/slide1.jpg",
    "/images/slide2.jpg",
    "/images/slide3.jpg",
  ];

  return (
    <WebGLSlider
      images={images}
      autoPlay={true}
      interval={5000}
      showCursor={true}
    />
  );
}
```

## 📖 Documentation

For full documentation, examples, and API reference, visit the [live demo](https://next-js-web-gl-slider.vercel.app/).

## 🛠️ Development

```bash
# Install dependencies
pnpm install

# Run development server
pnpm dev

# Build for production
pnpm build

# Run Storybook
pnpm storybook
```

## 📄 License

MIT © [Mario Carlos](https://github.com/marioccarloss)
