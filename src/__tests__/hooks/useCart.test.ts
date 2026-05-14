import { describe, it, expect, beforeEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useCart } from '@/hooks/useCart'

describe('useCart', () => {
  beforeEach(() => {
    // Clear cart state before each test
    const { result } = renderHook(() => useCart())
    act(() => {
      result.current.clearCart()
    })
  })

  it('should initialize with empty cart', () => {
    const { result } = renderHook(() => useCart())
    expect(result.current.items).toHaveLength(0)
    expect(result.current.subtotal).toBe(0)
  })

  it('should add item to cart', () => {
    const { result } = renderHook(() => useCart())

    act(() => {
      result.current.addItem({
        id: 'var_1',
        productId: 'prod_1',
        productName: 'Test Product',
        brandName: 'Magnus',
        price: 100,
        size: 'M',
        color: 'black',
        colorHex: '#000000',
        imageUrl: 'test.jpg',
        quantity: 1,
        stock: 10,
      })
    })

    expect(result.current.items).toHaveLength(1)
    expect(result.current.subtotal).toBe(100)
  })

  it('should update item quantity', () => {
    const { result } = renderHook(() => useCart())

    act(() => {
      result.current.addItem({
        id: 'var_1',
        productId: 'prod_1',
        productName: 'Test Product',
        brandName: 'Magnus',
        price: 100,
        size: 'M',
        color: 'black',
        colorHex: '#000000',
        imageUrl: 'test.jpg',
        quantity: 1,
        stock: 10,
      })
    })

    act(() => {
      result.current.updateQuantity('var_1', 3)
    })

    expect(result.current.items[0].quantity).toBe(3)
    expect(result.current.subtotal).toBe(300)
  })

  it('should remove item from cart', () => {
    const { result } = renderHook(() => useCart())

    act(() => {
      result.current.addItem({
        id: 'var_1',
        productId: 'prod_1',
        productName: 'Test Product',
        brandName: 'Magnus',
        price: 100,
        size: 'M',
        color: 'black',
        colorHex: '#000000',
        imageUrl: 'test.jpg',
        quantity: 1,
        stock: 10,
      })
    })

    act(() => {
      result.current.removeItem('var_1')
    })

    expect(result.current.items).toHaveLength(0)
    expect(result.current.subtotal).toBe(0)
  })

  it('should clear cart', () => {
    const { result } = renderHook(() => useCart())

    act(() => {
      result.current.addItem({
        id: 'var_1',
        productId: 'prod_1',
        productName: 'Test Product',
        brandName: 'Magnus',
        price: 100,
        size: 'M',
        color: 'black',
        colorHex: '#000000',
        imageUrl: 'test.jpg',
        quantity: 1,
        stock: 10,
      })
      result.current.addItem({
        id: 'var_2',
        productId: 'prod_2',
        productName: 'Test Product 2',
        brandName: 'Magnus',
        price: 200,
        size: 'L',
        color: 'white',
        colorHex: '#FFFFFF',
        imageUrl: 'test2.jpg',
        quantity: 1,
        stock: 5,
      })
    })

    expect(result.current.items).toHaveLength(2)

    act(() => {
      result.current.clearCart()
    })

    expect(result.current.items).toHaveLength(0)
    expect(result.current.subtotal).toBe(0)
  })
})
