import { useSearchParams } from 'react-router-dom'
import { useProducts } from '@/hooks/useProducts'
import { ProductGrid } from '@/components/products/ProductGrid'
import { Input } from '@/components/ui/Input'
import { useSEO } from '@/hooks/useSEO'

export default function Search() {
  const [searchParams, setSearchParams] = useSearchParams()
  const query = searchParams.get('q') || ''

  const { data, isLoading } = useProducts({ search: query || undefined })
  const products = data?.pages.flat() || []

  useSEO({
    title: query ? `"${query}" — Búsqueda | Magnus` : 'Buscar | Magnus',
  })

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const q = formData.get('q') as string
    if (q.trim()) {
      const params = new URLSearchParams(searchParams)
      params.set('q', q.trim())
      setSearchParams(params)
    }
  }

  return (
    <div className="pt-24 pb-16">
      <div className="container-wide">
        <form onSubmit={handleSearch} className="max-w-md mb-12">
          <Input
            name="q"
            defaultValue={query}
            placeholder="Buscar productos..."
            className="text-lg py-4"
          />
        </form>

        {query && (
          <p className="font-body text-sm text-muted mb-6">
            {products.length} resultados para "<span className="text-white">{query}</span>"
          </p>
        )}

        <ProductGrid products={products} isLoading={isLoading} />
      </div>
    </div>
  )
}
