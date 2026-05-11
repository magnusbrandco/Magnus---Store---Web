import type { Profile, Address } from './database'

export interface AuthUser {
  id: string
  email: string
}

export interface UserProfile extends Profile {
  addresses: Address[]
}
