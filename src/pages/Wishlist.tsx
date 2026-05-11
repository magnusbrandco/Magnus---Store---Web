import { useWishlist } from '@/hooks/useWishlist'
import { useSEO } from '@/hooks/useSEO'

export default function Wishlist() {
  useSEO({ title: 'Favoritos | Magnus' })
  const { wishlist, isLoading } = useWishlist()

  return (
    <div className="pt-24 pb-16">
      <div className="container-wide max-w-3xl">
        <h1 className="font-display text-display-lg text-white mb-8">Favoritos</h1>
        {isLoading ? (
          <p className="font-body text-muted">Cargando...</p>
        ) : wishlist.length === 0 ? (
          <p className="font-body text-muted">No tienes favoritos guardados.</p>
        ) : (
          <p className="font-body text-muted">{wishlist.length} productos guardados.</p>
        )}
      </div>
    </div>
  )
}
