'use client'

import { Eye, EyeOff, Lock, LogIn, Phone } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { toast } from 'sonner'

import { useAuth } from '@/contexts/AuthContext'
import { useAuthRedirect } from '@/hooks/useAuthRedirect'

export default function LoginPage() {
  const [telefone, setTelefone] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const { login } = useAuth()

  // Não requer autenticação na página de login
  useAuthRedirect({ requireAuth: false })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      console.log('🔐 [FRONTEND] Tentando login via contexto...')

      const result = await login(telefone, password)

      if (result.success) {
        console.log('✅ [FRONTEND] Login bem-sucedido via contexto!')
        toast.success('Login realizado com sucesso!')

        // Redirecionamento manual após login bem-sucedido
        console.log('🔄 [FRONTEND] Redirecionando para dashboard...')
        router.push('/dashboard')
      } else {
        console.log('❌ [FRONTEND] Login falhou:', result.message)
        toast.error(result.message || 'Erro ao fazer login')
      }
    } catch (error) {
      console.error('💥 [FRONTEND] Erro na requisição:', error)
      toast.error('Erro de conexão. Tente novamente.')
    } finally {
      setIsLoading(false)
    }
  }

  const formatPhone = (value: string) => {
    // Remove tudo que não é número
    const numbers = value.replace(/\D/g, '')

    // Aplica a máscara +55 (XX) 9XXXX-XXXX
    if (numbers.length <= 2) {
      return `+55 ${numbers}`
    } else if (numbers.length <= 4) {
      return `+55 (${numbers.slice(2)})`
    } else if (numbers.length <= 9) {
      return `+55 (${numbers.slice(2, 4)}) ${numbers.slice(4)}`
    } else {
      return `+55 (${numbers.slice(2, 4)}) ${numbers.slice(4, 9)}-${numbers.slice(9, 13)}`
    }
  }

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhone(e.target.value)
    setTelefone(formatted)
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-primary-50 to-primary-100 p-4">
      <div className="w-full max-w-md">
        <div className="rounded-2xl bg-white p-8 shadow-xl">
          {/* Logo e Título */}
          <div className="mb-8 text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary-600">
              <LogIn className="h-8 w-8 text-white" />
            </div>
            <h1 className="mb-2 text-2xl font-bold text-gray-900">
              Academia de Líderes
            </h1>
            <p className="text-gray-600">Faça login para acessar o sistema</p>
          </div>

          {/* Formulário */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Campo Telefone */}
            <div>
              <label
                htmlFor="telefone"
                className="mb-2 block text-sm font-medium text-gray-700"
              >
                Telefone
              </label>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <Phone className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="telefone"
                  type="tel"
                  value={telefone}
                  onChange={handlePhoneChange}
                  placeholder="+55 (11) 99999-9999"
                  className="block w-full rounded-lg border border-gray-300 py-3 pl-10 pr-3 transition-colors focus:border-primary-500 focus:ring-2 focus:ring-primary-500"
                  required
                />
              </div>
            </div>

            {/* Campo Senha */}
            <div>
              <label
                htmlFor="password"
                className="mb-2 block text-sm font-medium text-gray-700"
              >
                Senha
              </label>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Digite sua senha"
                  className="block w-full rounded-lg border border-gray-300 py-3 pl-10 pr-12 transition-colors focus:border-primary-500 focus:ring-2 focus:ring-primary-500"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 flex items-center pr-3"
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                  )}
                </button>
              </div>
            </div>

            {/* Botão de Login */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full rounded-lg bg-primary-600 px-4 py-3 font-medium text-white transition-colors hover:bg-primary-700 focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isLoading ? 'Entrando...' : 'Entrar'}
            </button>
          </form>

          {/* Informações de Acesso */}
          <div className="mt-8 rounded-lg bg-gray-50 p-4">
            <h3 className="mb-2 text-sm font-medium text-gray-900">
              Informações de Acesso
            </h3>
            <p className="text-xs text-gray-600">
              Use seu telefone cadastrado e a senha padrão:{' '}
              <strong>acad + sua matrícula</strong>
            </p>
            <p className="mt-1 text-xs text-gray-600">
              Exemplo: Para matrícula 12345, a senha é{' '}
              <strong>acad12345</strong>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
