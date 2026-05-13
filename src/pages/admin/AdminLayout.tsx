import { Outlet, Link, Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'

const adminLinks = [
  { to: '/admin', label: 'Dashboard' },
  { to: '/admin/productos', label: 'Productos' },
  { to: '/admin/marcas', label: 'Marcas' },
  { to: '/admin/categorias', label: 'Categorías' },
  { to: '/admin/cupones', label: 'Cupones' },
  { to: '/admin/pedidos', label: 'Pedidos' },
  { to: '/admin/clientes', label: 'Clientes' },
  { to: '/admin/drops', label: 'Drops' },
]
const ownerLinks = [
  { to: '/admin/owner', label: 'Panel del dueño' },
]

export function AdminLayout() {
  const { user, profile, isOwner } = useAuth()
  const location = useLocation()

  const isAdmin = profile?.role?.toLowerCase() === 'admin'

  if (location.pathname === '/admin' && isOwner) {
    return <Navigate to="/admin/owner" replace />
  }

  if (!user || (!isOwner && !isAdmin)) {
    return (
      <div className="pt-24 pb-16 text-center">
        <p className="font-body text-muted">Debes iniciar sesión como administrador.</p>
        <p className="font-body text-sm text-muted mt-2">
          <Link to="/auth" className="text-lime hover:underline">
            Ve a la página de inicio de sesión
          </Link>{' '}
          y accede con tu cuenta de administrador.
        </p>
      </div>
    )
  }

  return (
    <div className="pt-24 pb-16">
      <div className="container-wide">
        <div className="flex gap-8">
          <aside className="w-56 shrink-0 space-y-1">
            {adminLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={`block font-body text-sm px-4 py-2 transition-colors ${
                  location.pathname === link.to
                    ? 'text-lime bg-bg-3 border-l-2 border-lime'
                    : 'text-muted hover:text-white'
                }`}
              >
                {link.label}
              </Link>
            ))}
            {isOwner && ownerLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={`block font-body text-sm px-4 py-2 transition-colors ${
                  location.pathname === link.to
                    ? 'text-lime bg-bg-3 border-l-2 border-lime'
                    : 'text-muted hover:text-white'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </aside>
          <main className="flex-1">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  )
}
