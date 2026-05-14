import { Component, ReactNode, ErrorInfo } from 'react'

interface Props {
  children: ReactNode
}

interface State {
  hasError: boolean
  error: Error | null
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Log error to console in development
    if (import.meta.env.DEV) {
      console.error('Error caught by boundary:', error, errorInfo)
    } else {
      // In production, you could send this to an error tracking service
      // Example: Sentry, LogRocket, etc.
      console.error('Error:', error.message)
    }
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-bg flex items-center justify-center p-4">
          <div className="max-w-md w-full text-center">
            <div className="mb-6">
              <div className="text-6xl mb-4">⚠️</div>
              <h1 className="font-display text-display-lg text-white mb-2">
                Algo salió mal
              </h1>
              <p className="font-body text-muted mb-4">
                Parece que encontramos un error inesperado. Por favor, intenta recargar la página.
              </p>
              {import.meta.env.DEV && this.state.error && (
                <div className="mt-4 p-4 bg-red-900/20 border border-red-700 rounded text-left text-xs text-red-200 font-mono overflow-auto max-h-32">
                  {this.state.error.message}
                </div>
              )}
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => window.location.reload()}
                className="flex-1 px-4 py-2 bg-lime text-bg rounded font-body text-sm font-semibold hover:bg-opacity-90 transition-all"
              >
                Recargar página
              </button>
              <button
                onClick={() => window.location.href = '/'}
                className="flex-1 px-4 py-2 bg-bg-3 border border-border text-white rounded font-body text-sm font-semibold hover:bg-bg-2 transition-all"
              >
                Ir al inicio
              </button>
            </div>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}
