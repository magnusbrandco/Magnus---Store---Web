import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { supabase } from '@/lib/supabase'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'

interface RegisterFormProps {
  readonly onSuccess?: () => void
  readonly onToggleForm: () => void
}

interface RegisterData {
  fullName: string
  email: string
  password: string
  confirmPassword: string
  captcha: string
}

function createCaptcha() {
  const a = Math.floor(Math.random() * 8) + 1
  const b = Math.floor(Math.random() * 8) + 1
  return {
    question: `¿Cuánto es ${a} + ${b}?`,
    answer: String(a + b),
  }
}

export function RegisterForm({ onSuccess, onToggleForm }: RegisterFormProps) {
  const [error, setError] = useState('')
  const [successMessage, setSuccessMessage] = useState('')
  const [captcha, setCaptcha] = useState(createCaptcha())
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<RegisterData>()

  const onSubmit = async (data: RegisterData) => {
    setError('')
    setSuccessMessage('')

    if (data.password !== data.confirmPassword) {
      setError('Las contraseñas no coinciden')
      return
    }

    if (data.captcha.trim() !== captcha.answer) {
      setError('Respuesta de seguridad incorrecta. Vuelve a intentarlo.')
      setCaptcha(createCaptcha())
      return
    }

    const { error: authError } = await supabase.auth.signUp({
      email: data.email,
      password: data.password,
      options: {
        data: { full_name: data.fullName },
        emailRedirectTo: globalThis?.location?.origin ? `${globalThis.location.origin}/auth` : undefined,
      },
    })

    if (authError) {
      setError(authError.message)
      return
    }

    setSuccessMessage(
      'Registro exitoso. Revisa tu correo electrónico y confirma tu cuenta antes de iniciar sesión.'
    )
    reset({ fullName: '', email: '', password: '', confirmPassword: '', captcha: '' })
    setCaptcha(createCaptcha())
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <h2 className="font-display text-display-md text-white mb-2">Crear cuenta</h2>

      <Input
        label="Nombre completo"
        placeholder="Juan Pérez"
        error={errors.fullName?.message}
        registration={register('fullName', { required: 'Requerido' })}
      />

      <Input
        label="Email"
        type="email"
        placeholder="tu@email.com"
        error={errors.email?.message}
        registration={register('email', { required: 'Requerido' })}
      />

      <Input
        label="Contraseña"
        type="password"
        placeholder="••••••••"
        error={errors.password?.message}
        registration={register('password', {
          required: 'Requerido',
          minLength: { value: 6, message: 'Mínimo 6 caracteres' },
        })}
      />

      <Input
        label="Confirmar contraseña"
        type="password"
        placeholder="••••••••"
        error={errors.confirmPassword?.message}
        registration={register('confirmPassword', { required: 'Requerido' })}
      />

      <div className="rounded border border-border bg-bg-3 p-4">
        <p className="font-mono text-sm text-muted mb-3">Verificación de seguridad</p>
        <Input
          label={captcha.question}
          type="text"
          placeholder="Ingresa el resultado"
          error={errors.captcha?.message}
          registration={register('captcha', { required: 'Requerido' })}
        />
      </div>

      {error && <p className="font-body text-sm text-red">{error}</p>}
      {successMessage && <p className="font-body text-sm text-lime">{successMessage}</p>}

      <Button type="submit" variant="primary" size="lg" className="w-full" isLoading={isSubmitting}>
        Crear cuenta
      </Button>

      <p className="font-body text-sm text-muted text-center">
        ¿Ya tienes cuenta?{' '}
        <button type="button" onClick={onToggleForm} className="text-lime hover:underline">
          Inicia sesión
        </button>
      </p>
    </form>
  )
}
