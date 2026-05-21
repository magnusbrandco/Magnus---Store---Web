import { useNavigate, useParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import type { Category, ProductWithRelations } from '@/types'
import { ProductGrid } from '@/components/products/ProductGrid'
import { useSEO } from '@/hooks/useSEO'
import { Skeleton } from '@/components/ui/Skeleton'

export default function CategoryPage() {
  const { slug } = useParams<{ slug: string }>()
  const navigate = useNavigate()

  const { data: category, isLoading: isCategoryLoading } = useQuery<Category | null, Error>({
    queryKey: ['category', slug],
    queryFn: async () => {
      const { data } = await supabase
        .from('categories')
        .select('*')
        .eq('slug', slug!)
        .single()
      return data as Category | null
    },
    enabled: !!slug,
    staleTime: 1000 * 60 * 2,
  })

  const { data: products, isLoading: isProductsLoading } = useQuery<ProductWithRelations[] | null, Error>({
    queryKey: ['category-products', category?.id],
    queryFn: async () => {
      const { data } = await supabase
        .from('products')
        .select('id, name, slug, description, brand_id, category_id, base_price, compare_price, images, tags, is_active, is_featured, is_drop, created_at, updated_at, brand:brands(id, name, slug), variants:product_variants(id, size, color, color_hex, stock, price)')
        .eq('is_active', true)
        .eq('category_id', category!.id)
        .order('created_at', { ascending: false })
      return (data ?? []) as unknown as ProductWithRelations[]
    },
    enabled: !!category?.id,
    staleTime: 1000 * 60 * 2,
  })

  useSEO({
    title: category ? `${(category as Category).name} — Magnus` : 'Categoría | Magnus',
  })

  return (
    <div className="pt-24 pb-16">
      <div className="container-wide">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="font-mono text-sm text-lime hover:text-white transition"
          >
            ← Volver
          </button>
        </div>

        <div className="mb-12 space-y-6">
          {category ? (
            <>
              {category.image_url && (
                <img
                  src={category.image_url}
                  alt={`${category.name} cover`}
                  className="w-full max-h-72 rounded-3xl object-cover"
                  loading="lazy"
                />
              )}
              <div>
                <span className="font-mono text-label text-lime">— Categoría</span>
                <h1 className="font-display text-display-lg text-white mt-2">{category.name}</h1>
                {category.description && (
                  <p className="font-body text-muted mt-4 max-w-2xl">{category.description}</p>
                )}
              </div>
            </>
          ) : (
            <Skeleton className="h-16 w-48" />
          )}
        </div>
        <ProductGrid products={products || []} isLoading={isProductsLoading || isCategoryLoading} />
      </div>
    </div>
  )
}
