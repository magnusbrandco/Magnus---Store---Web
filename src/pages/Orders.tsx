import { useOrders } from '@/hooks/useOrders'
import { useSEO } from '@/hooks/useSEO'
import { formatCOP } from '@/lib/utils'

export default function Orders() {
  useSEO({ title: 'Mis Pedidos | Magnus' })
  const { orders, isLoading } = useOrders()

  return (
    <div className="pt-24 pb-16">
      <div className="container-wide max-w-3xl">
        <h1 className="font-display text-display-lg text-white mb-8">Mis pedidos</h1>

        {isLoading ? (
          <p className="font-body text-muted">Cargando...</p>
        ) : !orders?.length ? (
          <p className="font-body text-muted">No tienes pedidos aún.</p>
        ) : (
          <div className="space-y-4">
            {orders.map((order: any) => (
              <div key={order.id} className="bg-bg-3 border border-border p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="font-mono text-sm text-lime">{order.order_number}</p>
                    <p className="font-body text-xs text-muted">
                      {new Date(order.created_at).toLocaleDateString('es-CO', {
                        year: 'numeric', month: 'long', day: 'numeric',
                      })}
                    </p>
                  </div>
                  <span className={`font-mono text-micro uppercase px-3 py-1 border ${
                    order.status === 'delivered' ? 'border-lime text-lime'
                    : order.status === 'cancelled' ? 'border-red text-red'
                    : 'border-muted text-muted'
                  }`}>
                    {order.status}
                  </span>
                </div>
                <div className="border-t border-border pt-4 flex justify-between items-center">
                  <span className="font-body text-sm text-muted">{order.items?.length || 0} artículos</span>
                  <span className="font-mono text-sm text-white">{formatCOP(order.total)}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
