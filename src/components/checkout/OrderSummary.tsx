import { useCart } from '@/hooks/useCart'
import { formatCOP } from '@/lib/utils'
import { SHIPPING_COST_EXPRESS, SHIPPING_COST_SAME_DAY, FREE_SHIPPING_THRESHOLD } from '@/config/constants'
import type { ShippingMethod } from '@/types'

interface OrderSummaryProps {
  shippingMethod?: ShippingMethod
  discount?: number
}

export function OrderSummary({ shippingMethod, discount = 0 }: OrderSummaryProps) {
  const { items, subtotal } = useCart()

  const shippingCost = shippingMethod === 'express' ? SHIPPING_COST_EXPRESS
    : shippingMethod === 'same_day' ? SHIPPING_COST_SAME_DAY
    : subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_COST_EXPRESS

  const total = subtotal - discount + (shippingCost || 0)

  return (
    <div className="bg-bg-3 border border-border p-6 space-y-4 sticky top-24">
      <h3 className="font-display text-display-md text-white">Resumen</h3>

      <div className="space-y-3 max-h-60 overflow-y-auto">
        {items.map((item) => (
          <div key={item.id} className="flex gap-3">
            <div className="w-12 h-14 bg-bg shrink-0">
              {item.imageUrl && <img src={item.imageUrl} alt="" className="w-full h-full object-cover" />}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-body text-xs text-white truncate">{item.productName}</p>
              <p className="font-mono text-micro text-muted">x{item.quantity}</p>
            </div>
            <p className="font-mono text-xs text-white">{formatCOP(item.price * item.quantity)}</p>
          </div>
        ))}
      </div>

      <div className="border-t border-border pt-4 space-y-2">
        <div className="flex justify-between text-sm">
          <span className="font-body text-muted">Subtotal</span>
          <span className="font-mono text-white">{formatCOP(subtotal)}</span>
        </div>
        {discount > 0 && (
          <div className="flex justify-between text-sm">
            <span className="font-body text-lime">Descuento</span>
            <span className="font-mono text-lime">-{formatCOP(discount)}</span>
          </div>
        )}
        {shippingMethod && (
          <div className="flex justify-between text-sm">
            <span className="font-body text-muted">Envío</span>
            <span className="font-mono text-white">{shippingCost === 0 ? 'Gratis' : formatCOP(shippingCost)}</span>
          </div>
        )}
        <div className="flex justify-between pt-2 border-t border-border">
          <span className="font-body text-white font-semibold">Total</span>
          <span className="font-mono text-display-sm text-white">{formatCOP(total)}</span>
        </div>
      </div>
    </div>
  )
}
