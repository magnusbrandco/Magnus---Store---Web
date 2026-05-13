import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowDown } from 'lucide-react'
import { stagger, slideUp } from '@/lib/animations'
import { useHomeCounts, useHomepageSettings } from '@/hooks/useHomeContent'

export function Hero() {
  const [showPreloader, setShowPreloader] = useState(true)
  const { data: settings } = useHomepageSettings()
  const { data: counts } = useHomeCounts()

  useEffect(() => {
    const timer = setTimeout(() => setShowPreloader(false), 2000)
    return () => clearTimeout(timer)
  }, [])

  if (showPreloader) {
    return (
      <div className="fixed inset-0 z-[9998] bg-bg flex items-center justify-center">
        <motion.span
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="font-display text-display-xl text-lime"
        >
          MAGNUS
        </motion.span>
      </div>
    )
  }

  const heroTitleLines = settings?.hero_title?.split('\n') ?? ['CULTURA', 'URBANA', 'PREMIUM']
  const stats = [
    { value: counts?.brands ? `${counts.brands}` : '0', label: 'Marcas' },
    { value: counts?.categories ? `${counts.categories}` : 'Categorías' },
    { value: counts?.products ? `${counts.products}+` : '0', label: 'Productos' },
  ]

  return (
    <section className="relative min-h-screen flex items-center bg-bg overflow-hidden">
      <div className="absolute inset-0 bg-grid bg-[length:60px_60px] opacity-30" />
      <div className="absolute inset-0 bg-noise bg-[length:200px_200px] opacity-20 animate-noise" />

      <div className="container-wide relative z-10 pt-24 pb-16">
        <motion.div
          variants={stagger}
          initial="hidden"
          animate="visible"
          className="space-y-6"
        >
          <motion.span
            variants={slideUp}
            className="font-mono text-label text-lime block"
          >
            {settings?.hero_series_label ?? '— Colección 2026'}
          </motion.span>

          <h1 className="font-display text-display-xl text-white leading-[0.88] -ml-1">
            {heroTitleLines.map((line, index) => (
              <motion.span
                key={`${line}-${index}`}
                variants={slideUp}
                className={index === 1 ? 'block animate-glitch' : 'block'}
                style={index === 1 ? { color: settings?.hero_highlight_color ?? '#05C7F2' } : undefined}
              >
                {line}
              </motion.span>
            ))}
          </h1>

          <motion.p
            variants={slideUp}
            className="font-body text-lg text-muted max-w-md"
          >
            {settings?.hero_description ?? 'Sneakers, streetwear y accesorios auténticos. Drops limitados, cultura sin límites.'}
          </motion.p>

          <motion.div variants={slideUp} className="flex items-center gap-4 pt-4">
            <Link to={settings?.hero_primary_cta_link ?? '/drops'} className="btn-primary">
              {settings?.hero_primary_cta_label ?? 'Explorar Drops'}
            </Link>
            <Link to={settings?.hero_secondary_cta_link ?? '/tienda'} className="btn-outline">
              {settings?.hero_secondary_cta_label ?? 'Ver tienda'}
            </Link>
          </motion.div>

          <motion.div
            variants={slideUp}
            className="flex items-center gap-8 pt-8"
          >
            {stats.map((stat) => (
              <div key={stat.label}>
                <p className="font-display text-display-md text-lime">{stat.value}</p>
                <p className="font-mono text-micro text-muted uppercase">{stat.label}</p>
              </div>
            ))}
          </motion.div>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.5 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <ArrowDown className="text-muted animate-pulse-scroll" size={20} />
      </motion.div>
    </section>
  )
}
