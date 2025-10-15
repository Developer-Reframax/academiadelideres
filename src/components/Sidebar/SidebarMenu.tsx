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

import { useSidebar } from '../../contexts/SidebarContext'
import { SidebarGroup } from './SidebarGroup'
import { SidebarItem } from './SidebarItem'

export function SidebarMenu() {
  const { user } = useSidebar()
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
        if (item.adminOnly && user.role !== 'admin') return null

        if (item.children) {
          return <SidebarGroup key={index} item={item} />
        }

        return (
          <SidebarItem
            key={index}
            href={item.href!}
            icon={item.icon}
            label={item.label}
            active={pathname === item.href}
          />
        )
      })}
    </nav>
  )
}
