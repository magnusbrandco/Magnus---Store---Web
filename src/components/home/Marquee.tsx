import { motion } from 'framer-motion'

const items = [
  'NUEVA COLECCIÓN', 'ENVÍO GRATIS +$200K', 'DROPS LIMITADOS',
  '100% AUTÉNTICO', 'SNEAKERS', 'STREETWEAR', 'ACCESORIOS',
  'NUEVA COLECCIÓN', 'ENVÍO GRATIS +$200K', 'DROPS LIMITADOS',
  '100% AUTÉNTICO', 'SNEAKERS', 'STREETWEAR', 'ACCESORIOS',
]

export function Marquee() {
  return (
    <div className="relative overflow-hidden bg-lime py-4">
      <motion.div
        animate={{ x: ['0%', '-50%'] }}
        transition={{ duration: 20, ease: 'linear', repeat: Infinity }}
        className="flex whitespace-nowrap"
      >
        {items.map((text, i) => (
          <span
            key={i}
            className="font-display text-display-md text-bg mx-8 uppercase leading-none"
          >
            {text}
            <span className="inline-block mx-8">✦</span>
          </span>
        ))}
      </motion.div>
    </div>
  )
}
