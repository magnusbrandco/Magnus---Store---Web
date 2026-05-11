import type { Product, ProductVariant, Brand, Category, Review } from './database'

export interface ProductWithRelations extends Product {
  brand: Pick<Brand, 'id' | 'name' | 'slug'> | null
  category: Pick<Category, 'id' | 'name' | 'slug'> | null
  variants: ProductVariant[]
  reviews?: Review[]
}

export interface ProductFilters {
  category?: string
  brand?: string
  minPrice?: number
  maxPrice?: number
  sizes?: string[]
  colors?: string[]
  sort?: 'newest' | 'price_asc' | 'price_desc' | 'popular'
  search?: string
  page?: number
}

export interface ProductCardData {
  id: string
  name: string
  slug: string
  brand: string
  brandSlug: string
  basePrice: number
  comparePrice: number | null
  image: string
  hoverImage?: string
  rating: number
  reviewCount: number
  isNew: boolean
  isHot: boolean
  isDrop: boolean
  isLowStock: boolean
  colors: { name: string; hex: string }[]
  sizes: string[]
}

export interface SizeOption {
  label: string
  value: string
  inStock: boolean
}

export interface ColorOption {
  name: string
  hex: string
  available: boolean
}
