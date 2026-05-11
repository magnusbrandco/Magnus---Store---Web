import { motion } from 'framer-motion'
import { Button } from '@/components/ui/Button'
import { formatCOP } from '@/lib/utils'

interface PaymentFormProps {
  total: number
  onPay: () => void
  isLoading?: boolean
}

export function PaymentForm({ total, onPay, isLoading }: PaymentFormProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="space-y-6"
    >
      <h2 className="font-display text-display-md text-white mb-6">Pago</h2>

      <p className="font-body text-sm text-muted">
        Paga de forma segura con Wompi. Aceptamos tarjetas de crédito, débito, Nequi, PSE y Efecty.
      </p>

      <div className="bg-bg-3 border border-border p-6">
        <p className="font-body text-sm text-muted mb-2">Total a pagar</p>
        <p className="font-mono text-display-md text-white">{formatCOP(total)}</p>
      </div>

      <div id="wompi-container" />

      <Button
        variant="primary"
        size="lg"
        className="w-full"
        onClick={onPay}
        isLoading={isLoading}
      >
        Pagar {formatCOP(total)}
      </Button>

      <p className="font-body text-micro text-muted text-center">
        Tus datos están protegidos con encriptación SSL. No almacenamos información de tarjetas.
      </p>
    </motion.div>
  )
}
