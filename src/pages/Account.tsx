import { useEffect } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'
import { useOrders } from '@/hooks/useOrders'
import { useSEO } from '@/hooks/useSEO'
import { formatCOP } from '@/lib/utils'
import { notifications } from '@/lib/notifications'

const tabs = [
  { id: 'perfil', label: 'Perfil' },
  { id: 'pedidos', label: 'Pedidos' },
  { id: 'direcciones', label: 'Direcciones' },
  { id: 'favoritos', label: 'Favoritos' },
]

export default function Account() {
  useSEO({ title: 'Mi Cuenta | Magnus' })

  const [searchParams, setSearchParams] = useSearchParams()
  const activeTab = searchParams.get('tab') || 'perfil'
  const navigate = useNavigate()
  const { user, profile, isOwner, isLoading: authLoading, signOut } = useAuth()
  const { orders, isLoading } = useOrders()

  useEffect(() => {
    if (!authLoading && user && isOwner) {
      navigate('/admin/owner', { replace: true })
    }
  }, [authLoading, isOwner, navigate, user])

  const handleSignOut = async () => {
    const success = await signOut()
    if (success) {
      notifications.success('Sesión cerrada', 'Has cerrado sesión exitosamente')
      navigate('/')
    } else {
      notifications.error('Error', 'No se pudo cerrar la sesión')
    }
  }

  const setTab = (tab: string) => {
    const params = new URLSearchParams(searchParams)
    params.set('tab', tab)
    setSearchParams(params)
  }

  if (!user) {
    return (
      <div className="pt-24 pb-16 text-center">
        <h1 className="font-display text-display-lg text-white mb-4">Inicia sesión para continuar</h1>
      </div>
    )
  }

  return (
    <div className="pt-24 pb-16">
      <div className="container-wide">
        <h1 className="font-display text-display-lg text-white mb-8">Mi cuenta</h1>

        <div className="flex gap-2 mb-8 border-b border-border pb-4 overflow-x-auto">
          {tabs.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`font-body text-sm px-4 py-2 transition-colors whitespace-nowrap ${
                activeTab === t.id ? 'text-lime border-b-2 border-lime' : 'text-muted hover:text-white'
              }`}
            >
              {t.label}
            </button>
          ))}
          <button type="button" onClick={handleSignOut} className="font-body text-sm px-4 py-2 text-red ml-auto">
            Cerrar sesión
          </button>
        </div>

        {activeTab === 'perfil' && (
          <div className="max-w-md space-y-4">
            <p className="font-body text-white">Email: {user.email}</p>
            {(profile?.role?.toLowerCase() === 'admin' || isOwner) && (
              <p>
                <Link
                  to="/admin"
                  className="inline-flex items-center rounded-full border border-lime px-4 py-2 text-sm text-lime hover:bg-lime/10 transition-colors"
                >
                  Ir al panel de administrador
                </Link>
              </p>
            )}
            <p className="font-body text-muted text-sm">Más opciones de perfil próximamente.</p>
          </div>
        )}

        {activeTab === 'pedidos' && (
          <div className="space-y-4">
            {isLoading && <p className="font-body text-muted">Cargando pedidos...</p>}
            {!isLoading && (!orders || orders.length === 0) && (
              <p className="font-body text-muted">No tienes pedidos aún.</p>
            )}
            {!isLoading && orders && orders.length > 0 && orders.map((order: any) => (
              <div key={order.id} className="bg-bg-3 border border-border p-6 flex items-center justify-between">
                <div>
                  <p className="font-mono text-sm text-lime">{order.order_number}</p>
                  <p className="font-body text-xs text-muted">{new Date(order.created_at).toLocaleDateString('es-CO')}</p>
                  <span className="font-mono text-micro uppercase text-muted">{order.status}</span>
                </div>
                <div className="text-right">
                  <p className="font-mono text-sm text-white">{formatCOP(order.total)}</p>
                  <span className={`font-mono text-micro uppercase ${
                    order.payment_status === 'approved' ? 'text-lime' : 'text-muted'
                  }`}>
                    {order.payment_status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'direcciones' && (
          <p className="font-body text-muted">Gestión de direcciones próximamente.</p>
        )}

        {activeTab === 'favoritos' && (
          <p className="font-body text-muted">Tus favoritos próximamente.</p>
        )}
      </div>
    </div>
  )
}
