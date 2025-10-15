'use client'

import { User } from 'lucide-react'

interface SidebarUserProps {
  user: {
    nome: string
    role: string
  }
  isCollapsed: boolean
}

export function SidebarUser({ user, isCollapsed }: SidebarUserProps) {
  if (isCollapsed) return null

  return (
    <div className="border-b border-gray-200 p-4 dark:border-gray-700">
      <div className="flex items-center space-x-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-600">
          <User className="h-5 w-5 text-white" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-medium text-gray-900 dark:text-white">
            {user.nome}
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            {user.role === 'admin' ? 'Administrador' : 'Usuário'}
          </p>
        </div>
      </div>
    </div>
  )
}
