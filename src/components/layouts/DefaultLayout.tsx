'use client'

import { useRouter } from 'next/navigation'
import { ReactNode, useEffect } from 'react'

import { useAuth } from '@/contexts/AuthContext'
import { SidebarProvider } from '@/contexts/SidebarContext'

import { Sidebar } from '../Sidebar/Sidebar'

interface DefaultLayoutProps {
  children: ReactNode
}

export function DefaultLayout({ children }: DefaultLayoutProps) {
  const router = useRouter()
  const { user, isLoading, isAuthenticated } = useAuth()

  // Redireciona para login se não estiver autenticado
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login')
    }
  }, [isLoading, isAuthenticated, router])

  // Enquanto carrega, você pode mostrar um fallback ou null
  if (isLoading || !user) {
    return null
  }

  return (
    <SidebarProvider user={user}>
      <div className="flex h-screen">
        {/* Sidebar */}
        <Sidebar />

        {/* Conteúdo principal */}
        <main className="flex-1 overflow-auto bg-gray-50 p-4 dark:bg-gray-900">
          {children}
        </main>
      </div>
    </SidebarProvider>
  )
}
