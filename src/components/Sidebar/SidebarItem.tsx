'use client'

import { LucideIcon } from 'lucide-react'
import Link from 'next/link'

import { useSidebar } from '../../contexts/SidebarContext'

interface SidebarItemProps {
  href: string
  label: string
  icon: LucideIcon
  active?: boolean
}

export function SidebarItem({
  href,
  label,
  icon: Icon,
  active,
}: SidebarItemProps) {
  const { isCollapsed } = useSidebar()

  return (
    <Link
      href={href}
      className={`flex items-center space-x-3 rounded-lg px-3 py-2 transition-colors ${
        active
          ? 'bg-primary-100 text-primary-700 dark:bg-primary-900 dark:text-primary-300'
          : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700'
      } `}
      title={isCollapsed ? label : undefined}
    >
      <Icon className="h-5 w-5 flex-shrink-0" />
      {!isCollapsed && <span className="text-sm font-medium">{label}</span>}
    </Link>
  )
}
