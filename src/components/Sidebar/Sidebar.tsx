'use client'

import { useState } from 'react'

import { SidebarFooter } from './SidebarFooter'
import { SidebarHeader } from './SidebarHeader'
import { SidebarMenu } from './SidebarMenu'
import { SidebarUser } from './SidebarUser'

interface SidebarProps {
  user: {
    nome: string
    role: string
  }
}

export function Sidebar({ user }: SidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false)

  return (
    <aside
      className={`border-r border-gray-200 bg-white transition-all duration-300 dark:border-gray-700 dark:bg-gray-800 ${
        isCollapsed ? 'w-16 pt-2' : 'w-64'
      } flex h-screen flex-col`}
    >
      <SidebarHeader
        isCollapsed={isCollapsed}
        onToggle={() => setIsCollapsed(!isCollapsed)}
      />
      <SidebarMenu userRole={user.role} isCollapsed={isCollapsed} />
      <SidebarUser user={user} isCollapsed={isCollapsed} />
      <SidebarFooter isCollapsed={isCollapsed} />
    </aside>
  )
}
