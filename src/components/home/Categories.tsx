import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { useIntersectionObserver } from '@/hooks/useIntersectionObserver'
import { useHomeCategories, useHomepageSettings } from '@/hooks/useHomeContent'
import { fadeUp, stagger } from '@/lib/animations'
import { Shirt, ShoppingBag, Watch, Tent } from 'lucide-react'

const iconMap: Record<string, any> = {
  sneakers: ShoppingBag,
  hoodies: Shirt,
  accesorios: Watch,
  chaquetas: Tent,
}

export function Categories() {
  const { ref, isInView } = useIntersectionObserver({ triggerOnce: true })
  const { data: settings } = useHomepageSettings()
  const { data: categories, isLoading } = useHomeCategories()

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
          <motion.div variants={fadeUp}>
            <span className="font-mono text-label text-lime">{settings?.categories_section_label ?? '— Categorías'}</span>
            <h2 className="font-display text-display-lg text-white mt-2">{settings?.categories_section_title ?? 'Explora por categoría'}</h2>
          </motion.div>

          {isLoading ? (
            <p className="font-body text-muted">Cargando categorías reales...</p>
          ) : (
            <motion.div variants={fadeUp} className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {categories?.map((cat) => {
                const Icon = iconMap[cat.slug] ?? ShoppingBag
                return (
                  <Link
                    key={cat.id}
                    to={`/tienda?categoria=${cat.slug}`}
                    className="group relative card p-8 hover:border-lime transition-colors"
                  >
                    <div className="flex flex-col items-center text-center gap-3">
                      <Icon className="w-8 h-8 text-muted group-hover:text-lime transition-colors" />
                      <div>
                        <h3 className="font-display text-display-md text-white group-hover:text-lime transition-colors">
                          {cat.name}
                        </h3>
                        <p className="font-mono text-micro text-muted mt-1">{cat.count} productos</p>
                      </div>
                    </div>
                  </Link>
                )
              })}
            </motion.div>
          )}
        </motion.div>
      </div>
    </section>
  )
}
