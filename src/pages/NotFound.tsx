import { Link } from 'react-router-dom'
import { useSEO } from '@/hooks/useSEO'

export default function NotFound() {
  useSEO({ title: 'Página no encontrada | Magnus' })

  return (
    <div className="min-h-screen flex items-center justify-center bg-bg">
      <div className="text-center">
        <h1 className="font-display text-display-xl text-lime">404</h1>
        <p className="font-body text-lg text-muted mt-4 mb-8">Esta página no existe o fue movida.</p>
        <Link to="/" className="btn-primary">
          Volver al inicio
        </Link>
      </div>
    </div>
  )
}
