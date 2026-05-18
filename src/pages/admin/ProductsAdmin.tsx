import { useState, type ChangeEvent } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useSEO } from '@/hooks/useSEO'
import { SUPABASE_STORAGE_BUCKET } from '@/config/constants'
import { supabase } from '@/lib/supabase'
import type { Product, ProductVariant, Brand, Category } from '@/types/database'

interface ProductWithRelations extends Product {
  brand: Brand | null
  category: Category | null
  variants?: ProductVariant[]
}

type ProductFormState = {
  name: string
  slug: string
  description: string
  imageUrls: string
  base_price: string
  compare_price: string
  brand_id: string
  category_id: string
  sku: string
  size: string
  color: string
  color_hex: string
  stock: string
  is_active: boolean
  is_featured: boolean
  is_drop: boolean
  tags: string
}

const initialFormState: ProductFormState = {
  name: '',
  slug: '',
  description: '',
  imageUrls: '',
  base_price: '',
  compare_price: '',
  brand_id: '',
  category_id: '',
  sku: '',
  size: '',
  color: '',
  color_hex: '',
  stock: '',
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
  const [imageFiles, setImageFiles] = useState<File[]>([])
  const [isCreating, setIsCreating] = useState(false)
  const [editingProductId, setEditingProductId] = useState<string | null>(null)
  const [isSaving, setIsSaving] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)

  const getErrorMessage = (error: unknown): string => {
    if (!error) return 'Error desconocido.'
    if (error instanceof Error) return error.message
    if (typeof error === 'object' && error !== null) {
      if ('message' in error && typeof (error as any).message === 'string') return (error as any).message
      if ('error' in error && typeof (error as any).error === 'string') return (error as any).error
      if ('msg' in error && typeof (error as any).msg === 'string') return (error as any).msg
    }
    return String(error)
  }

  const { data, isLoading, error } = useQuery<ProductWithRelations[]>({
    queryKey: ['admin', 'products'],
    queryFn: async () => {
      const { data, error } = await (supabase
        .from('products')
        .select(`*, brand:brands(id, name), category:categories(id, name), variants:product_variants(id, stock)`)
        .order('created_at', { ascending: false }) as any)
      if (error) throw error
      return data ?? []
    },
  })

  const {
    data: brands,
    isLoading: isLoadingBrands,
    isError: brandsError,
    error: brandsErrorObj,
  } = useQuery<Brand[]>({
    queryKey: ['admin', 'brands'],
    queryFn: async () => {
      const { data, error } = await (supabase.from('brands').select('id, name').order('name') as any)
      if (error) throw error
      return data ?? []
    },
  })

  const {
    data: categories,
    isLoading: isLoadingCategories,
    isError: categoriesError,
    error: categoriesErrorObj,
  } = useQuery<Category[]>({
    queryKey: ['admin', 'categories'],
    queryFn: async () => {
      const { data, error } = await (supabase.from('categories').select('id, name').order('name') as any)
      if (error) throw error
      return data ?? []
    },
  })

  const uploadImageToStorage = async (file: File, folder: string) => {
    const fileName = `${folder}/${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.\-_]/g, '_')}`
    const { data, error } = await supabase.storage.from(SUPABASE_STORAGE_BUCKET).upload(fileName, file, {
      cacheControl: '3600',
      upsert: true,
    })
    if (error) throw error
    const { data: publicData } = supabase.storage.from(SUPABASE_STORAGE_BUCKET).getPublicUrl(fileName)
    if (!publicData?.publicUrl) {
      throw new Error('No se pudo generar la URL pública de la imagen.')
    }
    return publicData.publicUrl
  }

  const handleImageFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files ? Array.from(event.target.files) : []
    setImageFiles(files)
    if (files.length) {
      setForm((prev) => ({ ...prev, imageUrls: '' }))
    }
  }

  const normalizeImageUrl = (url: string) => {
    const trimmed = url.trim()
    if (!trimmed) return null

    const driveMatch = trimmed.match(/(?:drive\.google\.com\/(?:file\/d\/([a-zA-Z0-9_-]+)|open\?id=([a-zA-Z0-9_-]+))|docs\.google\.com\/uc\?id=([a-zA-Z0-9_-]+)|drive\.google\.com\/thumbnail\?id=([a-zA-Z0-9_-]+))(?:[&?].*)?/) 
    if (driveMatch) {
      const driveId = driveMatch.slice(1).find(Boolean)
      return driveId ? `https://drive.google.com/uc?export=view&id=${driveId}` : trimmed
    }

    return trimmed
  }

  const handleImageUrlsChange = (value: string) => {
    setImageFiles([])
    setForm((prev) => ({ ...prev, imageUrls: value }))
  }

  const createProduct = useMutation({
    mutationFn: async (payload: Record<string, unknown>) => {
      const { data, error } = await ((supabase as any).from('products').insert([payload]).select().single())
      if (error) throw error
      return data as Product
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'products'] })
      setForm(initialFormState)
      setImageFiles([])
      setIsCreating(false)
    },
    onError: (error) => {
      setSubmitError(error instanceof Error ? error.message : 'No se pudo crear el producto.')
    },
  })

  const handleInput = (field: keyof ProductFormState, value: string | boolean) => {
    setForm((prev) => ({
      ...prev,
      [field]: value,
      ...(field === 'name' && typeof value === 'string' ? { slug: createSlug(value) } : {}),
    }))
  }

  const handleEditProduct = (product: ProductWithRelations) => {
    setEditingProductId(product.id)
    setIsCreating(false)
    setForm(getProductFormState(product))
    setImageFiles([])
    setSubmitError(null)
  }

  const handleDeleteProduct = async (product: ProductWithRelations) => {
    const confirmed = window.confirm(`¿Eliminar el producto ${product.name}? Esta acción no se puede deshacer.`)
    if (!confirmed) return
    await deleteProduct.mutateAsync(product.id)
  }

  const resetForm = () => {
    setForm(initialFormState)
    setImageFiles([])
    setEditingProductId(null)
    setIsCreating(false)
    setSubmitError(null)
  }

  const getProductFormState = (product: ProductWithRelations): ProductFormState => ({
    name: product.name,
    slug: product.slug ?? '',
    description: product.description ?? '',
    imageUrls: (product.images ?? []).filter(Boolean).join(', '),
    base_price: String(product.base_price ?? ''),
    compare_price: product.compare_price ? String(product.compare_price) : '',
    brand_id: product.brand?.id ?? '',
    category_id: product.category?.id ?? '',
    sku: product.variants?.[0]?.sku ?? '',
    size: product.variants?.[0]?.size ?? '',
    color: product.variants?.[0]?.color ?? '',
    color_hex: product.variants?.[0]?.color_hex ?? '',
    stock: String(product.variants?.[0]?.stock ?? 0),
    is_active: product.is_active,
    is_featured: product.is_featured,
    is_drop: product.is_drop,
    tags: (product.tags ?? []).join(', '),
  })

  const updateProduct = useMutation({
    mutationFn: async (payload: { id: string } & Record<string, unknown>) => {
      const { id, ...rest } = payload
      const { data, error } = await ((supabase as any).from('products').update(rest).eq('id', id).select().single())
      if (error) throw error
      return data as Product
    },
    onSuccess: async (_, variables) => {
      const variantStock = Number(form.stock || '0')
      const variantPayload = {
        sku: form.sku || null,
        size: form.size || 'Único',
        color: form.color || null,
        color_hex: form.color_hex || null,
        stock: variantStock,
        price: Number(form.base_price) || 0,
        is_active: true,
        product_id: variables.id,
      }

      const existingVariant = await supabase
        .from('product_variants')
        .select('id')
        .eq('product_id', variables.id)
        .limit(1)
        .single()

      if (!existingVariant.error && existingVariant.data) {
        await supabase
          .from('product_variants')
          .update(variantPayload)
          .eq('id', existingVariant.data.id)
      } else if (!existingVariant.error && variantStock > 0) {
        await supabase.from('product_variants').insert([variantPayload])
      }

      queryClient.invalidateQueries({ queryKey: ['admin', 'products'] })
      resetForm()
    },
    onError: (error) => {
      setSubmitError(getErrorMessage(error))
    },
  })

  const deleteProduct = useMutation({
    mutationFn: async (id: string) => {
      const { data, error } = await ((supabase as any).from('products').delete().eq('id', id).select().single())
      if (error) throw error
      return data as Product
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'products'] })
      if (editingProductId) resetForm()
    },
    onError: (error) => {
      setSubmitError(getErrorMessage(error))
    },
  })

  const handleSubmit = async (event: { preventDefault: () => void }) => {
    event.preventDefault()
    setSubmitError(null)
    setIsSaving(true)

    try {
      const uploadedImageUrls = imageFiles.length
        ? await Promise.all(imageFiles.map((file) => uploadImageToStorage(file, 'products')))
        : []
      const fallbackImageUrls = form.imageUrls
        ? form.imageUrls
            .split(',')
            .map((url) => normalizeImageUrl(url))
            .filter(Boolean)
        : []

      const payload = {
        name: form.name,
        slug: form.slug || createSlug(form.name),
        description: form.description || null,
        brand_id: form.brand_id || null,
        category_id: form.category_id || null,
        base_price: Number(form.base_price) || 0,
        compare_price: form.compare_price ? Number(form.compare_price) : null,
        images: uploadedImageUrls.length ? uploadedImageUrls : fallbackImageUrls,
        tags: form.tags ? form.tags.split(',').map((tag) => tag.trim()).filter(Boolean) : [],
        is_active: form.is_active,
        is_featured: form.is_featured,
        is_drop: form.is_drop,
        metadata: {},
        product_variants: Number(form.stock || '0') > 0 ? [{
          sku: form.sku || null,
          size: form.size || 'Único',
          color: form.color || null,
          color_hex: form.color_hex || null,
          stock: Number(form.stock || '0'),
          price: Number(form.base_price) || 0,
          is_active: true,
        }] : [],
      }

      if (editingProductId) {
        const updatePayload = { ...payload }
        delete (updatePayload as any).product_variants
        await updateProduct.mutateAsync({ id: editingProductId, ...updatePayload })
      } else {
        await createProduct.mutateAsync(payload)
      }
    } catch (error) {
      setSubmitError(getErrorMessage(error))
    } finally {
      setIsSaving(false)
    }
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
              <th className="px-4 py-3">Stock</th>
              <th className="px-4 py-3">Activo</th>
              <th className="px-4 py-3">Destacado</th>
              <th className="px-4 py-3">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {data.map((product) => {
              const totalStock = product.variants?.reduce((sum, variant) => sum + (variant.stock ?? 0), 0) || 0
              return (
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
                  <td className="px-4 py-4">{totalStock}</td>
                  <td className="px-4 py-4">{product.is_active ? 'Sí' : 'No'}</td>
                  <td className="px-4 py-4">{product.is_featured ? 'Sí' : 'No'}</td>
                  <td className="px-4 py-4 flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() => handleEditProduct(product)}
                      className="rounded-full border border-border bg-bg px-3 py-1 text-xs text-white transition hover:border-lime hover:text-lime"
                    >
                      Editar
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeleteProduct(product)}
                      className="rounded-full border border-border bg-bg px-3 py-1 text-xs text-red transition hover:bg-red/10"
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              )
            })}
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
          onClick={() => {
            resetForm()
            setIsCreating(true)
          }}
          className="inline-flex items-center gap-2 rounded-full border border-lime bg-lime/10 px-4 py-2 text-sm font-medium text-lime transition hover:bg-lime/20"
        >
          + Añadir producto
        </button>
      </div>

      {(isCreating || editingProductId) && (
        <section className="mb-8 rounded-3xl border border-border bg-bg-3 p-6">
          <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="font-mono text-label text-lime">— {editingProductId ? 'Editar producto' : 'Nuevo producto'}</p>
              <h2 className="font-display text-display-sm text-white mt-2">{editingProductId ? 'Actualiza los datos del producto' : 'Agrega un producto nuevo a la tienda'}</h2>
            </div>
            <button
              type="button"
              onClick={resetForm}
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
              <span className="font-body text-sm text-muted">Imágenes del producto</span>
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleImageFileChange}
                className="mt-2 w-full rounded border border-border bg-bg px-3 py-2 text-white"
              />
              <p className="mt-2 text-xs text-muted">
                Selecciona varias imágenes para el producto. Si prefieres usar URLs, pégalas separadas por comas.
              </p>
              {imageFiles.length > 0 && (
                <div className="mt-3 grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {imageFiles.map((file) => (
                    <div key={file.name} className="overflow-hidden rounded-2xl border border-border bg-bg">
                      <img
                        src={URL.createObjectURL(file)}
                        alt={file.name}
                        className="h-24 w-full object-cover"
                      />
                      <p className="px-2 py-1 text-xs text-muted truncate">{file.name}</p>
                    </div>
                  ))}
                </div>
              )}
            </label>
            <label className="block">
              <span className="font-body text-sm text-muted">O URLs de imagen alternativa</span>
              <input
                value={form.imageUrls}
                onChange={(event) => handleImageUrlsChange(event.target.value)}
                className="mt-2 w-full rounded border border-border bg-bg px-3 py-2 text-white"
              />
            </label>
            <label className="block">
              <span className="font-body text-sm text-muted">SKU</span>
              <input
                value={form.sku}
                onChange={(event) => handleInput('sku', event.target.value)}
                className="mt-2 w-full rounded border border-border bg-bg px-3 py-2 text-white"
              />
            </label>
            <label className="block">
              <span className="font-body text-sm text-muted">Tamaño</span>
              <input
                value={form.size}
                onChange={(event) => handleInput('size', event.target.value)}
                placeholder="Ej: Único, S, M"
                className="mt-2 w-full rounded border border-border bg-bg px-3 py-2 text-white"
              />
            </label>
            <label className="block">
              <span className="font-body text-sm text-muted">Color</span>
              <input
                value={form.color}
                onChange={(event) => handleInput('color', event.target.value)}
                placeholder="Ej: blanco"
                className="mt-2 w-full rounded border border-border bg-bg px-3 py-2 text-white"
              />
            </label>
            <label className="block">
              <span className="font-body text-sm text-muted">Hex de color</span>
              <input
                value={form.color_hex}
                onChange={(event) => handleInput('color_hex', event.target.value)}
                placeholder="#ffffff"
                className="mt-2 w-full rounded border border-border bg-bg px-3 py-2 text-white"
              />
            </label>
            <label className="block">
              <span className="font-body text-sm text-muted">Stock inicial</span>
              <input
                type="number"
                value={form.stock}
                onChange={(event) => handleInput('stock', event.target.value)}
                min="0"
                step="1"
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
                {isLoadingBrands && <option disabled>Cargando marcas...</option>}
                {brands?.map((brand) => (
                  <option key={brand.id} value={brand.id}>{brand.name}</option>
                ))}
              </select>
              {brandsError && (
                <p className="mt-2 text-xs text-red">Error cargando marcas: {brandsErrorObj?.message ?? 'No se pudo cargar'}</p>
              )}
            </label>
            <label className="block">
              <span className="font-body text-sm text-muted">Categoría</span>
              <select
                value={form.category_id}
                onChange={(event) => handleInput('category_id', event.target.value)}
                className="mt-2 w-full rounded border border-border bg-bg px-3 py-2 text-white"
              >
                <option value="">Sin categoría</option>
                {isLoadingCategories && <option disabled>Cargando categorías...</option>}
                {categories?.map((category) => (
                  <option key={category.id} value={category.id}>{category.name}</option>
                ))}
              </select>
              {categoriesError && (
                <p className="mt-2 text-xs text-red">Error cargando categorías: {categoriesErrorObj?.message ?? 'No se pudo cargar'}</p>
              )}
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
                disabled={(editingProductId ? updateProduct.isPending : createProduct.isPending) || isSaving}
                className="btn-primary inline-flex items-center justify-center rounded-full px-6 py-3"
              >
                {isSaving || ((editingProductId ? updateProduct.isPending : createProduct.isPending)) ? 'Guardando...' : editingProductId ? 'Guardar cambios' : 'Guardar producto'}
              </button>
              {(editingProductId ? updateProduct.isSuccess : createProduct.isSuccess) && (
                <p className="font-body text-sm text-lime">{editingProductId ? 'Producto actualizado correctamente.' : 'Producto creado correctamente.'}</p>
              )}
              {(editingProductId ? updateProduct.isError : createProduct.isError || Boolean(submitError)) && (
                <p className="font-body text-sm text-red">
                  Error: {submitError ?? ((editingProductId ? updateProduct.error : createProduct.error) instanceof Error ? (editingProductId ? updateProduct.error : createProduct.error)?.message : 'No se pudo guardar')}
                </p>
              )}
            </div>
          </form>
        </section>
      )}

      {content}
    </div>
  )
}
