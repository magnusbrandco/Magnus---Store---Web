import { useCartStore } from '@/stores/cartStore'

export function useCart() {
  const store = useCartStore()

  const itemCount = store.items.reduce((acc, item) => acc + item.quantity, 0)
  const subtotal = store.items.reduce((acc, item) => acc + item.price * item.quantity, 0)

  return {
    items: store.items,
    itemCount,
    subtotal,
    isOpen: store.isOpen,
    addItem: store.addItem,
    removeItem: store.removeItem,
    updateQuantity: store.updateQuantity,
    clearCart: store.clearCart,
    openCart: store.openCart,
    closeCart: store.closeCart,
  }
}
