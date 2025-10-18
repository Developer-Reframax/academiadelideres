import './globals.css'

import type { Metadata } from 'next'
import { Montserrat } from 'next/font/google'

import { ThemeProviderWrapper } from '@/components/ThemeProviderWrapper'
import { AuthProvider } from '@/contexts/AuthContext'

const montserrat = Montserrat({
  subsets: ['latin'],
  variable: '--font-montserrat',
})

export const metadata: Metadata = {
  title: 'Academia de Líderes',
  description: 'Sistema de gerenciamento da Academia de Líderes',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR" className={montserrat.variable}>
      <body
        className={`${montserrat.className} --webkit-font-smoothing antialiased`}
      >
        <AuthProvider>
          <ThemeProviderWrapper>{children}</ThemeProviderWrapper>
        </AuthProvider>
      </body>
    </html>
  )
}
