'use client'

import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

import { Sidebar } from '@/components/Sidebar/Sidebar'
import { useAuth } from '@/contexts/AuthContext'
import { SidebarProvider } from '@/contexts/SidebarContext'

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { user, isLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading && user?.role !== 'admin') {
      router.push('/user/dashboard') // redireciona usuário não-admin
    }
  }, [user, isLoading, router])

  if (isLoading || user?.role !== 'admin') return null

  return (
    <SidebarProvider user={user}>
      <div className="flex h-screen">
        <Sidebar />
        <main className="flex-1 overflow-auto bg-gray-50 p-4 dark:bg-gray-900">
          {children}
        </main>
      </div>
    </SidebarProvider>
  )
}
