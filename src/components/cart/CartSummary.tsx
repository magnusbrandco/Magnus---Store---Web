import { Link } from 'react-router-dom'
import { formatCOP } from '@/lib/utils'
import { FREE_SHIPPING_THRESHOLD } from '@/config/constants'
import { useCart } from '@/hooks/useCart'
import { Button } from '@/components/ui/Button'

export function CartSummary() {
  const { subtotal, itemCount } = useCart()

  const needsForFreeShipping = FREE_SHIPPING_THRESHOLD - subtotal

  return (
    <div className="bg-bg-3 border border-border p-6 space-y-4">
      <h3 className="font-display text-display-md text-white">Resumen</h3>

      {needsForFreeShipping > 0 && (
        <p className="font-body text-xs text-muted bg-bg-2 p-3">
          Faltan <span className="text-lime font-mono">{formatCOP(needsForFreeShipping)}</span> para envío gratis
        </p>
      )}

      <div className="space-y-2">
        <div className="flex justify-between">
          <span className="font-body text-sm text-muted">Subtotal ({itemCount} items)</span>
          <span className="font-mono text-sm text-white">{formatCOP(subtotal)}</span>
        </div>
        <div className="flex justify-between">
          <span className="font-body text-sm text-muted">Envío</span>
          <span className="font-mono text-sm text-muted">Calculado al finalizar</span>
        </div>
      </div>

      <Link to="/checkout">
        <Button variant="primary" size="lg" className="w-full">
          Ir al checkout
        </Button>
      </Link>
    </div>
  )
}
