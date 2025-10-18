'use client'

import { ThemeProvider } from 'next-themes'
import { useEffect, useState } from 'react'

interface Props {
  children: React.ReactNode
}

export function ThemeProviderWrapper({ children }: Props) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true)
  }, [])

  if (!mounted) return null

  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="light"
      enableSystem
      storageKey="theme"
    >
      {children}
    </ThemeProvider>
  )
}
