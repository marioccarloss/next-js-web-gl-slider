import type { Meta, StoryObj } from '@storybook/react'
import DistortionSlider from '../components/distortion-slider'

/**
 * The DistortionSlider is a WebGL-powered image slider with distortion effects.
 * This component uses Three.js and @react-three/fiber to create smooth,
 * performant animations with a custom drag cursor.
 * 
 * Note: The current implementation has hardcoded slides. The refactored package
 * version (packages/webgl-slider) provides full configuration options but requires
 * React 18 compatibility fixes for @react-three/fiber.
 */
const meta: Meta<typeof DistortionSlider> = {
  title: 'Components/DistortionSlider',
  component: DistortionSlider,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: `
A stunning WebGL-powered image slider with distortion effects for React.

## Features
- 🎨 Custom drag cursor that follows mouse movement
- ⚡ WebGL-powered distortion effects using Three.js shaders
- 📱 Touch and drag support for mobile devices
- 🔄 Auto-play with configurable speed
- 🎯 Smooth momentum-based scrolling

## Future Configuration (in packages/webgl-slider)
The refactored component will support:
- \`slides\`: Array of slide data objects
- \`cursor\`: Custom cursor configuration (color, size, text)
- \`timing\`: Auto-play and animation timing options
- \`theme\`: Background and styling options
        `,
      },
    },
  },
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof DistortionSlider>

/**
 * Default configuration showing the slider with sample real estate images.
 * The slider automatically plays and responds to drag interactions.
 */
export const Default: Story = {
  args: {},
}

/**
 * The slider in a container with reduced height.
 */
export const HalfHeight: Story = {
  name: 'Half Viewport Height',
  decorators: [
    (Story) => (
      <div style={{ height: '50vh' }}>
        <Story />
      </div>
    ),
  ],
}
