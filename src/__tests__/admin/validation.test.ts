import { describe, it, expect } from 'vitest'
import { productSchema } from '@/pages/admin/ProductsAdmin'
import { couponSchema } from '@/pages/admin/CouponsAdmin'
import { normalizeImageUrl } from '@/lib/image'

describe('Admin form validation', () => {
  it('should validate product form values', () => {
    const result = productSchema.safeParse({
      name: 'Zapatos Test',
      slug: 'zapatos-test',
      description: 'Un producto de prueba',
      imageUrl: 'https://example.com/image.jpg',
      base_price: '120',
      compare_price: '150',
      brand_id: '',
      category_id: '',
      is_active: true,
      is_featured: false,
      is_drop: false,
      tags: 'zapatos,calzado',
    })

    expect(result.success).toBe(true)
  })

  it('should reject invalid product slug and price', () => {
    const result = productSchema.safeParse({
      name: 'XY',
      slug: 'Nombre Inválido',
      description: '',
      imageUrl: 'not-a-url',
      base_price: '-5',
      compare_price: 'abc',
      brand_id: '',
      category_id: '',
      is_active: true,
      is_featured: false,
      is_drop: false,
      tags: '',
    })

    expect(result.success).toBe(false)
    expect(result.error?.issues.some((issue) => issue.path[0] === 'slug')).toBe(true)
    expect(result.error?.issues.some((issue) => issue.path[0] === 'base_price')).toBe(true)
  })

  it('should validate coupon form values', () => {
    const result = couponSchema.safeParse({
      code: 'DESCUENTO10',
      type: 'percentage',
      value: '10',
      minOrder: '50',
      maxUses: '5',
      expiresAt: '2030-12-31',
      isActive: true,
    })

    expect(result.success).toBe(true)
  })

  it('should reject invalid coupon form values', () => {
    const result = couponSchema.safeParse({
      code: 'A',
      type: 'fixed',
      value: '-10',
      minOrder: 'abc',
      maxUses: 'x',
      expiresAt: '31-12-2030',
      isActive: true,
    })

    expect(result.success).toBe(false)
    expect(result.error?.issues.some((issue) => issue.path[0] === 'code')).toBe(true)
    expect(result.error?.issues.some((issue) => issue.path[0] === 'value')).toBe(true)
    expect(result.error?.issues.some((issue) => issue.path[0] === 'minOrder')).toBe(true)
  })

  it('should normalize Google Drive image URLs', () => {
    const normalized = normalizeImageUrl('https://drive.google.com/file/d/1a2B3cD4E5F6G7H8I9J0/view?usp=sharing')
    expect(normalized).toBe('https://drive.google.com/uc?export=view&id=1a2B3cD4E5F6G7H8I9J0')
  })

  it('should accept product form with Google Drive image URL', () => {
    const result = productSchema.safeParse({
      name: 'Zapatos Test',
      slug: 'zapatos-test',
      description: 'Un producto de prueba',
      imageUrl: 'https://drive.google.com/file/d/1a2B3cD4E5F6G7H8I9J0/view?usp=sharing',
      base_price: '120',
      compare_price: '150',
      brand_id: '',
      category_id: '',
      is_active: true,
      is_featured: false,
      is_drop: false,
      tags: 'zapatos,calzado',
    })

    expect(result.success).toBe(true)
  })
})
