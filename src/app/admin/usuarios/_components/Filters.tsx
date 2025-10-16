'use client'

import { ChevronDown, Filter, Search } from 'lucide-react'
import { useState } from 'react'

import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Input } from '@/components/ui/input'
import { Contrato, Grupo } from '@/types'

interface FiltersProps {
  searchTerm: string
  selectedGrupo: string
  selectedContratos?: string
  contratos: Contrato[]
  grupos: Grupo[]
  onSearchChange: (v: string) => void
  onGrupoChange: (v: string) => void
  onContratosChange: (v: string) => void
  onClear: () => void
}

export function Filters({
  searchTerm,
  selectedGrupo,
  selectedContratos,
  contratos,
  grupos,
  onSearchChange,
  onGrupoChange,
  onContratosChange,
  onClear,
}: FiltersProps) {
  const [openContratos, setOpenContratos] = useState(false)
  const [openGrupo, setOpenGrupo] = useState(false)

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
        {/* Campo de busca */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 transform text-gray-400" />
          <Input
            placeholder="Buscar usuários..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="border-gray-300 pl-10 focus:border-primary focus:ring-1 focus:ring-primary"
          />
        </div>

        {/* Filtro de ObraContrato */}
        <DropdownMenu open={openContratos} onOpenChange={setOpenContratos}>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              className="w-full justify-between text-sm"
            >
              {selectedContratos
                ? contratos.find((c) => c.id.toString() === selectedContratos)
                    ?.descricao
                : 'Todas as Obras/Contratos'}
              <ChevronDown className="h-4 w-4 opacity-50" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="max-h-64 w-[300px] overflow-y-auto">
            <DropdownMenuLabel>Filtrar por Obra/Contrato</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => onContratosChange('')}>
              Todas as Obras/Contratos
            </DropdownMenuItem>
            {contratos.map((contrato) => (
              <DropdownMenuItem
                key={contrato.id}
                onClick={() => onContratosChange(contrato.id.toString())}
              >
                {contrato.codigo} - {contrato.descricao}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Filtro de Grupo */}
        <DropdownMenu open={openGrupo} onOpenChange={setOpenGrupo}>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              className="w-full justify-between text-sm"
            >
              {selectedGrupo
                ? grupos.find((g) => g.id.toString() === selectedGrupo)?.grupo
                : 'Todos os grupos'}
              <ChevronDown className="h-4 w-4 opacity-50" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="max-h-64 w-[200px] overflow-y-auto">
            <DropdownMenuLabel>Filtrar por grupo</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => onGrupoChange('')}>
              Todos os grupos
            </DropdownMenuItem>
            {grupos.map((grupo) => (
              <DropdownMenuItem
                key={grupo.id}
                onClick={() => onGrupoChange(grupo.id.toString())}
              >
                {grupo.grupo}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Botão de limpar */}
        <Button
          onClick={onClear}
          variant="outline"
          className="flex items-center justify-center space-x-2"
        >
          <Filter className="h-4 w-4" />
          <span>Limpar Filtros</span>
        </Button>
      </div>
    </div>
  )
}
