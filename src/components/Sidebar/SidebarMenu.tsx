'use client'

import {
  BadgeAlert,
  ClipboardCheckIcon,
  LayoutDashboard,
  Network,
  Settings,
  User,
} from 'lucide-react'
import { usePathname } from 'next/navigation'

import { SidebarItem } from './SidebarItem'

export function SidebarMenu() {
  const pathname = usePathname()

  const menu = [
    { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/desafios', label: 'Meus Desafios', icon: ClipboardCheckIcon },
    { href: '/riscos-criticos', label: 'Riscos Críticos', icon: BadgeAlert },
    {
      href: '/analise-abrangencia',
      label: 'Abrangência de Acidentes',
      icon: Network,
    },

    { href: '/perfil', icon: User, label: 'Perfil' },
    { href: '/configuracoes', icon: Settings, label: 'Configurações' },
  ]

  return (
    <nav className="flex-1 space-y-2 p-3">
      {menu.map((item, index) => {
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
