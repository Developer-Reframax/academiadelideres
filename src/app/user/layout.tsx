'use client'

import { ReactNode } from 'react'

import { Sidebar } from '@/components/Sidebar/Sidebar'
import { useAuth } from '@/contexts/AuthContext'
import { SidebarProvider } from '@/contexts/SidebarContext'

interface UserLayoutProps {
  children: ReactNode
}

export default function UserLayout({ children }: UserLayoutProps) {
  const { user, isLoading } = useAuth()

  if (isLoading || !user) return null

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
