'use client'

import { Plus } from 'lucide-react'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'

import { DefaultHeader } from '@/components/DefaultHeader/DefaultHeader'
import { Button } from '@/components/ui/button'
import { Contrato, Grupo, Usuario } from '@/types'

import { Filters } from './_components/Filters'
import { StatsCards } from './_components/StatsCards'
import { UsuariosTable } from './_components/UsuariosTable'

export default function UsuariosPage() {
  const [usuarios, setUsuarios] = useState<Usuario[]>([])
  const [grupos, setGrupos] = useState<Grupo[]>([])
  const [contratos, setContratos] = useState<Contrato[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedContrato, setSelectedContrato] = useState<string>('')
  const [selectedGrupo, setSelectedGrupo] = useState<string>('')

  useEffect(() => {
    fetchUsuarios()
    fetchGrupos()
    fetchContratos()
  }, [])

  const fetchUsuarios = async () => {
    try {
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
      const token = localStorage.getItem('auth-token')
      const response = await fetch('/api/grupos', {
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      })
      const data = await response.json()
      if (data.success) setGrupos(data.data)
    } catch (error) {
      console.error('Erro ao carregar grupos:', error)
    }
  }

  const fetchContratos = async () => {
    try {
      const token = localStorage.getItem('auth-token')
      const response = await fetch('/api/contratos', {
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      })
      const data = await response.json()
      if (data.success) setContratos(data.data)
    } catch (error) {
      console.error('Erro ao carregar contratos:', error)
    }
  }

  const handleDeleteUser = async (matricula: number) => {
    if (!confirm('Tem certeza que deseja desativar este usuário?')) return
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

  const handleActivateUser = async (matricula: number) => {
    if (!confirm('Tem certeza que deseja ativar este usuário?')) return

    try {
      const token = localStorage.getItem('auth-token')

      const response = await fetch(`/api/usuarios/${matricula}`, {
        method: 'PUT', // podemos usar PUT, enviando só o status
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ status: 'ativo' }),
      })

      const data = await response.json()

      if (data.success) {
        toast.success('Usuário ativado com sucesso!')
        fetchUsuarios() // atualiza a lista
      } else {
        toast.error(data.message || 'Erro ao ativar usuário')
      }
    } catch (error) {
      console.error('Erro ao ativar usuário:', error)
      toast.error('Erro de conexão')
    }
  }

  const filteredUsuarios = usuarios.filter((usuario) => {
    const matchesSearch =
      usuario.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      usuario.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      usuario.telefone.includes(searchTerm)

    const matchesContrato =
      !selectedContrato || usuario.contrato_id?.toString() === selectedContrato
    const matchesGrupo =
      !selectedGrupo || usuario.grupo_id?.toString() === selectedGrupo

    return matchesSearch && matchesContrato && matchesGrupo
  })

  if (isLoading) {
    return (
      <div className="animate-pulse space-y-6">
        <div className="h-8 w-1/4 rounded bg-gray-200 dark:bg-gray-700"></div>
        <div className="h-64 rounded bg-gray-200 dark:bg-gray-700"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <DefaultHeader
        title="Usuários"
        subtitle="Gerencie os usuários do sistema"
        action={
          <Button
            onClick={() => console.log('Adicionar User')}
            variant={'outline'}
            className="rounded-lg bg-primary-500 text-white transition-colors hover:bg-primary-700"
          >
            <Plus size={16} /> Adicionar Usuário
          </Button>
        }
      />
      <Filters
        searchTerm={searchTerm}
        selectedGrupo={selectedGrupo}
        selectedContratos={selectedContrato}
        contratos={contratos}
        grupos={grupos}
        onSearchChange={setSearchTerm}
        onGrupoChange={setSelectedGrupo}
        onContratosChange={setSelectedContrato}
        onClear={() => {
          setSearchTerm('')
          setSelectedGrupo('')
          setSelectedContrato('')
        }}
      />

      <UsuariosTable
        usuarios={filteredUsuarios}
        onDelete={handleDeleteUser}
        onActivate={handleActivateUser}
      />
      <StatsCards usuarios={filteredUsuarios} />
    </div>
  )
}
