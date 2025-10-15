'use client'

import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from 'react'

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
  // Carrega o estado inicial do localStorage (modo admin persistente)
  const [isAdminMode, setIsAdminMode] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('isAdminMode') === 'true'
    }
    return false
  })

  const [isCollapsed, setIsCollapsed] = useState(false)

  const toggleSidebar = () => setIsCollapsed((prev) => !prev)

  const toggleAdminMode = () => {
    setIsAdminMode((prev) => {
      const next = !prev
      if (typeof window !== 'undefined') {
        localStorage.setItem('isAdminMode', next.toString())
      }
      return next
    })
  }

  // Atualiza localStorage caso o usuário entre de novo e localStorage tenha valor
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('isAdminMode')
      if (saved !== null) {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setIsAdminMode(saved === 'true')
      }
    }
  }, [])

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
