import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Search, ShoppingBag, User, Heart, Menu } from 'lucide-react'
import { useCart } from '@/hooks/useCart'
import { useAuth } from '@/hooks/useAuth'
import { useScroll } from '@/hooks/useScroll'
import { useUIStore } from '@/stores/uiStore'

export function Navbar() {
  const { itemCount, openCart } = useCart()
  const { isAuthenticated } = useAuth()
  const { isScrolled } = useScroll()
  const { toggleMobileMenu, openSearch } = useUIStore()

  return (
    <motion.header
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-500 ${
        isScrolled ? 'bg-bg/95 backdrop-blur-md border-b border-border' : 'bg-transparent'
      }`}
    >
      <nav className="container-wide flex items-center justify-between h-16 md:h-20">
        <div className="flex items-center gap-8">
          <Link to="/" className="font-display text-display-md text-lime leading-none">
            MAGNUS
          </Link>
          <div className="hidden lg:flex items-center gap-6">
            <Link to="/tienda" className="font-body text-sm text-muted hover:text-white transition-colors">
              Tienda
            </Link>
            <Link to="/drops" className="font-body text-sm text-muted hover:text-white transition-colors">
              Drops
            </Link>
            <Link to="/marcas" className="font-body text-sm text-muted hover:text-white transition-colors">
              Marcas
            </Link>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <button onClick={openSearch} className="text-muted hover:text-white transition-colors">
            <Search size={18} />
          </button>
          <Link to={isAuthenticated ? '/cuenta' : '/auth'} className="hidden md:block text-muted hover:text-white transition-colors">
            <User size={18} />
          </Link>
          <Link to="/favoritos" className="hidden md:block text-muted hover:text-white transition-colors">
            <Heart size={18} />
          </Link>
          <button onClick={openCart} className="relative text-muted hover:text-white transition-colors">
            <ShoppingBag size={18} />
            {itemCount > 0 && (
              <span className="absolute -top-2 -right-2 w-4 h-4 bg-lime text-bg text-micro font-mono flex items-center justify-center">
                {itemCount > 9 ? '9+' : itemCount}
              </span>
            )}
          </button>
          <button onClick={toggleMobileMenu} className="lg:hidden text-muted hover:text-white transition-colors">
            <Menu size={20} />
          </button>
        </div>
      </nav>
    </motion.header>
  )
}
