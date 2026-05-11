import { useQuery } from '@tanstack/react-query'
import { useSEO } from '@/hooks/useSEO'
import { supabase } from '@/lib/supabase'
import type { Drop } from '@/types/database'

interface DropWithProducts extends Drop {
  products: { product_id: string }[]
}

export default function DropsAdmin() {
  useSEO({ title: 'Admin Drops | Magnus' })

  const { data, isLoading, error } = useQuery<DropWithProducts[]>({
    queryKey: ['admin', 'drops'],
    queryFn: async () => {
      const { data, error } = await (supabase
        .from('drops')
        .select('*, products:drop_products(product_id)')
        .order('drop_date', { ascending: false }) as any)
      if (error) throw error
      return data ?? []
    },
  })

  let content

  if (isLoading) {
    content = <p className="font-body text-muted">Cargando drops...</p>
  } else if (error) {
    content = <p className="font-body text-red">Error cargando drops: {error.message}</p>
  } else if (data?.length) {
    content = (
      <div className="overflow-x-auto rounded-xl border border-border bg-bg-3">
        <table className="min-w-full text-left text-sm text-white">
          <thead className="border-b border-border bg-bg p-3 text-xs uppercase tracking-[0.2em] text-muted">
            <tr>
              <th className="px-4 py-3">Nombre</th>
              <th className="px-4 py-3">Fecha</th>
              <th className="px-4 py-3">Productos</th>
              <th className="px-4 py-3">Publicado</th>
              <th className="px-4 py-3">Activo</th>
            </tr>
          </thead>
          <tbody>
            {data.map((drop) => (
              <tr key={drop.id} className="border-b border-border hover:bg-bg">
                <td className="px-4 py-4">{drop.name}</td>
                <td className="px-4 py-4">{new Date(drop.drop_date).toLocaleDateString()}</td>
                <td className="px-4 py-4">{drop.products?.length ?? 0}</td>
                <td className="px-4 py-4">{drop.is_published ? 'Sí' : 'No'}</td>
                <td className="px-4 py-4">{drop.is_active ? 'Sí' : 'No'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    )
  } else {
    content = <p className="font-body text-muted">No hay drops creados.</p>
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-display text-display-lg text-white">Drops</h1>
        <p className="font-body text-muted mt-2">Listado de drops creados y publicados.</p>
      </div>
      {content}
    </div>
  )
}
