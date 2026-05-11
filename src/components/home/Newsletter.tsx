import { useState } from 'react'
import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import { useIntersectionObserver } from '@/hooks/useIntersectionObserver'
import { fadeUp } from '@/lib/animations'
import { supabase } from '@/lib/supabase'

export function Newsletter() {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const { ref, isInView } = useIntersectionObserver({ triggerOnce: true })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus('loading')
    try {
      await (supabase.from('newsletter_subscribers') as any).insert({ email, source: 'website' })
      setStatus('success')
      setEmail('')
    } catch {
      setStatus('error')
    }
  }

  return (
    <section ref={ref} className="py-24 bg-lime">
      <div className="container-wide">
        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          className="max-w-2xl mx-auto text-center"
        >
          <span className="font-mono text-label text-bg">— Newsletter</span>
          <h2 className="font-display text-display-lg text-bg mt-2">
            Entérate de los drops primero
          </h2>
          <p className="font-body text-bg/70 mt-4 mb-8">
            Sé el primero en recibir notificaciones de nuevos drops, ediciones limitadas y ofertas exclusivas.
          </p>

          <form onSubmit={handleSubmit} className="flex gap-2 max-w-md mx-auto">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="tu@email.com"
              required
              className="flex-1 bg-bg text-white px-5 py-4 font-body placeholder:text-muted focus:outline-none"
            />
            <button
              type="submit"
              disabled={status === 'loading'}
              className="bg-bg text-lime px-6 py-4 font-body font-semibold hover:bg-bg-2 transition-colors disabled:opacity-50"
            >
              {status === 'loading' ? (
                <span className="w-4 h-4 border-2 border-lime border-t-transparent rounded-full animate-spin block" />
              ) : (
                <ArrowRight size={20} />
              )}
            </button>
          </form>

          {status === 'success' && (
            <p className="text-bg font-body text-sm mt-4">¡Gracias por suscribirte!</p>
          )}
          {status === 'error' && (
            <p className="text-red font-body text-sm mt-4">Este email ya está registrado.</p>
          )}
        </motion.div>
      </div>
    </section>
  )
}
