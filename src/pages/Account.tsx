import { useEffect, useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/hooks/useAuth'
import { useOrders } from '@/hooks/useOrders'
import { useWishlist } from '@/hooks/useWishlist'
import { useSEO } from '@/hooks/useSEO'
import { formatCOP } from '@/lib/utils'
import { notifications } from '@/lib/notifications'

const tabs = [
  { id: 'perfil', label: 'Perfil' },
  { id: 'pedidos', label: 'Pedidos' },
  { id: 'direcciones', label: 'Direcciones' },
  { id: 'favoritos', label: 'Favoritos' },
]

export default function Account() {
  useSEO({ title: 'Mi Cuenta | Magnus' })

  const [searchParams, setSearchParams] = useSearchParams()
  const activeTab = searchParams.get('tab') || 'perfil'
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const { user, profile, isOwner, isLoading: authLoading, signOut } = useAuth()
  const { orders, isLoading } = useOrders()
  const { wishlist } = useWishlist()

  const [fullName, setFullName] = useState(profile?.full_name ?? '')
  const [phone, setPhone] = useState(profile?.phone ?? '')
  const [profileMessage, setProfileMessage] = useState<string | null>(null)

  useEffect(() => {
    setFullName(profile?.full_name ?? '')
    setPhone(profile?.phone ?? '')
  }, [profile])

  useEffect(() => {
    if (!authLoading && user && isOwner) {
      navigate('/admin/owner', { replace: true })
    }
  }, [authLoading, isOwner, navigate, user])

  const { data: addresses = [], isLoading: isLoadingAddresses } = useQuery({
    queryKey: ['addresses', user?.id],
    queryFn: async () => {
      if (!user) return []
      const { data, error } = await supabase
        .from('addresses')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
      if (error) throw error
      return data
    },
    enabled: !!user,
  })

  const updateProfile = useMutation({
    mutationFn: async () => {
      if (!user) throw new Error('No autenticado')
      const { data, error } = await supabase
        .from('profiles')
        .update({ full_name: fullName || null, phone: phone || null })
        .eq('id', user.id)
        .select()
        .single()
      if (error) throw error
      return data
    },
    onSuccess: () => {
      setProfileMessage('Perfil actualizado correctamente.')
      queryClient.invalidateQueries({ queryKey: ['auth', user?.id] })
      queryClient.invalidateQueries({ queryKey: ['profile', user?.id] })
    },
    onError: (error) => {
      setProfileMessage(error instanceof Error ? error.message : 'No se pudo actualizar tu perfil.')
    },
  })

  const [addressForm, setAddressForm] = useState({
    label: '',
    full_name: profile?.full_name ?? '',
    phone: profile?.phone ?? '',
    address_line1: '',
    address_line2: '',
    city: '',
    department: '',
    postal_code: '',
    is_default: false,
  })

  useEffect(() => {
    setAddressForm((prev) => ({
      ...prev,
      full_name: profile?.full_name ?? prev.full_name,
      phone: profile?.phone ?? prev.phone,
    }))
  }, [profile])

  const createAddress = useMutation({
    mutationFn: async () => {
      if (!user) throw new Error('No autenticado')
      const payload = {
        ...addressForm,
        user_id: user.id,
      }
      const { data, error } = await supabase
        .from('addresses')
        .insert([payload])
        .select()
        .single()
      if (error) throw error
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['addresses', user?.id] })
      setAddressForm((prev) => ({
        ...prev,
        label: '',
        address_line1: '',
        address_line2: '',
        city: '',
        department: '',
        postal_code: '',
        is_default: false,
      }))
      notifications.success('Dirección guardada', 'Tu dirección de envío ha sido guardada correctamente.')
    },
    onError: (error) => {
      notifications.error('Error', error instanceof Error ? error.message : 'No se pudo guardar la dirección.')
    },
  })

  const addressCount = addresses?.length ?? 0
  const favoriteCount = wishlist.length

  const canEditProfile = updateProfile.status !== 'pending'

  const handleSignOut = async () => {
    const success = await signOut()
    if (success) {
      notifications.success('Sesión cerrada', 'Has cerrado sesión exitosamente')
      navigate('/')
    } else {
      notifications.error('Error', 'No se pudo cerrar la sesión')
    }
  }

  const setTab = (tab: string) => {
    const params = new URLSearchParams(searchParams)
    params.set('tab', tab)
    setSearchParams(params)
  }

  if (!user) {
    return (
      <div className="pt-24 pb-16 text-center">
        <h1 className="font-display text-display-lg text-white mb-4">Inicia sesión para continuar</h1>
      </div>
    )
  }

  return (
    <div className="pt-24 pb-16">
      <div className="container-wide">
        <h1 className="font-display text-display-lg text-white mb-8">Mi cuenta</h1>

        <div className="flex gap-2 mb-8 border-b border-border pb-4 overflow-x-auto">
          {tabs.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`font-body text-sm px-4 py-2 transition-colors whitespace-nowrap ${
                activeTab === t.id ? 'text-lime border-b-2 border-lime' : 'text-muted hover:text-white'
              }`}
            >
              {t.label}
            </button>
          ))}
          <button type="button" onClick={handleSignOut} className="font-body text-sm px-4 py-2 text-red ml-auto">
            Cerrar sesión
          </button>
        </div>

        {activeTab === 'perfil' && (
          <div className="max-w-md space-y-6">
            <div>
              <p className="font-body text-white">Email: {user.email}</p>
              {(profile?.role?.toLowerCase() === 'admin' || isOwner) && (
                <p className="mt-3">
                  <Link
                    to="/admin"
                    className="inline-flex items-center rounded-full border border-lime px-4 py-2 text-sm text-lime hover:bg-lime/10 transition-colors"
                  >
                    Ir al panel de administrador
                  </Link>
                </p>
              )}
            </div>

            <form className="grid gap-4">
              <label className="block">
                <span className="font-body text-sm text-muted">Nombre completo</span>
                <input
                  value={fullName}
                  onChange={(event) => setFullName(event.target.value)}
                  className="mt-2 w-full rounded border border-border bg-bg px-3 py-2 text-white"
                />
              </label>
              <label className="block">
                <span className="font-body text-sm text-muted">Teléfono</span>
                <input
                  value={phone}
                  onChange={(event) => setPhone(event.target.value)}
                  className="mt-2 w-full rounded border border-border bg-bg px-3 py-2 text-white"
                />
              </label>
              <button
                type="button"
                onClick={() => updateProfile.mutate()}
                disabled={!canEditProfile}
                className="btn-primary rounded-full px-6 py-3"
              >
                {updateProfile.status === 'pending' ? 'Guardando...' : 'Guardar perfil'}
              </button>
              {profileMessage && (
                <p className={`font-body text-sm ${updateProfile.isError ? 'text-red' : 'text-lime'}`}>
                  {profileMessage}
                </p>
              )}
            </form>

            <div className="rounded-3xl border border-border bg-bg-3 p-4">
              <p className="font-body text-sm text-muted">Direcciones guardadas: {addressCount}</p>
              <p className="font-body text-sm text-muted">Favoritos guardados: {favoriteCount}</p>
              <p className="font-body text-sm text-muted">Usa las pestañas para administrar direcciones y favoritos.</p>
            </div>
          </div>
        )}

        {activeTab === 'pedidos' && (
          <div className="space-y-4">
            {isLoading && <p className="font-body text-muted">Cargando pedidos...</p>}
            {!isLoading && (!orders || orders.length === 0) && (
              <p className="font-body text-muted">No tienes pedidos aún.</p>
            )}
            {!isLoading && orders && orders.length > 0 && orders.map((order: any) => (
              <div key={order.id} className="bg-bg-3 border border-border p-6 flex items-center justify-between">
                <div>
                  <p className="font-mono text-sm text-lime">{order.order_number}</p>
                  <p className="font-body text-xs text-muted">{new Date(order.created_at).toLocaleDateString('es-CO')}</p>
                  <span className="font-mono text-micro uppercase text-muted">{order.status}</span>
                </div>
                <div className="text-right">
                  <p className="font-mono text-sm text-white">{formatCOP(order.total)}</p>
                  <span className={`font-mono text-micro uppercase ${
                    order.payment_status === 'approved' ? 'text-lime' : 'text-muted'
                  }`}>
                    {order.payment_status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'direcciones' && (
          <div className="space-y-6">
            <div>
              <p className="font-body text-muted">Aquí puedes guardar tus direcciones de envío.</p>
            </div>

            {isLoadingAddresses ? (
              <p className="font-body text-muted">Cargando direcciones...</p>
            ) : addressCount === 0 ? (
              <p className="font-body text-muted">No tienes direcciones guardadas.</p>
            ) : (
              <div className="space-y-4">
                {addresses.map((address: any) => (
                  <div key={address.id} className="rounded-3xl border border-border bg-bg-3 p-4">
                    <p className="font-body text-white">{address.label}</p>
                    <p className="font-body text-sm text-muted">{address.full_name} · {address.phone}</p>
                    <p className="font-body text-sm text-muted">{address.address_line1}{address.address_line2 ? `, ${address.address_line2}` : ''}</p>
                    <p className="font-body text-sm text-muted">{address.city}, {address.department} {address.postal_code}</p>
                  </div>
                ))}
              </div>
            )}

            <section className="rounded-3xl border border-border bg-bg-3 p-6">
              <h2 className="font-display text-display-sm text-white mb-4">Agregar dirección</h2>
              <div className="grid gap-4 lg:grid-cols-2">
                <label className="block">
                  <span className="font-body text-sm text-muted">Etiqueta</span>
                  <input
                    value={addressForm.label}
                    onChange={(event) => setAddressForm({ ...addressForm, label: event.target.value })}
                    className="mt-2 w-full rounded border border-border bg-bg px-3 py-2 text-white"
                  />
                </label>
                <label className="block">
                  <span className="font-body text-sm text-muted">Nombre completo</span>
                  <input
                    value={addressForm.full_name}
                    onChange={(event) => setAddressForm({ ...addressForm, full_name: event.target.value })}
                    className="mt-2 w-full rounded border border-border bg-bg px-3 py-2 text-white"
                  />
                </label>
                <label className="block">
                  <span className="font-body text-sm text-muted">Teléfono</span>
                  <input
                    value={addressForm.phone}
                    onChange={(event) => setAddressForm({ ...addressForm, phone: event.target.value })}
                    className="mt-2 w-full rounded border border-border bg-bg px-3 py-2 text-white"
                  />
                </label>
                <label className="block">
                  <span className="font-body text-sm text-muted">Dirección</span>
                  <input
                    value={addressForm.address_line1}
                    onChange={(event) => setAddressForm({ ...addressForm, address_line1: event.target.value })}
                    className="mt-2 w-full rounded border border-border bg-bg px-3 py-2 text-white"
                  />
                </label>
                <label className="block lg:col-span-2">
                  <span className="font-body text-sm text-muted">Dirección complementaria</span>
                  <input
                    value={addressForm.address_line2}
                    onChange={(event) => setAddressForm({ ...addressForm, address_line2: event.target.value })}
                    className="mt-2 w-full rounded border border-border bg-bg px-3 py-2 text-white"
                  />
                </label>
                <label className="block">
                  <span className="font-body text-sm text-muted">Ciudad</span>
                  <input
                    value={addressForm.city}
                    onChange={(event) => setAddressForm({ ...addressForm, city: event.target.value })}
                    className="mt-2 w-full rounded border border-border bg-bg px-3 py-2 text-white"
                  />
                </label>
                <label className="block">
                  <span className="font-body text-sm text-muted">Departamento</span>
                  <input
                    value={addressForm.department}
                    onChange={(event) => setAddressForm({ ...addressForm, department: event.target.value })}
                    className="mt-2 w-full rounded border border-border bg-bg px-3 py-2 text-white"
                  />
                </label>
                <label className="block">
                  <span className="font-body text-sm text-muted">Código postal</span>
                  <input
                    value={addressForm.postal_code}
                    onChange={(event) => setAddressForm({ ...addressForm, postal_code: event.target.value })}
                    className="mt-2 w-full rounded border border-border bg-bg px-3 py-2 text-white"
                  />
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={addressForm.is_default}
                    onChange={(event) => setAddressForm({ ...addressForm, is_default: event.target.checked })}
                    className="h-4 w-4 rounded border border-border bg-bg text-lime"
                  />
                  <span className="font-body text-sm text-muted">Establecer como dirección predeterminada</span>
                </label>
                <div className="lg:col-span-2">
                  <button
                    type="button"
                    onClick={() => createAddress.mutate()}
                    disabled={createAddress.status === 'pending'}
                    className="btn-primary rounded-full px-6 py-3"
                  >
                    {createAddress.status === 'pending' ? 'Guardando...' : 'Agregar dirección'}
                  </button>
                </div>
              </div>
            </section>
          </div>
        )}

        {activeTab === 'favoritos' && (
          <div className="space-y-4">
            {favoriteCount === 0 ? (
              <>
                <p className="font-body text-muted">No tienes favoritos todavía.</p>
                <Link
                  to="/favoritos"
                  className="inline-flex items-center rounded-full border border-lime px-4 py-2 text-sm text-lime hover:bg-lime/10 transition-colors"
                >
                  Ver favoritos
                </Link>
              </>
            ) : (
              <>
                <p className="font-body text-white">Tienes {favoriteCount} favoritos guardados.</p>
                <Link
                  to="/favoritos"
                  className="inline-flex items-center rounded-full border border-lime px-4 py-2 text-sm text-lime hover:bg-lime/10 transition-colors"
                >
                  Ir a favoritos
                </Link>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
