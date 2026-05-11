import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import { useAuth } from './useAuth'

export function useWishlist() {
  const { user } = useAuth()
  const queryClient = useQueryClient()

  const { data: wishlist = [], isLoading } = useQuery({
    queryKey: ['wishlist', user?.id],
    queryFn: async () => {
      if (!user) return []
      const { data, error } = await (supabase
        .from('wishlists')
        .select('product_id, created_at')
        .eq('user_id', user.id) as any)
      if (error) throw error
      return (data ?? []).map((w: any) => w.product_id)
    },
    enabled: !!user,
  })

  const toggleMutation = useMutation({
    mutationFn: async (productId: string) => {
      if (!user) throw new Error('No autenticado')
      const exists = wishlist.includes(productId)
      if (exists) {
        await (supabase
          .from('wishlists')
          .delete()
          .eq('user_id', user.id)
          .eq('product_id', productId) as any)
      } else {
        await (supabase
          .from('wishlists') as any)
          .insert({ user_id: user.id, product_id: productId })
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['wishlist', user?.id] })
    },
  })

  return {
    wishlist,
    isLoading,
    isInWishlist: (productId: string) => wishlist.includes(productId),
    toggleWishlist: toggleMutation.mutate,
  }
}
