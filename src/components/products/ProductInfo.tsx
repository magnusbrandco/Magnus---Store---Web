import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Heart, ChevronDown, ChevronUp } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { SizeSelector } from './SizeSelector'
import { ColorSelector } from './ColorSelector'
import { formatCOP } from '@/lib/utils'
import { useAuth } from '@/hooks/useAuth'
import { useWishlist } from '@/hooks/useWishlist'
import { notifications } from '@/lib/notifications'
import type { ProductWithRelations } from '@/types'

interface ProductInfoProps {
  product: ProductWithRelations
  onAddToCart: (variantId: string, quantity: number) => void
}

export function ProductInfo({ product, onAddToCart }: ProductInfoProps) {
  const navigate = useNavigate()
  const { user } = useAuth()
  const { isInWishlist, toggleWishlist } = useWishlist()
  const inWishlist = isInWishlist(product.id)

  const [selectedSize, setSelectedSize] = useState('')
  const [selectedColor, setSelectedColor] = useState('')
  const [quantity, setQuantity] = useState(1)
  const [openAccordion, setOpenAccordion] = useState<string | null>(null)

  const colors = product.variants
    ?.filter((v) => v.color_hex)
    ?.reduce((acc: any[], v) => {
      if (!acc.find((c) => c.hex === v.color_hex)) {
        acc.push({ name: v.color!, hex: v.color_hex! })
      }
      return acc
    }, []) || []

  const sizes = [...new Set(product.variants?.map((v) => v.size).filter(Boolean))] as string[]

  const selectedVariant =
    product.variants?.find((v) => v.size === selectedSize && v.color_hex === selectedColor) ??
    (product.variants?.length === 1 ? product.variants[0] : undefined)

  const stock = selectedVariant?.stock ?? 0
  const totalStock = product.variants?.reduce((s, v) => s + (v.stock ?? 0), 0) || 0
  const price = selectedVariant?.price || product.base_price

  useEffect(() => {
    if (!selectedSize && sizes.length === 1) {
      setSelectedSize(sizes[0])
    }
  }, [selectedSize, sizes])

  useEffect(() => {
    if (!selectedColor && colors.length === 1) {
      setSelectedColor(colors[0].hex)
    }
  }, [selectedColor, colors])

  return (
    <div className="space-y-6 sticky top-24">
      {product.brand && (
        <Link to={`/marca/${product.brand.slug}`} className="font-mono text-label text-lime hover:underline inline-block">
          {product.brand.name}
        </Link>
      )}

      <h1 className="font-display text-display-lg text-white leading-none">{product.name}</h1>

      <div className="flex items-baseline gap-3">
        <span className="font-mono text-2xl text-white">{formatCOP(price)}</span>
        {product.compare_price && product.compare_price > price && (
          <span className="font-mono text-lg text-muted line-through">{formatCOP(product.compare_price)}</span>
        )}
      </div>

      {colors.length > 0 && (
        <ColorSelector colors={colors} selected={selectedColor} onChange={setSelectedColor} />
      )}

      {sizes.length > 0 && (
        <SizeSelector
          sizes={sizes.map((s) => ({
            label: s,
            value: s,
            inStock: product.variants?.some((v) => v.size === s && v.stock > 0) || false,
          }))}
          selected={selectedSize}
          onChange={setSelectedSize}
        />
      )}

      <div className="flex items-center gap-2">
        {stock > 0 ? (
          <span className="font-body text-sm text-lime">✓ {stock <= 3 ? `⚡ Últimas ${stock} unidades` : 'Disponible'}</span>
        ) : (
          <span className="font-body text-sm text-red">✗ Agotado</span>
        )}
      </div>

      <div className="flex items-center gap-2">
        <div className="flex items-center border border-border">
          <button
            type="button"
            onClick={() => setQuantity(Math.max(1, quantity - 1))}
            className="px-4 py-3 text-muted hover:text-white transition-colors"
          >
            −
          </button>
          <span className="px-4 py-3 font-mono text-sm min-w-[3rem] text-center">{quantity}</span>
          <button
            type="button"
            onClick={() => setQuantity(Math.min(stock || 99, quantity + 1))}
            className="px-4 py-3 text-muted hover:text-white transition-colors"
          >
            +
          </button>
        </div>
      </div>

      <div className="flex gap-3">
        <Button
          variant="primary"
          size="lg"
          className="flex-1"
          disabled={!selectedVariant || stock === 0}
          onClick={() => selectedVariant && onAddToCart(selectedVariant.id, quantity)}
        >
          {selectedVariant ? 'Agregar al carrito' : 'Selecciona una variante'}
        </Button>
        <Button
          variant="outline"
          size="lg"
          className={`px-4 ${inWishlist ? 'border-lime text-lime' : ''}`}
          onClick={() => {
            if (!user) {
              notifications.error('Inicia sesión', 'Debes iniciar sesión para usar favoritos.')
              navigate('/auth?mode=login')
              return
            }
            toggleWishlist(product.id)
          }}
        >
          <Heart size={18} className={inWishlist ? 'text-lime' : ''} />
        </Button>
      </div>

      {[
        { id: 'desc', title: 'Descripción', content: product.description || 'Sin descripción disponible.' },
        { id: 'details', title: 'Detalles', content: product.details || 'Detalle del producto no disponible.' },
        { id: 'shipping', title: 'Envío y devoluciones', content: product.shipping_returns || 'Envío gratis en pedidos +$200K. Devoluciones dentro de 30 días.' },
      ].map((section) => (
        <div key={section.id} className="border-t border-border pt-4">
          <button
            onClick={() => setOpenAccordion(openAccordion === section.id ? null : section.id)}
            className="flex items-center justify-between w-full text-left"
          >
            <span className="font-body text-sm text-white">{section.title}</span>
            {openAccordion === section.id ? <ChevronUp size={16} className="text-muted" /> : <ChevronDown size={16} className="text-muted" />}
          </button>
          <motion.div
            initial={false}
            animate={{ height: openAccordion === section.id ? 'auto' : 0, opacity: openAccordion === section.id ? 1 : 0 }}
            className="overflow-hidden"
          >
            <p className="font-body text-sm text-muted mt-3 whitespace-pre-line">{section.content}</p>
          </motion.div>
        </div>
      ))}
    </div>
  )
}
