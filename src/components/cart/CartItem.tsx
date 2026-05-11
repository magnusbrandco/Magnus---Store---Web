import { Minus, Plus, Trash2 } from 'lucide-react'
import { formatCOP } from '@/lib/utils'
import type { CartItem as CartItemType } from '@/stores/cartStore'

interface CartItemProps {
  item: CartItemType
  onUpdateQuantity: (id: string, quantity: number) => void
  onRemove: (id: string) => void
}

export function CartItemRow({ item, onUpdateQuantity, onRemove }: CartItemProps) {
  return (
    <div className="flex gap-4 bg-bg-3 p-4">
      <div className="w-20 h-24 bg-bg shrink-0">
        {item.imageUrl && (
          <img src={item.imageUrl} alt={item.productName} className="w-full h-full object-cover" />
        )}
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-body text-sm text-white truncate">{item.productName}</p>
        <p className="font-mono text-micro text-muted">{item.brandName}</p>
        <p className="font-mono text-micro text-muted">
          {item.size} {item.color && `/ ${item.color}`}
        </p>
        <p className="font-mono text-sm text-white mt-1">{formatCOP(item.price)}</p>
        <div className="flex items-center gap-2 mt-2">
          <button
            onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
            className="text-muted hover:text-white transition-colors"
          >
            <Minus size={14} />
          </button>
          <span className="font-mono text-xs w-6 text-center">{item.quantity}</span>
          <button
            onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
            className="text-muted hover:text-white transition-colors"
            disabled={item.quantity >= item.stock}
          >
            <Plus size={14} />
          </button>
          <button onClick={() => onRemove(item.id)} className="ml-auto text-muted hover:text-red transition-colors">
            <Trash2 size={14} />
          </button>
        </div>
      </div>
    </div>
  )
}
