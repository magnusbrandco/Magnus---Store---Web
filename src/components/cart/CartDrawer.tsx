import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Minus, Plus, Trash2 } from 'lucide-react'
import { useCart } from '@/hooks/useCart'
import { Button } from '@/components/ui/Button'
import { formatCOP } from '@/lib/utils'

export function CartDrawer() {
  const { items, itemCount, subtotal, isOpen, closeCart, updateQuantity, removeItem } = useCart()

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 z-40"
            onClick={closeCart}
          />
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 bottom-0 w-full max-w-md bg-bg-2 border-l border-border z-50 flex flex-col"
          >
            <div className="flex items-center justify-between p-6 border-b border-border">
              <div>
                <h2 className="font-display text-display-md text-white">Carrito</h2>
                <p className="font-body text-xs text-muted">{itemCount} {itemCount === 1 ? 'artículo' : 'artículos'}</p>
              </div>
              <button onClick={closeCart} className="text-muted hover:text-white">
                <X size={20} />
              </button>
            </div>

            {items.length === 0 ? (
              <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
                <p className="font-body text-muted mb-4">Tu carrito está vacío</p>
                <Link to="/tienda" onClick={closeCart} className="btn-primary">
                  Explorar tienda
                </Link>
              </div>
            ) : (
              <>
                <div className="flex-1 overflow-y-auto p-6 space-y-4">
                  {items.map((item) => (
                    <div key={item.id} className="flex gap-4 bg-bg-3 p-4">
                      <div className="w-20 h-24 bg-bg shrink-0">
                        {item.imageUrl && (
                          <img src={item.imageUrl} alt={item.productName} className="w-full h-full object-cover" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-body text-sm text-white truncate">{item.productName}</p>
                        <p className="font-mono text-micro text-muted">{item.brandName}</p>
                        <p className="font-mono text-micro text-muted">
                          {item.size} {item.color && `/ ${item.color}`}
                        </p>
                        <p className="font-mono text-sm text-white mt-1">{formatCOP(item.price)}</p>
                        <div className="flex items-center gap-2 mt-2">
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="text-muted hover:text-white transition-colors"
                          >
                            <Minus size={14} />
                          </button>
                          <span className="font-mono text-xs w-6 text-center">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="text-muted hover:text-white transition-colors"
                            disabled={item.quantity >= item.stock}
                          >
                            <Plus size={14} />
                          </button>
                          <button onClick={() => removeItem(item.id)} className="ml-auto text-muted hover:text-red transition-colors">
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="border-t border-border p-6 space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="font-body text-sm text-muted">Subtotal</span>
                    <span className="font-mono text-sm text-white">{formatCOP(subtotal)}</span>
                  </div>
                  <p className="font-body text-xs text-muted">Envío calculado al finalizar</p>
                  <Link to="/checkout" onClick={closeCart} className="btn-primary w-full text-center block">
                    Ir al checkout
                  </Link>
                </div>
              </>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
