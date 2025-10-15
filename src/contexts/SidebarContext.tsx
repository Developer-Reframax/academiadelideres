'use client'

import { createContext, ReactNode, useContext, useState } from 'react'

interface SidebarUser {
  nome: string
  role: string
}

interface SidebarContextType {
  isCollapsed: boolean
  toggleSidebar: () => void
  user: SidebarUser
}

const SidebarContext = createContext<SidebarContextType | undefined>(undefined)

export function SidebarProvider({
  children,
  user,
}: {
  children: ReactNode
  user: SidebarUser
}) {
  const [isCollapsed, setIsCollapsed] = useState(false)

  const toggleSidebar = () => setIsCollapsed((prev) => !prev)

  return (
    <SidebarContext.Provider value={{ isCollapsed, toggleSidebar, user }}>
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
