'use client'

import {
  FileText,
  LayoutDashboard,
  LogOut,
  Menu,
  Moon,
  Settings,
  Sun,
  User,
  UserCheck,
  Users,
  X,
} from 'lucide-react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useTheme } from 'next-themes'
import { useState } from 'react'
import { toast } from 'sonner'

interface SidebarProps {
  user: {
    nome: string
    role: string
  }
}

export default function Sidebar({ user }: SidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false)
  const pathname = usePathname()
  const router = useRouter()
  const { theme, setTheme } = useTheme()

  const menuItems = [
    {
      href: '/dashboard',
      icon: LayoutDashboard,
      label: 'Dashboard',
      adminOnly: false,
    },
    {
      href: '/usuarios',
      icon: Users,
      label: 'Usuários',
      adminOnly: true,
    },
    {
      href: '/grupos',
      icon: UserCheck,
      label: 'Grupos',
      adminOnly: true,
    },
    {
      href: '/contratos',
      icon: FileText,
      label: 'Contratos',
      adminOnly: true,
    },
    {
      href: '/perfil',
      icon: User,
      label: 'Perfil',
      adminOnly: false,
    },
    {
      href: '/configuracoes',
      icon: Settings,
      label: 'Configurações',
      adminOnly: false,
    },
  ]

  const handleLogout = async () => {
    try {
      // Obter token do localStorage
      const token = localStorage.getItem('auth-token')

      const response = await fetch('/api/auth/logout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      })

      if (response.ok) {
        toast.success('Logout realizado com sucesso!')
        router.push('/login')
      } else {
        toast.error('Erro ao fazer logout')
      }
    } catch {
      toast.error('Erro de conexão')
    }
  }

  const filteredMenuItems = menuItems.filter(
    (item) => !item.adminOnly || user.role === 'admin',
  )

  return (
    <div
      className={`border-r border-gray-200 bg-white transition-all duration-300 dark:border-gray-700 dark:bg-gray-800 ${
        isCollapsed ? 'w-16' : 'w-64'
      }`}
    >
      <div className="flex h-full flex-col">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-200 p-4 dark:border-gray-700">
          {!isCollapsed && (
            <h1 className="text-lg font-bold text-gray-900 dark:text-white">
              Academia de Líderes
            </h1>
          )}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="rounded-lg p-2 transition-colors hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            {isCollapsed ? (
              <Menu className="h-5 w-5 text-gray-600 dark:text-gray-300" />
            ) : (
              <X className="h-5 w-5 text-gray-600 dark:text-gray-300" />
            )}
          </button>
        </div>

        {/* User Info */}
        {!isCollapsed && (
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
        )}

        {/* Navigation */}
        <nav className="flex-1 space-y-2 p-4">
          {filteredMenuItems.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center space-x-3 rounded-lg px-3 py-2 transition-colors ${
                  isActive
                    ? 'bg-primary-100 text-primary-700 dark:bg-primary-900 dark:text-primary-300'
                    : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700'
                }`}
                title={isCollapsed ? item.label : undefined}
              >
                <Icon className="h-5 w-5 flex-shrink-0" />
                {!isCollapsed && (
                  <span className="text-sm font-medium">{item.label}</span>
                )}
              </Link>
            )
          })}
        </nav>

        {/* Footer Actions */}
        <div className="space-y-2 border-t border-gray-200 p-4 dark:border-gray-700">
          {/* Theme Toggle */}
          <button
            onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
            className="flex w-full items-center space-x-3 rounded-lg px-3 py-2 text-gray-700 transition-colors hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
            title={
              isCollapsed
                ? theme === 'light'
                  ? 'Modo Escuro'
                  : 'Modo Claro'
                : undefined
            }
          >
            {theme === 'light' ? (
              <Moon className="h-5 w-5 flex-shrink-0" />
            ) : (
              <Sun className="h-5 w-5 flex-shrink-0" />
            )}
            {!isCollapsed && (
              <span className="text-sm font-medium">
                {theme === 'light' ? 'Modo Escuro' : 'Modo Claro'}
              </span>
            )}
          </button>

          {/* Logout */}
          <button
            onClick={handleLogout}
            className="flex w-full items-center space-x-3 rounded-lg px-3 py-2 text-red-600 transition-colors hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20"
            title={isCollapsed ? 'Sair' : undefined}
          >
            <LogOut className="h-5 w-5 flex-shrink-0" />
            {!isCollapsed && <span className="text-sm font-medium">Sair</span>}
          </button>
        </div>
      </div>
    </div>
  )
}
