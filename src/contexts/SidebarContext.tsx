'use client'

import { createContext, ReactNode, useContext, useState } from 'react'

export interface SidebarUser {
  nome: string
  role: string
}

interface SidebarContextType {
  isCollapsed: boolean
  toggleSidebar: () => void
  user: SidebarUser
  isAdminMode: boolean
  toggleAdminMode: () => void
}

const SidebarContext = createContext<SidebarContextType | undefined>(undefined)

interface SidebarProviderProps {
  children: ReactNode
  user: SidebarUser
}

export function SidebarProvider({ children, user }: SidebarProviderProps) {
  const [isCollapsed, setIsCollapsed] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(`isCollapsed_${user.nome}`)
      return saved === 'true'
    }
    return false
  })

  const [isAdminMode, setIsAdminMode] = useState(() => {
    if (typeof window !== 'undefined') {
      // Garante que apenas usuários admin possam iniciar em modo admin
      const saved = localStorage.getItem(`isAdminMode_${user.nome}`)
      return saved === 'true' && user.role === 'admin'
    }
    return false
  })

  const toggleSidebar = () => {
    setIsCollapsed((prev) => {
      const next = !prev
      if (typeof window !== 'undefined') {
        localStorage.setItem(`isCollapsed_${user.nome}`, next.toString())
      }
      return next
    })
  }

  const toggleAdminMode = () => {
    if (user.role !== 'admin') return // impede usuários normais de alternar

    setIsAdminMode((prev) => {
      const next = !prev
      if (typeof window !== 'undefined') {
        localStorage.setItem(`isAdminMode_${user.nome}`, next.toString())
      }
      return next
    })
  }

  return (
    <SidebarContext.Provider
      value={{ isCollapsed, toggleSidebar, user, isAdminMode, toggleAdminMode }}
    >
      {children}
    </SidebarContext.Provider>
  )
}

export function useSidebar() {
  const context = useContext(SidebarContext)
  if (!context) {
    throw new Error('useSidebar deve ser usado dentro de SidebarProvider')
  }
  return context
}
