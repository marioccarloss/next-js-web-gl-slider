import type { Meta, StoryObj } from '@storybook/react'
import { useRef, useState } from 'react'
import { DragCursor } from '../packages/webgl-slider/src'

// Wrapper component to provide containerRef
function DragCursorDemo({ 
  isDragging = false,
  config = {},
}: { 
  isDragging?: boolean
  config?: Parameters<typeof DragCursor>[0]['config']
}) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [dragging, setDragging] = useState(isDragging)

  return (
    <div 
      ref={containerRef}
      className="w-full h-screen bg-[#0a0a0a] relative cursor-none flex items-center justify-center"
      onMouseDown={() => setDragging(true)}
      onMouseUp={() => setDragging(false)}
      onMouseLeave={() => setDragging(false)}
    >
      <DragCursor 
        containerRef={containerRef} 
        isDragging={dragging}
        config={config}
      />
      <p className="text-white/50 text-sm">Move your mouse inside this area</p>
    </div>
  )
}

const meta: Meta<typeof DragCursorDemo> = {
  title: 'Components/DragCursor',
  component: DragCursorDemo,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
  argTypes: {
    config: {
      description: 'Cursor configuration options',
      control: 'object',
    },
  },
}

export default meta
type Story = StoryObj<typeof DragCursorDemo>

/**
 * Default orange cursor
 */
export const Default: Story = {
  args: {
    config: {
      enabled: true,
      color: '#e65c2e',
      size: 112,
      text: 'DRAG',
      showArrows: true,
    },
  },
}

/**
 * Blue cursor with custom text
 */
export const Blue: Story = {
  args: {
    config: {
      enabled: true,
      color: '#3b82f6',
      size: 140,
      text: 'SWIPE',
      showArrows: true,
    },
  },
}

/**
 * Large green cursor
 */
export const LargeGreen: Story = {
  args: {
    config: {
      enabled: true,
      color: '#22c55e',
      size: 160,
      text: 'SLIDE',
      showArrows: true,
    },
  },
}

/**
 * Cursor without arrows
 */
export const NoArrows: Story = {
  args: {
    config: {
      enabled: true,
      color: '#a855f7',
      size: 120,
      text: 'DRAG',
      showArrows: false,
    },
  },
}

/**
 * Small compact cursor
 */
export const Small: Story = {
  args: {
    config: {
      enabled: true,
      color: '#f97316',
      size: 80,
      text: '→',
      showArrows: false,
    },
  },
}
