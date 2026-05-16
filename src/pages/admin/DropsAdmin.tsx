import { useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useSEO } from '@/hooks/useSEO'
import { supabase } from '@/lib/supabase'
import type { Drop } from '@/types/database'

interface DropWithProducts extends Drop {
  products: { product_id: string }[]
}

type DropFormState = {
  name: string
  slug: string
  description: string
  cover_url: string
  drop_date: string
  is_active: boolean
  is_published: boolean
}

const initialFormState: DropFormState = {
  name: '',
  slug: '',
  description: '',
  cover_url: '',
  drop_date: '',
  is_active: true,
  is_published: false,
}

function createSlug(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replaceAll(/\s+/g, '-')
    .replaceAll(/[^a-z0-9-]/g, '')
}

export default function DropsAdmin() {
  useSEO({ title: 'Admin Drops | Magnus' })

  const queryClient = useQueryClient()
  const [form, setForm] = useState<DropFormState>(initialFormState)
  const [isCreating, setIsCreating] = useState(false)

  const { data, isLoading, error } = useQuery<DropWithProducts[]>({
    queryKey: ['admin', 'drops'],
    queryFn: async () => {
      const { data, error } = await (supabase
        .from('drops')
        .select('*, products:drop_products(product_id)')
        .order('drop_date', { ascending: false }) as any)
      if (error) throw error
      return data ?? []
    },
  })

  const createDrop = useMutation({
    mutationFn: async (payload: Record<string, unknown>) => {
      const { data, error } = await ((supabase as any).from('drops').insert([payload]).select().single())
      if (error) throw error
      return data as Drop
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'drops'] })
      setForm(initialFormState)
      setIsCreating(false)
    },
  })

  const handleInput = (field: keyof DropFormState, value: string | boolean) => {
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
      cover_url: form.cover_url || null,
      drop_date: form.drop_date ? new Date(form.drop_date).toISOString() : new Date().toISOString(),
      is_active: form.is_active,
      is_published: form.is_published,
    }

    await createDrop.mutateAsync(payload)
  }

  let content

  if (isLoading) {
    content = <p className="font-body text-muted">Cargando drops...</p>
  } else if (error) {
    content = <p className="font-body text-red">Error cargando drops: {error.message}</p>
  } else if (data?.length) {
    content = (
      <div className="overflow-x-auto rounded-xl border border-border bg-bg-3">
        <table className="min-w-full text-left text-sm text-white">
          <thead className="border-b border-border bg-bg p-3 text-xs uppercase tracking-[0.2em] text-muted">
            <tr>
              <th className="px-4 py-3">Nombre</th>
              <th className="px-4 py-3">Fecha</th>
              <th className="px-4 py-3">Productos</th>
              <th className="px-4 py-3">Publicado</th>
              <th className="px-4 py-3">Activo</th>
            </tr>
          </thead>
          <tbody>
            {data.map((drop) => (
              <tr key={drop.id} className="border-b border-border hover:bg-bg">
                <td className="px-4 py-4">{drop.name}</td>
                <td className="px-4 py-4">{new Date(drop.drop_date).toLocaleDateString()}</td>
                <td className="px-4 py-4">{drop.products?.length ?? 0}</td>
                <td className="px-4 py-4">{drop.is_published ? 'Sí' : 'No'}</td>
                <td className="px-4 py-4">{drop.is_active ? 'Sí' : 'No'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    )
  } else {
    content = <p className="font-body text-muted">No hay drops creados.</p>
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-display text-display-lg text-white">Drops</h1>
        <p className="font-body text-muted mt-2">Listado de drops creados y publicados.</p>
      </div>

      <div className="mb-8 rounded-xl border border-border bg-bg-3 p-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h2 className="font-display text-display-sm text-white">Crear nuevo drop</h2>
            <p className="font-body text-muted mt-1">Agrega un lanzamiento y organiza tus drops desde el admin.</p>
          </div>
          <button
            type="button"
            className="btn-outline"
            onClick={() => setIsCreating((current) => !current)}
          >
            {isCreating ? 'Ocultar formulario' : 'Nuevo drop'}
          </button>
        </div>

        {isCreating && (
          <form onSubmit={handleSubmit} className="mt-6 grid gap-4 lg:grid-cols-2">
            <label className="block">
              <span className="font-body text-sm text-muted">Nombre</span>
              <input
                value={form.name}
                onChange={(event) => handleInput('name', event.target.value)}
                className="mt-2 w-full rounded border border-border bg-bg px-3 py-2 text-white"
                required
              />
            </label>

            <label className="block">
              <span className="font-body text-sm text-muted">Slug</span>
              <input
                value={form.slug}
                onChange={(event) => handleInput('slug', event.target.value)}
                className="mt-2 w-full rounded border border-border bg-bg px-3 py-2 text-white"
                placeholder="auto-generado"
              />
            </label>

            <label className="block lg:col-span-2">
              <span className="font-body text-sm text-muted">Descripción</span>
              <textarea
                value={form.description}
                onChange={(event) => handleInput('description', event.target.value)}
                className="mt-2 w-full min-h-[100px] rounded border border-border bg-bg px-3 py-2 text-white"
              />
            </label>

            <label className="block">
              <span className="font-body text-sm text-muted">Imagen de portada (URL)</span>
              <input
                value={form.cover_url}
                onChange={(event) => handleInput('cover_url', event.target.value)}
                className="mt-2 w-full rounded border border-border bg-bg px-3 py-2 text-white"
              />
            </label>

            <label className="block">
              <span className="font-body text-sm text-muted">Fecha del drop</span>
              <input
                type="datetime-local"
                value={form.drop_date}
                onChange={(event) => handleInput('drop_date', event.target.value)}
                className="mt-2 w-full rounded border border-border bg-bg px-3 py-2 text-white"
                required
              />
            </label>

            <div className="grid gap-4 lg:grid-cols-2">
              <label className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={form.is_active}
                  onChange={(event) => handleInput('is_active', event.target.checked)}
                  className="h-4 w-4"
                />
                <span className="font-body text-sm text-muted">Activo</span>
              </label>
              <label className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={form.is_published}
                  onChange={(event) => handleInput('is_published', event.target.checked)}
                  className="h-4 w-4"
                />
                <span className="font-body text-sm text-muted">Publicado</span>
              </label>
            </div>

            <div className="lg:col-span-2">
              <button
                type="submit"
                className="btn-primary"
                disabled={createDrop.status === 'pending'}
              >
                {createDrop.status === 'pending' ? 'Creando...' : 'Crear drop'}
              </button>
            </div>
          </form>
        )}
      </div>

      {content}
    </div>
  )
}
