import { motion } from 'framer-motion'
import { Shield, Truck, RotateCcw, Headphones } from 'lucide-react'
import { useIntersectionObserver } from '@/hooks/useIntersectionObserver'
import { fadeUp, stagger } from '@/lib/animations'

const features = [
  { icon: Shield, title: '100% Auténtico', desc: 'Todos nuestros productos son verificados y auténticos.' },
  { icon: Truck, title: 'Envío Rápido', desc: '48h en principales ciudades. Gratis en pedidos +$200K.' },
  { icon: RotateCcw, title: 'Devolución Fácil', desc: '30 días para devolver. Sin preguntas.' },
  { icon: Headphones, title: 'Soporte 24/7', desc: 'Estamos aquí para ayudarte cuando nos necesites.' },
]

export function FeaturesSection() {
  const { ref, isInView } = useIntersectionObserver({ triggerOnce: true })

  return (
    <section ref={ref} className="py-24 bg-bg-2">
      <div className="container-wide">
        <motion.div
          variants={stagger}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          className="grid grid-cols-2 md:grid-cols-4 gap-8"
        >
          {features.map((f, i) => (
            <motion.div key={i} variants={fadeUp} className="text-center">
              <div className="w-12 h-12 bg-lime/10 flex items-center justify-center mx-auto mb-4">
                <f.icon className="text-lime" size={22} />
              </div>
              <h3 className="font-display text-display-md text-white mb-2">{f.title}</h3>
              <p className="font-body text-sm text-muted">{f.desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
