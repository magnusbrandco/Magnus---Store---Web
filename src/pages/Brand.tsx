import { useNavigate, useParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import { Badge } from '@/components/ui/Badge'
import type { Brand, ProductWithRelations } from '@/types'
import { ProductGrid } from '@/components/products/ProductGrid'
import { useSEO } from '@/hooks/useSEO'
import { Skeleton } from '@/components/ui/Skeleton'

export default function BrandPage() {
  const { slug } = useParams<{ slug: string }>()
  const navigate = useNavigate()

  const { data: brand, isLoading: isBrandLoading } = useQuery<Brand | null>({
    queryKey: ['brand', slug],
    queryFn: async () => {
      const { data } = await supabase.from('brands').select('*').eq('slug', slug!).single()
      return data
    },
    enabled: !!slug,
    staleTime: 1000 * 60 * 2,
  })

  const { data: products, isLoading: isProductsLoading } = useQuery<ProductWithRelations[] | null, Error>({
    queryKey: ['brand-products', brand?.id],
    queryFn: async () => {
      const { data } = await supabase
        .from('products')
        .select('id, name, slug, description, brand_id, category_id, base_price, compare_price, images, tags, is_active, is_featured, is_drop, created_at, updated_at, brand:brands(id, name, slug), variants:product_variants(id, size, color, color_hex, stock, price)')
        .eq('is_active', true)
        .eq('brand_id', brand!.id)
        .order('created_at', { ascending: false })
      return (data ?? []) as unknown as ProductWithRelations[]
    },
    enabled: !!brand?.id,
    staleTime: 1000 * 60 * 2,
  })

  useSEO({
    title: brand ? `${(brand as Brand).name} | Magnus` : 'Marca | Magnus',
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
          {brand?.is_featured && (
            <Badge variant="new">Marca destacada</Badge>
          )}
        </div>

        <div className="mb-12 space-y-6">
          {brand ? (
            <>
              {brand.cover_url && (
                <img
                  src={brand.cover_url}
                  alt={`${brand.name} cover`}
                  className="w-full max-h-72 rounded-3xl object-cover"
                  loading="lazy"
                />
              )}
              <div>
                <span className="font-mono text-label text-lime">— Marca</span>
                <h1 className="font-display text-display-lg text-white mt-2">{brand.name}</h1>
                {brand.description && (
                  <p className="font-body text-muted mt-4 max-w-2xl">{brand.description}</p>
                )}
              </div>
            </>
          ) : (
            <Skeleton className="h-16 w-48" />
          )}
        </div>

        <ProductGrid products={products || []} isLoading={isProductsLoading || isBrandLoading} />
      </div>
    </div>
  )
}
