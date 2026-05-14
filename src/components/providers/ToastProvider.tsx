import { Toaster } from 'sonner'

export function ToastProvider() {
  return (
    <Toaster
      position="top-right"
      richColors
      theme="dark"
      closeButton
      duration={4000}
      style={{
        '--toast-background': '#0f0f0f',
        '--toast-text-color': '#fff',
        '--toast-border': '1px solid #222',
      } as React.CSSProperties}
    />
  )
}
