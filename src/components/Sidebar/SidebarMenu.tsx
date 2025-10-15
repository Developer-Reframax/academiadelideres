'use client'

import {
  FileText,
  LayoutDashboard,
  Settings,
  User,
  UserCheck,
  Users,
} from 'lucide-react'
import { usePathname } from 'next/navigation'

import { SidebarGroup } from './SidebarGroup'
import { SidebarItem } from './SidebarItem'

interface SidebarMenuProps {
  userRole: string
  isCollapsed: boolean
}

export function SidebarMenu({ userRole, isCollapsed }: SidebarMenuProps) {
  const pathname = usePathname()

  const menu = [
    { href: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    {
      label: 'Administração',
      icon: Users,
      adminOnly: true,
      children: [
        { href: '/usuarios', label: 'Usuários', icon: Users },
        { href: '/grupos', label: 'Grupos', icon: UserCheck },
        { href: '/contratos', label: 'Contratos', icon: FileText },
      ],
    },
    { href: '/perfil', icon: User, label: 'Perfil' },
    { href: '/configuracoes', icon: Settings, label: 'Configurações' },
  ]

  return (
    <nav className="flex-1 space-y-2 p-3">
      {menu.map((item, index) => {
        if (item.adminOnly && userRole !== 'admin') return null

        if (item.children) {
          return (
            <SidebarGroup key={index} item={item} isCollapsed={isCollapsed} />
          )
        }

        return (
          <SidebarItem
            key={index}
            href={item.href!}
            icon={item.icon}
            label={item.label}
            active={pathname === item.href}
            isCollapsed={isCollapsed}
          />
        )
      })}
    </nav>
  )
}
