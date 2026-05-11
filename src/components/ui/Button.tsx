import { forwardRef, type ButtonHTMLAttributes } from 'react'
import { motion } from 'framer-motion'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'outline' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  isLoading?: boolean
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'primary', size = 'md', isLoading, children, className = '', disabled, ...props }, ref) => {
    const base = 'font-body font-semibold rounded-none transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center justify-center gap-2'

    const variants = {
      primary: 'bg-lime text-bg hover:bg-white',
      outline: 'border border-white text-white hover:bg-white hover:text-bg',
      ghost: 'text-white hover:text-lime',
    }

    const sizes = {
      sm: 'px-5 py-2.5 text-sm',
      md: 'px-8 py-4',
      lg: 'px-12 py-5 text-lg',
    }

    return (
      <motion.button
        ref={ref}
        whileTap={{ scale: 0.97 }}
        className={`${base} ${variants[variant]} ${sizes[size]} ${className}`}
        disabled={disabled || isLoading}
        {...(props as any)}
      >
        {isLoading ? (
          <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
        ) : children}
      </motion.button>
    )
  }
)

Button.displayName = 'Button'
