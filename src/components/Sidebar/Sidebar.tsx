'use client'

import { useSidebar } from '../../contexts/SidebarContext'
import { SidebarFooter } from './SidebarFooter'
import { SidebarHeader } from './SidebarHeader'
import { SidebarMenu } from './SidebarMenu'
import { SidebarUser } from './SidebarUser'

export function Sidebar() {
  const { isCollapsed } = useSidebar()

  return (
    <aside
      className={`border-r border-gray-200 bg-white transition-all duration-300 dark:border-gray-700 dark:bg-gray-800 ${
        isCollapsed ? 'w-16 pt-2' : 'w-64'
      } flex h-screen flex-col`}
    >
      <SidebarHeader />
      <SidebarMenu />
      <SidebarUser />
      <SidebarFooter />
    </aside>
  )
}
