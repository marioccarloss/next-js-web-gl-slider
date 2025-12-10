// Type definitions for WebGL Distortion Slider

/**
 * Data for a single slide in the slider
 */
export interface SlideData {
  /** Unique identifier for the slide */
  id: string | number
  /** Image source URL */
  src: string
  /** Main title displayed on the slide */
  title: string
  /** Subtitle or location displayed below the title */
  subtitle: string
  /** Optional array of feature tags */
  features?: string[]
  /** Optional custom render function for complete overlay control */
  renderOverlay?: (slide: SlideData) => React.ReactNode
}

/**
 * Configuration options for the custom drag cursor
 */
export interface CursorConfig {
  /** Show custom cursor (default: true) */
  enabled?: boolean
  /** Cursor diameter in pixels (default: 112) */
  size?: number
  /** Background color (default: '#e65c2e') */
  color?: string
  /** Cursor label text (default: 'DRAG') */
  text?: string
  /** Show chevron arrows (default: true) */
  showArrows?: boolean
  /** Text color (default: 'white') */
  textColor?: string
}

/**
 * Timing and animation configuration
 */
export interface TimingConfig {
  /** Enable auto-play (default: true) */
  autoPlay?: boolean
  /** Auto-play speed multiplier (default: 0.00015) */
  autoPlaySpeed?: number
  /** Shader effect easing factor 0-1 (default: 0.1) */
  transitionEasing?: number
  /** Momentum decay after drag 0-1 (default: 0.95) */
  momentumDecay?: number
  /** Effect decay factor 0-1 (default: 0.92) */
  effectDecay?: number
  /** Drag sensitivity multiplier (default: 0.0008) */
  dragSensitivity?: number
}

/**
 * Theme configuration for colors and styling
 */
export interface SliderTheme {
  /** Container background color (default: '#0a0a0a') */
  backgroundColor?: string
  /** Gradient overlay enabled (default: true) */
  showGradient?: boolean
  /** Gradient strength 0-1 (default: 0.8) */
  gradientStrength?: number
}

/**
 * Screen position data for slide overlays
 */
export interface SlidePosition {
  x: number
  y: number
  width: number
  height: number
  opacity: number
}

/**
 * Props for the Explore button component
 */
export interface ExploreButtonProps {
  /** Additional CSS classes */
  className?: string
  /** Button click handler */
  onClick?: () => void
  /** Button background color (default: 'amber-500') */
  color?: string
}

/**
 * Main props for the DistortionSlider component
 */
export interface DistortionSliderProps {
  /** Array of slide data to display */
  slides: SlideData[]
  /** Custom cursor configuration */
  cursor?: CursorConfig
  /** Timing and animation settings */
  timing?: TimingConfig
  /** Theme and styling options */
  theme?: SliderTheme
  /** Additional CSS class for the container */
  className?: string
  /** Height of the slider (default: '100vh') */
  height?: string
  /** Camera FOV for WebGL scene (default: 45) */
  cameraFov?: number
  /** Callback when active slide changes */
  onSlideChange?: (index: number, slide: SlideData) => void
  /** Callback when drag interaction starts */
  onDragStart?: () => void
  /** Callback when drag interaction ends */
  onDragEnd?: () => void
  /** Custom render function for slide overlay content */
  renderSlideContent?: (slide: SlideData, position: SlidePosition) => React.ReactNode
  /** Custom render function for explore button */
  renderExploreButton?: (slide: SlideData) => React.ReactNode
  /** Show default explore button (default: true) */
  showExploreButton?: boolean
}

/**
 * Default configuration values
 */
export const DEFAULT_CURSOR_CONFIG: Required<CursorConfig> = {
  enabled: true,
  size: 112,
  color: '#e65c2e',
  text: 'DRAG',
  showArrows: true,
  textColor: 'white',
}

export const DEFAULT_TIMING_CONFIG: Required<TimingConfig> = {
  autoPlay: true,
  autoPlaySpeed: 0.00015,
  transitionEasing: 0.1,
  momentumDecay: 0.95,
  effectDecay: 0.92,
  dragSensitivity: 0.0008,
}

export const DEFAULT_THEME: Required<SliderTheme> = {
  backgroundColor: '#0a0a0a',
  showGradient: true,
  gradientStrength: 0.8,
}
