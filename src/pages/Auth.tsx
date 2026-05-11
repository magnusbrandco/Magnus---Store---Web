import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSEO } from '@/hooks/useSEO'
import { LoginForm } from '@/components/auth/LoginForm'
import { RegisterForm } from '@/components/auth/RegisterForm'
import { Button } from '@/components/ui/Button'

export default function AuthPage() {
  useSEO({ title: 'Iniciar sesión | Magnus' })
  const [isLogin, setIsLogin] = useState(true)
  const navigate = useNavigate()

  const handleSuccess = () => {
    navigate('/cuenta')
  }

  return (
    <div className="pt-24 pb-16">
      <div className="container-wide">
        <div className="mx-auto max-w-3xl rounded-3xl border border-border bg-bg-2 p-8 shadow-xl">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-8">
            <div>
              <p className="font-display text-display-md text-white">Acceso</p>
              <p className="font-body text-muted text-sm">Inicia sesión con tu cuenta de administrador para gestionar la tienda.</p>
            </div>
            <div className="flex gap-2">
              <Button variant={isLogin ? 'secondary' : 'outline'} onClick={() => setIsLogin(true)}>
                Entrar
              </Button>
              <Button variant={isLogin ? 'outline' : 'secondary'} onClick={() => setIsLogin(false)}>
                Crear cuenta
              </Button>
            </div>
          </div>

          {isLogin ? (
            <LoginForm onSuccess={handleSuccess} onToggleForm={() => setIsLogin(false)} />
          ) : (
            <RegisterForm onSuccess={() => navigate('/cuenta')} onToggleForm={() => setIsLogin(true)} />
          )}
        </div>
      </div>
    </div>
  )
}
