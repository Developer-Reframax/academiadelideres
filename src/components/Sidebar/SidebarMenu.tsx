'use client'

import {
  BadgeAlert,
  ClipboardCheckIcon,
  LayoutDashboard,
  Network,
} from 'lucide-react'
import { usePathname } from 'next/navigation'

import { SidebarItem } from './SidebarItem'

export function SidebarMenu() {
  const pathname = usePathname()

  const menu = [
    { href: '/user/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    {
      href: '/user/desafios',
      label: 'Meus Desafios',
      icon: ClipboardCheckIcon,
    },
    {
      href: '/user/riscos-criticos',
      label: 'Riscos Críticos',
      icon: BadgeAlert,
    },
    {
      href: '/user/abrangencia-acidentes',
      label: 'Abrangência de Acidentes',
      icon: Network,
    },
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
