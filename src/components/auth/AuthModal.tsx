import { useState } from 'react'
import { Modal } from '@/components/ui/Modal'
import { LoginForm } from './LoginForm'
import { RegisterForm } from './RegisterForm'
import { useUIStore } from '@/stores/uiStore'

export function AuthModal() {
  const { isAuthModalOpen, closeAuthModal } = useUIStore()
  const [isLogin, setIsLogin] = useState(true)

  return (
    <Modal isOpen={isAuthModalOpen} onClose={closeAuthModal}>
      {isLogin ? (
        <LoginForm onSuccess={closeAuthModal} onToggleForm={() => setIsLogin(false)} />
      ) : (
        <RegisterForm onSuccess={closeAuthModal} onToggleForm={() => setIsLogin(true)} />
      )}
    </Modal>
  )
}
