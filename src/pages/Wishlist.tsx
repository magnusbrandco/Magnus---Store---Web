import { useWishlist } from '@/hooks/useWishlist'
import { useQuery } from '@tanstack/react-query'
import { useSEO } from '@/hooks/useSEO'
import { supabase } from '@/lib/supabase'
import { ProductCard } from '@/components/products/ProductCard'

export default function Wishlist() {
  useSEO({ title: 'Favoritos | Magnus' })
  const { wishlist, isLoading: isLoadingWishlist } = useWishlist()

  const {
    data: products = [],
    isLoading: isLoadingProducts,
    error,
  } = useQuery({
    queryKey: ['wishlist-products', wishlist],
    queryFn: async () => {
      if (!wishlist.length) return []
      const { data, error } = await supabase
        .from('products')
        .select('*, brand:brands(id, name, slug)')
        .in('id', wishlist)
      if (error) throw error
      return data ?? []
    },
    enabled: wishlist.length > 0,
  })

  const loading = isLoadingWishlist || isLoadingProducts

  return (
    <div className="pt-24 pb-16">
      <div className="container-wide">
        <h1 className="font-display text-display-lg text-white mb-8">Favoritos</h1>
        {loading ? (
          <p className="font-body text-muted">Cargando favoritos...</p>
        ) : wishlist.length === 0 ? (
          <p className="font-body text-muted">No tienes favoritos guardados.</p>
        ) : error ? (
          <p className="font-body text-red">Error cargando favoritos.</p>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
