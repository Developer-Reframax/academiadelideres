'use client'

import { ListCollapse, Menu } from 'lucide-react'
import Image from 'next/image'
import { useTheme } from 'next-themes'

import logoDark from '@/assets/logoAcadLiderDarkMode.svg'
import logoLight from '@/assets/logoAcadLideres.svg'

interface SidebarHeaderProps {
  isCollapsed: boolean
  onToggle: () => void
}

export function SidebarHeader({ isCollapsed, onToggle }: SidebarHeaderProps) {
  const { theme } = useTheme() // 'light' | 'dark' | 'system'

  const currentLogo = theme === 'dark' ? logoDark : logoLight
  return (
    <div className="relative flex items-center justify-center border-b border-gray-200 p-4 dark:border-gray-700">
      {!isCollapsed && (
        <Image src={currentLogo} alt="Logo" width={120} height={40} />
      )}

      <button
        onClick={onToggle}
        className="absolute right-4 rounded-lg p-2 transition-colors hover:bg-gray-100 dark:hover:bg-gray-700"
      >
        {isCollapsed ? (
          <Menu className="h-5 w-5 text-gray-600 dark:text-gray-300" />
        ) : (
          <ListCollapse className="h-5 w-5 text-gray-600 dark:text-gray-300" />
        )}
      </button>
    </div>
  )
}
