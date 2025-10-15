'use client'

import { Group, LayoutDashboard, ReceiptIcon, Users } from 'lucide-react'
import { usePathname } from 'next/navigation'

import { SidebarItem } from './SidebarItem'

export function SidebarAdmin() {
  const pathname = usePathname()

  const adminMenu = [
    { href: '/admin/dashboard', icon: LayoutDashboard, label: 'Painel Admin' },
    { href: '/admin/usuarios', icon: Users, label: 'Gerenciar Usuários' },
    { href: '/admin/grupos', icon: Group, label: 'Gerenciar Grupos' },
    {
      href: '/admin/contratos',
      icon: ReceiptIcon,
      label: 'Gerenciar Contratos',
    },
  ]

  return (
    <nav className="flex-1 space-y-2 p-3">
      {adminMenu.map((item, index) => (
        <SidebarItem
          key={index}
          href={item.href}
          icon={item.icon}
          label={item.label}
          active={pathname === item.href}
        />
      ))}
    </nav>
  )
}
