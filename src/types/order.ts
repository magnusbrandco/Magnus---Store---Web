import type { Order, OrderItem } from './database'

export interface OrderWithItems extends Order {
  items: OrderItem[]
}

export interface ShippingInfo {
  fullName: string
  phone: string
  addressLine1: string
  addressLine2?: string
  city: string
  department: string
  postalCode?: string
}

export type ShippingMethod = 'standard' | 'express' | 'same_day'

export interface ShippingOption {
  id: ShippingMethod
  label: string
  description: string
  cost: number
  days: string
}

export interface CouponResult {
  valid: boolean
  coupon_id?: string
  type?: 'percentage' | 'fixed'
  value?: number
  discount?: number
  error?: string
}
