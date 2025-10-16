'use client'

import { ReactNode } from 'react'

interface DefaultHeaderProps {
  title: string
  subtitle?: string
  action?: ReactNode
  className?: string
}

export function DefaultHeader({
  title,
  subtitle,
  action,
  className,
}: DefaultHeaderProps) {
  return (
    <header
      className={`flex flex-col gap-2 border-b border-gray-200 pb-4 dark:border-gray-700 md:flex-row md:items-center md:justify-between ${className ?? ''}`}
    >
      <div>
        <h1 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
          {title}
        </h1>
        {subtitle && (
          <p className="text-sm text-gray-600 dark:text-gray-400">{subtitle}</p>
        )}
      </div>

      {action && (
        <div className="mt-2 flex items-center gap-2 md:mt-0">{action}</div>
      )}
    </header>
  )
}
