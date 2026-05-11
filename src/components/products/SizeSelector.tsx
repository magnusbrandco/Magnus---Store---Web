import type { SizeOption } from '@/types'

interface SizeSelectorProps {
  sizes: SizeOption[]
  selected: string
  onChange: (size: string) => void
}

export function SizeSelector({ sizes, selected, onChange }: SizeSelectorProps) {
  return (
    <div>
      <p className="font-mono text-label text-muted uppercase mb-3">
        Talla {selected && <span className="text-white">— {selected}</span>}
      </p>
      <div className="flex flex-wrap gap-2">
        {sizes.map((size) => (
          <button
            key={size.value}
            onClick={() => size.inStock && onChange(size.value)}
            disabled={!size.inStock}
            className={`min-w-[3rem] px-4 py-2.5 font-body text-sm border transition-colors ${
              selected === size.value
                ? 'bg-lime text-bg border-lime'
                : size.inStock
                ? 'bg-transparent text-white border-border hover:border-white'
                : 'bg-transparent text-muted border-border opacity-40 line-through cursor-not-allowed'
            }`}
          >
            {size.label}
          </button>
        ))}
      </div>
    </div>
  )
}
