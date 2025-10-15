'use client'

import { LogOut, Moon, Sun } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useTheme } from 'next-themes'
import { toast } from 'sonner'

export function SidebarFooter({ isCollapsed }: { isCollapsed: boolean }) {
  const { theme, setTheme } = useTheme()
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
          <Moon className="h-5 w-5" />
        ) : (
          <Sun className="h-5 w-5" />
        )}
        {!isCollapsed && (
          <span className="text-sm font-medium">
            {theme === 'light' ? 'Modo Escuro' : 'Modo Claro'}
          </span>
        )}
      </button>

      <button
        onClick={handleLogout}
        className="flex w-full items-center space-x-3 rounded-lg px-3 py-2 text-red-600 transition-colors hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20"
        title={isCollapsed ? 'Sair' : undefined}
      >
        <LogOut className="h-5 w-5 flex-shrink-0" />
        {!isCollapsed && <span className="text-sm font-medium">Sair</span>}
      </button>
    </div>
  )
}
