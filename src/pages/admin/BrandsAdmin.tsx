import { useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useSEO } from '@/hooks/useSEO'
import { Modal, Toast } from '@/components/ui'
import { supabase } from '@/lib/supabase'
import type { Brand } from '@/types/database'

function createSlug(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replaceAll(/\s+/g, '-')
    .replaceAll(/[^a-z0-9-]/g, '')
}

export default function BrandsAdmin() {
  useSEO({ title: 'Admin Marcas | Magnus' })

  const queryClient = useQueryClient()
  const [name, setName] = useState('')
  const [logoUrl, setLogoUrl] = useState('')
  const [coverUrl, setCoverUrl] = useState('')

  const [editingBrandId, setEditingBrandId] = useState<string | null>(null)
  const [editedName, setEditedName] = useState('')
  const [editedSlug, setEditedSlug] = useState('')

  const [toastMessage, setToastMessage] = useState('')
  const [toastType, setToastType] = useState<'success' | 'error'>('success')
  const [toastVisible, setToastVisible] = useState(false)
  const [deleteTarget, setDeleteTarget] = useState<Brand | null>(null)
  const [savingBrandId, setSavingBrandId] = useState<string | null>(null)
  const [deletingBrandId, setDeletingBrandId] = useState<string | null>(null)

  const { data, isLoading, error } = useQuery<Brand[]>({
    queryKey: ['admin', 'brands'],
    queryFn: async () => {
      const { data, error } = await (supabase.from('brands').select('*').order('name') as any)
      if (error) throw error
      return data ?? []
    },
  })

  const showToast = (message: string, type: 'success' | 'error') => {
    setToastMessage(message)
    setToastType(type)
    setToastVisible(true)
  }

  const createBrand = useMutation({
    mutationFn: async () => {
      const trimmedName = name.trim()
      if (!trimmedName) throw new Error('El nombre es requerido.')
      const slug = createSlug(trimmedName)

      const existingName = await supabase.from('brands').select('id').eq('name', trimmedName).limit(1)
      if (existingName.error) throw existingName.error
      if (existingName.data?.length) throw new Error('Ya existe una marca con ese nombre.')

      const existingSlug = await supabase.from('brands').select('id').eq('slug', slug).limit(1)
      if (existingSlug.error) throw existingSlug.error
      if (existingSlug.data?.length) throw new Error('Ya existe una marca con ese slug.')

      const payload = {
        name: trimmedName,
        slug,
        logo_url: logoUrl || null,
        cover_url: coverUrl || null,
        description: null,
        is_featured: false,
        sort_order: 0,
      }

      const { data, error } = await supabase.from('brands').insert(payload).select().single()
      if (error) throw error
      return data as Brand
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['admin', 'brands'])
      setName('')
      setLogoUrl('')
      setCoverUrl('')
      showToast('Marca creada correctamente.', 'success')
    },
    onError: (error) => {
      showToast(error instanceof Error ? error.message : 'No se pudo crear la marca.', 'error')
    },
  })

  const updateBrand = useMutation({
    mutationFn: async (payload: { id: string; name: string; slug: string }) => {
      const trimmedName = payload.name.trim()
      if (!trimmedName) throw new Error('El nombre es requerido.')

      const existingName = await supabase
        .from('brands')
        .select('id')
        .eq('name', trimmedName)
        .neq('id', payload.id)
        .limit(1)
      if (existingName.error) throw existingName.error
      if (existingName.data?.length) throw new Error('Ya existe otra marca con ese nombre.')

      const existingSlug = await supabase
        .from('brands')
        .select('id')
        .eq('slug', payload.slug)
        .neq('id', payload.id)
        .limit(1)
      if (existingSlug.error) throw existingSlug.error
      if (existingSlug.data?.length) throw new Error('Ya existe otro slug igual.')

      const { data, error } = await supabase
        .from('brands')
        .update({ name: trimmedName, slug: payload.slug })
        .eq('id', payload.id)
        .select()
        .single()
      if (error) throw error
      return data as Brand
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['admin', 'brands'])
      resetEditBrand()
      showToast('Marca actualizada correctamente.', 'success')
    },
    onError: (error) => {
      showToast(error instanceof Error ? error.message : 'No se pudo actualizar la marca.', 'error')
    },
  })

  const deleteBrand = useMutation({
    mutationFn: async (id: string) => {
      const { data, error } = await supabase.from('brands').delete().eq('id', id).select().single()
      if (error) throw error
      return data as Brand
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['admin', 'brands'])
      if (editingBrandId) resetEditBrand()
      showToast('Marca eliminada correctamente.', 'success')
    },
    onError: (error) => {
      showToast(error instanceof Error ? error.message : 'No se pudo eliminar la marca.', 'error')
    },
  })

  const isBusy = createBrand.isLoading || updateBrand.isLoading || deleteBrand.isLoading

  const handleSubmit = async (event: { preventDefault: () => void }) => {
    event.preventDefault()
    if (!name.trim()) return
    await createBrand.mutateAsync()
  }

  const handleEditBrand = (brand: Brand) => {
    setEditingBrandId(brand.id)
    setEditedName(brand.name)
    setEditedSlug(brand.slug ?? '')
  }

  const resetEditBrand = () => {
    setEditingBrandId(null)
    setEditedName('')
    setEditedSlug('')
  }

  const handleDeleteBrand = (brand: Brand) => {
    setDeleteTarget(brand)
  }

  const confirmDeleteBrand = async () => {
    if (!deleteTarget) return
    setDeletingBrandId(deleteTarget.id)
    try {
      await deleteBrand.mutateAsync(deleteTarget.id)
    } finally {
      setDeletingBrandId(null)
      setDeleteTarget(null)
    }
  }

  const handleSaveBrand = async () => {
    if (!editingBrandId || !editedName.trim()) return
    setSavingBrandId(editingBrandId)
    try {
      await updateBrand.mutateAsync({
        id: editingBrandId,
        name: editedName.trim(),
        slug: createSlug(editedSlug || editedName),
      })
    } finally {
      setSavingBrandId(null)
    }
  }

  const brandsContent = (() => {
    if (isLoading) {
      return <p className="font-body text-muted">Cargando marcas...</p>
    }

    if (error) {
      return <p className="font-body text-red">Error cargando marcas: {error.message}</p>
    }

    if (!data?.length) {
      return <p className="font-body text-muted">No hay marcas registradas.</p>
    }

    return (
      <div className="overflow-x-auto rounded-xl border border-border bg-bg-3">
        <table className="min-w-full text-left text-sm text-white">
          <thead className="border-b border-border bg-bg p-3 text-xs uppercase tracking-[0.2em] text-muted">
            <tr>
              <th className="px-4 py-3">Logo</th>
              <th className="px-4 py-3">Marca</th>
              <th className="px-4 py-3">Slug</th>
              <th className="px-4 py-3">Creado</th>
              <th className="px-4 py-3">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {data.map((brand) => {
              const isEditing = editingBrandId === brand.id
              const isSaving = savingBrandId === brand.id
              const isDeleting = deletingBrandId === brand.id
              return (
                <tr key={brand.id} className="border-b border-border hover:bg-bg">
                  <td className="px-4 py-4">
                    <div className="inline-flex h-10 w-10 items-center justify-center overflow-hidden rounded-full border border-border bg-bg">
                      {brand.logo_url ? (
                        <img src={brand.logo_url} alt={brand.name} className="h-full w-full object-cover" />
                      ) : (
                        <span className="font-body text-xs text-muted">No logo</span>
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
                      brand.name
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
                      brand.slug
                    )}
                  </td>
                  <td className="px-4 py-4">{new Date(brand.created_at).toLocaleDateString()}</td>
                  <td className="px-4 py-4">
                    <div className="flex flex-wrap gap-2">
                      {isEditing ? (
                        <>
                          <button
                            type="button"
                            onClick={handleSaveBrand}
                            disabled={isBusy || isSaving}
                            className="text-lime hover:underline"
                          >
                            {isSaving ? 'Guardando...' : 'Guardar'}
                          </button>
                          <button
                            type="button"
                            onClick={resetEditBrand}
                            disabled={isBusy}
                            className="text-muted hover:text-white"
                          >
                            Cancelar
                          </button>
                        </>
                      ) : (
                        <button
                          type="button"
                          onClick={() => handleEditBrand(brand)}
                          disabled={isBusy || (editingBrandId !== null && !isEditing)}
                          className="text-lime hover:underline disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          Editar
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={() => handleDeleteBrand(brand)}
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
      <Toast
        message={toastMessage}
        type={toastType}
        isVisible={toastVisible}
        onClose={() => setToastVisible(false)}
      />
      <Modal
        isOpen={Boolean(deleteTarget)}
        onClose={() => setDeleteTarget(null)}
        title="Confirmar eliminación"
      >
        <p className="font-body text-sm text-muted mb-6">
          ¿Eliminar esta marca? Esta acción no se puede deshacer.
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
            onClick={confirmDeleteBrand}
            disabled={Boolean(deletingBrandId)}
            className="btn-primary rounded-full px-4 py-2"
          >
            Eliminar
          </button>
        </div>
      </Modal>

      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-display-lg text-white">Marcas</h1>
          <p className="font-body text-muted mt-2">Crea y administra las marcas utilizadas por los productos.</p>
        </div>
      </div>

      <section className="mb-8 rounded-3xl border border-border bg-bg-3 p-6">
        <div className="mb-6">
          <p className="font-mono text-label text-lime">— Nueva marca</p>
          <h2 className="font-display text-display-sm text-white mt-2">Agrega una marca nueva</h2>
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
            <span className="font-body text-sm text-muted">Logo URL</span>
            <input
              value={logoUrl}
              onChange={(event) => setLogoUrl(event.target.value)}
              disabled={isBusy}
              className="mt-2 w-full rounded border border-border bg-bg px-3 py-2 text-white"
            />
            {logoUrl && (
              <div className="mt-2 overflow-hidden rounded-2xl border border-border bg-bg">
                <img src={logoUrl} alt="Logo preview" className="h-20 w-full object-cover" />
              </div>
            )}
          </label>
          <label className="block">
            <span className="font-body text-sm text-muted">Cover URL</span>
            <input
              value={coverUrl}
              onChange={(event) => setCoverUrl(event.target.value)}
              disabled={isBusy}
              className="mt-2 w-full rounded border border-border bg-bg px-3 py-2 text-white"
            />
          </label>
          <div className="lg:col-span-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <button
              type="submit"
              disabled={isBusy}
              className="btn-primary rounded-full px-6 py-3"
            >
              {createBrand.isLoading ? 'Guardando...' : 'Crear marca'}
            </button>
            <div className="space-y-1">
              {createBrand.isSuccess && (
                <p className="font-body text-sm text-lime">Marca creada correctamente.</p>
              )}
              {createBrand.isError && (
                <p className="font-body text-sm text-red">Error: {createBrand.error instanceof Error ? createBrand.error.message : 'No se pudo crear la marca.'}</p>
              )}
            </div>
          </div>
        </form>
      </section>

      <section className="rounded-3xl border border-border bg-bg-3 p-6">
        <div className="mb-6">
          <p className="font-mono text-label text-lime">— Marcas existentes</p>
          <h2 className="font-display text-display-sm text-white mt-2">Listado de marcas</h2>
        </div>
        {brandsContent}
      </section>
    </div>
  )
}
