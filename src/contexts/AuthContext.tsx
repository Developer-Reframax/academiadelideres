'use client'

import { usePathname } from 'next/navigation'
import React, {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from 'react'

import { User } from '@/types'

interface AuthContextType {
  user: User | null
  isLoading: boolean
  isAuthenticated: boolean
  login: (
    telefone: string,
    password: string,
  ) => Promise<{ success: boolean; message?: string }>
  logout: () => Promise<void>
  checkAuth: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Rotas que não precisam de verificação automática de autenticação
const publicRoutes = ['/login']

// Helper para gerenciar token no localStorage
const TOKEN_KEY = 'auth-token'

const getToken = (): string | null => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem(TOKEN_KEY)
  }
  return null
}

const setToken = (token: string): void => {
  if (typeof window !== 'undefined') {
    localStorage.setItem(TOKEN_KEY, token)
  }
}

const removeToken = (): void => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(TOKEN_KEY)
  }
}

const getAuthHeaders = (): HeadersInit => {
  const token = getToken()
  return token ? { Authorization: `Bearer ${token}` } : {}
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [hasCheckedAuth, setHasCheckedAuth] = useState(false) // Flag para evitar múltiplas verificações
  const pathname = usePathname()

  // Determinar se é rota pública e definir isLoading adequadamente
  const isPublicRoute = publicRoutes.includes(pathname)
  const [isLoading, setIsLoading] = useState(!isPublicRoute) // Se for rota pública, não carrega

  const checkAuth = async () => {
    // Evitar múltiplas chamadas simultâneas
    if (isLoading && hasCheckedAuth) {
      console.log('🔄 [AUTH CONTEXT] Verificação já em andamento, pulando...')
      return
    }

    try {
      setIsLoading(true)
      const token = getToken()

      if (!token) {
        console.log('🔍 [AUTH CONTEXT] Nenhum token encontrado no localStorage')
        setUser(null)
        setHasCheckedAuth(true)
        return
      }

      console.log('🔍 [AUTH CONTEXT] Verificando token com API...')
      const response = await fetch('/api/auth/me', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeaders(),
        },
      })

      if (response.ok) {
        const data = await response.json()
        if (data.success && data.user) {
          console.log('✅ [AUTH CONTEXT] Usuário autenticado:', data.user.nome)
          setUser(data.user)
        } else {
          console.log('❌ [AUTH CONTEXT] Resposta inválida da API')
          setUser(null)
          removeToken()
        }
      } else {
        console.log('❌ [AUTH CONTEXT] Falha na autenticação, removendo token')
        setUser(null)
        removeToken()
      }
    } catch (error) {
      console.error('Erro ao verificar autenticação:', error)
      setUser(null)
      removeToken()
    } finally {
      setIsLoading(false)
      setHasCheckedAuth(true)
    }
  }

  const login = async (telefone: string, password: string) => {
    try {
      setIsLoading(true)
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ telefone, password }),
      })

      const data = await response.json()

      if (data.success && data.user && data.token) {
        console.log(
          '✅ [AUTH CONTEXT] Login realizado com sucesso:',
          data.user.nome,
        )
        setToken(data.token)
        setUser(data.user)
        setHasCheckedAuth(true) // Marcar como verificado após login bem-sucedido
        return { success: true }
      } else {
        console.log('❌ [AUTH CONTEXT] Falha no login:', data.message)
        return { success: false, message: data.message || 'Erro no login' }
      }
    } catch (error) {
      console.error('Erro no login:', error)
      return { success: false, message: 'Erro de conexão' }
    } finally {
      setIsLoading(false)
    }
  }

  const logout = async () => {
    try {
      setIsLoading(true)
      console.log('🚪 [AUTH CONTEXT] Realizando logout')

      // Remover token do localStorage
      removeToken()

      // Opcional: chamar API de logout se existir
      try {
        await fetch('/api/auth/logout', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            ...getAuthHeaders(),
          },
        })
      } catch (error) {
        console.log('Erro ao chamar API de logout (não crítico):', error)
      }
    } catch (error) {
      console.error('Erro no logout:', error)
    } finally {
      setUser(null)
      setIsLoading(false)
      setHasCheckedAuth(false) // Reset para permitir nova verificação
      console.log('✅ [AUTH CONTEXT] Logout concluído')
    }
  }

  // Efeito para gerenciar rotas públicas (executa apenas quando pathname muda)
  useEffect(() => {
    const currentIsPublicRoute = publicRoutes.includes(pathname)

    if (currentIsPublicRoute) {
      // Em rotas públicas: não fazer verificação, definir loading como false
      console.log(
        '🔓 [AUTH CONTEXT] Rota pública detectada, pulando verificação:',
        pathname,
      )
      setIsLoading(false)
      setHasCheckedAuth(true)
    }
  }, [pathname])

  // Efeito para verificar autenticação em rotas protegidas
  useEffect(() => {
    const currentIsPublicRoute = publicRoutes.includes(pathname)

    // Em rotas protegidas: verificar autenticação se ainda não verificou
    if (!currentIsPublicRoute && !hasCheckedAuth) {
      console.log(
        '🔍 [AUTH CONTEXT] Verificação inicial de autenticação para rota protegida:',
        pathname,
      )
      checkAuth()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname, hasCheckedAuth])

  // AuthContext não deve gerenciar redirecionamentos automáticos
  // Isso deve ser feito manualmente nas páginas conforme necessário

  const value: AuthContextType = {
    user,
    isLoading,
    isAuthenticated: !!user,
    login,
    logout,
    checkAuth,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider')
  }
  return context
}
