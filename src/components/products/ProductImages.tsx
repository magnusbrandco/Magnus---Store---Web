import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronLeft, ChevronRight } from 'lucide-react'

interface ProductImagesProps {
  images: string[]
  name: string
}

export function ProductImages({ images, name }: ProductImagesProps) {
  const [selected, setSelected] = useState(0)
  const hasImages = images.length > 0
  const selectedIndex = hasImages ? Math.min(selected, images.length - 1) : 0

  const handlePrev = () => {
    if (!hasImages) return
    setSelected((prev) => (prev - 1 + images.length) % images.length)
  }

  const handleNext = () => {
    if (!hasImages) return
    setSelected((prev) => (prev + 1) % images.length)
  }

  return (
    <div className="flex gap-4">
      <div className="flex flex-col gap-2">
        {hasImages ? (
          images.map((img, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setSelected(i)}
              className={`w-16 h-20 border-2 overflow-hidden shrink-0 transition-colors ${
                selectedIndex === i ? 'border-lime' : 'border-border hover:border-white/30'
              }`}
            >
              <img src={img} alt="" className="w-full h-full object-cover" />
            </button>
          ))
        ) : (
          <div className="w-16 h-20 rounded border border-border bg-bg flex items-center justify-center text-xs text-muted">
            Sin imagen
          </div>
        )}
      </div>

      <div className="flex-1 aspect-[4/5] bg-bg-3 overflow-hidden relative">
        {hasImages ? (
          <AnimatePresence mode="wait">
            <motion.img
              key={selectedIndex}
              src={images[selectedIndex]}
              alt={name}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="w-full h-full object-cover"
            />
          </AnimatePresence>
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-border/20 text-center text-sm text-muted">
            Imagen no disponible
          </div>
        )}

        {hasImages && images.length > 1 && (
          <div className="absolute inset-x-0 bottom-4 flex items-center justify-between px-3">
            <button
              type="button"
              onClick={handlePrev}
              className="rounded-full bg-black/70 p-2 text-white transition hover:bg-black"
              aria-label="Imagen anterior"
            >
              <ChevronLeft size={18} />
            </button>
            <button
              type="button"
              onClick={handleNext}
              className="rounded-full bg-black/70 p-2 text-white transition hover:bg-black"
              aria-label="Siguiente imagen"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
