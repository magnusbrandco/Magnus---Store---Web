import { useParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import type { Brand, ProductWithRelations } from '@/types'
import { ProductGrid } from '@/components/products/ProductGrid'
import { useSEO } from '@/hooks/useSEO'
import { Skeleton } from '@/components/ui/Skeleton'

export default function BrandPage() {
  const { slug } = useParams<{ slug: string }>()

  const { data: brand } = useQuery<Brand | null>({
    queryKey: ['brand', slug],
    queryFn: async () => {
      const { data } = await supabase.from('brands').select('*').eq('slug', slug!).single()
      return data
    },
    enabled: !!slug,
  })

  const { data: products, isLoading } = useQuery({
    queryKey: ['brand-products', slug],
    queryFn: async () => {
      const { data } = await supabase
        .from('products')
        .select('*, brand:brands(id, name, slug), variants:product_variants(id, size, color, color_hex, stock, price)')
        .eq('is_active', true)
        .eq('brand.slug', slug!)
      return (data ?? []) as unknown as ProductWithRelations[]
    },
    enabled: !!slug,
  })

  useSEO({
    title: brand ? `${(brand as Brand).name} | Magnus` : 'Marca | Magnus',
  })

  return (
    <div className="pt-24 pb-16">
      <div className="container-wide">
        <div className="mb-12">
          {brand ? (
            <>
              <span className="font-mono text-label text-lime">— Marca</span>
              <h1 className="font-display text-display-lg text-white mt-2">{brand.name}</h1>
              {brand.description && (
                <p className="font-body text-muted mt-4 max-w-lg">{brand.description}</p>
              )}
            </>
          ) : (
            <Skeleton className="h-16 w-48" />
          )}
        </div>
        <ProductGrid products={products || []} isLoading={isLoading} />
      </div>
    </div>
  )
}
