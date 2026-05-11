import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { useIntersectionObserver } from '@/hooks/useIntersectionObserver'
import { useHomeBrands, useHomepageSettings } from '@/hooks/useHomeContent'
import { fadeUp, stagger } from '@/lib/animations'

export function BrandsSection() {
  const { ref, isInView } = useIntersectionObserver({ triggerOnce: true })
  const { data: settings } = useHomepageSettings()
  const { data: brands, isLoading } = useHomeBrands()

  return (
    <section className="py-24 bg-bg">
      <div className="container-wide">
        <motion.div
          ref={ref}
          variants={stagger}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          className="space-y-12"
        >
          <motion.div variants={fadeUp} className="text-center">
            <span className="font-mono text-label text-lime">{settings?.brands_section_label ?? '— Marcas'}</span>
            <h2 className="font-display text-display-lg text-white mt-2">{settings?.brands_section_title ?? 'Marcas exclusivas'}</h2>
          </motion.div>

          {isLoading ? (
            <p className="font-body text-muted">Cargando marcas desde la base de datos...</p>
          ) : (
            <motion.div variants={fadeUp} className="grid grid-cols-2 md:grid-cols-5 gap-4">
              {brands?.map((brand) => (
                <Link
                  key={brand.id}
                  to={`/marca/${brand.slug}`}
                  className="card p-8 flex items-center justify-center hover:border-lime transition-colors group"
                >
                  <span className="font-display text-display-md text-muted group-hover:text-white transition-colors">
                    {brand.name}
                  </span>
                </Link>
              ))}
            </motion.div>
          )}
        </motion.div>
      </div>
    </section>
  )
}
