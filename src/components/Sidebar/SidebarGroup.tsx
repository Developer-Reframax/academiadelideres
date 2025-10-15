'use client'

import { ChevronDown, ChevronRight, LucideIcon } from 'lucide-react'
import { useState } from 'react'

import { useSidebar } from '../../contexts/SidebarContext'
import { SidebarItem } from './SidebarItem'

interface SidebarGroupItem {
  label: string
  icon: LucideIcon
  children: { href: string; label: string; icon: LucideIcon }[]
}

export function SidebarGroup({ item }: { item: SidebarGroupItem }) {
  const [open, setOpen] = useState(false)
  const { isCollapsed } = useSidebar()

  return (
    <div>
      <button
        onClick={() => setOpen(!open)}
        className="flex w-full items-center space-x-3 rounded-lg px-3 py-2 text-gray-700 transition-colors hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
        title={isCollapsed ? item.label : undefined}
      >
        <item.icon className="h-5 w-5 flex-shrink-0" />
        {!isCollapsed && (
          <>
            <span className="flex-1 text-left text-sm font-medium">
              {item.label}
            </span>
            {open ? (
              <ChevronDown className="h-4 w-4" />
            ) : (
              <ChevronRight className="h-4 w-4" />
            )}
          </>
        )}
      </button>

      {!isCollapsed && open && (
        <div className="ml-6 mt-1 space-y-1 border-l border-gray-300 pl-2 dark:border-gray-600">
          {item.children.map((child, index) => (
            <SidebarItem
              key={index}
              href={child.href}
              label={child.label}
              icon={child.icon}
            />
          ))}
        </div>
      )}
    </div>
  )
}
