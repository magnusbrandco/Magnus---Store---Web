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

  const handlePay = async () => {
    // En producción, esto llamaría a la Edge Function create-order
    // y luego inicializaría el widget de Wompi con la firma
    const mockOrderId = 'order-' + Date.now()
    const mockSignature = 'mock-signature'
    initWompiWidget(mockOrderId, subtotal, mockSignature)
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
