'use client'

import { LogOut, Moon, Shield, Sun, User } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useTheme } from 'next-themes'
import { toast } from 'sonner'

import { useSidebar } from '../../contexts/SidebarContext'
import { Button } from '../ui/button'

export function SidebarFooter() {
  const { theme, setTheme } = useTheme()
  const { isCollapsed, isAdminMode, toggleAdminMode, user } = useSidebar()
  const router = useRouter()

  const handleLogout = async () => {
    const token = localStorage.getItem('auth-token')
    const response = await fetch('/api/auth/logout', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
      },
    })
    if (response.ok) {
      toast.success('Logout realizado com sucesso!')
      router.push('/login')
    } else {
      toast.error('Erro ao fazer logout')
    }
  }

  return (
    <div className="space-y-2 border-t border-gray-200 p-3 dark:border-gray-700">
      {/* Botão de Modo Admin apenas para administradores */}
      {user.role === 'admin' && !isCollapsed && (
        <Button
          onClick={toggleAdminMode}
          className="flex w-full items-center justify-center gap-2 rounded-md bg-primary-600 px-3 py-2 text-sm font-medium text-white hover:bg-primary-700"
        >
          {isAdminMode ? (
            <>
              <User className="h-4 w-4" />
              Modo Usuário
            </>
          ) : (
            <>
              <Shield className="h-4 w-4" />
              Modo Admin
            </>
          )}
        </Button>
      )}

      <Button
        onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
        variant={'ghost'}
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
          <Moon className="h-5 w-5" />
        ) : (
          <Sun className="h-5 w-5" />
        )}
        {!isCollapsed && (
          <span className="text-sm font-medium">
            {theme === 'light' ? 'Modo Escuro' : 'Modo Claro'}
          </span>
        )}
      </Button>

      <Button
        variant={'destructive'}
        onClick={handleLogout}
        className="flex w-full items-center space-x-3 rounded-lg px-3 py-2 text-red-200 transition-colors hover:bg-red-800"
        title={isCollapsed ? 'Sair' : undefined}
      >
        <LogOut className="h-5 w-5 flex-shrink-0" />
        {!isCollapsed && <span className="text-sm font-medium">Sair</span>}
      </Button>
    </div>
  )
}
