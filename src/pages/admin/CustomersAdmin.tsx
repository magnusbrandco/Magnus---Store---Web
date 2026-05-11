import { useQuery } from '@tanstack/react-query'
import { useSEO } from '@/hooks/useSEO'
import { supabase } from '@/lib/supabase'
import type { Profile } from '@/types/database'

export default function CustomersAdmin() {
  useSEO({ title: 'Admin Clientes | Magnus' })

  const { data, isLoading, error } = useQuery<Profile[]>({
    queryKey: ['admin', 'customers'],
    queryFn: async () => {
      const { data, error } = await (supabase
        .from('profiles')
        .select('id, email, full_name, role, is_subscribed, created_at')
        .order('created_at', { ascending: false }) as any)
      if (error) throw error
      return data ?? []
    },
  })

  let content

  if (isLoading) {
    content = <p className="font-body text-muted">Cargando clientes...</p>
  } else if (error) {
    content = <p className="font-body text-red">Error cargando clientes: {error.message}</p>
  } else if (data?.length) {
    content = (
      <div className="overflow-x-auto rounded-xl border border-border bg-bg-3">
        <table className="min-w-full text-left text-sm text-white">
          <thead className="border-b border-border bg-bg p-3 text-xs uppercase tracking-[0.2em] text-muted">
            <tr>
              <th className="px-4 py-3">Nombre</th>
              <th className="px-4 py-3">Email</th>
              <th className="px-4 py-3">Rol</th>
              <th className="px-4 py-3">Suscrito</th>
              <th className="px-4 py-3">Registro</th>
            </tr>
          </thead>
          <tbody>
            {data.map((profile) => (
              <tr key={profile.id} className="border-b border-border hover:bg-bg">
                <td className="px-4 py-4">{profile.full_name ?? 'Sin nombre'}</td>
                <td className="px-4 py-4">{profile.email}</td>
                <td className="px-4 py-4 capitalize">{profile.role}</td>
                <td className="px-4 py-4">{profile.is_subscribed ? 'Sí' : 'No'}</td>
                <td className="px-4 py-4">{new Date(profile.created_at).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    )
  } else {
    content = <p className="font-body text-muted">No hay clientes registrados.</p>
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-display text-display-lg text-white">Clientes</h1>
        <p className="font-body text-muted mt-2">Clientes registrados en la tienda.</p>
      </div>
      {content}
    </div>
  )
}
