import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Heart, User } from 'lucide-react'
import { useUIStore } from '@/stores/uiStore'

export function MobileNav() {
  const { isMobileMenuOpen, toggleMobileMenu } = useUIStore()

  return (
    <AnimatePresence>
      {isMobileMenuOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 z-40 lg:hidden"
            onClick={toggleMobileMenu}
          />
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 bottom-0 w-72 bg-bg-2 border-l border-border z-50 lg:hidden"
          >
            <div className="flex items-center justify-between p-6 border-b border-border">
              <span className="font-display text-display-sm text-lime">MAGNUS</span>
              <button onClick={toggleMobileMenu} className="text-muted hover:text-white">
                <X size={20} />
              </button>
            </div>

            <nav className="p-6 flex flex-col gap-4">
              <Link to="/tienda" onClick={toggleMobileMenu} className="font-body text-lg text-white hover:text-lime transition-colors">
                Tienda
              </Link>
              <Link to="/drops" onClick={toggleMobileMenu} className="font-body text-lg text-white hover:text-lime transition-colors">
                Drops
              </Link>
              <Link to="/marcas" onClick={toggleMobileMenu} className="font-body text-lg text-white hover:text-lime transition-colors">
                Marcas
              </Link>
            </nav>

            <div className="p-6 border-t border-border flex gap-4">
              <Link to="/favoritos" onClick={toggleMobileMenu} className="flex items-center gap-2 text-muted hover:text-white transition-colors">
                <Heart size={16} /> Favoritos
              </Link>
              <Link to="/cuenta" onClick={toggleMobileMenu} className="flex items-center gap-2 text-muted hover:text-white transition-colors">
                <User size={16} /> Cuenta
              </Link>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
