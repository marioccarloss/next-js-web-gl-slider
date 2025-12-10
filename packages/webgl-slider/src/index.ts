// Components
export { DistortionSlider } from './components/distortion-slider'
export { DragCursor } from './components/drag-cursor'
export { ExploreButton } from './components/explore-button'
export { SlideImage } from './components/slide-image'
export { SliderScene } from './components/slider-scene'

// Types
export type {
  SlideData,
  CursorConfig,
  TimingConfig,
  SliderTheme,
  SlidePosition,
  ExploreButtonProps,
  DistortionSliderProps,
} from './types'

// Defaults
export {
  DEFAULT_CURSOR_CONFIG,
  DEFAULT_TIMING_CONFIG,
  DEFAULT_THEME,
} from './types'

// Shaders (for advanced customization)
export { vertexShader, fragmentShader, createFragmentShader } from './shaders'

// Default export
export { DistortionSlider as default } from './components/distortion-slider'
