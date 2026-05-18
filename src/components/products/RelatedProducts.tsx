import { useQuery } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import type { ProductWithRelations } from '@/types'
import { ProductCard } from './ProductCard'

interface RelatedProductsProps {
  productId: string
  categoryId?: string
}

export function RelatedProducts({ productId, categoryId }: RelatedProductsProps) {
  const { data: products } = useQuery({
    queryKey: ['related-products', productId, categoryId],
    queryFn: async () => {
      let query = supabase
        .from('products')
        .select('*, brand:brands(id, name, slug), variants:product_variants(id, size, color, color_hex, stock, price)')
        .eq('is_active', true)
        .neq('id', productId)
        .limit(4)

      if (categoryId) query = query.eq('category_id', categoryId)

      const { data } = await query
      return (data ?? []) as unknown as ProductWithRelations[]
    },
    enabled: !!productId,
  })

  if (!products?.length) return null

  return (
    <section className="py-16">
      <div className="container-wide">
        <h2 className="font-display text-display-lg text-white mb-8">También te puede gustar</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  )
}
