import { motion } from 'framer-motion'
import { Clock } from 'lucide-react'
import { useUpcomingDrops } from '@/hooks/useDrops'
import { useIntersectionObserver } from '@/hooks/useIntersectionObserver'
import { fadeUp } from '@/lib/animations'
import { formatCOP } from '@/lib/utils'

export function DropBanner() {
  const { data: drops, isLoading } = useUpcomingDrops()
  const { ref, isInView } = useIntersectionObserver({ triggerOnce: true })
  const nextDrop = drops?.[0]

  const getTimeRemaining = (date: string) => {
    const diff = new Date(date).getTime() - Date.now()
    if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0 }
    return {
      days: Math.floor(diff / (1000 * 60 * 60 * 24)),
      hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((diff / (1000 * 60)) % 60),
      seconds: Math.floor((diff / 1000) % 60),
    }
  }

  return (
    <section ref={ref} className="relative py-32 overflow-hidden bg-bg">
      <div className="absolute inset-0 bg-grid opacity-20" />
      {nextDrop?.cover_url && (
        <div
          className="absolute inset-0 bg-cover bg-center opacity-20"
          style={{ backgroundImage: `url(${nextDrop.cover_url})` }}
        />
      )}

      <div className="container-wide relative z-10">
        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          className="max-w-3xl mx-auto text-center"
        >
          <span className="font-mono text-label text-lime">— Próximo Drop</span>

          <h2 className="font-display text-display-lg text-white mt-4 mb-4">
            {nextDrop?.name || 'DROP VIII'}
          </h2>

          <p className="font-body text-muted mb-8 max-w-lg mx-auto">
            {nextDrop?.description || 'Edición limitada. Una vez agotado, no habrá reestock.'}
          </p>

          {nextDrop && (
            <div className="flex items-center justify-center gap-6 mb-8">
              {Object.entries(getTimeRemaining(nextDrop.drop_date)).map(([unit, value]) => (
                <div key={unit} className="text-center">
                  <p className="font-display text-display-md text-lime">{value}</p>
                  <p className="font-mono text-micro text-muted uppercase">{unit}</p>
                </div>
              ))}
            </div>
          )}

          <button className="btn-primary inline-flex items-center gap-2">
            <Clock size={16} />
            Notifícame
          </button>
        </motion.div>
      </div>
    </section>
  )
}
