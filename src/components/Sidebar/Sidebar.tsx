'use client'

import { ShieldCheck } from 'lucide-react'

import { useSidebar } from '../../contexts/SidebarContext'
import { SidebarAdmin } from './SidebarAdmin'
import { SidebarFooter } from './SidebarFooter'
import { SidebarHeader } from './SidebarHeader'
import { SidebarMenu } from './SidebarMenu'
import { SidebarUser } from './SidebarUser'

export function Sidebar() {
  const { isCollapsed, isAdminMode } = useSidebar()

  return (
    <aside
      className={`border-r border-gray-200 bg-white transition-all duration-300 dark:border-gray-700 dark:bg-gray-800 ${
        isCollapsed ? 'w-16 pt-2' : 'w-64'
      } flex h-screen flex-col`}
    >
      <SidebarHeader />
      {isAdminMode && (
        <div
          className={`flex items-center justify-center text-sm font-medium text-white transition-all duration-200 ${isCollapsed ? 'mx-auto my-2 h-12 w-12 rounded-full bg-red-600' : 'mb-4 h-8 w-full rounded bg-red-600'} `}
        >
          {!isCollapsed ? (
            'Modo Admin'
          ) : (
            <ShieldCheck className="h-6 w-6 text-white" />
          )}
        </div>
      )}
      {isAdminMode ? <SidebarAdmin /> : <SidebarMenu />}
      <SidebarUser />
      <SidebarFooter />
    </aside>
  )
}
