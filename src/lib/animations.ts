import type { Variants } from 'framer-motion'

export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 32 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] } },
}

export const stagger: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12 } },
}

export const slideUp: Variants = {
  hidden: { y: '110%' },
  visible: { y: 0, transition: { duration: 0.9, ease: [0.77, 0, 0.175, 1] } },
}

export const scaleIn: Variants = {
  hidden: { scale: 0.92, opacity: 0 },
  visible: { scale: 1, opacity: 1, transition: { duration: 0.5, ease: 'easeOut' } },
}

export const pageTransition = {
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -8 },
  transition: { duration: 0.3 },
}
