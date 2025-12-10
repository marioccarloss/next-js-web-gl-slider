import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'

const _geist = Geist({ subsets: ["latin"] });
const _geistMono = Geist_Mono({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: 'React WebGL Distortion Slider | Beautiful WebGL-Powered Image Carousel',
  description: 'A stunning WebGL-powered image slider with distortion effects for React. Customizable cursor, auto-play, touch support, and TypeScript ready.',
  keywords: ['react', 'webgl', 'slider', 'carousel', 'three.js', 'distortion', 'animation'],
  authors: [{ name: 'Mario Carlos' }],
  openGraph: {
    title: 'React WebGL Distortion Slider',
    description: 'A stunning WebGL-powered image slider with distortion effects for React.',
    type: 'website',
  },
  generator: 'Next.js',
  icons: {
    icon: [
      {
        url: '/icon-light.svg',
        media: '(prefers-color-scheme: light)',
        type: 'image/svg+xml',
      },
      {
        url: '/icon-dark.svg',
        media: '(prefers-color-scheme: dark)',
        type: 'image/svg+xml',
      },
      {
        url: '/icon.svg',
        type: 'image/svg+xml',
      },
    ],
    apple: '/icon.svg',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`font-sans antialiased`}>
        {children}
        <Analytics />
      </body>
    </html>
  )
}
