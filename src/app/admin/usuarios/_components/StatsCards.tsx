'use client'

import { Usuario } from '@/types'

interface StatsCardsProps {
  usuarios: Usuario[]
}

export function StatsCards({ usuarios }: StatsCardsProps) {
  const total = usuarios.length
  const ativos = usuarios.filter((u) => u.status === 'ativo').length

  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
        <div className="text-2xl font-bold text-gray-900 dark:text-white">
          {total}
        </div>
        <div className="text-sm text-gray-600 dark:text-gray-400">
          Total de usuários
        </div>
      </div>
      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
        <div className="text-2xl font-bold text-green-600">{ativos}</div>
        <div className="text-sm text-gray-600 dark:text-gray-400">
          Usuários ativos
        </div>
      </div>
    </div>
  )
}
