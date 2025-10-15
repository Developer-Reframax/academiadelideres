'use client'

import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

import { useAuth } from '@/contexts/AuthContext'

interface UseAuthRedirectOptions {
  requireAuth?: boolean
}

export function useAuthRedirect(options: UseAuthRedirectOptions = {}) {
  const { requireAuth = true } = options
  const { user, isLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    // Se não requer autenticação, não fazer nada
    if (!requireAuth) return

    // Aguardar verificação de autenticação
    if (isLoading) return

    // Se não estiver autenticado, redirecionar para login
    if (!user) {
      console.log(
        '❌ [AUTH REDIRECT] Usuário não autenticado, redirecionando para login',
      )
      router.push('/login')
    }
  }, [user, isLoading, router, requireAuth])

  return {
    user,
    isLoading,
    isAuthenticated: !!user,
  }
}
