import { useQuery, useMutation } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import type { Drop, DropSubscriber } from '@/types'

export function useDrops() {
  return useQuery<Drop[]>({
    queryKey: ['drops'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('drops')
        .select(`
          *,
          products:drop_products(product:products(*))
        `)
        .eq('is_published', true)
        .order('drop_date', { ascending: true })
      if (error) throw error
      return (data ?? []) as Drop[]
    },
  })
}

export function useUpcomingDrops() {
  return useQuery<Drop[]>({
    queryKey: ['drops', 'upcoming'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('drops')
        .select('*')
        .eq('is_published', true)
        .gte('drop_date', new Date().toISOString())
        .order('drop_date', { ascending: true })
      if (error) throw error
      return (data ?? []) as Drop[]
    },
  })
}

export function useSubscribeToDrop() {
  return useMutation<DropSubscriber, Error, { dropId: string; email: string }>({
    mutationFn: async ({ dropId, email }) => {
      const { data, error } = await supabase
        .from('drop_subscribers')
        .insert({ drop_id: dropId, email } as any)
        .select()
        .single()
      if (error) throw error
      return data as DropSubscriber
    },
  })
}
