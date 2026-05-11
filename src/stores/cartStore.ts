import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

export interface CartItem {
  id: string
  productId: string
  productName: string
  brandName: string
  price: number
  size: string
  color: string
  colorHex: string
  imageUrl: string
  quantity: number
  stock: number
}

interface CartStore {
  items: CartItem[]
  isOpen: boolean
  addItem: (item: CartItem) => void
  removeItem: (variantId: string) => void
  updateQuantity: (variantId: string, quantity: number) => void
  clearCart: () => void
  openCart: () => void
  closeCart: () => void
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,

      addItem: (newItem) => set((state) => {
        const existing = state.items.find(i => i.id === newItem.id)
        if (existing) {
          return {
            items: state.items.map(i =>
              i.id === newItem.id
                ? { ...i, quantity: Math.min(i.quantity + newItem.quantity, i.stock) }
                : i
            ),
            isOpen: true,
          }
        }
        return { items: [...state.items, newItem], isOpen: true }
      }),

      removeItem: (variantId) => set((state) => ({
        items: state.items.filter(i => i.id !== variantId)
      })),

      updateQuantity: (variantId, quantity) => set((state) => ({
        items: quantity === 0
          ? state.items.filter(i => i.id !== variantId)
          : state.items.map(i => i.id === variantId ? { ...i, quantity } : i)
      })),

      clearCart: () => set({ items: [] }),
      openCart: () => set({ isOpen: true }),
      closeCart: () => set({ isOpen: false }),
    }),
    {
      name: 'magnus-cart',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ items: state.items }),
    }
  )
)
