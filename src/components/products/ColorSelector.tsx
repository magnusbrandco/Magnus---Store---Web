import type { ColorOption } from '@/types'

interface ColorSelectorProps {
  colors: { name: string; hex: string }[]
  selected: string
  onChange: (hex: string) => void
}

export function ColorSelector({ colors, selected, onChange }: ColorSelectorProps) {
  return (
    <div>
      <p className="font-mono text-label text-muted uppercase mb-3">
        Color {selected && <span className="text-white">— {colors.find((c) => c.hex === selected)?.name}</span>}
      </p>
      <div className="flex items-center gap-2">
        {colors.map((color) => (
          <button
            key={color.hex}
            onClick={() => onChange(color.hex)}
            className={`w-8 h-8 rounded-full border-2 transition-all ${
              selected === color.hex ? 'border-lime scale-110' : 'border-border hover:border-white'
            }`}
            style={{ backgroundColor: color.hex }}
            title={color.name}
          />
        ))}
      </div>
    </div>
  )
}
