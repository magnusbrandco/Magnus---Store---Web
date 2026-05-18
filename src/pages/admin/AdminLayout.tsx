import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'

const adminLinks = [
  { to: '/admin', label: 'Dashboard' },
  { to: '/admin/productos', label: 'Productos' },
  { to: '/admin/marcas', label: 'Marcas' },
  { to: '/admin/categorias', label: 'Categorías' },
  { to: '/admin/pedidos', label: 'Pedidos' },
  { to: '/admin/clientes', label: 'Clientes' },
  { to: '/admin/drops', label: 'Drops' },
]
const ownerLinks = [
  { to: '/admin/owner', label: 'Panel del dueño' },
]

export function AdminLayout() {
  const { user, profile, isOwner, signOut } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()

  const handleSignOut = async () => {
    const success = await signOut()
    if (success) {
      navigate('/auth')
    }
  }

  if (!user || (!isOwner && profile?.role !== 'admin')) {
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
        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="inline-flex items-center rounded-full border border-border bg-bg px-4 py-2 text-sm text-white transition hover:border-lime hover:text-lime"
          >
            ← Volver
          </button>
          <p className="font-body text-sm text-muted">Panel de administración</p>
        </div>
        <div className="flex flex-col gap-8 lg:flex-row">
          <aside className="w-full lg:w-56 shrink-0 space-y-1">
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
            <button
              type="button"
              onClick={handleSignOut}
              className="w-full text-left font-body text-sm px-4 py-2 text-red transition-colors hover:text-white"
            >
              Cerrar sesión
            </button>
          </aside>
          <main className="flex-1">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  )
}
