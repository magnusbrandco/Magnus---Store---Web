import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'
import { useSEO } from '@/hooks/useSEO'
import { supabase } from '@/lib/supabase'

export default function OwnerDashboard() {
  const navigate = useNavigate()
  const { user, isOwner } = useAuth()
  const [stats, setStats] = useState({
    brands: 0,
    categories: 0,
    products: 0,
    orders: 0,
    drops: 0,
  })
  const [isLoadingStats, setIsLoadingStats] = useState(true)
  const [statsError, setStatsError] = useState<string | null>(null)

  useEffect(() => {
    const fetchStats = async () => {
      setIsLoadingStats(true)
      setStatsError(null)

      try {
        const [brandsResponse, categoriesResponse, productsResponse, ordersResponse, dropsResponse] = await Promise.all([
          supabase.from('brands').select('id', { count: 'exact', head: true }),
          supabase.from('categories').select('id', { count: 'exact', head: true }),
          supabase.from('products').select('id', { count: 'exact', head: true }),
          supabase.from('orders').select('id', { count: 'exact', head: true }),
          supabase.from('drops').select('id', { count: 'exact', head: true }),
        ])

        const error = brandsResponse.error || categoriesResponse.error || productsResponse.error || ordersResponse.error || dropsResponse.error
        if (error) throw error

        setStats({
          brands: brandsResponse.count ?? 0,
          categories: categoriesResponse.count ?? 0,
          products: productsResponse.count ?? 0,
          orders: ordersResponse.count ?? 0,
          drops: dropsResponse.count ?? 0,
        })
      } catch (error) {
        setStatsError(error instanceof Error ? error.message : 'No se pudieron cargar las métricas.')
      } finally {
        setIsLoadingStats(false)
      }
    }

    fetchStats()
  }, [])

  useSEO({ title: 'Owner Dashboard | Magnus' })

  return (
    <div>
      <div className="mb-8">
        <img src="/LOGO_NEGRO.svg" alt="Magnus" className="h-10 mb-4" />
        <p className="font-mono text-label text-lime">— Panel del dueño</p>
        <h1 className="font-display text-display-lg text-white mt-2">Bienvenido al panel del propietario</h1>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <div className="bg-bg-3 border border-border p-6 rounded-xl">
          <p className="font-body text-xs text-muted">Usuario</p>
          <p className="font-display text-display-sm text-white mt-2">{user?.email ?? 'Invitado'}</p>
        </div>
        <div className="bg-bg-3 border border-border p-6 rounded-xl">
          <p className="font-body text-xs text-muted">Rol</p>
          <p className="font-display text-display-sm text-white mt-2">{isOwner ? 'Dueño' : 'Administrador'}</p>
        </div>
        <div className="bg-bg-3 border border-border p-6 rounded-xl">
          <p className="font-body text-xs text-muted">Acceso</p>
          <p className="font-display text-display-sm text-white mt-2">Acceso completo al panel del dueño</p>
        </div>
      </div>

      <div className="mt-8 grid gap-4 lg:grid-cols-[1fr_320px]">
        <div className="rounded-3xl border border-border bg-bg-3 p-6">
          <div className="mb-6 flex items-center justify-between gap-4">
            <div>
              <p className="font-mono text-label text-lime">— Métricas</p>
              <h2 className="font-display text-display-sm text-white mt-2">Interacciones y crecimiento</h2>
            </div>
          </div>
          {isLoadingStats ? (
            <p className="font-body text-muted">Cargando métricas...</p>
          ) : statsError ? (
            <p className="font-body text-red">{statsError}</p>
          ) : (
            <div className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-3xl border border-border bg-bg p-4">
                  <p className="font-body text-xs text-muted">Marcas</p>
                  <p className="font-display text-display-sm text-white mt-2">{stats.brands}</p>
                </div>
                <div className="rounded-3xl border border-border bg-bg p-4">
                  <p className="font-body text-xs text-muted">Categorías</p>
                  <p className="font-display text-display-sm text-white mt-2">{stats.categories}</p>
                </div>
                <div className="rounded-3xl border border-border bg-bg p-4">
                  <p className="font-body text-xs text-muted">Productos</p>
                  <p className="font-display text-display-sm text-white mt-2">{stats.products}</p>
                </div>
                <div className="rounded-3xl border border-border bg-bg p-4">
                  <p className="font-body text-xs text-muted">Órdenes</p>
                  <p className="font-display text-display-sm text-white mt-2">{stats.orders}</p>
                </div>
                <div className="rounded-3xl border border-border bg-bg p-4">
                  <p className="font-body text-xs text-muted">Drops</p>
                  <p className="font-display text-display-sm text-white mt-2">{stats.drops}</p>
                </div>
              </div>
              <div className="rounded-3xl border border-border bg-bg p-4">
                <p className="font-body text-xs text-muted">Tendencia reciente</p>
                <div className="mt-4 space-y-4">
                  {[
                    { label: 'Marcas', value: stats.brands, color: 'bg-lime' },
                    { label: 'Categorías', value: stats.categories, color: 'bg-cyan' },
                    { label: 'Productos', value: stats.products, color: 'bg-blue-400' },
                    { label: 'Órdenes', value: stats.orders, color: 'bg-fuchsia-500' },
                    { label: 'Drops', value: stats.drops, color: 'bg-orange-400' },
                  ].map((item) => {
                    const maxValue = Math.max(stats.brands, stats.categories, stats.products, stats.orders, stats.drops, 1)
                    const width = `${Math.round((item.value / maxValue) * 100)}%`
                    return (
                      <div key={item.label} className="space-y-2">
                        <div className="flex items-center justify-between text-sm text-muted">
                          <span>{item.label}</span>
                          <span className="text-white">{item.value}</span>
                        </div>
                        <div className="h-3 rounded-full bg-bg-2">
                          <div className={`${item.color} h-full rounded-full`} style={{ width }} />
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="rounded-3xl border border-border bg-bg-3 p-6">
          <h2 className="font-display text-display-sm text-white mb-4">Acciones del dueño</h2>
          <p className="font-body text-muted">Este panel muestra las interacciones clave para mantener el catálogo actualizado y seguir el desempeño del negocio.</p>
          <div className="mt-6 space-y-3">
            <button 
              onClick={() => navigate('/admin/marcas')}
              className="w-full rounded-3xl border border-border bg-bg p-4 text-left hover:bg-bg-2 transition-colors"
            >
              <p className="font-body text-sm text-muted">Ver marcas</p>
              <p className="text-white">Accede al listado de marcas y revisa los logos cargados.</p>
            </button>
            <button 
              onClick={() => navigate('/admin/categorias')}
              className="w-full rounded-3xl border border-border bg-bg p-4 text-left hover:bg-bg-2 transition-colors"
            >
              <p className="font-body text-sm text-muted">Ver categorías</p>
              <p className="text-white">Administra la estructura y asigna nuevas categorías fácilmente.</p>
            </button>
            <button 
              onClick={() => navigate('/admin/pedidos')}
              className="w-full rounded-3xl border border-border bg-bg p-4 text-left hover:bg-bg-2 transition-colors"
            >
              <p className="font-body text-sm text-muted">Controlar órdenes</p>
              <p className="text-white">Supervisa pedidos y revisa que la operación esté activa.</p>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
