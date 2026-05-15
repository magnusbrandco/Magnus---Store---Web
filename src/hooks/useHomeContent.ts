import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import type { Brand, Category, HomepageSetting, Updates } from '@/lib/supabase-types'

type HomepageSettingsUpdate = { id: string } & Partial<Omit<HomepageSetting, 'id'>>

export function useHomepageSettings() {
  return useQuery<HomepageSetting | null>({
    queryKey: ['homepageSettings'],
    queryFn: async (): Promise<HomepageSetting | null> => {
      const { data, error } = await supabase
        .from('homepage_settings')
        .select('*')
        .single()

      if (error) throw error
      return data
    },
  })
}

export function useUpdateHomepageSettings() {
  const queryClient = useQueryClient()

  return useMutation<HomepageSetting, Error, HomepageSettingsUpdate>({
    mutationFn: async (settings: HomepageSettingsUpdate) => {
      const { id, ...payload } = settings
      const { data, error } = await supabase
        .from('homepage_settings')
        .update<Updates<'homepage_settings'>>(payload)
        .eq('id', id)
        .select()
        .single()

      if (error) throw error
      return data
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

type HomeCategory = Pick<
  Category,
  'id' | 'name' | 'slug' | 'description' | 'image_url' | 'sort_order'
> & { products?: { id: string }[] }

type HomeBrand = Pick<Brand, 'id' | 'name' | 'slug' | 'logo_url' | 'cover_url'>

export function useHomeCategories() {
  return useQuery({
    queryKey: ['homeCategories'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('categories')
        .select('id, name, slug, description, image_url, sort_order, products(id)')
        .order('sort_order')

      if (error) throw error
      return ((data ?? []) as unknown as HomeCategory[]).map((category) => ({
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
      return (data ?? []) as HomeBrand[]
    },
  })
}
