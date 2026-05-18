import { useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useProducts } from '@/hooks/useProducts'
import { ProductGrid } from '@/components/products/ProductGrid'
import { ProductFilters } from '@/components/products/ProductFilters'
import { useSEO } from '@/hooks/useSEO'
import type { ProductFilters as ProductFiltersType } from '@/types'

export default function Shop() {
  useSEO({
    title: 'Tienda — Sneakers, Streetwear y Accesorios | Magnus',
    description: 'Explora nuestra colección completa de sneakers, hoodies, camisetas y accesorios.',
  })

  const [searchParams] = useSearchParams()
  const [showFilters, setShowFilters] = useState(false)

  const filters: ProductFiltersType = {
    category: searchParams.get('categoria') || undefined,
    brand: searchParams.get('marca') || undefined,
    minPrice: searchParams.get('precio_min') ? Number(searchParams.get('precio_min')) : undefined,
    maxPrice: searchParams.get('precio_max') ? Number(searchParams.get('precio_max')) : undefined,
    sort: (searchParams.get('orden') as ProductFiltersType['sort']) || undefined,
    search: searchParams.get('busqueda') || undefined,
  }

  const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } = useProducts(filters)
  const products = data?.pages.flat() || []

  return (
    <div className="pt-24 pb-16">
      <div className="container-wide">
        <div className="mb-8">
          <span className="font-mono text-label text-lime">— Tienda</span>
          <h1 className="font-display text-display-lg text-white mt-2">Productos</h1>
        </div>

        <div className="mb-4 lg:hidden">
          <button
            type="button"
            onClick={() => setShowFilters((prev) => !prev)}
            className="btn-outline"
          >
            {showFilters ? 'Ocultar filtros' : 'Mostrar filtros'}
          </button>
        </div>

        <div className="flex flex-col gap-8 lg:flex-row">
          <div className={`w-full lg:w-64 shrink-0 ${showFilters ? 'block' : 'hidden'} lg:block`}>
            <ProductFilters />
          </div>
          <div className="flex-1">
            <p className="font-body text-sm text-muted mb-4">{products.length} productos</p>
            <ProductGrid products={products} isLoading={isLoading} />

            {hasNextPage && (
              <div className="text-center mt-12">
                <button
                  onClick={() => fetchNextPage()}
                  disabled={isFetchingNextPage}
                  className="btn-outline"
                >
                  {isFetchingNextPage ? 'Cargando...' : 'Cargar más'}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
