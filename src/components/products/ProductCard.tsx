import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import { Badge } from '@/components/ui/Badge'
import { normalizeImageUrl } from '@/lib/image'
import { formatCOP } from '@/lib/utils'
import type { ProductCardData } from '@/types'

interface ProductCardProps {
  product: any
}

export function ProductCard({ product }: ProductCardProps) {
  const [activeImage, setActiveImage] = useState(0)
  const images = (product.images?.filter(Boolean) ?? []).map(normalizeImageUrl)

  useEffect(() => {
    if (!images.length) return
    const timer = window.setInterval(() => {
      setActiveImage((current) => (current + 1) % images.length)
    }, 3000)
    return () => window.clearInterval(timer)
  }, [images.length])

  const lowestPrice = product.variants?.length
    ? Math.min(...product.variants.map((v: any) => v.price || product.base_price))
    : product.base_price

  const colors = product.variants
    ?.filter((v: any) => v.color_hex)
    ?.reduce((acc: any[], v: any) => {
      if (!acc.find((c) => c.hex === v.color_hex)) {
        acc.push({ name: v.color, hex: v.color_hex })
      }
      return acc
    }, []) || []

  const totalStock = product.variants?.reduce((sum: number, v: any) => sum + v.stock, 0) || 0
  const isLowStock = totalStock > 0 && totalStock <= 5

  return (
    <Link to={`/producto/${product.slug}`} className="group block">
      <div
        className="relative aspect-[4/5] bg-bg-3 overflow-hidden mb-3"
        onMouseEnter={() => images.length > 1 && setActiveImage((current) => (current + 1) % images.length)}
      >
        {images.length > 0 ? (
          <img
            src={images[activeImage % images.length]}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
            loading="lazy"
          />
        ) : (
          <div className="flex h-full items-center justify-center bg-bg text-center text-sm text-muted">
            Imagen no disponible
          </div>
        )}

        <div className="absolute top-3 left-3 flex flex-col gap-1">
          {product.is_drop && <Badge variant="hot">Drop</Badge>}
          {product.compare_price && <Badge variant="new">-{Math.round((1 - product.base_price / product.compare_price) * 100)}%</Badge>}
          {isLowStock && <Badge variant="default">Últimas</Badge>}
        </div>
      </div>

      <div className="space-y-1">
        {product.brand && (
          <p className="font-mono text-micro text-lime uppercase">{product.brand.name}</p>
        )}
        <h3 className="font-body text-sm text-white group-hover:text-lime transition-colors line-clamp-2">
          {product.name}
        </h3>
        <p className="font-mono text-sm text-white">{formatCOP(lowestPrice)}</p>

        {colors.length > 0 && (
          <div className="flex items-center gap-1 pt-1">
            {colors.slice(0, 4).map((c: any) => (
              <span
                key={c.hex}
                className="w-3 h-3 rounded-full border border-border"
                style={{ backgroundColor: c.hex }}
                title={c.name}
              />
            ))}
            {colors.length > 4 && (
              <span className="font-mono text-micro text-muted">+{colors.length - 4}</span>
            )}
          </div>
        )}
      </div>
    </Link>
  )
}
