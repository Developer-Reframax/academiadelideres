'use client'

import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { Toaster } from 'sonner'

import { useAuth } from '@/contexts/AuthContext'

import { Sidebar } from './Sidebar/Sidebar'

interface DashboardLayoutProps {
  children: React.ReactNode
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const { user, isLoading, isAuthenticated } = useAuth()
  const router = useRouter()

  useEffect(() => {
    // Se não está carregando e não está autenticado, redirecionar para login
    if (!isLoading && !isAuthenticated) {
      console.log(
        '🔄 [DASHBOARD LAYOUT] Usuário não autenticado, redirecionando para login',
      )
      router.push('/login')
    }
  }, [isLoading, isAuthenticated, router])

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-primary-600"></div>
      </div>
    )
  }

  if (!isAuthenticated || !user) {
    return null
  }

  return (
    <>
      <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900">
        <Sidebar user={user} />
        <main className="flex-1 overflow-auto">
          <div className="p-6">{children}</div>
        </main>
      </div>
      <Toaster position="top-right" richColors closeButton />
    </>
  )
}
