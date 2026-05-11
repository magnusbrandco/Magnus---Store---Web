import { motion } from 'framer-motion'
import { ProductCard } from './ProductCard'
import { ProductGridSkeleton } from '@/components/ui/Skeleton'
import { stagger, scaleIn } from '@/lib/animations'

interface ProductGridProps {
  products: any[]
  isLoading?: boolean
}

export function ProductGrid({ products, isLoading }: ProductGridProps) {
  if (isLoading) return <ProductGridSkeleton />

  if (!products?.length) {
    return (
      <div className="col-span-full text-center py-20">
        <p className="font-body text-muted text-lg">No encontramos productos con esos filtros.</p>
        <p className="font-body text-sm text-muted mt-2">Probá ajustando los filtros o buscando otro término.</p>
      </div>
    )
  }

  return (
    <motion.div
      variants={stagger}
      initial="hidden"
      animate="visible"
      className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
    >
      {products.map((product, i) => (
        <motion.div key={product.id} variants={scaleIn} transition={{ delay: i * 0.03 }}>
          <ProductCard product={product} />
        </motion.div>
      ))}
    </motion.div>
  )
}
