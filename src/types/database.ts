export interface Json {
  [key: string]: unknown
}

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: Profile
        Insert: Omit<Profile, 'created_at' | 'updated_at'>
        Update: Partial<Omit<Profile, 'id'>>
      }
      addresses: {
        Row: Address
        Insert: Omit<Address, 'id' | 'created_at'>
        Update: Partial<Omit<Address, 'id'>>
      }
      brands: {
        Row: Brand
        Insert: Omit<Brand, 'id' | 'created_at'>
        Update: Partial<Omit<Brand, 'id'>>
      }
      categories: {
        Row: Category
        Insert: Omit<Category, 'id' | 'created_at'>
        Update: Partial<Omit<Category, 'id'>>
      }
      products: {
        Row: Product
        Insert: Omit<Product, 'id' | 'created_at' | 'updated_at' | 'search_vector'>
        Update: Partial<Omit<Product, 'id'>>
      }
      product_variants: {
        Row: ProductVariant
        Insert: Omit<ProductVariant, 'id' | 'created_at'>
        Update: Partial<Omit<ProductVariant, 'id'>>
      }
      drops: {
        Row: Drop
        Insert: Omit<Drop, 'id' | 'created_at'>
        Update: Partial<Omit<Drop, 'id'>>
      }
      drop_products: {
        Row: DropProduct
        Insert: DropProduct
        Update: Partial<DropProduct>
      }
      drop_subscribers: {
        Row: DropSubscriber
        Insert: Omit<DropSubscriber, 'id' | 'created_at'>
        Update: Partial<Omit<DropSubscriber, 'id'>>
      }
      carts: {
        Row: Cart
        Insert: Omit<Cart, 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Omit<Cart, 'id'>>
      }
      cart_items: {
        Row: CartItem
        Insert: Omit<CartItem, 'id' | 'created_at'>
        Update: Partial<Omit<CartItem, 'id'>>
      }
      orders: {
        Row: Order
        Insert: Omit<Order, 'id' | 'created_at' | 'updated_at' | 'order_number'>
        Update: Partial<Omit<Order, 'id'>>
      }
      order_items: {
        Row: OrderItem
        Insert: Omit<OrderItem, 'id'>
        Update: Partial<Omit<OrderItem, 'id'>>
      }
      order_events: {
        Row: OrderEvent
        Insert: Omit<OrderEvent, 'id' | 'created_at'>
        Update: Partial<Omit<OrderEvent, 'id'>>
      }
      wishlists: {
        Row: WishlistItem
        Insert: Omit<WishlistItem, 'created_at'>
        Update: Partial<Omit<WishlistItem, 'created_at'>>
      }
      reviews: {
        Row: Review
        Insert: Omit<Review, 'id' | 'created_at'>
        Update: Partial<Omit<Review, 'id'>>
      }
      homepage_settings: {
        Row: HomepageSetting
        Insert: Omit<HomepageSetting, 'id' | 'updated_at'>
        Update: Partial<Omit<HomepageSetting, 'id'>>
      }
      coupons: {
        Row: Coupon
        Insert: Omit<Coupon, 'id' | 'created_at'>
        Update: Partial<Omit<Coupon, 'id'>>
      }
    }
    Functions: {
      get_cart_totals: {
        Args: { p_user_id: string }
        Returns: { item_count: number; subtotal: number; total: number }
      }
      validate_coupon: {
        Args: { p_code: string; p_order_total: number }
        Returns: Json
      }
      get_dashboard_stats: {
        Args: Record<string, never>
        Returns: Json
      }
    }
  }
}

export interface Profile {
  id: string
  email: string
  full_name: string | null
  phone: string | null
  avatar_url: string | null
  role: 'customer' | 'admin' | 'staff'
  is_subscribed: boolean
  created_at: string
  updated_at: string
}

export interface Address {
  id: string
  user_id: string
  label: string
  full_name: string
  phone: string
  address_line1: string
  address_line2: string | null
  city: string
  department: string
  postal_code: string | null
  is_default: boolean
  created_at: string
}

export interface Brand {
  id: string
  name: string
  slug: string
  logo_url: string | null
  cover_url: string | null
  description: string | null
  is_featured: boolean
  sort_order: number
  created_at: string
}

export interface Category {
  id: string
  name: string
  slug: string
  description: string | null
  image_url: string | null
  parent_id: string | null
  sort_order: number
  created_at: string
}

export interface Product {
  id: string
  name: string
  slug: string
  description: string | null
  brand_id: string | null
  category_id: string | null
  base_price: number
  compare_price: number | null
  images: string[]
  tags: string[]
  is_active: boolean
  is_featured: boolean
  is_drop: boolean
  metadata: Json
  search_vector: string | null
  created_at: string
  updated_at: string
}

export interface ProductVariant {
  id: string
  product_id: string
  sku: string | null
  size: string | null
  color: string | null
  color_hex: string | null
  stock: number
  price: number | null
  is_active: boolean
  created_at: string
}

export interface Drop {
  id: string
  name: string
  slug: string
  description: string | null
  cover_url: string | null
  drop_date: string
  is_active: boolean
  is_published: boolean
  created_at: string
}

export interface DropProduct {
  drop_id: string
  product_id: string
}

export interface DropSubscriber {
  id: string
  drop_id: string
  email: string
  user_id: string | null
  created_at: string
}

export interface Cart {
  id: string
  user_id: string
  session_id: string | null
  created_at: string
  updated_at: string
}

export interface CartItem {
  id: string
  cart_id: string
  variant_id: string
  product_id: string
  quantity: number
  price: number
  created_at: string
}

export interface Order {
  id: string
  order_number: string
  user_id: string
  status: 'pending' | 'payment_pending' | 'paid' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'refunded'
  payment_status: 'pending' | 'approved' | 'declined' | 'voided' | 'error'
  payment_method: string | null
  wompi_tx_id: string | null
  subtotal: number
  discount: number
  shipping_cost: number
  total: number
  coupon_code: string | null
  shipping_address: Json
  notes: string | null
  metadata: Json
  created_at: string
  updated_at: string
}

export interface OrderItem {
  id: string
  order_id: string
  product_id: string
  variant_id: string
  product_name: string
  variant_info: Json
  quantity: number
  unit_price: number
  total_price: number
}

export interface OrderEvent {
  id: string
  order_id: string
  event: string
  data: Json
  created_at: string
}

export interface WishlistItem {
  user_id: string
  product_id: string
  created_at: string
}

export interface Review {
  id: string
  product_id: string
  user_id: string
  order_id: string
  rating: number
  title: string | null
  body: string | null
  is_verified: boolean
  is_visible: boolean
  created_at: string
}

export interface HomepageSetting {
  id: string
  hero_series_label: string
  hero_title: string
  hero_description: string
  hero_primary_cta_label: string
  hero_primary_cta_link: string
  hero_secondary_cta_label: string
  hero_secondary_cta_link: string
  hero_highlight_color: string
  categories_section_label: string
  categories_section_title: string
  brands_section_label: string
  brands_section_title: string
  updated_at: string
}

export interface Coupon {
  id: string
  code: string
  type: 'percentage' | 'fixed'
  value: number
  min_order: number
  max_uses: number | null
  uses_count: number
  is_active: boolean
  expires_at: string | null
  created_at: string
}
