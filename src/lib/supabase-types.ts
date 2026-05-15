import type { Database } from '@/types/database'

// Type helpers for type-safe Supabase queries
export type Tables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Row']
export type Inserts<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Insert']
export type Updates<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Update']

// Common table types for easier imports
export type Profile = Tables<'profiles'>
export type Brand = Tables<'brands'>
export type Category = Tables<'categories'>
export type Product = Tables<'products'>
export type ProductVariant = Tables<'product_variants'>
export type Drop = Tables<'drops'>
export type DropProduct = Tables<'drop_products'>
export type DropSubscriber = Tables<'drop_subscribers'>
export type Order = Tables<'orders'>
export type OrderItem = Tables<'order_items'>
export type OrderEvent = Tables<'order_events'>
export type WishlistItem = Tables<'wishlists'>
export type Review = Tables<'reviews'>
export type Cart = Tables<'carts'>
export type CartItem = Tables<'cart_items'>
export type Coupon = Tables<'coupons'>
export type HomepageSetting = Tables<'homepage_settings'>
export type Address = Tables<'addresses'>
