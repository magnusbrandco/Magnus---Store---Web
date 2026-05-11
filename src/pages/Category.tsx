import { useParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import { ProductGrid } from '@/components/products/ProductGrid'
import { useSEO } from '@/hooks/useSEO'
import { Skeleton } from '@/components/ui/Skeleton'

export default function CategoryPage() {
  const { slug } = useParams<{ slug: string }>()

  const { data: category } = useQuery({
    queryKey: ['category', slug],
    queryFn: async () => {
      const { data } = await (supabase.from('categories').select('*').eq('slug', slug!).single() as any)
      return data as any
    },
    enabled: !!slug,
  })

  const { data: products, isLoading } = useQuery({
    queryKey: ['category-products', slug],
    queryFn: async () => {
      const { data } = await (supabase
        .from('products')
        .select('*, brand:brands(id, name, slug), variants:product_variants(id, size, color, color_hex, stock, price)')
        .eq('is_active', true)
        .eq('category.slug', slug!) as any)
      return (data ?? []) as any[]
    },
    enabled: !!slug,
  })

  useSEO({
    title: category ? `${category.name} — Magnus` : 'Categoría | Magnus',
  })

  return (
    <div className="pt-24 pb-16">
      <div className="container-wide">
        <div className="mb-12">
          {category ? (
            <>
              <span className="font-mono text-label text-lime">— Categoría</span>
              <h1 className="font-display text-display-lg text-white mt-2">{category.name}</h1>
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
