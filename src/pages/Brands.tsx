import { Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import type { Brand } from '@/types'
import { useSEO } from '@/hooks/useSEO'
import { Skeleton } from '@/components/ui/Skeleton'

export default function BrandsPage() {
  const { data: brands, isLoading } = useQuery<Brand[]>({
    queryKey: ['brands'],
    queryFn: async (): Promise<Brand[]> => {
      const { data } = await supabase.from('brands').select('*').order('name')
      return (data ?? []) as Brand[]
    },
  })

  useSEO({ title: 'Marcas | Magnus' })

  return (
    <div className="pt-24 pb-16">
      <div className="container-wide">
        <div className="mb-12">
          <span className="font-mono text-label text-lime">— Marcas</span>
          <h1 className="font-display text-display-lg text-white mt-2">Todas las marcas</h1>
          <p className="font-body text-muted mt-4 max-w-2xl">
            Explora todas las marcas disponibles y navega a su catálogo de productos.
          </p>
        </div>

        {isLoading ? (
          <Skeleton className="h-12 w-48 mb-8" />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {brands?.map((brand) => (
              <Link
                key={brand.id}
                to={`/marca/${brand.slug}`}
                className="card p-6 border border-border hover:border-lime transition-colors"
              >
                <div>
                  <h2 className="font-display text-xl text-white">{brand.name}</h2>
                  {brand.description && (
                    <p className="font-body text-muted mt-2 line-clamp-3">{brand.description}</p>
                  )}
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
