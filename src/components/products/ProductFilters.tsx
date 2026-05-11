import { useSearchParams } from 'react-router-dom'
import { X } from 'lucide-react'

const sortOptions = [
  { value: '', label: 'Relevancia' },
  { value: 'newest', label: 'Más nuevos' },
  { value: 'price_asc', label: 'Precio ↑' },
  { value: 'price_desc', label: 'Precio ↓' },
]

export function ProductFilters() {
  const [searchParams, setSearchParams] = useSearchParams()

  const updateParam = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams)
    if (value) {
      params.set(key, value)
    } else {
      params.delete(key)
    }
    params.set('pagina', '1')
    setSearchParams(params)
  }

  const removeParam = (key: string) => {
    const params = new URLSearchParams(searchParams)
    params.delete(key)
    params.set('pagina', '1')
    setSearchParams(params)
  }

  const activeFilters: { key: string; label: string }[] = []
  searchParams.forEach((value, key) => {
    if (key !== 'pagina' && key !== 'orden') {
      activeFilters.push({ key, label: `${key}: ${value}` })
    }
  })

  return (
    <aside className="space-y-8">
      <div>
        <h4 className="font-mono text-label text-lime uppercase mb-4">Ordenar</h4>
        <div className="flex flex-col gap-2">
          {sortOptions.map((opt) => (
            <button
              key={opt.value}
              onClick={() => updateParam('orden', opt.value)}
              className={`font-body text-sm text-left transition-colors ${
                searchParams.get('orden') === opt.value || (!searchParams.get('orden') && !opt.value)
                  ? 'text-lime'
                  : 'text-muted hover:text-white'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      <div>
        <h4 className="font-mono text-label text-lime uppercase mb-4">Categoría</h4>
        <div className="flex flex-col gap-2">
          {['Sneakers', 'Hoodies', 'Camisetas', 'Accesorios'].map((cat) => (
            <button
              key={cat}
              onClick={() => updateParam('categoria', cat.toLowerCase())}
              className={`font-body text-sm text-left transition-colors ${
                searchParams.get('categoria') === cat.toLowerCase()
                  ? 'text-lime'
                  : 'text-muted hover:text-white'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <div>
        <h4 className="font-mono text-label text-lime uppercase mb-4">Precio</h4>
        <div className="flex items-center gap-2">
          <input
            type="number"
            placeholder="Min"
            value={searchParams.get('precio_min') || ''}
            onChange={(e) => updateParam('precio_min', e.target.value)}
            className="input-field w-24 text-sm"
          />
          <span className="text-muted">—</span>
          <input
            type="number"
            placeholder="Max"
            value={searchParams.get('precio_max') || ''}
            onChange={(e) => updateParam('precio_max', e.target.value)}
            className="input-field w-24 text-sm"
          />
        </div>
      </div>

      {activeFilters.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {activeFilters.map((f) => (
            <button
              key={f.key}
              onClick={() => removeParam(f.key)}
              className="flex items-center gap-1 bg-bg-3 border border-border px-3 py-1.5 font-mono text-micro text-muted hover:border-lime transition-colors"
            >
              {f.label}
              <X size={12} />
            </button>
          ))}
        </div>
      )}
    </aside>
  )
}
