import type { Meta, StoryObj } from '@storybook/react'
import { ExploreButton } from '../packages/webgl-slider/src'

const meta: Meta<typeof ExploreButton> = {
  title: 'Components/ExploreButton',
  component: ExploreButton,
  parameters: {
    layout: 'centered',
    backgrounds: {
      default: 'dark',
    },
  },
  tags: ['autodocs'],
  argTypes: {
    color: {
      description: 'Primary button color (CSS color value)',
      control: 'color',
    },
    hoverColor: {
      description: 'Hover state color (CSS color value)',
      control: 'color',
    },
    size: {
      description: 'Button size variant',
      control: 'radio',
      options: ['sm', 'md', 'lg'],
    },
    onClick: {
      description: 'Click event handler',
      action: 'clicked',
    },
  },
}

export default meta
type Story = StoryObj<typeof ExploreButton>

/**
 * Default amber/orange button
 */
export const Default: Story = {
  args: {
    size: 'md',
  },
}

/**
 * Small size variant
 */
export const Small: Story = {
  args: {
    size: 'sm',
  },
}

/**
 * Large size variant
 */
export const Large: Story = {
  args: {
    size: 'lg',
  },
}

/**
 * Blue themed button
 */
export const Blue: Story = {
  args: {
    color: 'rgb(59 130 246)',
    hoverColor: 'rgb(96 165 250)',
    size: 'md',
  },
}

/**
 * Green themed button
 */
export const Green: Story = {
  args: {
    color: 'rgb(34 197 94)',
    hoverColor: 'rgb(74 222 128)',
    size: 'md',
  },
}

/**
 * Purple themed button
 */
export const Purple: Story = {
  args: {
    color: 'rgb(168 85 247)',
    hoverColor: 'rgb(192 132 252)',
    size: 'md',
  },
}

/**
 * Pink themed button
 */
export const Pink: Story = {
  args: {
    color: 'rgb(236 72 153)',
    hoverColor: 'rgb(244 114 182)',
    size: 'md',
  },
}
