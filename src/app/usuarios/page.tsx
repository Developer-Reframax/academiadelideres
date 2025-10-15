'use client'

import { Edit, Eye, Filter, Plus, Search, Trash2 } from 'lucide-react'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'

import DashboardLayout from '@/components/DashboardLayout'
import { Grupo, Usuario } from '@/types'

export default function UsuariosPage() {
  const [usuarios, setUsuarios] = useState<Usuario[]>([])
  const [grupos, setGrupos] = useState<Grupo[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedRole, setSelectedRole] = useState<string>('')
  const [selectedGrupo, setSelectedGrupo] = useState<string>('')

  useEffect(() => {
    fetchUsuarios()
    fetchGrupos()
  }, [])

  const fetchUsuarios = async () => {
    try {
      // Obter token do localStorage
      const token = localStorage.getItem('auth-token')

      const response = await fetch('/api/usuarios', {
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      })
      const data = await response.json()

      if (data.success) {
        setUsuarios(data.data)
      } else {
        toast.error('Erro ao carregar usuários')
      }
    } catch {
      toast.error('Erro de conexão')
    } finally {
      setIsLoading(false)
    }
  }

  const fetchGrupos = async () => {
    try {
      // Obter token do localStorage
      const token = localStorage.getItem('auth-token')

      const response = await fetch('/api/grupos', {
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      })
      const data = await response.json()

      if (data.success) {
        setGrupos(data.data)
      }
    } catch (error) {
      console.error('Erro ao carregar grupos:', error)
    }
  }

  const handleDeleteUser = async (matricula: number) => {
    if (!confirm('Tem certeza que deseja desativar este usuário?')) {
      return
    }

    try {
      const response = await fetch(`/api/usuarios/${matricula}`, {
        method: 'DELETE',
      })

      const data = await response.json()

      if (data.success) {
        toast.success('Usuário desativado com sucesso!')
        fetchUsuarios()
      } else {
        toast.error(data.message || 'Erro ao desativar usuário')
      }
    } catch {
      toast.error('Erro de conexão')
    }
  }

  const filteredUsuarios = usuarios.filter((usuario) => {
    const matchesSearch =
      usuario.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      usuario.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      usuario.telefone.includes(searchTerm)

    const matchesRole = !selectedRole || usuario.role === selectedRole
    const matchesGrupo =
      !selectedGrupo || usuario.grupo_id?.toString() === selectedGrupo

    return matchesSearch && matchesRole && matchesGrupo
  })

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="animate-pulse space-y-6">
          <div className="h-8 w-1/4 rounded bg-gray-200 dark:bg-gray-700"></div>
          <div className="h-64 rounded bg-gray-200 dark:bg-gray-700"></div>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Usuários
            </h1>
            <p className="mt-1 text-gray-600 dark:text-gray-400">
              Gerencie os usuários do sistema
            </p>
          </div>
          <button className="flex items-center space-x-2 rounded-lg bg-primary-600 px-4 py-2 text-white transition-colors hover:bg-primary-700">
            <Plus className="h-4 w-4" />
            <span>Novo Usuário</span>
          </button>
        </div>

        {/* Filters */}
        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 transform text-gray-400" />
              <input
                type="text"
                placeholder="Buscar usuários..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full rounded-lg border border-gray-300 py-2 pl-10 pr-4 focus:border-primary-500 focus:ring-2 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
              />
            </div>

            {/* Role Filter */}
            <select
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value)}
              className="rounded-lg border border-gray-300 px-4 py-2 focus:border-primary-500 focus:ring-2 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
            >
              <option value="">Todos os perfis</option>
              <option value="admin">Administrador</option>
              <option value="user">Usuário</option>
            </select>

            {/* Group Filter */}
            <select
              value={selectedGrupo}
              onChange={(e) => setSelectedGrupo(e.target.value)}
              className="rounded-lg border border-gray-300 px-4 py-2 focus:border-primary-500 focus:ring-2 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
            >
              <option value="">Todos os grupos</option>
              {grupos.map((grupo) => (
                <option key={grupo.id} value={grupo.id.toString()}>
                  {grupo.grupo}
                </option>
              ))}
            </select>

            {/* Clear Filters */}
            <button
              onClick={() => {
                setSearchTerm('')
                setSelectedRole('')
                setSelectedGrupo('')
              }}
              className="flex items-center space-x-2 rounded-lg border border-gray-300 px-4 py-2 transition-colors hover:bg-gray-50 dark:border-gray-600 dark:hover:bg-gray-700"
            >
              <Filter className="h-4 w-4" />
              <span>Limpar Filtros</span>
            </button>
          </div>
        </div>

        {/* Users Table */}
        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-300">
                    Usuário
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-300">
                    Matrícula
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-300">
                    Telefone
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-300">
                    Grupo
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-300">
                    Perfil
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-300">
                    Status
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-300">
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white dark:divide-gray-700 dark:bg-gray-800">
                {filteredUsuarios.map((usuario) => (
                  <tr
                    key={usuario.matricula}
                    className="hover:bg-gray-50 dark:hover:bg-gray-700"
                  >
                    <td className="whitespace-nowrap px-6 py-4">
                      <div>
                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                          {usuario.nome}
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          {usuario.email}
                        </div>
                      </div>
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-900 dark:text-white">
                      {usuario.matricula}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-900 dark:text-white">
                      {usuario.telefone}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-900 dark:text-white">
                      {usuario.grupos?.grupo || 'Sem grupo'}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4">
                      <span
                        className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${
                          usuario.role === 'admin'
                            ? 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200'
                            : 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                        }`}
                      >
                        {usuario.role === 'admin' ? 'Administrador' : 'Usuário'}
                      </span>
                    </td>
                    <td className="whitespace-nowrap px-6 py-4">
                      <span
                        className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${
                          usuario.status === 'ativo'
                            ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                            : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                        }`}
                      >
                        {usuario.status === 'ativo' ? 'Ativo' : 'Inativo'}
                      </span>
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-right text-sm font-medium">
                      <div className="flex items-center justify-end space-x-2">
                        <button className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300">
                          <Eye className="h-4 w-4" />
                        </button>
                        <button className="text-yellow-600 hover:text-yellow-900 dark:text-yellow-400 dark:hover:text-yellow-300">
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteUser(usuario.matricula)}
                          className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredUsuarios.length === 0 && (
            <div className="py-12 text-center">
              <p className="text-gray-500 dark:text-gray-400">
                Nenhum usuário encontrado
              </p>
            </div>
          )}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
            <div className="text-2xl font-bold text-gray-900 dark:text-white">
              {usuarios.length}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Total de usuários
            </div>
          </div>
          <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
            <div className="text-2xl font-bold text-green-600">
              {usuarios.filter((u) => u.status === 'ativo').length}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Usuários ativos
            </div>
          </div>
          <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
            <div className="text-2xl font-bold text-purple-600">
              {usuarios.filter((u) => u.role === 'admin').length}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Administradores
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
