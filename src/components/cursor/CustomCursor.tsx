'use client'
import { useEffect, useRef } from 'react'
import { motion, useMotionValue, useSpring } from 'framer-motion'

export function CustomCursor() {
  const cursorX = useMotionValue(-100)
  const cursorY = useMotionValue(-100)
  const ringX = useSpring(cursorX, { damping: 20, stiffness: 200 })
  const ringY = useSpring(cursorY, { damping: 20, stiffness: 200 })

  useEffect(() => {
    const move = (e: MouseEvent) => { cursorX.set(e.clientX); cursorY.set(e.clientY) }
    window.addEventListener('mousemove', move)
    return () => window.removeEventListener('mousemove', move)
  }, [])

  return (
    <>
      <motion.div
        className="fixed top-0 left-0 w-2 h-2 bg-lime rounded-full pointer-events-none z-[9999] -translate-x-1/2 -translate-y-1/2 mix-blend-difference"
        style={{ x: cursorX, y: cursorY }}
      />
      <motion.div
        className="fixed top-0 left-0 w-9 h-9 border border-lime rounded-full pointer-events-none z-[9999] -translate-x-1/2 -translate-y-1/2 mix-blend-difference opacity-60"
        style={{ x: ringX, y: ringY }}
      />
    </>
  )
}
