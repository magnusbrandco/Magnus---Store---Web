import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface ProductImagesProps {
  images: string[]
  name: string
}

export function ProductImages({ images, name }: ProductImagesProps) {
  const [selected, setSelected] = useState(0)

  return (
    <div className="flex gap-4">
      <div className="flex flex-col gap-2">
        {images.map((img, i) => (
          <button
            key={i}
            onClick={() => setSelected(i)}
            className={`w-16 h-20 border-2 overflow-hidden shrink-0 transition-colors ${
              selected === i ? 'border-lime' : 'border-border hover:border-white/30'
            }`}
          >
            <img src={img} alt="" className="w-full h-full object-cover" />
          </button>
        ))}
      </div>

      <div className="flex-1 aspect-[4/5] bg-bg-3 overflow-hidden relative">
        <AnimatePresence mode="wait">
          <motion.img
            key={selected}
            src={images[selected]}
            alt={name}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="w-full h-full object-cover"
          />
        </AnimatePresence>
      </div>
    </div>
  )
}
