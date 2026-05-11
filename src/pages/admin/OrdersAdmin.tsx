import { useQuery } from '@tanstack/react-query'
import { useSEO } from '@/hooks/useSEO'
import { supabase } from '@/lib/supabase'
import type { Order, Profile, OrderItem } from '@/types/database'

interface OrderWithRelations extends Order {
  user: Profile | null
  items: OrderItem[]
}

export default function OrdersAdmin() {
  useSEO({ title: 'Admin Pedidos | Magnus' })

  const { data, isLoading, error } = useQuery<OrderWithRelations[]>({
    queryKey: ['admin', 'orders'],
    queryFn: async () => {
      const { data, error } = await (supabase
        .from('orders')
        .select(`*, user:profiles(id, email, full_name), items:order_items(id)`)
        .order('created_at', { ascending: false }) as any)
      if (error) throw error
      return data ?? []
    },
  })

  let content

  if (isLoading) {
    content = <p className="font-body text-muted">Cargando pedidos...</p>
  } else if (error) {
    content = <p className="font-body text-red">Error cargando pedidos: {error.message}</p>
  } else if (data?.length) {
    content = (
      <div className="overflow-x-auto rounded-xl border border-border bg-bg-3">
        <table className="min-w-full text-left text-sm text-white">
          <thead className="border-b border-border bg-bg p-3 text-xs uppercase tracking-[0.2em] text-muted">
            <tr>
              <th className="px-4 py-3">Pedido</th>
              <th className="px-4 py-3">Cliente</th>
              <th className="px-4 py-3">Items</th>
              <th className="px-4 py-3">Total</th>
              <th className="px-4 py-3">Estado</th>
              <th className="px-4 py-3">Fecha</th>
            </tr>
          </thead>
          <tbody>
            {data.map((order) => (
              <tr key={order.id} className="border-b border-border hover:bg-bg">
                <td className="px-4 py-4">{order.order_number}</td>
                <td className="px-4 py-4">
                  <p>{order.user?.full_name ?? order.user?.email ?? 'Sin cliente'}</p>
                  <p className="font-body text-xs text-muted">{order.user?.email ?? ''}</p>
                </td>
                <td className="px-4 py-4">{order.items?.length ?? 0}</td>
                <td className="px-4 py-4">${order.total.toFixed(0)}</td>
                <td className="px-4 py-4 capitalize">{order.status}</td>
                <td className="px-4 py-4">{new Date(order.created_at).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    )
  } else {
    content = <p className="font-body text-muted">No hay pedidos registrados.</p>
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-display text-display-lg text-white">Pedidos</h1>
        <p className="font-body text-muted mt-2">Listado de pedidos recibidos y su estado.</p>
      </div>
      {content}
    </div>
  )
}
