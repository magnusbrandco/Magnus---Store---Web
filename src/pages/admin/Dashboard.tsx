import { useEffect, useState } from 'react'
import { useSEO } from '@/hooks/useSEO'
import { useHomeCounts, useHomepageSettings, useUpdateHomepageSettings } from '@/hooks/useHomeContent'
import type { HomepageSetting } from '@/types/database'

const emptySettings: Omit<HomepageSetting, 'updated_at'> = {
  id: '',
  hero_series_label: '',
  hero_title: '',
  hero_description: '',
  hero_primary_cta_label: '',
  hero_primary_cta_link: '',
  hero_secondary_cta_label: '',
  hero_secondary_cta_link: '',
  hero_highlight_color: '#05C7F2',
  categories_section_label: '',
  categories_section_title: '',
  brands_section_label: '',
  brands_section_title: '',
}

export default function Dashboard() {
  useSEO({ title: 'Admin Dashboard | Magnus' })

  const { data: counts } = useHomeCounts()
  const { data: settings, isLoading: isLoadingSettings } = useHomepageSettings()
  const updateSettings = useUpdateHomepageSettings()
  const [form, setForm] = useState<Omit<HomepageSetting, 'updated_at'>>(emptySettings)

  useEffect(() => {
    if (settings) {
      setForm(settings)
    }
  }, [settings])

  const handleChange = (key: keyof Omit<HomepageSetting, 'updated_at'>, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }))
  }

  const handleSubmit = async (event: any) => {
    event.preventDefault()
    if (!form.id) return
    await updateSettings.mutateAsync(form as HomepageSetting)
  }

  return (
    <div>
      <h1 className="font-display text-display-lg text-white mb-8">Dashboard</h1>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-bg-3 border border-border p-6">
          <p className="font-body text-xs text-muted">Productos activos</p>
          <p className="font-display text-display-md text-white mt-1">{counts?.products ?? 0}</p>
        </div>
        <div className="bg-bg-3 border border-border p-6">
          <p className="font-body text-xs text-muted">Categorías activas</p>
          <p className="font-display text-display-md text-white mt-1">{counts?.categories ?? 0}</p>
        </div>
        <div className="bg-bg-3 border border-border p-6">
          <p className="font-body text-xs text-muted">Marcas destacadas</p>
          <p className="font-display text-display-md text-white mt-1">{counts?.brands ?? 0}</p>
        </div>
        <div className="bg-bg-3 border border-border p-6">
          <p className="font-body text-xs text-muted">Contenido editable</p>
          <p className="font-display text-display-md text-white mt-1">Home</p>
        </div>
      </div>

      <section className="bg-bg-3 border border-border p-6 rounded-xl">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-6">
          <div>
            <p className="font-mono text-label text-lime">— Contenido de la home</p>
            <h2 className="font-display text-display-lg text-white mt-2">Edita títulos, CTA y secciones de la página principal</h2>
          </div>
        </div>

        {isLoadingSettings ? (
          <p className="font-body text-muted">Cargando configuración de home...</p>
        ) : (
          <form onSubmit={handleSubmit} className="grid gap-6">
            <div className="grid gap-4 md:grid-cols-2">
              <label className="block">
                <span className="font-body text-sm text-muted">Etiqueta de hero</span>
                <input
                  value={form.hero_series_label}
                  onChange={(event) => handleChange('hero_series_label', event.target.value)}
                  className="mt-2 w-full rounded border border-border bg-bg px-3 py-2 text-white"
                />
              </label>
              <label className="block">
                <span className="font-body text-sm text-muted">Título principal (usa salto de línea con \n)</span>
                <textarea
                  value={form.hero_title}
                  onChange={(event) => handleChange('hero_title', event.target.value)}
                  className="mt-2 w-full min-h-[120px] rounded border border-border bg-bg px-3 py-2 text-white"
                />
              </label>
            </div>

            <label className="block">
              <span className="font-body text-sm text-muted">Descripción de hero</span>
              <textarea
                value={form.hero_description}
                onChange={(event) => handleChange('hero_description', event.target.value)}
                className="mt-2 w-full min-h-[80px] rounded border border-border bg-bg px-3 py-2 text-white"
              />
            </label>

            <div className="grid gap-4 md:grid-cols-4">
              <label className="block">
                <span className="font-body text-sm text-muted">CTA primaria</span>
                <input
                  value={form.hero_primary_cta_label}
                  onChange={(event) => handleChange('hero_primary_cta_label', event.target.value)}
                  className="mt-2 w-full rounded border border-border bg-bg px-3 py-2 text-white"
                />
              </label>
              <label className="block">
                <span className="font-body text-sm text-muted">Link CTA primaria</span>
                <input
                  value={form.hero_primary_cta_link}
                  onChange={(event) => handleChange('hero_primary_cta_link', event.target.value)}
                  className="mt-2 w-full rounded border border-border bg-bg px-3 py-2 text-white"
                />
              </label>
              <label className="block">
                <span className="font-body text-sm text-muted">CTA secundaria</span>
                <input
                  value={form.hero_secondary_cta_label}
                  onChange={(event) => handleChange('hero_secondary_cta_label', event.target.value)}
                  className="mt-2 w-full rounded border border-border bg-bg px-3 py-2 text-white"
                />
              </label>
              <label className="block">
                <span className="font-body text-sm text-muted">Link CTA secundaria</span>
                <input
                  value={form.hero_secondary_cta_link}
                  onChange={(event) => handleChange('hero_secondary_cta_link', event.target.value)}
                  className="mt-2 w-full rounded border border-border bg-bg px-3 py-2 text-white"
                />
              </label>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <label className="block">
                <span className="font-body text-sm text-muted">Color del texto destacado</span>
                <div className="mt-2 flex items-center gap-3">
                  <input
                    type="color"
                    value={form.hero_highlight_color}
                    onChange={(event) => handleChange('hero_highlight_color', event.target.value)}
                    className="h-12 w-12 rounded border border-border bg-bg p-0"
                  />
                  <input
                    value={form.hero_highlight_color}
                    onChange={(event) => handleChange('hero_highlight_color', event.target.value)}
                    placeholder="#05C7F2"
                    className="w-full rounded border border-border bg-bg px-3 py-2 text-white"
                  />
                </div>
              </label>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <label className="block">
                <span className="font-body text-sm text-muted">Etiqueta sección categorías</span>
                <input
                  value={form.categories_section_label}
                  onChange={(event) => handleChange('categories_section_label', event.target.value)}
                  className="mt-2 w-full rounded border border-border bg-bg px-3 py-2 text-white"
                />
              </label>
              <label className="block">
                <span className="font-body text-sm text-muted">Título sección categorías</span>
                <input
                  value={form.categories_section_title}
                  onChange={(event) => handleChange('categories_section_title', event.target.value)}
                  className="mt-2 w-full rounded border border-border bg-bg px-3 py-2 text-white"
                />
              </label>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <label className="block">
                <span className="font-body text-sm text-muted">Etiqueta sección marcas</span>
                <input
                  value={form.brands_section_label}
                  onChange={(event) => handleChange('brands_section_label', event.target.value)}
                  className="mt-2 w-full rounded border border-border bg-bg px-3 py-2 text-white"
                />
              </label>
              <label className="block">
                <span className="font-body text-sm text-muted">Título sección marcas</span>
                <input
                  value={form.brands_section_title}
                  onChange={(event) => handleChange('brands_section_title', event.target.value)}
                  className="mt-2 w-full rounded border border-border bg-bg px-3 py-2 text-white"
                />
              </label>
            </div>

            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <button
                type="submit"
                disabled={updateSettings.isPending || !form.id}
                className="btn-primary w-full md:w-auto"
              >
                {updateSettings.isPending ? 'Guardando...' : 'Guardar contenido de home'}
              </button>
              {updateSettings.isSuccess && (
                <p className="font-body text-sm text-lime">Contenido actualizado correctamente.</p>
              )}
              {updateSettings.isError && (
                <p className="font-body text-sm text-red">
                  No se pudo guardar: {updateSettings.error instanceof Error ? updateSettings.error.message : 'Error desconocido'}
                </p>
              )}
            </div>
          </form>
        )}
      </section>
    </div>
  )
}
