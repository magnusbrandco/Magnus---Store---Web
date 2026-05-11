import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { useFeaturedProducts } from '@/hooks/useProducts'
import { ProductGridSkeleton } from '@/components/ui/Skeleton'
import { ProductCard } from '@/components/products/ProductCard'
import { fadeUp, stagger } from '@/lib/animations'
import { useIntersectionObserver } from '@/hooks/useIntersectionObserver'

export function FeaturedProducts() {
  const { data: products, isLoading } = useFeaturedProducts()
  const { ref, isInView } = useIntersectionObserver({ triggerOnce: true })

  return (
    <section className="py-24 bg-bg-2">
      <div className="container-wide">
        <motion.div
          ref={ref}
          variants={stagger}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          className="space-y-12"
        >
          <motion.div variants={fadeUp} className="flex items-end justify-between">
            <div>
              <span className="font-mono text-label text-lime">— Destacados</span>
              <h2 className="font-display text-display-lg text-white mt-2">Lo más buscado</h2>
            </div>
            <Link to="/tienda" className="font-body text-sm text-muted hover:text-white transition-colors hidden md:block">
              Ver todo →
            </Link>
          </motion.div>

          {isLoading ? (
            <ProductGridSkeleton count={4} />
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {products?.slice(0, 8).map((product: any, i: number) => (
                <motion.div key={product.id} variants={fadeUp} transition={{ delay: i * 0.05 }}>
                  <ProductCard product={product} />
                </motion.div>
              ))}
            </div>
          )}

          <motion.div variants={fadeUp} className="text-center md:hidden">
            <Link to="/tienda" className="btn-outline inline-block">
              Ver todo →
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
