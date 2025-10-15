'use client'

import {
  Calendar,
  Clock,
  FileText,
  TrendingUp,
  UserCheck,
  Users,
} from 'lucide-react'
import { useEffect, useState } from 'react'

import { useAuthRedirect } from '@/hooks/useAuthRedirect'
import { DashboardStats } from '@/types'

interface StatsCardProps {
  title: string
  value: string | number
  icon: React.ComponentType<{ className?: string }>
  color: string
  trend?: {
    value: number
    isPositive: boolean
  }
}

function StatsCard({ title, value, icon: Icon, color, trend }: StatsCardProps) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
            {title}
          </p>
          <p className="mt-1 text-2xl font-bold text-gray-900 dark:text-white">
            {value}
          </p>
          {trend && (
            <div
              className={`mt-2 flex items-center text-sm ${trend.isPositive ? 'text-green-600' : 'text-red-600'}`}
            >
              <TrendingUp
                className={`mr-1 h-4 w-4 ${trend.isPositive ? '' : 'rotate-180'}`}
              />
              {trend.value}% vs mês anterior
            </div>
          )}
        </div>
        <div className={`rounded-lg p-3 ${color}`}>
          <Icon className="h-6 w-6 text-white" />
        </div>
      </div>
    </div>
  )
}

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const { isLoading: authLoading } = useAuthRedirect({ requireAuth: true })

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const mockStats: DashboardStats = {
          totalUsuarios: 45,
          totalGrupos: 8,
          totalContratos: 12,
          contratosAtivos: 9,
          usuariosAtivos: 42,
          gruposAtivos: 7,
          gruposDesafiados: 3,
        }
        await new Promise((resolve) => setTimeout(resolve, 1000))
        setStats(mockStats)
      } catch (error) {
        console.error('Erro ao buscar estatísticas:', error)
      } finally {
        setIsLoading(false)
      }
    }

    if (!authLoading) fetchStats()
  }, [authLoading])

  if (authLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-32 w-32 animate-spin rounded-full border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="mb-6 h-8 w-1/4 rounded bg-gray-200 dark:bg-gray-700"></div>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className="h-32 rounded-xl bg-gray-200 dark:bg-gray-700"
              ></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Dashboard
          </h1>
          <p className="mt-1 text-gray-600 dark:text-gray-400">
            Visão geral do sistema Academia de Líderes
          </p>
        </div>
        <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
          <Clock className="h-4 w-4" />
          <span>Atualizado agora</span>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Total de Usuários"
          value={stats?.totalUsuarios || 0}
          icon={Users}
          color="bg-blue-500"
          trend={{ value: 12, isPositive: true }}
        />
        <StatsCard
          title="Usuários Ativos"
          value={stats?.usuariosAtivos || 0}
          icon={UserCheck}
          color="bg-green-500"
          trend={{ value: 8, isPositive: true }}
        />
        <StatsCard
          title="Total de Grupos"
          value={stats?.totalGrupos || 0}
          icon={UserCheck}
          color="bg-purple-500"
          trend={{ value: 5, isPositive: true }}
        />
        <StatsCard
          title="Contratos Ativos"
          value={stats?.contratosAtivos || 0}
          icon={FileText}
          color="bg-orange-500"
          trend={{ value: 3, isPositive: false }}
        />
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
          <h3 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
            Atividades Recentes
          </h3>
          <div className="space-y-4">
            {[
              {
                action: 'Novo usuário cadastrado',
                user: 'João Silva',
                time: '2 horas atrás',
                type: 'user',
              },
              {
                action: 'Contrato atualizado',
                user: 'Sistema',
                time: '4 horas atrás',
                type: 'contract',
              },
              {
                action: 'Grupo criado',
                user: 'Maria Santos',
                time: '1 dia atrás',
                type: 'group',
              },
            ].map((activity, index) => (
              <div
                key={index}
                className="flex items-center space-x-3 rounded-lg bg-gray-50 p-3 dark:bg-gray-700"
              >
                <div
                  className={`h-2 w-2 rounded-full ${
                    activity.type === 'user'
                      ? 'bg-blue-500'
                      : activity.type === 'contract'
                        ? 'bg-orange-500'
                        : 'bg-purple-500'
                  }`}
                ></div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    {activity.action}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    por {activity.user} • {activity.time}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
          <h3 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
            Ações Rápidas
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <button className="group rounded-lg border-2 border-dashed border-gray-300 p-4 transition-colors hover:border-primary-500 dark:border-gray-600 dark:hover:border-primary-400">
              <Users className="mx-auto mb-2 h-8 w-8 text-gray-400 group-hover:text-primary-500" />
              <p className="text-sm font-medium text-gray-600 group-hover:text-primary-500 dark:text-gray-400">
                Novo Usuário
              </p>
            </button>
            <button className="group rounded-lg border-2 border-dashed border-gray-300 p-4 transition-colors hover:border-primary-500 dark:border-gray-600 dark:hover:border-primary-400">
              <UserCheck className="mx-auto mb-2 h-8 w-8 text-gray-400 group-hover:text-primary-500" />
              <p className="text-sm font-medium text-gray-600 group-hover:text-primary-500 dark:text-gray-400">
                Novo Grupo
              </p>
            </button>
            <button className="group rounded-lg border-2 border-dashed border-gray-300 p-4 transition-colors hover:border-primary-500 dark:border-gray-600 dark:hover:border-primary-400">
              <FileText className="mx-auto mb-2 h-8 w-8 text-gray-400 group-hover:text-primary-500" />
              <p className="text-sm font-medium text-gray-600 group-hover:text-primary-500 dark:text-gray-400">
                Novo Contrato
              </p>
            </button>
            <button className="group rounded-lg border-2 border-dashed border-gray-300 p-4 transition-colors hover:border-primary-500 dark:border-gray-600 dark:hover:border-primary-400">
              <Calendar className="mx-auto mb-2 h-8 w-8 text-gray-400 group-hover:text-primary-500" />
              <p className="text-sm font-medium text-gray-600 group-hover:text-primary-500 dark:text-gray-400">
                Relatórios
              </p>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
