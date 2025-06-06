'use client'

import dynamic from 'next/dynamic'

import "./globals.css"

// Create a client-only component for mouse tracking
const MouseFollower = dynamic(() => import('../components/MouseFollower'), { ssr: false });

// Rest of the file content remains the same...
export default function NotFound() {
  return (
    <div>
      <MouseFollower />
      
    </div>
  )
} 