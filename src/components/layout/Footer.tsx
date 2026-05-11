import { Link } from 'react-router-dom'
import { Globe, ExternalLink, MessageSquareShare } from 'lucide-react'

export function Footer() {
  return (
    <footer className="bg-bg-2 border-t border-border">
      <div className="container-wide py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
          <div>
            <h4 className="font-display text-display-md text-white mb-4">MAGNUS</h4>
            <p className="font-body text-sm text-muted max-w-xs">
              Cultura urbana premium. Sneakers, streetwear y accesorios auténticos.
            </p>
          </div>
          <div>
            <h5 className="font-mono text-label text-lime uppercase mb-4">Shop</h5>
            <div className="flex flex-col gap-2">
              <Link to="/tienda" className="font-body text-sm text-muted hover:text-white transition-colors">Todos los productos</Link>
              <Link to="/drops" className="font-body text-sm text-muted hover:text-white transition-colors">Drops exclusivos</Link>
              <Link to="/marcas" className="font-body text-sm text-muted hover:text-white transition-colors">Marcas</Link>
            </div>
          </div>
          <div>
            <h5 className="font-mono text-label text-lime uppercase mb-4">Ayuda</h5>
            <div className="flex flex-col gap-2">
              <Link to="/envio" className="font-body text-sm text-muted hover:text-white transition-colors">Envío</Link>
              <Link to="/devoluciones" className="font-body text-sm text-muted hover:text-white transition-colors">Devoluciones</Link>
              <Link to="/faq" className="font-body text-sm text-muted hover:text-white transition-colors">FAQ</Link>
              <Link to="/contacto" className="font-body text-sm text-muted hover:text-white transition-colors">Contacto</Link>
            </div>
          </div>
          <div>
            <h5 className="font-mono text-label text-lime uppercase mb-4">Legal</h5>
            <div className="flex flex-col gap-2">
              <Link to="/terminos" className="font-body text-sm text-muted hover:text-white transition-colors">Términos</Link>
              <Link to="/privacidad" className="font-body text-sm text-muted hover:text-white transition-colors">Privacidad</Link>
            </div>
          </div>
        </div>

        <div className="flex flex-col md:flex-row items-center justify-between gap-4 pt-8 border-t border-border">
          <p className="font-body text-xs text-muted">
            &copy; {new Date().getFullYear()} Magnus Store. Todos los derechos reservados.
          </p>
          <div className="flex items-center gap-4">
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="text-muted hover:text-white transition-colors">
              <Globe size={18} />
            </a>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-muted hover:text-white transition-colors">
              <ExternalLink size={18} />
            </a>
            <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className="text-muted hover:text-white transition-colors">
              <MessageSquareShare size={18} />
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
