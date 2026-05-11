import { useEffect } from 'react'
import { useAuthStore } from '@/stores/authStore'

export function useAuth() {
  const store = useAuthStore()

  useEffect(() => {
    let unsubscribe: (() => void) | undefined

    store.initialize().then((cleanup) => {
      unsubscribe = cleanup
    })

    return () => {
      unsubscribe?.()
    }
  }, [])

  return {
    user: store.user,
    profile: store.profile,
    isOwner: store.isOwner,
    isAuthenticated: store.isAuthenticated,
    isLoading: store.isLoading,
    signOut: store.signOut,
  }
}
