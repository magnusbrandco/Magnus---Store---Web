import { useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useSEO } from '@/hooks/useSEO'
import { Modal, Toast } from '@/components/ui'
import { supabase } from '@/lib/supabase'
import type { Coupon } from '@/types/database'

export default function CouponsAdmin() {
  useSEO({ title: 'Admin Cupones | Magnus' })

  const queryClient = useQueryClient()
  const [code, setCode] = useState('')
  const [type, setType] = useState<'percentage' | 'fixed'>('percentage')
  const [value, setValue] = useState('0')
  const [minOrder, setMinOrder] = useState('0')
  const [maxUses, setMaxUses] = useState('')
  const [expiresAt, setExpiresAt] = useState('')
  const [isActive, setIsActive] = useState(true)

  const [editingCouponId, setEditingCouponId] = useState<string | null>(null)
  const [editedCode, setEditedCode] = useState('')
  const [editedType, setEditedType] = useState<'percentage' | 'fixed'>('percentage')
  const [editedValue, setEditedValue] = useState('0')
  const [editedMinOrder, setEditedMinOrder] = useState('0')
  const [editedMaxUses, setEditedMaxUses] = useState('')
  const [editedExpiresAt, setEditedExpiresAt] = useState('')
  const [editedIsActive, setEditedIsActive] = useState(true)

  const [toastMessage, setToastMessage] = useState('')
  const [toastType, setToastType] = useState<'success' | 'error'>('success')
  const [toastVisible, setToastVisible] = useState(false)
  const [deleteTarget, setDeleteTarget] = useState<Coupon | null>(null)
  const [savingCouponId, setSavingCouponId] = useState<string | null>(null)
  const [deletingCouponId, setDeletingCouponId] = useState<string | null>(null)

  const { data, isLoading, error } = useQuery<Coupon[]>({
    queryKey: ['admin', 'coupons'],
    queryFn: async () => {
      const { data, error } = await (supabase.from('coupons').select('*').order('created_at', { ascending: false }) as any)
      if (error) throw error
      return data ?? []
    },
  })

  const showToast = (message: string, type: 'success' | 'error') => {
    setToastMessage(message)
    setToastType(type)
    setToastVisible(true)
  }

  const createCoupon = useMutation({
    mutationFn: async () => {
      const trimmedCode = code.trim().toUpperCase()
      if (!trimmedCode) throw new Error('El código es requerido.')

      const existingCoupon = await supabase.from('coupons').select('id').eq('code', trimmedCode).limit(1)
      if (existingCoupon.error) throw existingCoupon.error
      if (existingCoupon.data?.length) throw new Error('Ya existe un cupón con ese código.')

      const { data, error } = await ((supabase as any)
        .from('coupons')
        .insert([
          {
            code: trimmedCode,
            type,
            value: Number(value),
            min_order: Number(minOrder),
            max_uses: maxUses ? Number(maxUses) : null,
            uses_count: 0,
            is_active: isActive,
            expires_at: expiresAt || null,
          },
        ])
        .select()
        .single())

      if (error) throw error
      return data as Coupon
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'coupons'] })
      setCode('')
      setType('percentage')
      setValue('0')
      setMinOrder('0')
      setMaxUses('')
      setExpiresAt('')
      setIsActive(true)
      showToast('Cupón creado correctamente.', 'success')
    },
    onError: (error) => {
      showToast(error instanceof Error ? error.message : 'No se pudo crear el cupón.', 'error')
    },
  })

  const updateCoupon = useMutation({
    mutationFn: async (payload: {
      id: string
      code: string
      type: 'percentage' | 'fixed'
      value: number
      min_order: number
      max_uses: number | null
      is_active: boolean
      expires_at: string | null
    }) => {
      const trimmedCode = payload.code.trim().toUpperCase()
      if (!trimmedCode) throw new Error('El código es requerido.')

      const existingCoupon = await supabase
        .from('coupons')
        .select('id')
        .eq('code', trimmedCode)
        .neq('id', payload.id)
        .limit(1)
      if (existingCoupon.error) throw existingCoupon.error
      if (existingCoupon.data?.length) throw new Error('Ya existe otro cupón con ese código.')

      const { data, error } = await ((supabase as any)
        .from('coupons')
        .update({
          code: trimmedCode,
          type: payload.type,
          value: payload.value,
          min_order: payload.min_order,
          max_uses: payload.max_uses,
          is_active: payload.is_active,
          expires_at: payload.expires_at,
        })
        .eq('id', payload.id)
        .select()
        .single())

      if (error) throw error
      return data as Coupon
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'coupons'] })
      resetEditCoupon()
      showToast('Cupón actualizado correctamente.', 'success')
    },
    onError: (error) => {
      showToast(error instanceof Error ? error.message : 'No se pudo actualizar el cupón.', 'error')
    },
  })

  const deleteCoupon = useMutation({
    mutationFn: async (id: string) => {
      const { data, error } = await supabase.from('coupons').delete().eq('id', id).select().single()
      if (error) throw error
      return data as Coupon
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'coupons'] })
      if (editingCouponId) resetEditCoupon()
      showToast('Cupón eliminado correctamente.', 'success')
    },
    onError: (error) => {
      showToast(error instanceof Error ? error.message : 'No se pudo eliminar el cupón.', 'error')
    },
  })

  const isBusy = createCoupon.isPending || updateCoupon.isPending || deleteCoupon.isPending

  const handleSubmit = async (event: { preventDefault: () => void }) => {
    event.preventDefault()
    if (!code.trim()) return
    await createCoupon.mutateAsync()
  }

  const handleEditCoupon = (coupon: Coupon) => {
    setEditingCouponId(coupon.id)
    setEditedCode(coupon.code)
    setEditedType(coupon.type)
    setEditedValue(String(coupon.value))
    setEditedMinOrder(String(coupon.min_order))
    setEditedMaxUses(coupon.max_uses ? String(coupon.max_uses) : '')
    setEditedExpiresAt(coupon.expires_at ? coupon.expires_at.slice(0, 10) : '')
    setEditedIsActive(coupon.is_active)
  }

  const resetEditCoupon = () => {
    setEditingCouponId(null)
    setEditedCode('')
    setEditedType('percentage')
    setEditedValue('0')
    setEditedMinOrder('0')
    setEditedMaxUses('')
    setEditedExpiresAt('')
    setEditedIsActive(true)
  }

  const handleDeleteCoupon = (coupon: Coupon) => {
    setDeleteTarget(coupon)
  }

  const confirmDeleteCoupon = async () => {
    if (!deleteTarget) return
    setDeletingCouponId(deleteTarget.id)
    try {
      await deleteCoupon.mutateAsync(deleteTarget.id)
    } finally {
      setDeletingCouponId(null)
      setDeleteTarget(null)
    }
  }

  const handleSaveCoupon = async () => {
    if (!editingCouponId || !editedCode.trim()) return
    setSavingCouponId(editingCouponId)
    try {
      await updateCoupon.mutateAsync({
        id: editingCouponId,
        code: editedCode,
        type: editedType,
        value: Number(editedValue),
        min_order: Number(editedMinOrder),
        max_uses: editedMaxUses ? Number(editedMaxUses) : null,
        is_active: editedIsActive,
        expires_at: editedExpiresAt || null,
      })
    } finally {
      setSavingCouponId(null)
    }
  }

  const couponsContent = (() => {
    if (isLoading) {
      return <p className="font-body text-muted">Cargando cupones...</p>
    }

    if (error) {
      return <p className="font-body text-red">Error cargando cupones: {error.message}</p>
    }

    if (!data?.length) {
      return <p className="font-body text-muted">No hay cupones registrados.</p>
    }

    return (
      <div className="overflow-x-auto rounded-xl border border-border bg-bg-3">
        <table className="min-w-full text-left text-sm text-white">
          <thead className="border-b border-border bg-bg p-3 text-xs uppercase tracking-[0.2em] text-muted">
            <tr>
              <th className="px-4 py-3">Código</th>
              <th className="px-4 py-3">Tipo</th>
              <th className="px-4 py-3">Valor</th>
              <th className="px-4 py-3">Mínimo</th>
              <th className="px-4 py-3">Usos</th>
              <th className="px-4 py-3">Activo</th>
              <th className="px-4 py-3">Expira</th>
              <th className="px-4 py-3">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {data.map((coupon) => {
              const isEditing = editingCouponId === coupon.id
              const isSaving = savingCouponId === coupon.id
              const isDeleting = deletingCouponId === coupon.id
              return (
                <tr key={coupon.id} className="border-b border-border hover:bg-bg">
                  <td className="px-4 py-4 font-mono">{coupon.code}</td>
                  <td className="px-4 py-4">{coupon.type === 'percentage' ? '%': 'Fijo'}</td>
                  <td className="px-4 py-4">{coupon.type === 'percentage' ? `${coupon.value}%` : `$${coupon.value}`}</td>
                  <td className="px-4 py-4">${coupon.min_order}</td>
                  <td className="px-4 py-4">{coupon.uses_count}/{coupon.max_uses ?? '∞'}</td>
                  <td className="px-4 py-4">{coupon.is_active ? 'Sí' : 'No'}</td>
                  <td className="px-4 py-4">{coupon.expires_at ? new Date(coupon.expires_at).toLocaleDateString() : 'N/A'}</td>
                  <td className="px-4 py-4 space-x-3">
                    <button
                      type="button"
                      onClick={() => handleEditCoupon(coupon)}
                      className="text-[#05C7F2] hover:underline"
                    >
                      Editar
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeleteCoupon(coupon)}
                      className="text-red hover:underline"
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
  })()

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-display text-display-lg text-white">Cupones</h1>
        <p className="font-body text-muted mt-2">Administra códigos de descuento, valores y fechas de expiración.</p>
      </div>

      <div className="grid gap-8 xl:grid-cols-[420px_1fr]">
        <section className="rounded-3xl border border-border bg-bg-3 p-6">
          <h2 className="font-mono text-label text-[#05C7F2] uppercase mb-4">Nuevo cupón</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm text-white mb-2">Código</label>
              <input
                value={code}
                onChange={(event) => setCode(event.target.value)}
                className="input-field"
                placeholder="EJEMPLO10"
              />
            </div>
            <div>
              <label className="block text-sm text-white mb-2">Tipo</label>
              <select
                value={type}
                onChange={(event) => setType(event.target.value as 'percentage' | 'fixed')}
                className="input-field"
              >
                <option value="percentage">Porcentaje</option>
                <option value="fixed">Monto fijo</option>
              </select>
            </div>
            <div>
              <label className="block text-sm text-white mb-2">Valor</label>
              <input
                type="number"
                min="0"
                value={value}
                onChange={(event) => setValue(event.target.value)}
                className="input-field"
              />
            </div>
            <div>
              <label className="block text-sm text-white mb-2">Compra mínima</label>
              <input
                type="number"
                min="0"
                value={minOrder}
                onChange={(event) => setMinOrder(event.target.value)}
                className="input-field"
              />
            </div>
            <div>
              <label className="block text-sm text-white mb-2">Usos máximos</label>
              <input
                type="number"
                min="0"
                value={maxUses}
                onChange={(event) => setMaxUses(event.target.value)}
                className="input-field"
                placeholder="Dejar vacío para ilimitado"
              />
            </div>
            <div>
              <label className="block text-sm text-white mb-2">Expira</label>
              <input
                type="date"
                value={expiresAt}
                onChange={(event) => setExpiresAt(event.target.value)}
                className="input-field"
              />
            </div>
            <div className="flex items-center gap-3">
              <label className="flex items-center gap-2 text-sm text-white">
                <input
                  type="checkbox"
                  checked={isActive}
                  onChange={(event) => setIsActive(event.target.checked)}
                  className="h-4 w-4 rounded border border-border bg-bg"
                />
                Activo
              </label>
              <button type="submit" className="btn-primary" disabled={isBusy}>
                Crear cupón
              </button>
            </div>
          </form>
        </section>

        <section className="space-y-4">
          <div className="rounded-3xl border border-border bg-bg-3 p-6">
            <h2 className="font-mono text-label text-[#05C7F2] uppercase mb-4">Cupones registrados</h2>
            {couponsContent}
          </div>
          {editingCouponId && (
            <div className="rounded-3xl border border-border bg-bg-3 p-6">
              <h2 className="font-mono text-label text-[#05C7F2] uppercase mb-4">Editar cupón</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-white mb-2">Código</label>
                  <input
                    value={editedCode}
                    onChange={(event) => setEditedCode(event.target.value)}
                    className="input-field"
                  />
                </div>
                <div>
                  <label className="block text-sm text-white mb-2">Tipo</label>
                  <select
                    value={editedType}
                    onChange={(event) => setEditedType(event.target.value as 'percentage' | 'fixed')}
                    className="input-field"
                  >
                    <option value="percentage">Porcentaje</option>
                    <option value="fixed">Monto fijo</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm text-white mb-2">Valor</label>
                  <input
                    type="number"
                    min="0"
                    value={editedValue}
                    onChange={(event) => setEditedValue(event.target.value)}
                    className="input-field"
                  />
                </div>
                <div>
                  <label className="block text-sm text-white mb-2">Compra mínima</label>
                  <input
                    type="number"
                    min="0"
                    value={editedMinOrder}
                    onChange={(event) => setEditedMinOrder(event.target.value)}
                    className="input-field"
                  />
                </div>
                <div>
                  <label className="block text-sm text-white mb-2">Usos máximos</label>
                  <input
                    type="number"
                    min="0"
                    value={editedMaxUses}
                    onChange={(event) => setEditedMaxUses(event.target.value)}
                    className="input-field"
                    placeholder="Dejar vacío para ilimitado"
                  />
                </div>
                <div>
                  <label className="block text-sm text-white mb-2">Expira</label>
                  <input
                    type="date"
                    value={editedExpiresAt}
                    onChange={(event) => setEditedExpiresAt(event.target.value)}
                    className="input-field"
                  />
                </div>
                <div className="flex items-center gap-3">
                  <label className="flex items-center gap-2 text-sm text-white">
                    <input
                      type="checkbox"
                      checked={editedIsActive}
                      onChange={(event) => setEditedIsActive(event.target.checked)}
                      className="h-4 w-4 rounded border border-border bg-bg"
                    />
                    Activo
                  </label>
                  <button
                    type="button"
                    onClick={handleSaveCoupon}
                    className="btn-primary"
                    disabled={isBusy}
                  >
                    Guardar cambios
                  </button>
                  <button
                    type="button"
                    onClick={resetEditCoupon}
                    className="btn-outline"
                  >
                    Cancelar
                  </button>
                </div>
              </div>
            </div>
          )}
        </section>
      </div>

      <Toast isVisible={toastVisible} type={toastType} message={toastMessage} onClose={() => setToastVisible(false)} />
      <Modal isOpen={Boolean(deleteTarget)} onClose={() => setDeleteTarget(null)} title="Eliminar cupón">
        <div className="space-y-6">
          <p className="font-body text-white">
            ¿Seguro que deseas eliminar el cupón <span className="font-mono text-[#05C7F2]">{deleteTarget?.code}</span>?
          </p>
          <div className="flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={() => setDeleteTarget(null)}
              className="btn-outline"
              disabled={deletingCouponId !== null}
            >
              Cancelar
            </button>
            <button
              type="button"
              onClick={confirmDeleteCoupon}
              className="btn-primary"
              disabled={deletingCouponId !== null}
            >
              {deletingCouponId ? 'Eliminando...' : 'Eliminar'}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
