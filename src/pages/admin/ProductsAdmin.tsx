import { useState, ChangeEvent } from 'react'
import { z } from 'zod'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useSEO } from '@/hooks/useSEO'
import { normalizeImageUrl, uploadImageFile } from '@/lib/image'
import { notifications } from '@/lib/notifications'
import { supabase } from '@/lib/supabase'
import type { Product, ProductVariant, Brand, Category } from '@/types/database'

interface ProductWithRelations extends Product {
  brand: Brand | null
  category: Category | null
  variants: ProductVariant[]
}

type ProductFormState = {
  name: string
  slug: string
  description: string
  details: string
  shippingReturns: string
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

type ProductVariantFormState = {
  id?: string | null
  size: string
  color: string
  colorHex: string
  stock: string
  price: string
}

const emptyVariantState: ProductVariantFormState = {
  id: null,
  size: '',
  color: '',
  colorHex: '',
  stock: '0',
  price: '0',
}

const initialFormState: ProductFormState = {
  name: '',
  slug: '',
  description: '',
  details: '',
  shippingReturns: '',
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

export const productSchema = z.object({
  name: z.string().min(3, 'El nombre debe tener al menos 3 caracteres'),
  slug: z.string().min(3, 'El slug debe tener al menos 3 caracteres').regex(/^[a-z0-9-]+$/, 'El slug solo puede tener letras minúsculas, números y guiones'),
  description: z.string().optional(),
  imageUrl: z.string().url({ message: 'La URL de la imagen no es válida' }).optional().or(z.literal('')),
  details: z.string().optional().or(z.literal('')),
  shippingReturns: z.string().optional().or(z.literal('')),
  base_price: z.string().min(1, 'El precio es requerido').refine((value) => !Number.isNaN(Number(value)) && Number(value) >= 0, {
    message: 'El precio debe ser un número válido',
  }),
  compare_price: z.string().optional().refine((value) => value === '' || (!Number.isNaN(Number(value)) && Number(value) >= 0), {
    message: 'El precio de comparación debe ser un número válido',
  }),
  brand_id: z.string().optional(),
  category_id: z.string().optional(),
  is_active: z.boolean(),
  is_featured: z.boolean(),
  is_drop: z.boolean(),
  tags: z.string().optional(),
})

const variantSchema = z.object({
  id: z.string().nullable().optional(),
  size: z.string().optional().or(z.literal('')),
  color: z.string().optional().or(z.literal('')),
  colorHex: z.string().optional().or(z.literal('')),
  stock: z.string().refine((value) => !Number.isNaN(Number(value)) && Number(value) >= 0, {
    message: 'El stock debe ser un número entero válido',
  }),
  price: z.string().optional().refine((value) => value === '' || (!Number.isNaN(Number(value)) && Number(value) >= 0), {
    message: 'El precio de variante debe ser un número válido',
  }),
})

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
  const [variants, setVariants] = useState<ProductVariantFormState[]>([emptyVariantState])
  const [isCreating, setIsCreating] = useState(false)
  const [editingProductId, setEditingProductId] = useState<string | null>(null)
  const [productMessage, setProductMessage] = useState<string | null>(null)
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreviewUrl, setImagePreviewUrl] = useState('')

  const { data, isLoading, error } = useQuery<ProductWithRelations[]>({
    queryKey: ['admin', 'products'],
    queryFn: async () => {
      const { data, error } = await (supabase
        .from('products')
        .select(`*, details, shipping_returns, brand:brands(id, name), category:categories(id, name), variants:product_variants(id, sku, size, color, color_hex, stock, price, is_active)`)
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
    mutationFn: async (payload: { product: Record<string, unknown>; variants: ProductVariantFormState[] }) => {
      const { data, error } = await supabase.from('products').insert(payload.product as any).select().single()
      if (error) throw error

      if (payload.variants.length > 0) {
        const variantPayload = payload.variants.map((variant) => ({
          product_id: data.id,
          sku: null,
          size: variant.size || null,
          color: variant.color || null,
          color_hex: variant.colorHex || null,
          stock: Number(variant.stock),
          price: variant.price ? Number(variant.price) : null,
          is_active: true,
        }))

        const { error: variantError } = await supabase.from('product_variants').insert(variantPayload)
        if (variantError) {
          await supabase.from('products').delete().eq('id', data.id)
          throw variantError
        }
      }

      return data as Product
    },
    onSuccess: (createdProduct, variables) => {
      queryClient.setQueryData<ProductWithRelations[]>(['admin', 'products'], (old) => {
        const newProduct: ProductWithRelations = {
          ...createdProduct,
          brand: brands?.find((brand) => brand.id === createdProduct.brand_id) ?? null,
          category: categories?.find((category) => category.id === createdProduct.category_id) ?? null,
          variants: variables.variants.map((variant) => ({
            id: variant.id ?? '',
            product_id: createdProduct.id,
            sku: null,
            size: variant.size || null,
            color: variant.color || null,
            color_hex: variant.colorHex || null,
            stock: Number(variant.stock),
            price: variant.price ? Number(variant.price) : null,
            is_active: true,
            created_at: new Date().toISOString(),
          })),
        }
        return old ? [newProduct, ...old] : [newProduct]
      })
      setForm(initialFormState)
      setVariants([emptyVariantState])
      setImageFile(null)
      setImagePreviewUrl('')
      setEditingProductId(null)
      setProductMessage('Producto creado correctamente.')
      notifications.success('Producto creado', 'El producto se guardó correctamente en el catálogo.')
      setIsCreating(false)
    },
    onError: (error) => {
      const message = error instanceof Error ? error.message : 'No se pudo crear el producto.'
      notifications.error('Error al crear el producto', message)
      setProductMessage(message)
    },
  })

  const handleInput = (field: keyof ProductFormState, value: string | boolean) => {
    setForm((prev) => ({
      ...prev,
      [field]: value,
      ...(field === 'name' && typeof value === 'string' ? { slug: createSlug(value) } : {}),
    }))
  }

  const handleImageFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] ?? null
    if (file) {
      setImageFile(file)
      setImagePreviewUrl(URL.createObjectURL(file))
    } else {
      setImageFile(null)
      setImagePreviewUrl('')
    }
  }

  const handleVariantChange = (index: number, field: keyof ProductVariantFormState, value: string) => {
    setVariants((prev) => prev.map((variant, i) => (i === index ? { ...variant, [field]: value } : variant)))
  }

  const resetProductForm = () => {
    setForm(initialFormState)
    setVariants([emptyVariantState])
    setEditingProductId(null)
    setImageFile(null)
    setImagePreviewUrl('')
    setProductMessage(null)
    setIsCreating(false)
  }

  const handleEditProduct = (product: ProductWithRelations) => {
    setIsCreating(true)
    setEditingProductId(product.id)
    setForm({
      name: product.name,
      slug: product.slug,
      description: product.description ?? '',
      details: product.details ?? '',
      shippingReturns: product.shipping_returns ?? '',
      imageUrl: product.images[0] ?? '',
      base_price: String(product.base_price),
      compare_price: product.compare_price !== null ? String(product.compare_price) : '',
      brand_id: product.brand_id ?? '',
      category_id: product.category_id ?? '',
      is_active: product.is_active,
      is_featured: product.is_featured,
      is_drop: product.is_drop,
      tags: product.tags?.join(', ') ?? '',
    })
    setVariants(
      product.variants.length > 0
        ? product.variants.map((variant) => ({
            id: variant.id,
            size: variant.size ?? '',
            color: variant.color ?? '',
            colorHex: variant.color_hex ?? '',
            stock: String(variant.stock),
            price: variant.price !== null ? String(variant.price) : '',
          }))
        : [emptyVariantState]
    )
    setImagePreviewUrl(product.images[0] ?? '')
  }

  const addVariant = () => setVariants((prev) => [...prev, emptyVariantState])
  const removeVariant = (index: number) => setVariants((prev) => prev.filter((_, i) => i !== index))

  const updateProduct = useMutation({
    mutationFn: async (payload: { id: string; product: Record<string, unknown>; variants: ProductVariantFormState[] }) => {
      const { data, error } = await supabase.from('products').update(payload.product as any).eq('id', payload.id).select().single()
      if (error) throw error

      const { data: existingVariants, error: existingVariantsError } = await supabase
        .from('product_variants')
        .select('id')
        .eq('product_id', payload.id)
      if (existingVariantsError) throw existingVariantsError

      const existingIds = (existingVariants ?? []).map((variant: { id: string }) => variant.id)
      const incomingIds = payload.variants.filter((variant) => variant.id).map((variant) => variant.id as string)
      const deleteIds = existingIds.filter((id) => !incomingIds.includes(id))

      if (deleteIds.length > 0) {
        const { error: deleteError } = await supabase.from('product_variants').delete().in('id', deleteIds)
        if (deleteError) throw deleteError
      }

      for (const variant of payload.variants) {
        if (variant.id) {
          const { error: updateError } = await supabase
            .from('product_variants')
            .update({
              size: variant.size || null,
              color: variant.color || null,
              color_hex: variant.colorHex || null,
              stock: Number(variant.stock),
              price: variant.price ? Number(variant.price) : null,
            })
            .eq('id', variant.id)
          if (updateError) throw updateError
        } else {
          const { error: insertError } = await supabase.from('product_variants').insert([
            {
              product_id: payload.id,
              sku: null,
              size: variant.size || null,
              color: variant.color || null,
              color_hex: variant.colorHex || null,
              stock: Number(variant.stock),
              price: variant.price ? Number(variant.price) : null,
              is_active: true,
            },
          ])
          if (insertError) throw insertError
        }
      }

      return data as Product
    },
    onSuccess: (updatedProduct, variables) => {
      queryClient.setQueryData<ProductWithRelations[]>(['admin', 'products'], (old) => {
        if (!old) return []
        return old.map((product) => {
          if (product.id !== updatedProduct.id) return product
          return {
            ...updatedProduct,
            brand: brands?.find((brand) => brand.id === updatedProduct.brand_id) ?? null,
            category: categories?.find((category) => category.id === updatedProduct.category_id) ?? null,
            variants: variables.variants.map((variant) => ({
              id: variant.id ?? '',
              product_id: updatedProduct.id,
              sku: null,
              size: variant.size || null,
              color: variant.color || null,
              color_hex: variant.colorHex || null,
              stock: Number(variant.stock),
              price: variant.price ? Number(variant.price) : null,
              is_active: true,
              created_at: product.variants?.find((v) => v.id === variant.id)?.created_at ?? new Date().toISOString(),
            })),
          }
        })
      })
      setProductMessage('Producto actualizado correctamente.')
      notifications.success('Producto actualizado', 'Los datos del producto y las variantes se guardaron correctamente.')
      resetProductForm()
    },
    onError: (error) => {
      const message = error instanceof Error ? error.message : 'No se pudo actualizar el producto.'
      notifications.error('Error al actualizar el producto', message)
      setProductMessage(message)
    },
  })

  const handleSubmit = async (event: { preventDefault: () => void }) => {
    event.preventDefault()
    setProductMessage(null)

    const parsed = productSchema.safeParse({
      ...form,
      imageUrl: form.imageUrl || '',
      compare_price: form.compare_price || '',
      brand_id: form.brand_id || '',
      category_id: form.category_id || '',
      tags: form.tags || '',
    })

    if (!parsed.success) {
      const validationMessage = parsed.error.issues[0]?.message || 'Revisa los campos del formulario.'
      notifications.error('Error en el formulario', validationMessage)
      setProductMessage(validationMessage)
      return
    }

    let imageUrl = form.imageUrl
    if (imageFile) {
      try {
        imageUrl = await uploadImageFile(imageFile, 'products')
      } catch (error) {
        const message = error instanceof Error ? error.message : 'No se pudo subir la imagen.'
        notifications.error('Error al subir la imagen', message)
        setProductMessage(message)
        return
      }
    }

    const normalizedImageUrl = normalizeImageUrl(imageUrl)
    const parsedVariants = variants
      .filter((variant) => variant.size || variant.color || variant.colorHex || variant.stock !== '0' || variant.price !== '0')
      .map((variant) => variantSchema.parse({
        id: variant.id,
        size: variant.size || '',
        color: variant.color || '',
        colorHex: variant.colorHex || '',
        stock: variant.stock.trim() || '0',
        price: variant.price.trim() || '',
      })) as ProductVariantFormState[]

    const payload = {
      product: {
        name: form.name,
        slug: form.slug || createSlug(form.name),
        description: form.description || null,
        details: form.details || null,
        shipping_returns: form.shippingReturns || null,
        brand_id: form.brand_id || null,
        category_id: form.category_id || null,
        base_price: Number(form.base_price) || 0,
        compare_price: form.compare_price ? Number(form.compare_price) : null,
        images: normalizedImageUrl ? [normalizedImageUrl] : [],
        tags: form.tags ? form.tags.split(',').map((tag) => tag.trim()).filter(Boolean) : [],
        is_active: form.is_active,
        is_featured: form.is_featured,
        is_drop: form.is_drop,
        metadata: {},
      },
      variants: parsedVariants,
    }

    if (editingProductId) {
      await updateProduct.mutateAsync({
        id: editingProductId,
        product: payload.product,
        variants: parsedVariants,
      })
    } else {
      await createProduct.mutateAsync(payload)
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
                <td className="px-4 py-4">
                  {product.variants?.reduce((total, variant) => total + (variant.stock ?? 0), 0)}
                </td>
                <td className="px-4 py-4">{product.is_active ? 'Sí' : 'No'}</td>
                <td className="px-4 py-4">{product.is_featured ? 'Sí' : 'No'}</td>
                <td className="px-4 py-4">
                  <button
                    type="button"
                    onClick={() => handleEditProduct(product)}
                    className="text-lime hover:underline"
                  >
                    Editar
                  </button>
                </td>
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
              <p className="font-mono text-label text-lime">— {editingProductId ? 'Editar producto' : 'Nuevo producto'}</p>
              <h2 className="font-display text-display-sm text-white mt-2">
                {editingProductId ? 'Actualiza un producto existente' : 'Agrega un producto nuevo a la tienda'}
              </h2>
            </div>
            <button
              type="button"
              onClick={resetProductForm}
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
            <label className="block lg:col-span-2">
              <span className="font-body text-sm text-muted">Detalles</span>
              <textarea
                value={form.details}
                onChange={(event) => handleInput('details', event.target.value)}
                className="mt-2 w-full min-h-[120px] rounded border border-border bg-bg px-3 py-2 text-white"
              />
            </label>
            <label className="block lg:col-span-2">
              <span className="font-body text-sm text-muted">Envío y devoluciones</span>
              <textarea
                value={form.shippingReturns}
                onChange={(event) => handleInput('shippingReturns', event.target.value)}
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
            <label className="block lg:col-span-2">
              <span className="font-body text-sm text-muted">Imagen URL</span>
              <input
                value={form.imageUrl}
                onChange={(event) => handleInput('imageUrl', event.target.value)}
                placeholder="https://... o link de Drive"
                className="mt-2 w-full rounded border border-border bg-bg px-3 py-2 text-white"
              />
            </label>
            <label className="block lg:col-span-2">
              <span className="font-body text-sm text-muted">Imagen del producto</span>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageFileChange}
                className="mt-2 w-full rounded border border-border bg-bg px-3 py-2 text-white"
              />
              {(imagePreviewUrl || form.imageUrl) && (
                <div className="mt-2 overflow-hidden rounded-2xl border border-border bg-bg">
                  <img
                    src={imagePreviewUrl || form.imageUrl}
                    alt="Vista previa del producto"
                    className="h-44 w-full object-cover"
                  />
                </div>
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
            <div className="lg:col-span-2 rounded-3xl border border-border bg-bg-2 p-4">
              <div className="mb-4 flex items-center justify-between gap-3">
                <div>
                  <p className="font-mono text-label text-lime">— Variantes</p>
                  <p className="font-body text-sm text-muted">Agrega tallas, colores y stock para este producto.</p>
                </div>
                <button
                  type="button"
                  onClick={addVariant}
                  className="rounded-full border border-lime px-3 py-2 text-sm text-lime hover:bg-lime/10"
                >
                  Añadir variante
                </button>
              </div>
              {variants.map((variant, index) => (
                <div key={index} className="grid gap-3 lg:grid-cols-5 mb-3 items-end">
                  <label className="block">
                    <span className="font-body text-sm text-muted">Talla</span>
                    <input
                      value={variant.size}
                      onChange={(event) => handleVariantChange(index, 'size', event.target.value)}
                      className="mt-2 w-full rounded border border-border bg-bg px-3 py-2 text-white"
                    />
                  </label>
                  <label className="block">
                    <span className="font-body text-sm text-muted">Color</span>
                    <input
                      value={variant.color}
                      onChange={(event) => handleVariantChange(index, 'color', event.target.value)}
                      className="mt-2 w-full rounded border border-border bg-bg px-3 py-2 text-white"
                    />
                  </label>
                  <label className="block">
                    <span className="font-body text-sm text-muted">Hex color</span>
                    <input
                      value={variant.colorHex}
                      onChange={(event) => handleVariantChange(index, 'colorHex', event.target.value)}
                      placeholder="#FFFFFF"
                      className="mt-2 w-full rounded border border-border bg-bg px-3 py-2 text-white"
                    />
                  </label>
                  <label className="block">
                    <span className="font-body text-sm text-muted">Stock</span>
                    <input
                      type="number"
                      min="0"
                      value={variant.stock}
                      onChange={(event) => handleVariantChange(index, 'stock', event.target.value)}
                      className="mt-2 w-full rounded border border-border bg-bg px-3 py-2 text-white"
                    />
                  </label>
                  <div className="flex flex-col gap-2">
                    <label className="block">
                      <span className="font-body text-sm text-muted">Precio variante</span>
                      <input
                        type="number"
                        min="0"
                        step="1"
                        value={variant.price}
                        onChange={(event) => handleVariantChange(index, 'price', event.target.value)}
                        className="mt-2 w-full rounded border border-border bg-bg px-3 py-2 text-white"
                      />
                    </label>
                    <button
                      type="button"
                      onClick={() => removeVariant(index)}
                      className="self-end text-red hover:underline"
                    >
                      Eliminar
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="lg:col-span-2 flex items-center gap-3">
              <button
                type="submit"
                disabled={createProduct.status === 'pending'}
                className="btn-primary inline-flex items-center justify-center rounded-full px-6 py-3"
              >
                {createProduct.status === 'pending' ? 'Guardando...' : 'Guardar producto'}
              </button>
              {productMessage && (
                <p className={`font-body text-sm ${createProduct.status === 'error' ? 'text-red' : 'text-lime'}`}>
                  {productMessage}
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
