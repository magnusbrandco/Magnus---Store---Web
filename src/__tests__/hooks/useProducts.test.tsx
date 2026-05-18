import { describe, it, expect, vi, beforeEach } from 'vitest'
import type { ReactNode } from 'react'
import { renderHook, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useProducts } from '@/hooks/useProducts'
import { supabase } from '@/lib/supabase'

const mockData = [
  {
    id: 'product-1',
    name: 'Test Product',
    slug: 'test-product',
    is_active: true,
    base_price: 25,
    is_featured: false,
    brand: { id: 'brand-1', name: 'Brand One', slug: 'brand-one' },
    category: { id: 'category-1', name: 'Category One', slug: 'category-one' },
    variants: [],
  },
]

const mockQuery = {
  select: vi.fn().mockReturnThis(),
  eq: vi.fn().mockReturnThis(),
  range: vi.fn().mockReturnThis(),
  order: vi.fn().mockReturnThis(),
  textSearch: vi.fn().mockReturnThis(),
  gte: vi.fn().mockReturnThis(),
  lte: vi.fn().mockReturnThis(),
  then(onFulfilled: (value: any) => any) {
    return Promise.resolve({ data: mockData, error: null }).then(onFulfilled)
  },
}

describe('useProducts', () => {
  beforeEach(() => {
    vi.restoreAllMocks()
    vi.spyOn(supabase, 'from').mockReturnValue(mockQuery as any)
    mockQuery.select.mockClear()
    mockQuery.eq.mockClear()
    mockQuery.range.mockClear()
    mockQuery.order.mockClear()
    mockQuery.textSearch.mockClear()
    mockQuery.gte.mockClear()
    mockQuery.lte.mockClear()
  })

  it('fetches products and applies filters correctly', async () => {
    const queryClient = new QueryClient()
    const wrapper = ({ children }: { children: ReactNode }) => (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    )

    const { result } = renderHook(
      () =>
        useProducts({
          category: 'category-one',
          brand: 'brand-one',
          minPrice: 10,
          maxPrice: 100,
          search: 'test',
          sort: 'price_desc',
        }),
      {
        wrapper,
      }
    )

    await waitFor(() => expect(result.current.isSuccess).toBe(true))

    expect(supabase.from).toHaveBeenCalledWith('products')
    expect(mockQuery.textSearch).toHaveBeenCalledWith('search_vector', 'test')
    expect(mockQuery.gte).toHaveBeenCalledWith('base_price', 10)
    expect(mockQuery.lte).toHaveBeenCalledWith('base_price', 100)
    expect(mockQuery.order).toHaveBeenCalledWith('base_price', { ascending: false })
    expect(result.current.data?.pages[0]).toEqual(mockData)
  })
})
