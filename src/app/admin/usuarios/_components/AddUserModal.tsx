'use client'

import { Check, X } from 'lucide-react'
import { useState } from 'react'

import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

interface AddUserModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function AddUserModal({ open, onOpenChange }: AddUserModalProps) {
  const [telefone, setTelefone] = useState('')
  const [selectedModules, setSelectedModules] = useState<string[]>([])
  const [status, setStatus] = useState<'ativo' | 'inativo'>('ativo')

  const handleTelefoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, '')
    if (value.length > 11) value = value.slice(0, 11)
    if (value.length <= 10)
      value = value.replace(/^(\d{2})(\d{4})(\d{0,4}).*/, '($1) $2-$3')
    else value = value.replace(/^(\d{2})(\d{5})(\d{0,4}).*/, '($1) $2-$3')
    setTelefone(value)
  }

  const toggleModule = (modulo: string) => {
    setSelectedModules((prev) =>
      prev.includes(modulo)
        ? prev.filter((m) => m !== modulo)
        : [...prev, modulo],
    )
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log({ telefone, selectedModules, status })
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl rounded-xl border border-gray-200 bg-white shadow-lg dark:border-gray-800 dark:bg-gray-900">
        <DialogHeader className="border-b border-gray-200 pb-4 dark:border-gray-700">
          <DialogTitle className="text-lg font-semibold text-gray-900 dark:text-white">
            Adicionar Usuário
          </DialogTitle>
          <DialogDescription className="text-sm text-gray-500 dark:text-gray-400">
            Preencha as informações abaixo para cadastrar um novo usuário.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="mt-2 space-y-6">
          {/* 1ª linha: nome + email */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="nome">Nome</Label>
              <Input id="nome" placeholder="Digite o nome completo" required />
            </div>

            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="exemplo@dominio.com"
                required
              />
            </div>
          </div>

          {/* 2ª linha: telefone + status */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="telefone">Telefone</Label>
              <Input
                id="telefone"
                type="tel"
                value={telefone}
                onChange={handleTelefoneChange}
                placeholder="(00) 00000-0000"
                required
              />
            </div>

            <div className="flex flex-col space-y-1.5">
              <Label>Status</Label>
              <div className="flex overflow-hidden rounded-lg border border-gray-300 dark:border-gray-600">
                <Button
                  variant={status === 'ativo' ? 'default' : 'outline'}
                  className={`flex-1 justify-center gap-2 rounded-none rounded-l-md border-none ${
                    status === 'ativo'
                      ? 'bg-green-600 text-white hover:bg-green-700'
                      : ''
                  }`}
                  onClick={() => setStatus('ativo')}
                >
                  <Check className="h-4 w-4" /> Ativo
                </Button>
                <Button
                  variant={status === 'inativo' ? 'default' : 'outline'}
                  className={`flex-1 justify-center gap-2 rounded-none rounded-r-md border-none ${
                    status === 'inativo'
                      ? 'bg-red-600 text-white hover:bg-red-700'
                      : ''
                  }`}
                  onClick={() => setStatus('inativo')}
                >
                  <X className="h-4 w-4" /> Inativo
                </Button>
              </div>
            </div>
          </div>

          {/* 3ª linha: nível de acesso + contrato */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="nivel">Nível de Acesso</Label>
              <Select>
                <SelectTrigger id="nivel">
                  <SelectValue placeholder="Selecione o nível" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="admin">Administrador</SelectItem>
                  <SelectItem value="gestor">Gestor</SelectItem>
                  <SelectItem value="usuario">Usuário</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="contrato">Contrato</Label>
              <Select>
                <SelectTrigger id="contrato">
                  <SelectValue placeholder="Selecione o contrato" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="obraA">Obra A</SelectItem>
                  <SelectItem value="obraB">Obra B</SelectItem>
                  <SelectItem value="obraC">Obra C</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* 4ª linha: módulos com checkboxes azuis */}
          <div className="flex flex-col space-y-1.5">
            <Label>Módulos</Label>
            <div className="flex flex-wrap gap-2">
              {['I', 'II', 'III', 'IV', 'V'].map((num) => (
                <label
                  key={num}
                  className={`flex cursor-pointer items-center space-x-2 rounded-md border px-3 py-1.5 text-sm transition-colors hover:bg-blue-50 dark:hover:bg-blue-800 ${
                    selectedModules.includes(num)
                      ? 'bg-blue-600 text-white'
                      : 'border-gray-300 bg-white text-gray-700 dark:border-gray-600 dark:bg-gray-900 dark:text-gray-200'
                  }`}
                >
                  <Checkbox
                    checked={selectedModules.includes(num)}
                    onCheckedChange={() => toggleModule(num)}
                    className="h-4 w-4 rounded-sm accent-blue-600 dark:accent-blue-500"
                  />
                  <span>Módulo {num}</span>
                </label>
              ))}
            </div>
          </div>

          {/* 5ª linha: grupo + função */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="grupo">Grupo</Label>
              <Select>
                <SelectTrigger id="grupo">
                  <SelectValue placeholder="Selecione o grupo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="adm">Administrativo</SelectItem>
                  <SelectItem value="campo">Campo</SelectItem>
                  <SelectItem value="engenharia">Engenharia</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="funcao">Função</Label>
              <Input id="funcao" placeholder="Cargo ou função" required />
            </div>
          </div>

          {/* Botão + aviso de senha */}
          <div className="flex flex-col items-center justify-center gap-1 pt-2">
            <Button
              type="submit"
              className="mb-2 w-full bg-primary-600 px-6 text-white hover:bg-primary-700"
            >
              Salvar Usuário
            </Button>
            <span className="text-xs text-gray-500 dark:text-gray-400">
              O usuário será cadastrado com a senha padrão{' '}
              <strong>&quot;12345678&quot;</strong>
            </span>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
