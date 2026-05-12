import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import type { HomepageSetting } from '@/types/database'

export function useHomepageSettings() {
  return useQuery({
    queryKey: ['homepageSettings'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('homepage_settings')
        .select('*')
        .single()

      if (error) throw error
      return data as HomepageSetting
    },
  })
}

export function useUpdateHomepageSettings() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (settings: HomepageSetting) => {
      const { data, error } = await supabase
        .from('homepage_settings')
        .update(settings)
        .eq('id', settings.id)
        .single()

      if (error) throw error
      return data as HomepageSetting
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['homepageSettings'] })
    },
  })
}

export function useHomeCounts() {
  return useQuery({
    queryKey: ['homeCounts'],
    queryFn: async () => {
      const [productsRes, categoriesRes, brandsRes] = await Promise.all([
        supabase.from('products').select('id', { count: 'exact', head: true }).eq('is_active', true),
        supabase.from('categories').select('id', { count: 'exact', head: true }),
        supabase.from('brands').select('id', { count: 'exact', head: true }),
      ])

      if (productsRes.error) throw productsRes.error
      if (categoriesRes.error) throw categoriesRes.error
      if (brandsRes.error) throw brandsRes.error

      return {
        products: Number(productsRes.count ?? 0),
        categories: Number(categoriesRes.count ?? 0),
        brands: Number(brandsRes.count ?? 0),
      }
    },
  })
}

export function useHomeCategories() {
  return useQuery({
    queryKey: ['homeCategories'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('categories')
        .select('id, name, slug, description, image_url, sort_order, products(id)')
        .order('sort_order')

      if (error) throw error
      return (
        (data ?? []) as Array<{
          id: string
          name: string
          slug: string
          description: string | null
          image_url: string | null
          sort_order: number
          products?: { id: string }[]
        }>
      ).map((category) => ({
        ...category,
        count: category.products?.length ?? 0,
      }))
    },
  })
}

export function useHomeBrands() {
  return useQuery({
    queryKey: ['homeBrands'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('brands')
        .select('id, name, slug, logo_url, cover_url')
        .eq('is_featured', true)
        .order('sort_order')

      if (error) throw error
      return (data ?? []) as Array<{ id: string; name: string; slug: string; logo_url: string | null; cover_url: string | null }>
    },
  })
}
