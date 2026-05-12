import { useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useSEO } from '@/hooks/useSEO'
import { supabase } from '@/lib/supabase'
import type { Product, Brand, Category } from '@/types/database'

interface ProductWithRelations extends Product {
  brand: Brand | null
  category: Category | null
}

type ProductFormState = {
  name: string
  slug: string
  description: string
  imageUrl: string
  base_price: string
  compare_price: string
  brand_id: string
  category_id: string
  is_active: boolean
  is_featured: boolean
  is_drop: boolean
  tags: string
}

const initialFormState: ProductFormState = {
  name: '',
  slug: '',
  description: '',
  imageUrl: '',
  base_price: '',
  compare_price: '',
  brand_id: '',
  category_id: '',
  is_active: true,
  is_featured: false,
  is_drop: false,
  tags: '',
}

function createSlug(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replaceAll(/\s+/g, '-')
    .replaceAll(/[^a-z0-9-]/g, '')
}

export default function ProductsAdmin() {
  useSEO({ title: 'Admin Productos | Magnus' })

  const queryClient = useQueryClient()
  const [form, setForm] = useState<ProductFormState>(initialFormState)
  const [isCreating, setIsCreating] = useState(false)
  const { data, isLoading, error } = useQuery<ProductWithRelations[]>({
    queryKey: ['admin', 'products'],
    queryFn: async () => {
      const { data, error } = await (supabase
        .from('products')
        .select(`*, brand:brands(id, name), category:categories(id, name)`)
        .order('created_at', { ascending: false }) as any)
      if (error) throw error
      return data ?? []
    },
  })

  const { data: brands } = useQuery<Brand[]>({
    queryKey: ['admin', 'brands'],
    queryFn: async () => {
      const { data, error } = await (supabase.from('brands').select('id, name').order('name') as any)
      if (error) throw error
      return data ?? []
    },
  })

  const { data: categories } = useQuery<Category[]>({
    queryKey: ['admin', 'categories'],
    queryFn: async () => {
      const { data, error } = await (supabase.from('categories').select('id, name').order('name') as any)
      if (error) throw error
      return data ?? []
    },
  })

  const createProduct = useMutation({
    mutationFn: async (payload: Record<string, unknown>) => {
      const { data, error } = await ((supabase as any).from('products').insert([payload]).select().single())
      if (error) throw error
      return data as Product
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'products'] })
      setForm(initialFormState)
      setIsCreating(false)
    },
  })

  const handleInput = (field: keyof ProductFormState, value: string | boolean) => {
    setForm((prev) => ({
      ...prev,
      [field]: value,
      ...(field === 'name' && typeof value === 'string' ? { slug: createSlug(value) } : {}),
    }))
  }

  const handleSubmit = async (event: { preventDefault: () => void }) => {
    event.preventDefault()

    const payload = {
      name: form.name,
      slug: form.slug || createSlug(form.name),
      description: form.description || null,
      brand_id: form.brand_id || null,
      category_id: form.category_id || null,
      base_price: Number(form.base_price) || 0,
      compare_price: form.compare_price ? Number(form.compare_price) : null,
      images: form.imageUrl ? [form.imageUrl] : [],
      tags: form.tags ? form.tags.split(',').map((tag) => tag.trim()).filter(Boolean) : [],
      is_active: form.is_active,
      is_featured: form.is_featured,
      is_drop: form.is_drop,
      metadata: {},
    }

    await createProduct.mutateAsync(payload)
  }

  let content

  if (isLoading) {
    content = <p className="font-body text-muted">Cargando productos...</p>
  } else if (error) {
    content = <p className="font-body text-red">Error cargando productos: {error.message}</p>
  } else if (data?.length) {
    content = (
      <div className="overflow-x-auto rounded-xl border border-border bg-bg-3">
        <table className="min-w-full text-left text-sm text-white">
          <thead className="border-b border-border bg-bg p-3 text-xs uppercase tracking-[0.2em] text-muted">
            <tr>
              <th className="px-4 py-3">Producto</th>
              <th className="px-4 py-3">Marca / Categoría</th>
              <th className="px-4 py-3">Precio</th>
              <th className="px-4 py-3">Activo</th>
              <th className="px-4 py-3">Destacado</th>
            </tr>
          </thead>
          <tbody>
            {data.map((product) => (
              <tr key={product.id} className="border-b border-border hover:bg-bg">
                <td className="px-4 py-4">
                  <p className="font-medium text-white">{product.name}</p>
                  <p className="font-body text-xs text-muted">{product.slug}</p>
                </td>
                <td className="px-4 py-4">
                  <p>{product.brand?.name ?? 'Sin marca'}</p>
                  <p className="font-body text-xs text-muted">{product.category?.name ?? 'Sin categoría'}</p>
                </td>
                <td className="px-4 py-4">${product.base_price.toFixed(0)}</td>
                <td className="px-4 py-4">{product.is_active ? 'Sí' : 'No'}</td>
                <td className="px-4 py-4">{product.is_featured ? 'Sí' : 'No'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    )
  } else {
    content = <p className="font-body text-muted">No hay productos registrados.</p>
  }

  return (
    <div>
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-display-lg text-white">Productos</h1>
          <p className="font-body text-muted mt-2">Lista de productos activos e inactivos desde la base de datos.</p>
        </div>
        <button
          type="button"
          onClick={() => setIsCreating((prev) => !prev)}
          className="inline-flex items-center gap-2 rounded-full border border-lime bg-lime/10 px-4 py-2 text-sm font-medium text-lime transition hover:bg-lime/20"
        >
          + Añadir producto
        </button>
      </div>

      {isCreating && (
        <section className="mb-8 rounded-3xl border border-border bg-bg-3 p-6">
          <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="font-mono text-label text-lime">— Nuevo producto</p>
              <h2 className="font-display text-display-sm text-white mt-2">Agrega un producto nuevo a la tienda</h2>
            </div>
            <button
              type="button"
              onClick={() => setIsCreating(false)}
              className="font-body text-sm text-muted hover:text-white"
            >
              Cancelar
            </button>
          </div>

          <form onSubmit={handleSubmit} className="grid gap-4 lg:grid-cols-2">
            <label className="block">
              <span className="font-body text-sm text-muted">Nombre</span>
              <input
                value={form.name}
                onChange={(event) => handleInput('name', event.target.value)}
                required
                className="mt-2 w-full rounded border border-border bg-bg px-3 py-2 text-white"
              />
            </label>
            <label className="block">
              <span className="font-body text-sm text-muted">Slug</span>
              <input
                value={form.slug}
                onChange={(event) => handleInput('slug', event.target.value)}
                className="mt-2 w-full rounded border border-border bg-bg px-3 py-2 text-white"
              />
            </label>
            <label className="block lg:col-span-2">
              <span className="font-body text-sm text-muted">Descripción</span>
              <textarea
                value={form.description}
                onChange={(event) => handleInput('description', event.target.value)}
                className="mt-2 w-full min-h-[120px] rounded border border-border bg-bg px-3 py-2 text-white"
              />
            </label>
            <label className="block">
              <span className="font-body text-sm text-muted">Precio</span>
              <input
                type="number"
                value={form.base_price}
                onChange={(event) => handleInput('base_price', event.target.value)}
                required
                min="0"
                step="1"
                className="mt-2 w-full rounded border border-border bg-bg px-3 py-2 text-white"
              />
            </label>
            <label className="block">
              <span className="font-body text-sm text-muted">Precio comparativo</span>
              <input
                type="number"
                value={form.compare_price}
                onChange={(event) => handleInput('compare_price', event.target.value)}
                min="0"
                step="1"
                className="mt-2 w-full rounded border border-border bg-bg px-3 py-2 text-white"
              />
            </label>
            <label className="block">
              <span className="font-body text-sm text-muted">Imagen URL</span>
              <input
                value={form.imageUrl}
                onChange={(event) => handleInput('imageUrl', event.target.value)}
                className="mt-2 w-full rounded border border-border bg-bg px-3 py-2 text-white"
              />
            </label>
            <label className="block">
              <span className="font-body text-sm text-muted">Etiquetas (separadas por coma)</span>
              <input
                value={form.tags}
                onChange={(event) => handleInput('tags', event.target.value)}
                className="mt-2 w-full rounded border border-border bg-bg px-3 py-2 text-white"
              />
            </label>
            <label className="block">
              <span className="font-body text-sm text-muted">Marca</span>
              <select
                value={form.brand_id}
                onChange={(event) => handleInput('brand_id', event.target.value)}
                className="mt-2 w-full rounded border border-border bg-bg px-3 py-2 text-white"
              >
                <option value="">Sin marca</option>
                {brands?.map((brand) => (
                  <option key={brand.id} value={brand.id}>{brand.name}</option>
                ))}
              </select>
            </label>
            <label className="block">
              <span className="font-body text-sm text-muted">Categoría</span>
              <select
                value={form.category_id}
                onChange={(event) => handleInput('category_id', event.target.value)}
                className="mt-2 w-full rounded border border-border bg-bg px-3 py-2 text-white"
              >
                <option value="">Sin categoría</option>
                {categories?.map((category) => (
                  <option key={category.id} value={category.id}>{category.name}</option>
                ))}
              </select>
            </label>
            <div className="flex flex-col gap-3 lg:col-span-2 md:flex-row md:items-center md:justify-between">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={form.is_active}
                  onChange={(event) => handleInput('is_active', event.target.checked)}
                  className="h-4 w-4 rounded border border-border bg-bg text-lime"
                />
                <span className="font-body text-sm text-muted">Activo</span>
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={form.is_featured}
                  onChange={(event) => handleInput('is_featured', event.target.checked)}
                  className="h-4 w-4 rounded border border-border bg-bg text-lime"
                />
                <span className="font-body text-sm text-muted">Destacado</span>
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={form.is_drop}
                  onChange={(event) => handleInput('is_drop', event.target.checked)}
                  className="h-4 w-4 rounded border border-border bg-bg text-lime"
                />
                <span className="font-body text-sm text-muted">Es drop</span>
              </label>
            </div>

            <div className="lg:col-span-2 flex items-center gap-3">
              <button
                type="submit"
                disabled={createProduct.isPending}
                className="btn-primary inline-flex items-center justify-center rounded-full px-6 py-3"
              >
                {createProduct.isPending ? 'Guardando...' : 'Guardar producto'}
              </button>
              {createProduct.isSuccess && (
                <p className="font-body text-sm text-lime">Producto creado correctamente.</p>
              )}
              {createProduct.isError && (
                <p className="font-body text-sm text-red">Error: {createProduct.error instanceof Error ? createProduct.error.message : 'No se pudo crear'}</p>
              )}
            </div>
          </form>
        </section>
      )}

      {content}
    </div>
  )
}
