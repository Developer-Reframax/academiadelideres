'use client'

import { usePathname } from 'next/navigation'
import { ReactNode } from 'react'

import { DefaultLayout } from '@/components/layouts/DefaultLayout'

interface LayoutWrapperProps {
  children: ReactNode
}

export function LayoutWrapper({ children }: LayoutWrapperProps) {
  const pathname = usePathname()

  const noSidebarPages = ['/login', '/register']
  const shouldUseSidebar = !noSidebarPages.includes(pathname)

  return shouldUseSidebar ? (
    <DefaultLayout>{children}</DefaultLayout>
  ) : (
    <>{children}</>
  )
}
