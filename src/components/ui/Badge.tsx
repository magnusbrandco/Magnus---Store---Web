import type { ReactNode } from 'react'

interface BadgeProps {
  variant?: 'default' | 'hot' | 'new' | 'soldout'
  children: ReactNode
  className?: string
}

export function Badge({ variant = 'default', children, className = '' }: BadgeProps) {
  const variants = {
    default: 'bg-white text-bg',
    hot: 'bg-red text-white',
    new: 'bg-lime text-bg',
    soldout: 'bg-muted text-white',
  }

  return (
    <span className={`font-mono text-micro px-2.5 py-1 uppercase tracking-wider ${variants[variant]} ${className}`}>
      {children}
    </span>
  )
}
