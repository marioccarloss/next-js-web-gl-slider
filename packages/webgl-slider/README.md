# React WebGL Distortion Slider

A stunning WebGL-powered image slider with distortion effects for React applications. Built with Three.js and @react-three/fiber.

![Demo](https://raw.githubusercontent.com/mariocarloss/react-webgl-distortion-slider/main/demo.gif)

## ✨ Features

- 🎨 **Customizable Cursor** - Configure color, size, text, and visibility
- ⚡ **WebGL Performance** - Smooth 60fps animations powered by Three.js
- 📱 **Touch Support** - Full touch and drag support for mobile devices
- 🔄 **Auto-play Control** - Enable/disable with configurable speed
- 🎯 **TypeScript Ready** - Full TypeScript support with exported types
- 📦 **Tree-shakeable** - Import only what you need
- 🎭 **Custom Overlays** - Render custom content on each slide

## 📦 Installation

```bash
# npm
npm install react-webgl-distortion-slider

# yarn
yarn add react-webgl-distortion-slider

# pnpm
pnpm add react-webgl-distortion-slider
```

### Peer Dependencies

This package requires the following peer dependencies:

```bash
npm install react react-dom three @react-three/fiber @react-three/drei
```

## 🚀 Quick Start

```tsx
import { DistortionSlider } from "react-webgl-distortion-slider";

const slides = [
  {
    id: 1,
    src: "/images/slide-1.jpg",
    title: "Mountain Vista",
    subtitle: "Colorado, USA",
    features: ["4 Bedrooms", "Mountain View", "Ski Access"],
  },
  {
    id: 2,
    src: "/images/slide-2.jpg",
    title: "Ocean Retreat",
    subtitle: "Malibu, California",
    features: ["3 Bedrooms", "Beachfront", "Private Pool"],
  },
];

function App() {
  return (
    <DistortionSlider
      slides={slides}
      timing={{ autoPlay: true }}
      cursor={{ color: "#e65c2e" }}
    />
  );
}
```

## ⚙️ Props

### `DistortionSliderProps`

| Prop                  | Type                             | Default   | Description                    |
| --------------------- | -------------------------------- | --------- | ------------------------------ |
| `slides`              | `SlideData[]`                    | Required  | Array of slide data objects    |
| `cursor`              | `CursorConfig`                   | See below | Custom cursor configuration    |
| `timing`              | `TimingConfig`                   | See below | Timing and animation settings  |
| `theme`               | `SliderTheme`                    | See below | Theme and styling options      |
| `className`           | `string`                         | `""`      | Additional CSS class           |
| `height`              | `string`                         | `"100vh"` | Height of the slider           |
| `cameraFov`           | `number`                         | `45`      | Camera field of view           |
| `showExploreButton`   | `boolean`                        | `true`    | Show default explore button    |
| `onSlideChange`       | `(index, slide) => void`         | -         | Callback on slide change       |
| `onDragStart`         | `() => void`                     | -         | Callback on drag start         |
| `onDragEnd`           | `() => void`                     | -         | Callback on drag end           |
| `renderSlideContent`  | `(slide, position) => ReactNode` | -         | Custom slide content renderer  |
| `renderExploreButton` | `(slide) => ReactNode`           | -         | Custom explore button renderer |

### `SlideData`

```typescript
interface SlideData {
  id: string | number;
  src: string; // Image URL
  title: string;
  subtitle: string;
  features?: string[]; // Optional feature tags
  renderOverlay?: (slide: SlideData) => ReactNode; // Custom overlay
}
```

### `CursorConfig`

```typescript
interface CursorConfig {
  enabled?: boolean; // Show custom cursor (default: true)
  size?: number; // Diameter in px (default: 112)
  color?: string; // Background color (default: '#e65c2e')
  text?: string; // Label text (default: 'DRAG')
  showArrows?: boolean; // Show chevron arrows (default: true)
  textColor?: string; // Text color (default: 'white')
}
```

### `TimingConfig`

```typescript
interface TimingConfig {
  autoPlay?: boolean; // Enable auto-play (default: true)
  autoPlaySpeed?: number; // Speed multiplier (default: 0.00015)
  transitionEasing?: number; // Easing factor 0-1 (default: 0.1)
  momentumDecay?: number; // Momentum decay 0-1 (default: 0.95)
  effectDecay?: number; // Effect decay 0-1 (default: 0.92)
  dragSensitivity?: number; // Drag sensitivity (default: 0.0008)
}
```

### `SliderTheme`

```typescript
interface SliderTheme {
  backgroundColor?: string; // Container bg (default: '#0a0a0a')
  showGradient?: boolean; // Gradient overlay (default: true)
  gradientStrength?: number; // Gradient strength 0-1 (default: 0.8)
}
```

## 🎨 Examples

### Custom Cursor

```tsx
<DistortionSlider
  slides={slides}
  cursor={{
    color: "#3b82f6",
    size: 150,
    text: "SWIPE",
    showArrows: false,
  }}
/>
```

### Disable Auto-play

```tsx
<DistortionSlider
  slides={slides}
  timing={{
    autoPlay: false,
  }}
/>
```

### Fast Auto-play

```tsx
<DistortionSlider
  slides={slides}
  timing={{
    autoPlay: true,
    autoPlaySpeed: 0.0005,
  }}
/>
```

### Custom Slide Content

```tsx
<DistortionSlider
  slides={slides}
  renderSlideContent={(slide, position) => (
    <div className="absolute inset-0 flex items-center justify-center">
      <h2 className="text-4xl text-white">{slide.title}</h2>
    </div>
  )}
/>
```

### Event Callbacks

```tsx
<DistortionSlider
  slides={slides}
  onSlideChange={(index, slide) => {
    console.log("Active slide:", index, slide.title);
  }}
  onDragStart={() => console.log("Drag started")}
  onDragEnd={() => console.log("Drag ended")}
/>
```

## 🔧 Advanced Usage

### Using Individual Components

You can also import and use individual components:

```tsx
import {
  DragCursor,
  ExploreButton
} from 'react-webgl-distortion-slider'

// Use DragCursor in your own slider
<DragCursor
  containerRef={containerRef}
  isDragging={isDragging}
  config={{ color: '#ff0000' }}
/>

// Use ExploreButton standalone
<ExploreButton
  color="rgb(59 130 246)"
  onClick={() => navigate('/details')}
/>
```

### Custom Shaders

For advanced users, you can access and customize the WebGL shaders:

```tsx
import {
  vertexShader,
  createFragmentShader,
} from "react-webgl-distortion-slider";

// Create a fragment shader with custom gradient strength
const customFragment = createFragmentShader(0.5);
```

## 📄 License

MIT © [Mario Carlos](https://github.com/mariocarloss)

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request
