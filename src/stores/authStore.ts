import { create } from 'zustand'
import { supabase } from '@/lib/supabase'
import { OWNER_EMAIL } from '@/config/constants'
import type { User } from '@supabase/supabase-js'
import type { Profile } from '@/types/database'

interface AuthStore {
  user: User | null
  profile: Profile | null
  isOwner: boolean
  isAuthenticated: boolean
  isLoading: boolean
  setUser: (user: User | null, profile: Profile | null, isOwner: boolean) => void
  signOut: () => Promise<boolean>
  initialize: () => Promise<(() => void) | undefined>
}

const fetchProfile = async (userId: string) => {
  const { data, error } = await supabase
    .from('profiles')
    .select('id, full_name, phone, role, avatar_url')
    .eq('id', userId)
    .maybeSingle()

  if (error) {
    console.warn('No profile found for auth user:', error.message)
    return null
  }

  return data ? (data as Profile) : null
}

const isOwnerEmail = (email: string | null): boolean =>
  email?.toLowerCase() === OWNER_EMAIL.toLowerCase()

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  profile: null,
  isOwner: false,
  isAuthenticated: false,
  isLoading: true,

  setUser: (user, profile, isOwner) => set({ user, profile, isOwner, isAuthenticated: !!user }),

  signOut: async () => {
    const { error } = await supabase.auth.signOut()
    const success = !error
    if (error) {
      console.error('Sign out failed:', error.message)
    }
    set({ user: null, profile: null, isOwner: false, isAuthenticated: false })
    return success
  },

  initialize: async () => {
    const { data: { session } } = await supabase.auth.getSession()
    let profile = null
    let owner = false

    if (session?.user) {
      profile = await fetchProfile(session.user.id)
      owner = isOwnerEmail(session.user.email ?? null)
    }

    set({
      user: session?.user ?? null,
      profile,
      isOwner: owner,
      isAuthenticated: !!session?.user,
      isLoading: false,
    })

    const { data } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (session?.user) {
        const profile = await fetchProfile(session.user.id)
        set({
          user: session.user,
          profile,
          isOwner: isOwnerEmail(session.user.email ?? null),
          isAuthenticated: true,
        })
      } else {
        set({ user: null, profile: null, isOwner: false, isAuthenticated: false })
      }
    })

    return () => data.subscription.unsubscribe()
  },
}))
