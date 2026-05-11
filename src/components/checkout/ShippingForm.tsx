import { useForm } from 'react-hook-form'
import { motion } from 'framer-motion'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'

interface ShippingFormData {
  fullName: string
  phone: string
  addressLine1: string
  addressLine2?: string
  city: string
  department: string
  postalCode?: string
}

interface ShippingFormProps {
  onSubmit: (data: ShippingFormData) => void
  defaultValues?: ShippingFormData
}

export function ShippingForm({ onSubmit, defaultValues }: ShippingFormProps) {
  const { register, handleSubmit, formState: { errors } } = useForm<ShippingFormData>({
    defaultValues,
  })

  return (
    <motion.form
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-5"
    >
      <h2 className="font-display text-display-md text-white mb-6">Información de envío</h2>

      <Input
        label="Nombre completo"
        placeholder="Juan Pérez"
        error={errors.fullName?.message}
        registration={register('fullName', { required: 'Requerido' })}
      />

      <Input
        label="Teléfono"
        placeholder="300 123 4567"
        error={errors.phone?.message}
        registration={register('phone', { required: 'Requerido' })}
      />

      <Input
        label="Dirección"
        placeholder="Calle 123 #45-67"
        error={errors.addressLine1?.message}
        registration={register('addressLine1', { required: 'Requerido' })}
      />

      <Input
        label="Complemento (opcional)"
        placeholder="Apto 301, Edificio..."
        registration={register('addressLine2')}
      />

      <div className="grid grid-cols-2 gap-4">
        <Input
          label="Ciudad"
          placeholder="Medellín"
          error={errors.city?.message}
          registration={register('city', { required: 'Requerido' })}
        />
        <Input
          label="Departamento"
          placeholder="Antioquia"
          error={errors.department?.message}
          registration={register('department', { required: 'Requerido' })}
        />
      </div>

      <Input
        label="Código postal (opcional)"
        placeholder="050012"
        registration={register('postalCode')}
      />

      <Button type="submit" variant="primary" size="lg" className="w-full mt-6">
        Continuar al pago
      </Button>
    </motion.form>
  )
}
