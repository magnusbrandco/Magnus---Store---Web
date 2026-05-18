import { useState } from 'react'
import { z } from 'zod'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useSEO } from '@/hooks/useSEO'
import { normalizeImageUrl } from '@/lib/image'
import { Modal } from '@/components/ui'
import { notifications } from '@/lib/notifications'
import { supabase } from '@/lib/supabase'
import type { Category } from '@/types/database'

function createSlug(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replaceAll(/\s+/g, '-')
    .replaceAll(/[^a-z0-9-]/g, '')
}

const categorySchema = z.object({
  name: z.string().min(3, 'El nombre debe tener al menos 3 caracteres'),
  slug: z.string().min(3, 'El slug debe tener al menos 3 caracteres').regex(/^[a-z0-9-]+$/, 'El slug solo puede contener letras minúsculas, números y guiones'),
  imageUrl: z.string().url('La URL de la imagen no es válida').optional().or(z.literal('')),
  parentId: z.string().optional().or(z.literal('')),
})

export default function CategoriesAdmin() {
  useSEO({ title: 'Admin Categorías | Magnus' })

  const queryClient = useQueryClient()
  const [name, setName] = useState('')
  const [imageUrl, setImageUrl] = useState('')
  const [parentId, setParentId] = useState<string | null>(null)

  const [editingCategoryId, setEditingCategoryId] = useState<string | null>(null)
  const [editedName, setEditedName] = useState('')
  const [editedSlug, setEditedSlug] = useState('')
  const [editedImageUrl, setEditedImageUrl] = useState('')
  const [editedParentId, setEditedParentId] = useState<string | null>(null)

  const [deleteTarget, setDeleteTarget] = useState<Category | null>(null)
  const [savingCategoryId, setSavingCategoryId] = useState<string | null>(null)
  const [deletingCategoryId, setDeletingCategoryId] = useState<string | null>(null)

  const { data, isLoading, error } = useQuery<Category[]>({
    queryKey: ['admin', 'categories'],
    queryFn: async () => {
      const { data, error } = await (supabase.from('categories').select('*').order('name') as any)
      if (error) throw error
      return data ?? []
    },
  })

  const createCategory = useMutation({
    mutationFn: async () => {
      const trimmedName = name.trim()
      if (!trimmedName) throw new Error('El nombre es requerido.')
      const slug = createSlug(trimmedName)

      const existingName = await supabase.from('categories').select('id').eq('name', trimmedName).limit(1)
      if (existingName.error) throw existingName.error
      if (existingName.data?.length) throw new Error('Ya existe una categoría con ese nombre.')

      const existingSlug = await supabase.from('categories').select('id').eq('slug', slug).limit(1)
      if (existingSlug.error) throw existingSlug.error
      if (existingSlug.data?.length) throw new Error('Ya existe una categoría con ese slug.')

      const payload = {
        name: trimmedName,
        slug,
        description: null,
        image_url: normalizeImageUrl(imageUrl) || null,
        parent_id: parentId || null,
        sort_order: 0,
      }

      const { data, error } = await supabase.from('categories').insert(payload).select().single()
      if (error) throw error
      return data as Category
    },
    onSuccess: (data) => {
      queryClient.setQueryData<Category[]>(['admin', 'categories'], (old) =>
        old ? [...old, data].sort((a, b) => a.name.localeCompare(b.name)) : [data]
      )
      setName('')
      setImageUrl('')
      setParentId(null)
      notifications.success('Categoría creada', 'Categoría creada correctamente.')
    },
    onError: (error) => {
      notifications.error('Error al crear categoría', error instanceof Error ? error.message : 'No se pudo crear la categoría.')
    },
  })

  const updateCategory = useMutation({
    mutationFn: async (payload: { id: string; name: string; slug: string; image_url?: string | null; parent_id: string | null }) => {
      const trimmedName = payload.name.trim()
      if (!trimmedName) throw new Error('El nombre es requerido.')

      const existingName = await supabase
        .from('categories')
        .select('id')
        .eq('name', trimmedName)
        .neq('id', payload.id)
        .limit(1)
      if (existingName.error) throw existingName.error
      if (existingName.data?.length) throw new Error('Ya existe otra categoría con ese nombre.')

      const existingSlug = await supabase
        .from('categories')
        .select('id')
        .eq('slug', payload.slug)
        .neq('id', payload.id)
        .limit(1)
      if (existingSlug.error) throw existingSlug.error
      if (existingSlug.data?.length) throw new Error('Ya existe otro slug igual.')

      const { data, error } = await supabase
        .from('categories')
        .update({
          name: trimmedName,
          slug: payload.slug,
          image_url: normalizeImageUrl(payload.image_url || '' ) || null,
          parent_id: payload.parent_id || null,
        })
        .eq('id', payload.id)
        .select()
        .single()
      if (error) throw error
      return data as Category
    },
    onSuccess: (data) => {
      queryClient.setQueryData<Category[]>(['admin', 'categories'], (old) =>
        old ? old.map((category) => (category.id === data.id ? data : category)).sort((a, b) => a.name.localeCompare(b.name)) : [data]
      )
      resetEditCategory()
      notifications.success('Categoría actualizada', 'Categoría actualizada correctamente.')
    },
    onError: (error) => {
      notifications.error('Error al actualizar categoría', error instanceof Error ? error.message : 'No se pudo actualizar la categoría.')
    },
  })

  const deleteCategory = useMutation({
    mutationFn: async (id: string) => {
      const { data, error } = await supabase.from('categories').delete().eq('id', id).select().single()
      if (error) throw error
      return data as Category
    },
    onSuccess: (_, id) => {
      queryClient.setQueryData<Category[]>(['admin', 'categories'], (old) =>
        old ? old.filter((category) => category.id !== id) : []
      )
      if (editingCategoryId) resetEditCategory()
      notifications.success('Categoría eliminada', 'Categoría eliminada correctamente.')
    },
    onError: (error) => {
      notifications.error('Error al eliminar categoría', error instanceof Error ? error.message : 'No se pudo eliminar la categoría.')
    },
  })

  const isBusy =
    createCategory.status === 'pending' ||
    updateCategory.status === 'pending' ||
    deleteCategory.status === 'pending'

  const handleSubmit = async (event: { preventDefault: () => void }) => {
    event.preventDefault()

    const parsed = categorySchema.safeParse({
      name: name.trim(),
      slug: createSlug(name),
      imageUrl,
      parentId: parentId || '',
    })

    if (!parsed.success) {
      notifications.error('Error de validación', parsed.error.issues[0]?.message || 'Revisa los datos del formulario.')
      return
    }

    await createCategory.mutateAsync()
  }

  const handleEditCategory = (category: Category) => {
    setEditingCategoryId(category.id)
    setEditedName(category.name)
    setEditedSlug(category.slug ?? '')
    setEditedImageUrl(category.image_url ?? '')
    setEditedParentId(category.parent_id)
  }

  const resetEditCategory = () => {
    setEditingCategoryId(null)
    setEditedName('')
    setEditedSlug('')
    setEditedImageUrl('')
    setEditedParentId(null)
  }

  const handleDeleteCategory = (category: Category) => {
    setDeleteTarget(category)
  }

  const confirmDeleteCategory = async () => {
    if (!deleteTarget) return
    setDeletingCategoryId(deleteTarget.id)
    try {
      await deleteCategory.mutateAsync(deleteTarget.id)
    } finally {
      setDeletingCategoryId(null)
      setDeleteTarget(null)
    }
  }

  const handleSaveCategory = async () => {
    if (!editingCategoryId || !editedName.trim()) return
    setSavingCategoryId(editingCategoryId)
    try {
      await updateCategory.mutateAsync({
        id: editingCategoryId,
        name: editedName.trim(),
        slug: createSlug(editedSlug || editedName),
        image_url: editedImageUrl,
        parent_id: editedParentId || null,
      })
    } finally {
      setSavingCategoryId(null)
    }
  }

  const categoriesContent = (() => {
    if (isLoading) {
      return <p className="font-body text-muted">Cargando categorías...</p>
    }

    if (error) {
      return <p className="font-body text-red">Error cargando categorías: {error.message}</p>
    }

    if (!data?.length) {
      return <p className="font-body text-muted">No hay categorías registradas.</p>
    }

    return (
      <div className="overflow-x-auto rounded-xl border border-border bg-bg-3">
        <table className="min-w-full text-left text-sm text-white">
          <thead className="border-b border-border bg-bg p-3 text-xs uppercase tracking-[0.2em] text-muted">
            <tr>
              <th className="px-4 py-3">Imagen</th>
              <th className="px-4 py-3">Categoría</th>
              <th className="px-4 py-3">Slug</th>
              <th className="px-4 py-3">Padre</th>
              <th className="px-4 py-3">Creado</th>
              <th className="px-4 py-3">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {data.map((category) => {
              const parent = data.find((item) => item.id === category.parent_id)
              const isEditing = editingCategoryId === category.id
              const isSaving = savingCategoryId === category.id
              const isDeleting = deletingCategoryId === category.id
              return (
                <tr key={category.id} className="border-b border-border hover:bg-bg">
                  <td className="px-4 py-4">
                    <div className="inline-flex h-10 w-10 items-center justify-center overflow-hidden rounded-2xl border border-border bg-bg">
                      {category.image_url ? (
                        <img src={category.image_url} alt={category.name} className="h-full w-full object-cover" />
                      ) : (
                        <span className="font-body text-xs text-muted">No image</span>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    {isEditing ? (
                      <input
                        value={editedName}
                        onChange={(event) => setEditedName(event.target.value)}
                        className="w-full rounded border border-border bg-bg px-2 py-1 text-white"
                      />
                    ) : (
                      category.name
                    )}
                  </td>
                  <td className="px-4 py-4">
                    {isEditing ? (
                      <input
                        value={editedSlug}
                        onChange={(event) => setEditedSlug(event.target.value)}
                        className="w-full rounded border border-border bg-bg px-2 py-1 text-white"
                      />
                    ) : (
                      category.slug
                    )}
                  </td>
                  <td className="px-4 py-4">
                    {isEditing ? (
                      <select
                        value={editedParentId ?? ''}
                        onChange={(event) => setEditedParentId(event.target.value || null)}
                        className="w-full rounded border border-border bg-bg px-2 py-1 text-white"
                      >
                        <option value="">Sin padre</option>
                        {data
                          .filter((item) => item.id !== category.id)
                          .map((item) => (
                            <option key={item.id} value={item.id}>
                              {item.name}
                            </option>
                          ))}
                      </select>
                    ) : (
                      parent?.name ?? 'Sin padre'
                    )}
                  </td>
                  <td className="px-4 py-4">{new Date(category.created_at).toLocaleDateString()}</td>
                  <td className="px-4 py-4">
                    <div className="flex flex-wrap gap-2">
                      {isEditing ? (
                        <>
                          <button
                            type="button"
                            onClick={handleSaveCategory}
                            disabled={isBusy || isSaving}
                            className="text-lime hover:underline"
                          >
                            {isSaving ? 'Guardando...' : 'Guardar'}
                          </button>
                          <button
                            type="button"
                            onClick={resetEditCategory}
                            disabled={isBusy}
                            className="text-muted hover:text-white"
                          >
                            Cancelar
                          </button>
                        </>
                      ) : (
                        <button
                          type="button"
                          onClick={() => handleEditCategory(category)}
                          disabled={isBusy || (editingCategoryId !== null && !isEditing)}
                          className="text-lime hover:underline disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          Editar
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={() => handleDeleteCategory(category)}
                        disabled={isBusy}
                        className="text-red hover:underline disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        {isDeleting ? 'Eliminando...' : 'Eliminar'}
                      </button>
                    </div>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    )
  })()

  return (
    <div>
      <Modal
        isOpen={Boolean(deleteTarget)}
        onClose={() => setDeleteTarget(null)}
        title="Confirmar eliminación"
      >
        <p className="font-body text-sm text-muted mb-6">
          ¿Eliminar esta categoría? Esta acción no se puede deshacer.
        </p>
        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={() => setDeleteTarget(null)}
            className="rounded-full border border-border px-4 py-2 text-muted hover:text-white"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={confirmDeleteCategory}
            disabled={Boolean(deletingCategoryId)}
            className="btn-primary rounded-full px-4 py-2"
          >
            Eliminar
          </button>
        </div>
      </Modal>

      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-display-lg text-white">Categorías</h1>
          <p className="font-body text-muted mt-2">Crea y administra categorías para organizar productos.</p>
        </div>
      </div>

      <section className="mb-8 rounded-3xl border border-border bg-bg-3 p-6">
        <div className="mb-6">
          <p className="font-mono text-label text-lime">— Nueva categoría</p>
          <h2 className="font-display text-display-sm text-white mt-2">Agrega una categoría nueva</h2>
        </div>
        <form onSubmit={handleSubmit} className="grid gap-4 lg:grid-cols-4">
          <label className="block">
            <span className="font-body text-sm text-muted">Nombre</span>
            <input
              value={name}
              onChange={(event) => setName(event.target.value)}
              required
              disabled={isBusy}
              className="mt-2 w-full rounded border border-border bg-bg px-3 py-2 text-white"
            />
          </label>
          <label className="block">
            <span className="font-body text-sm text-muted">Slug</span>
            <input
              value={createSlug(name)}
              readOnly
              className="mt-2 w-full rounded border border-border bg-bg/80 px-3 py-2 text-white"
            />
          </label>
          <label className="block">
            <span className="font-body text-sm text-muted">Imagen URL</span>
            <input
              value={imageUrl}
              onChange={(event) => setImageUrl(event.target.value)}
              disabled={isBusy}
              className="mt-2 w-full rounded border border-border bg-bg px-3 py-2 text-white"
            />
            {imageUrl && (
              <div className="mt-2 overflow-hidden rounded-2xl border border-border bg-bg">
                <img src={imageUrl} alt="Vista previa de categoría" className="h-20 w-full object-cover" />
              </div>
            )}
          </label>
          <label className="block">
            <span className="font-body text-sm text-muted">Categoría padre</span>
            <select
              value={parentId ?? ''}
              onChange={(event) => setParentId(event.target.value || null)}
              disabled={isBusy}
              className="mt-2 w-full rounded border border-border bg-bg px-3 py-2 text-white"
            >
              <option value="">Sin padre</option>
              {data
                ?.filter((category) => category.id !== editingCategoryId)
                .map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
            </select>
          </label>
          <div className="lg:col-span-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <button
              type="submit"
              disabled={isBusy}
              className="btn-primary rounded-full px-6 py-3"
            >
              {createCategory.status === 'pending' ? 'Guardando...' : 'Crear categoría'}
            </button>
            <div className="space-y-1">
              {createCategory.isSuccess && (
                <p className="font-body text-sm text-lime">Categoría creada correctamente.</p>
              )}
              {createCategory.isError && (
                <p className="font-body text-sm text-red">Error: {createCategory.error instanceof Error ? createCategory.error.message : 'No se pudo crear la categoría.'}</p>
              )}
            </div>
          </div>
        </form>
      </section>

      <section className="rounded-3xl border border-border bg-bg-3 p-6">
        <div className="mb-6">
          <p className="font-mono text-label text-lime">— Categorías existentes</p>
          <h2 className="font-display text-display-sm text-white mt-2">Listado de categorías</h2>
        </div>
        {categoriesContent}
      </section>
    </div>
  )
}
