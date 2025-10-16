'use client'

import { CircleCheck, Edit, Trash2 } from 'lucide-react'
import { useState } from 'react'

import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { Usuario } from '@/types'

interface UsuariosTableProps {
  usuarios: Usuario[]
  onDelete: (matricula: number) => void
  onActivate: (matricula: number) => void
}

export function UsuariosTable({
  usuarios,
  onDelete,
  onActivate,
}: UsuariosTableProps) {
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)

  const totalPages = Math.ceil(usuarios.length / pageSize)

  const paginatedUsuarios = usuarios.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize,
  )

  if (usuarios.length === 0) {
    return (
      <div className="py-12 text-center">
        <p className="text-gray-500 dark:text-gray-400">
          Nenhum usuário encontrado
        </p>
      </div>
    )
  }

  const handlePageSizeChange = (size: number) => {
    setPageSize(size)
    setCurrentPage(1) // volta para a primeira página ao mudar "Itens por"
  }

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-100 dark:bg-gray-900">
              {[
                'Usuário',
                'Matrícula',
                'Telefone',
                'Grupo',
                'Obra/Contrato',
                'Status',
                'Ações',
              ].map((header) => (
                <TableHead
                  key={header}
                  className={`px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-300 ${
                    header === 'Ações' ? 'text-right' : ''
                  }`}
                >
                  {header}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>

          <TableBody>
            {paginatedUsuarios.map((usuario) => (
              <TableRow
                key={usuario.matricula}
                className="hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                <TableCell className="px-6 py-4">
                  <div>
                    <div className="text-sm font-medium text-gray-900 dark:text-white">
                      {usuario.nome}
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      {usuario.email}
                    </div>
                  </div>
                </TableCell>

                <TableCell className="px-6 py-4 text-sm text-gray-900 dark:text-white">
                  {usuario.matricula}
                </TableCell>

                <TableCell className="px-6 py-4 text-sm text-gray-900 dark:text-white">
                  {usuario.telefone
                    ? usuario.telefone.replace(
                        /^(\d{2})(\d{5})(\d{4})$/,
                        '($1) $2-$3',
                      )
                    : ''}
                </TableCell>

                <TableCell className="px-6 py-4 text-sm text-gray-900 dark:text-white">
                  {usuario.grupos?.grupo || 'Sem grupo'}
                </TableCell>

                <TableCell className="px-6 py-4 text-sm text-gray-900 dark:text-white">
                  {usuario.contratos?.descricao || 'Sem contrato'}
                </TableCell>

                <TableCell className="px-6 py-4">
                  <span
                    className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${
                      usuario.status === 'ativo'
                        ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                        : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                    }`}
                  >
                    {usuario.status === 'ativo' ? 'Ativo' : 'Inativo'}
                  </span>
                </TableCell>

                <TableCell className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end space-x-2">
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <button className="text-yellow-600 hover:text-yellow-900 dark:text-yellow-400 dark:hover:text-yellow-300">
                            <Edit className="h-4 w-4" />
                          </button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Editar</p>
                        </TooltipContent>
                      </Tooltip>

                      <Tooltip>
                        <TooltipTrigger asChild>
                          <button
                            onClick={
                              () =>
                                usuario.status === 'ativo'
                                  ? onDelete(usuario.matricula) // desativar
                                  : onActivate(usuario.matricula) // ativar
                            }
                            className={`inline-flex items-center justify-center rounded ${
                              usuario.status === 'ativo'
                                ? 'text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300'
                                : 'text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300'
                            }`}
                          >
                            {usuario.status === 'ativo' ? (
                              <Trash2 className="h-4 w-4" />
                            ) : (
                              <CircleCheck className="h-4 w-4" />
                            )}
                          </button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>
                            {usuario.status === 'ativo'
                              ? 'Desativar'
                              : 'Ativar'}{' '}
                            usuário
                          </p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Paginação */}
      {usuarios.length > 0 && (
        <div className="flex flex-col items-end gap-2 border-t border-gray-200 px-6 py-4 dark:border-gray-700 md:flex-row md:justify-between">
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant="outline"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
            >
              Anterior
            </Button>
            <span className="text-sm text-gray-700 dark:text-gray-300">
              Página {currentPage} de {totalPages}
            </span>
            <Button
              size="sm"
              variant="outline"
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
            >
              Próxima
            </Button>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-700 dark:text-gray-300">
              Itens por página:
            </span>
            <Select
              value={pageSize.toString()}
              onValueChange={(v) => handlePageSizeChange(Number(v))}
            >
              <SelectTrigger className="w-[80px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {[10, 25, 50].map((size) => (
                  <SelectItem key={size} value={size.toString()}>
                    {size}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      )}
    </div>
  )
}
