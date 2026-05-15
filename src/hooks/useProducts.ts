import { useQuery, useInfiniteQuery } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import type { ProductFilters, ProductWithRelations } from '@/types'

export function useProducts(filters: ProductFilters = {}) {
  return useInfiniteQuery({
    queryKey: ['products', filters],
    queryFn: async ({ pageParam = 0 }) => {
      const PAGE_SIZE = 20
      let query = supabase
        .from('products')
        .select(`
          *,
          brand:brands(id, name, slug),
          category:categories(id, name, slug),
          variants:product_variants(id, size, color, color_hex, stock, price)
        `)
        .eq('is_active', true)
        .range(pageParam * PAGE_SIZE, (pageParam + 1) * PAGE_SIZE - 1)

      if (filters.category) query = query.eq('category.slug', filters.category)
      if (filters.brand) query = query.eq('brand.slug', filters.brand)
      if (filters.minPrice) query = query.gte('base_price', filters.minPrice)
      if (filters.maxPrice) query = query.lte('base_price', filters.maxPrice)
      if (filters.search) query = query.textSearch('search_vector', filters.search)

      switch (filters.sort) {
        case 'newest': query = query.order('created_at', { ascending: false }); break
        case 'price_asc': query = query.order('base_price', { ascending: true }); break
        case 'price_desc': query = query.order('base_price', { ascending: false }); break
        default: query = query.order('is_featured', { ascending: false }); break
      }

      const { data, error } = await query
      if (error) throw error
      return (data ?? []) as unknown as ProductWithRelations[]
    },
    getNextPageParam: (lastPage, allPages) =>
      lastPage.length === 20 ? allPages.length : undefined,
    initialPageParam: 0,
  })
}

export function useProduct(slug: string) {
  return useQuery({
    queryKey: ['product', slug],
    queryFn: async () => {
      const { data, error } = await (supabase
        .from('products')
        .select(`
          *,
          brand:brands(*),
          category:categories(*),
          variants:product_variants(*),
          reviews(*, profile:profiles(full_name, avatar_url))
        `)
        .eq('slug', slug)
        .eq('is_active', true)
        .single())
      if (error) throw error
      return data as unknown as ProductWithRelations
    },
    enabled: !!slug,
  })
}

export function useFeaturedProducts() {
  return useQuery({
    queryKey: ['products', 'featured'],
    queryFn: async () => {
      const { data, error } = await (supabase
        .from('products')
        .select(`
          *,
          brand:brands(id, name, slug),
          variants:product_variants(id, size, color, color_hex, stock, price)
        `)
        .eq('is_active', true)
        .eq('is_featured', true)
        .order('created_at', { ascending: false })
        .limit(8))
      if (error) throw error
      return (data ?? []) as unknown as ProductWithRelations[]
    },
  })
}
