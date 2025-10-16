'use client'

import { Group, ReceiptText, Users } from 'lucide-react'
import { usePathname } from 'next/navigation'

import { SidebarItem } from './SidebarItem'

export function SidebarAdmin() {
  const pathname = usePathname()

  const adminMenu = [
    { href: '/admin/usuarios', icon: Users, label: 'Gerenciar Usuários' },
    { href: '/admin/grupos', icon: Group, label: 'Gerenciar Grupos' },
    {
      href: '/admin/contratos',
      icon: ReceiptText,
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
