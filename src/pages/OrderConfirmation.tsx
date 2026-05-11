import { useParams, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Check } from 'lucide-react'
import { useOrder } from '@/hooks/useOrders'
import { Button } from '@/components/ui/Button'
import { Skeleton } from '@/components/ui/Skeleton'
import { formatCOP } from '@/lib/utils'
import { useSEO } from '@/hooks/useSEO'

export default function OrderConfirmation() {
  const { id } = useParams<{ id: string }>()
  const { data: order, isLoading } = useOrder(id || '')
  const email = 'tu@email.com'

  useSEO({
    title: order ? `Pedido ${order.order_number} — Magnus` : 'Confirmación | Magnus',
  })

  if (isLoading) {
    return (
      <div className="pt-24 pb-16 text-center">
        <Skeleton className="h-20 w-20 mx-auto rounded-full" />
      </div>
    )
  }

  return (
    <div className="pt-24 pb-16">
      <div className="container-wide max-w-2xl mx-auto text-center">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', damping: 15, stiffness: 200 }}
          className="w-20 h-20 bg-lime rounded-full flex items-center justify-center mx-auto mb-6"
        >
          <Check className="text-bg" size={36} />
        </motion.div>

        <h1 className="font-display text-display-lg text-white mb-2">¡Pedido confirmado!</h1>
        <p className="font-body text-muted mb-8">Te enviamos un email de confirmación a {email}</p>

        {order && (
          <div className="bg-bg-3 border border-border p-8 text-left space-y-4 mb-8">
            <div>
              <p className="font-mono text-label text-muted uppercase">Número de pedido</p>
              <p className="font-display text-display-md text-lime">{order.order_number}</p>
            </div>

            <div className="space-y-2">
              {order.items?.map((item: any) => (
                <div key={item.id} className="flex justify-between">
                  <span className="font-body text-sm text-white">{item.product_name} x{item.quantity}</span>
                  <span className="font-mono text-sm text-white">{formatCOP(item.total_price)}</span>
                </div>
              ))}
            </div>

            <div className="border-t border-border pt-4 flex justify-between">
              <span className="font-body text-white font-semibold">Total</span>
              <span className="font-mono text-display-sm text-white">{formatCOP(order.total)}</span>
            </div>
          </div>
        )}

        <div className="flex items-center justify-center gap-4">
          <Link to="/tienda" className="btn-primary">Seguir comprando</Link>
          <Link to="/cuenta?tab=pedidos" className="btn-outline">Ver mis pedidos</Link>
        </div>
      </div>
    </div>
  )
}
