import { useQuery, useMutation } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import { useAuth } from './useAuth'
import type { Order, OrderItem } from '@/types'

export function useOrders() {
  const { user } = useAuth()

  const { data: orders, isLoading } = useQuery({
    queryKey: ['orders', user?.id],
    queryFn: async () => {
      if (!user) return []
      const { data, error } = await supabase
        .from('orders')
        .select('*, items:order_items(*)')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
      if (error) throw error
      return (data ?? []) as (Order & { items: OrderItem[] })[]
    },
    enabled: !!user,
  })

  return { orders, isLoading }
}

export function useOrder(id: string) {
  return useQuery({
    queryKey: ['order', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('orders')
        .select('*, items:order_items(*)')
        .eq('id', id)
        .single()
      if (error) throw error
      return data as Order & { items: OrderItem[] }
    },
    enabled: !!id,
  })
}

export function useCreateOrder() {
  return useMutation({
    mutationFn: async (orderData: Record<string, unknown>) => {
      const { data, error } = await supabase.functions.invoke('create-order', {
        body: orderData,
      })
      if (error) throw error
      return data
    },
  })
}
