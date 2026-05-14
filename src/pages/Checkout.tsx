import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useCart } from '@/hooks/useCart'
import { CheckoutSteps } from '@/components/checkout/CheckoutSteps'
import { ShippingForm } from '@/components/checkout/ShippingForm'
import { OrderSummary } from '@/components/checkout/OrderSummary'
import { useSEO } from '@/hooks/useSEO'
import { Button } from '@/components/ui/Button'
import { initWompiWidget } from '@/lib/wompi'

const steps = ['Información', 'Pago']

export default function Checkout() {
  useSEO({ title: 'Checkout | Magnus' })

  const navigate = useNavigate()
  const { items, subtotal } = useCart()
  const [currentStep, setCurrentStep] = useState(0)
  const [shippingData, setShippingData] = useState<any>(null)

  if (items.length === 0) {
    navigate('/tienda')
    return null
  }

  const handleShippingSubmit = (data: any) => {
    setShippingData(data)
    setCurrentStep(1)
  }

  const handlePay = () => {
    // Redirect to WhatsApp while payment methods are being configured
    const whatsappNumber = '573216209183'
    const message = encodeURIComponent(
      `Hola, quiero completar mi pedido. Total: $${subtotal.toLocaleString('es-CO')}`
    )
    window.open(`https://wa.me/${whatsappNumber}?text=${message}`, '_blank')
  }

  return (
    <div className="pt-24 pb-16">
      <div className="container-wide">
        <CheckoutSteps currentStep={currentStep} steps={steps} />

        <div className="grid lg:grid-cols-3 gap-8 lg:gap-12">
          <div className="lg:col-span-2">
            {currentStep === 0 && (
              <ShippingForm onSubmit={handleShippingSubmit} />
            )}
            {currentStep === 1 && (
              <div className="space-y-6">
                <div className="bg-bg-3 border border-border p-6">
                  <h3 className="font-display text-display-md text-white mb-2">Dirección de envío</h3>
                  <p className="font-body text-sm text-muted">
                    {shippingData?.fullName}<br />
                    {shippingData?.addressLine1}<br />
                    {shippingData?.city}, {shippingData?.department}
                  </p>
                  <button onClick={() => setCurrentStep(0)} className="font-body text-xs text-lime hover:underline mt-2">
                    Editar
                  </button>
                </div>
                <Button variant="primary" size="lg" className="w-full" onClick={handlePay}>
                  Pagar
                </Button>
                <div id="wompi-container" />
              </div>
            )}
          </div>
          <div className="lg:col-span-1">
            <OrderSummary />
          </div>
        </div>
      </div>
    </div>
  )
}
