import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Check, X, AlertCircle } from 'lucide-react'

interface ToastProps {
  message: string
  type?: 'success' | 'error'
  isVisible: boolean
  onClose: () => void
  duration?: number
}

export function Toast({ message, type = 'success', isVisible, onClose, duration = 3000 }: ToastProps) {
  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(onClose, duration)
      return () => clearTimeout(timer)
    }
  }, [isVisible, duration, onClose])

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: -20, x: '-50%' }}
          animate={{ opacity: 1, y: 0, x: '-50%' }}
          exit={{ opacity: 0, y: -20, x: '-50%' }}
          className="fixed top-6 left-1/2 z-[9999] flex items-center gap-3 bg-bg-3 border border-border px-6 py-4 min-w-[300px]"
        >
          {type === 'success' ? (
            <Check className="text-lime shrink-0" size={18} />
          ) : (
            <AlertCircle className="text-red shrink-0" size={18} />
          )}
          <span className="font-body text-sm text-white">{message}</span>
          <button onClick={onClose} className="ml-auto text-muted hover:text-white">
            <X size={16} />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
