import { useAuth } from '@/hooks/useAuth'
import { useSEO } from '@/hooks/useSEO'

export default function OwnerDashboard() {
  const { user, isOwner } = useAuth()

  useSEO({ title: 'Owner Dashboard | Magnus' })

  return (
    <div>
      <div className="mb-8">
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

      <div className="mt-8 bg-bg-3 border border-border p-6 rounded-xl">
        <h2 className="font-display text-display-sm text-white mb-4">Opciones del dueño</h2>
        <p className="font-body text-muted">Aquí puedes agregar controles exclusivos que solo el dueño verá, como métricas avanzadas o configuraciones de cuenta.</p>
      </div>
    </div>
  )
}
