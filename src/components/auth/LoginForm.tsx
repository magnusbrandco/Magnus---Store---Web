import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { supabase } from '@/lib/supabase'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'

interface LoginFormProps {
  readonly onSuccess?: () => void
  readonly onToggleForm: () => void
}

interface LoginData {
  email: string
  password: string
}

export function LoginForm({ onSuccess, onToggleForm }: LoginFormProps) {
  const [error, setError] = useState('')
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<LoginData>()

  const onSubmit = async (data: LoginData) => {
    setError('')
    const { error: authError } = await supabase.auth.signInWithPassword({
      email: data.email,
      password: data.password,
    })
    if (authError) {
      const message = authError.message.toLowerCase()
      if (message.includes('confirm') || message.includes('verif')) {
        setError('Debes verificar tu correo electrónico antes de iniciar sesión.')
      } else {
        setError(authError.message === 'Invalid login credentials'
          ? 'Email o contraseña incorrectos'
          : authError.message)
      }
    } else {
      onSuccess?.()
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <h2 className="font-display text-display-md text-white mb-2">Iniciar sesión</h2>

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
        registration={register('password', { required: 'Requerido' })}
      />

      {error && <p className="font-body text-sm text-red">{error}</p>}

      <Button type="submit" variant="primary" size="lg" className="w-full" isLoading={isSubmitting}>
        Iniciar sesión
      </Button>

      <p className="font-body text-sm text-muted text-center">
        ¿No tienes cuenta?{' '}
        <button type="button" onClick={onToggleForm} className="text-lime hover:underline">
          Regístrate
        </button>
      </p>
    </form>
  )
}
