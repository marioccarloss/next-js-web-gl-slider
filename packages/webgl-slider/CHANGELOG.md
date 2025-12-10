# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2024-12-06

### Added

- Initial release of `webgl-distortion-slider-workspace`
- `DistortionSlider` main component with full configuration support
- Configurable cursor with `CursorConfig` options (color, size, text, arrows)
- Timing configuration with `TimingConfig` (autoPlay, speed, momentum, easing)
- Theme configuration with `SliderTheme` (background color, gradient)
- Individual component exports: `DragCursor`, `ExploreButton`, `SlideImage`, `SliderScene`
- TypeScript support with full type exports
- Custom render functions for slide content and explore button
- Event callbacks: `onSlideChange`, `onDragStart`, `onDragEnd`
- Touch and drag support for mobile devices
- WebGL shaders with distortion effect
- Infinite carousel loop functionality
