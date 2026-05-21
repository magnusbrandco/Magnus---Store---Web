import { useNavigate, useParams } from 'react-router-dom'
import { useProduct } from '@/hooks/useProducts'
import { useCart } from '@/hooks/useCart'
import { ProductImages } from '@/components/products/ProductImages'
import { ProductInfo } from '@/components/products/ProductInfo'
import { RelatedProducts } from '@/components/products/RelatedProducts'
import { Skeleton } from '@/components/ui/Skeleton'
import { ChevronLeft } from 'lucide-react'
import { useSEO } from '@/hooks/useSEO'

export default function ProductDetail() {
  const { slug } = useParams<{ slug: string }>()
  const navigate = useNavigate()
  const { data: product, isLoading } = useProduct(slug || '')
  const { addItem } = useCart()

  useSEO({
    title: product ? `${product.name} — ${product.brand?.name || ''}` : 'Cargando...',
    description: product?.description?.slice(0, 160) || undefined,
    image: product?.images?.[0],
  })

  if (isLoading) {
    return (
      <div className="pt-24 pb-16">
        <div className="container-wide">
          <div className="grid md:grid-cols-2 gap-12">
            <Skeleton className="aspect-[4/5]" />
            <div className="space-y-4">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-12 w-3/4" />
              <Skeleton className="h-8 w-24" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-20 w-full" />
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="pt-24 pb-16 text-center">
        <h1 className="font-display text-display-lg text-white">Producto no encontrado</h1>
      </div>
    )
  }

  const handleAddToCart = (variantId: string, quantity: number) => {
    const variant = product.variants?.find((v: any) => v.id === variantId)
    if (!variant) return

    addItem({
      id: variant.id,
      productId: product.id,
      productName: product.name,
      brandName: product.brand?.name || '',
      price: variant.price || product.base_price,
      size: variant.size || '',
      color: variant.color || '',
      colorHex: variant.color_hex || '',
      imageUrl: product.images?.[0] || '',
      quantity,
      stock: variant.stock,
    })
  }

  return (
    <div className="pt-24 pb-16">
      <div className="container-wide">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="mb-8 inline-flex items-center gap-2 text-sm font-medium text-muted hover:text-white"
        >
          <ChevronLeft size={18} /> Volver
        </button>

        <div className="grid md:grid-cols-12 gap-8 lg:gap-12">
          <div className="md:col-span-7">
            <ProductImages images={product.images || []} name={product.name} />
          </div>
          <div className="md:col-span-5">
            <ProductInfo product={product} onAddToCart={handleAddToCart} />
          </div>
        </div>
        <RelatedProducts productId={product.id} categoryId={product.category_id ?? undefined} />
      </div>
    </div>
  )
}
