import { useDrops } from '@/hooks/useDrops'
import { useSEO } from '@/hooks/useSEO'
import { Skeleton } from '@/components/ui/Skeleton'

export default function Drops() {
  useSEO({
    title: 'Drops Exclusivos — Lanzamientos Limitados | Magnus',
    description: 'Sé el primero en obtener los lanzamientos más exclusivos. Drops limitados con countdown.',
  })

  const { data: drops, isLoading } = useDrops()

  return (
    <div className="pt-24 pb-16">
      <div className="container-wide mb-12">
        <span className="font-mono text-label text-lime">— Exclusivo</span>
        <h1 className="font-display text-display-xl text-white mt-2">DROPS</h1>
        <p className="font-body text-muted mt-4 max-w-lg">
          Lanzamientos limitados. Una vez agotados, no hay reestock. Activa las notificaciones para no perderte ninguno.
        </p>
      </div>

      {isLoading ? (
        <div className="container-wide grid md:grid-cols-2 gap-6">
          {[1, 2].map((i) => (
            <Skeleton key={i} className="aspect-[16/9]" />
          ))}
        </div>
      ) : drops?.length === 0 ? (
        <div className="container-wide text-center py-20">
          <p className="font-body text-muted">No hay drops disponibles por ahora.</p>
        </div>
      ) : (
        <div className="container-wide grid md:grid-cols-2 gap-6">
          {drops?.map((drop: any) => {
            const isActive = new Date(drop.drop_date) <= new Date()
            return (
              <div key={drop.id} className="relative bg-bg-3 border border-border overflow-hidden group">
                <div className="aspect-[16/9] bg-bg">
                  {drop.cover_url && (
                    <img src={drop.cover_url} alt={drop.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                  )}
                </div>
                <div className="p-6">
                  <span className={`font-mono text-micro uppercase ${isActive ? 'text-lime' : 'text-muted'}`}>
                    {isActive ? 'Disponible' : 'Próximamente'}
                  </span>
                  <h3 className="font-display text-display-md text-white mt-1">{drop.name}</h3>
                  <p className="font-body text-sm text-muted mt-2 line-clamp-2">{drop.description}</p>
                  <div className="flex items-center gap-4 mt-4">
                    {!isActive && (
                      <p className="font-mono text-sm text-lime">
                        {new Date(drop.drop_date).toLocaleDateString('es-CO', {
                          day: 'numeric', month: 'long', year: 'numeric',
                        })}
                      </p>
                    )}
                    <button className={`${isActive ? 'btn-primary' : 'btn-outline'} text-sm`}>
                      {isActive ? 'Ver productos' : 'Notifícame'}
                    </button>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
