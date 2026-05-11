import { forwardRef, type InputHTMLAttributes } from 'react'
import type { UseFormRegisterReturn } from 'react-hook-form'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  registration?: UseFormRegisterReturn
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, className = '', registration, ...props }, ref) => {
    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label className="font-mono text-label text-muted uppercase">
            {label}
          </label>
        )}
        <input
          ref={ref}
          className={`input-field ${error ? 'border-red' : ''} ${className}`}
          {...registration}
          {...props}
        />
        {error && (
          <span className="font-mono text-micro text-red">{error}</span>
        )}
      </div>
    )
  }
)

Input.displayName = 'Input'
