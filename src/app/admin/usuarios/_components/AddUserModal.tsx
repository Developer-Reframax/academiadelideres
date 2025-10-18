/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import { AnimatePresence, motion } from 'framer-motion'
import {
  Briefcase,
  Building,
  Check,
  Mail,
  Phone,
  Search,
  User,
  Users,
  X,
} from 'lucide-react'
import { useEffect, useState } from 'react'

import { Badge } from '@/components/ui/badge'
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
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'

interface AddUserModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

/**
 * OBS:
 * - Substitua colaboradoresMock por fetch('/api/rm-apoio?search=...') quando a rota existir.
 */

// Interface para os dados da tabela rm_apoio
interface RmApoioData {
  id: number
  chapa_matricula: string
  nome: string
  cod_funcao: string
  funcao: string
  data_nasc: string
  data_admissao: string
  equipe: string
  cod_equipe: string
  cod_situacao: string
  email?: string
}

// Dados mockados para simular a tabela rm_apoio
const colaboradoresMock: RmApoioData[] = [
  {
    id: 1,
    chapa_matricula: '12345',
    nome: 'Ana Souza',
    cod_funcao: 'ENG01',
    funcao: 'Engenheira Civil',
    data_nasc: '1985-05-15',
    data_admissao: '2020-01-10',
    equipe: 'Obra A',
    cod_equipe: 'OA123',
    cod_situacao: '1',
    email: 'ana.souza@ex.com',
  },
  {
    id: 2,
    chapa_matricula: '23456',
    nome: 'Carlos Lima',
    cod_funcao: 'TEC02',
    funcao: 'Técnico de Segurança',
    data_nasc: '1990-08-22',
    data_admissao: '2019-11-05',
    equipe: 'Obra B',
    cod_equipe: 'OB456',
    cod_situacao: '1',
    email: 'carlos.lima@ex.com',
  },
  {
    id: 3,
    chapa_matricula: '34567',
    nome: 'João Pedro',
    cod_funcao: 'SUP03',
    funcao: 'Supervisor de Campo',
    data_nasc: '1982-03-10',
    data_admissao: '2018-06-15',
    equipe: 'Obra C',
    cod_equipe: 'OC789',
    cod_situacao: '1',
    email: 'joao.pedro@ex.com',
  },
  {
    id: 4,
    chapa_matricula: '45678',
    nome: 'Maria Silva',
    cod_funcao: 'ARQ04',
    funcao: 'Arquiteta',
    data_nasc: '1988-11-30',
    data_admissao: '2021-02-20',
    equipe: 'Obra A',
    cod_equipe: 'OA123',
    cod_situacao: '1',
    email: 'maria.silva@ex.com',
  },
  {
    id: 5,
    chapa_matricula: '56789',
    nome: 'Roberto Alves',
    cod_funcao: 'ENG05',
    funcao: 'Engenheiro Elétrico',
    data_nasc: '1979-07-25',
    data_admissao: '2017-09-12',
    equipe: 'Obra D',
    cod_equipe: 'OD012',
    cod_situacao: '1',
    email: 'roberto.alves@ex.com',
  },
]

// Simulação da tabela de contratos
const contratosMock = [
  { id: 1, codigo: 'OA123', nome: 'Obra A' },
  { id: 2, codigo: 'OB456', nome: 'Obra B' },
  { id: 3, codigo: 'OC789', nome: 'Obra C' },
  { id: 4, codigo: 'OD012', nome: 'Obra D' },
]

// Simulação da tabela de grupos
const gruposMock = [
  { id: 1, nome: 'Administração' },
  { id: 2, nome: 'Engenharia' },
  { id: 3, nome: 'Operacional' },
  { id: 4, nome: 'Segurança' },
]

export function AddUserModal({ open, onOpenChange }: AddUserModalProps) {
  const [telefone, setTelefone] = useState('')
  const [email, setEmail] = useState('')
  const [selectedModules, setSelectedModules] = useState<string[]>([])
  const [status, setStatus] = useState<'ativo' | 'inativo'>('ativo')
  const [nivelAcesso, setNivelAcesso] = useState('')
  const [grupo, setGrupo] = useState('')
  const [contrato, setContrato] = useState('')
  const [errors, setErrors] = useState<{ [key: string]: string }>({})

  // busca RM_APOIO
  const [searchTerm, setSearchTerm] = useState('')
  const [filtered, setFiltered] = useState<RmApoioData[]>([])
  const [selectedColab, setSelectedColab] = useState<RmApoioData | null>(null)
  const [showResults, setShowResults] = useState(false)
  const [isSearching, setIsSearching] = useState(false)
  const [searchFocused, setSearchFocused] = useState(false)
  const [formStep, setFormStep] = useState(1)
  const [formProgress, setFormProgress] = useState(0)

  // Reset state when modal closes
  useEffect(() => {
    if (!open) {
      const resetState = () => {
        setSearchTerm('')
        setSelectedColab(null)
        setFiltered([])
        setShowResults(false)
        setFormStep(1)
        setFormProgress(0)
        setTelefone('')
        setEmail('')
        setSelectedModules([])
        setStatus('ativo')
        setNivelAcesso('')
        setGrupo('')
        setContrato('')
        setErrors({})
      }

      // Usando setTimeout para evitar cascading renders
      setTimeout(resetState, 0)
    }
  }, [open])

  // Update form progress
  useEffect(() => {
    const updateProgress = () => {
      if (!selectedColab) {
        setFormProgress(0)
      } else if (formStep === 1) {
        setFormProgress(33)
      } else if (formStep === 2) {
        setFormProgress(66)
      } else if (formStep === 3) {
        setFormProgress(100)
      }
    }

    // Usando setTimeout para evitar cascading renders
    setTimeout(updateProgress, 0)
  }, [selectedColab, formStep])

  const handleTelefoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, '')
    if (value.length > 11) value = value.slice(0, 11)
    if (value.length <= 10)
      value = value.replace(/^(\d{2})(\d{4})(\d{0,4}).*/, '($1) $2-$3')
    else value = value.replace(/^(\d{2})(\d{5})(\d{0,4}).*/, '($1) $2-$3')
    setTelefone(value)
  }

  const handleSearch = (term: string) => {
    setSearchTerm(term)
    setIsSearching(true)

    // Simular busca no backend
    setTimeout(() => {
      if (term.length < 0) {
        setFiltered([])
        setShowResults(false)
      } else {
        const results = colaboradoresMock.filter((colab) =>
          colab.nome.toLowerCase().includes(term.toLowerCase()),
        )
        setFiltered(results)
        setShowResults(true)
      }
      setIsSearching(false)
    }, 300) // simular delay de rede
  }

  const handleSelect = (colab: RmApoioData) => {
    setSelectedColab(colab)
    setSearchTerm(colab.nome)
    setFiltered([])
    setShowResults(false)
    setFormStep(1)

    // Preencher campos automaticamente com dados do RM
    setEmail(colab.email || '')

    // Buscar contrato baseado no cod_equipe
    const contratoEncontrado = contratosMock.find(
      (c) => c.codigo === colab.cod_equipe,
    )
    if (contratoEncontrado) {
      setContrato(contratoEncontrado.nome)
    }
  }

  const toggleModule = (modulo: string) => {
    setSelectedModules((prev) =>
      prev.includes(modulo)
        ? prev.filter((m) => m !== modulo)
        : [...prev, modulo],
    )
  }

  const validateStep = (step: number): boolean => {
    const newErrors: { [key: string]: string } = {}

    if (step === 1) {
      if (!telefone.trim()) newErrors.telefone = 'Telefone é obrigatório'
      if (!email.trim()) newErrors.email = 'Email é obrigatório'
      if (!nivelAcesso) newErrors.nivelAcesso = 'Nível de acesso é obrigatório'
    } else if (step === 2) {
      if (!contrato.trim()) newErrors.contrato = 'Contrato é obrigatório'
      if (!grupo) newErrors.grupo = 'Grupo é obrigatório'
    } else if (step === 3) {
      if (selectedModules.length === 0)
        newErrors.modulos = 'Selecione pelo menos um módulo'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const nextStep = () => {
    if (formStep < 3) {
      if (validateStep(formStep)) {
        setFormStep(formStep + 1)
      }
    }
  }

  const prevStep = () => {
    if (formStep > 1) {
      setFormStep(formStep - 1)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // Validar todos os campos antes de enviar
    if (!validateStep(1) || !validateStep(2) || !validateStep(3)) {
      alert('Por favor, preencha todos os campos obrigatórios antes de salvar.')
      return
    }

    if (!selectedColab) {
      alert('Selecione um colaborador do RM Apoio antes de continuar.')
      return
    }

    // Buscar contrato_id baseado no cod_equipe
    const contratoEncontrado = contratosMock.find(
      (c) => c.codigo === selectedColab.cod_equipe,
    )
    const contratoId = contratoEncontrado?.id || null

    // Buscar grupo_id baseado na seleção
    const grupoEncontrado = gruposMock.find((g) => g.nome === grupo)
    const grupoId = grupoEncontrado?.id || null

    // Montar payload para enviar ao backend
    const payload = {
      matricula: selectedColab.chapa_matricula,
      nome: selectedColab.nome,
      email,
      telefone,
      role: nivelAcesso,
      status,
      contrato_id: contratoId,
      grupo_id: grupoId,
      password_hash: 'hash_da_senha_12345678', // Em produção, isso seria gerado no backend
      pass_sub: false,
      data_nascimento: selectedColab.data_nasc,
      funcao: selectedColab.funcao,
      modulos: selectedModules,
    }

    console.log('salvando usuário:', payload)
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
            Primeiro selecione um colaborador do RM Apoio para preencher
            automaticamente alguns campos.
          </DialogDescription>
        </DialogHeader>

        {/* Progress bar */}
        <div className="relative h-2 w-full bg-gray-100 dark:bg-gray-800">
          <motion.div
            className="absolute left-0 top-0 h-full bg-gradient-to-r from-blue-500 to-indigo-600"
            initial={{ width: 0 }}
            animate={{ width: `${formProgress}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>

        <div className="mt-4 px-0">
          {/* Campo de busca obrigatório */}
          <div className="relative px-4">
            <Label className="flex items-center gap-2">
              <Search className="h-4 w-4" />
              Pesquisar colaborador (Colaboradores do RM)
              <Badge
                variant="outline"
                className="ml-2 bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-500"
              >
                Obrigatório
              </Badge>
            </Label>
            <div className="relative mt-2">
              <Input
                placeholder="Digite o nome do colaborador..."
                value={searchTerm}
                onChange={(e) => handleSearch(e.target.value)}
                onFocus={() => setSearchFocused(true)}
                onBlur={() => setTimeout(() => setSearchFocused(false), 200)}
                className={`pr-10 transition-all duration-300 ${
                  searchFocused
                    ? 'border-blue-500 ring-2 ring-blue-200 dark:ring-blue-800'
                    : ''
                }`}
                aria-label="Pesquisar colaborador do RM Apoio"
              />
              <AnimatePresence>
                {isSearching ? (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute right-3 top-2.5 h-4 w-4 animate-spin rounded-full border-2 border-gray-300 border-t-blue-600"
                  />
                ) : (
                  <Search className="absolute right-3 top-2.5 h-4 w-4 text-gray-400" />
                )}
              </AnimatePresence>
            </div>

            {/* resultados dropdown */}
            <AnimatePresence>
              {showResults && searchTerm && filtered.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className="absolute z-20 mt-1 w-[calc(100%-2rem)] overflow-hidden rounded-md border border-gray-200 bg-white shadow-lg dark:border-gray-700 dark:bg-gray-800"
                >
                  <div className="max-h-60 overflow-y-auto">
                    {filtered.map((c) => (
                      <motion.button
                        key={c.id}
                        type="button"
                        onClick={() => handleSelect(c)}
                        whileHover={{
                          backgroundColor: 'rgba(59, 130, 246, 0.1)',
                        }}
                        className="flex w-full flex-col gap-1 border-b border-gray-100 px-4 py-3 text-left transition-colors last:border-0 dark:border-gray-700"
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-medium text-gray-900 dark:text-white">
                            {c.nome}
                          </span>
                          <Badge
                            variant="outline"
                            className="bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300"
                          >
                            ID: {c.id}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400">
                          <span className="flex items-center gap-1">
                            <Briefcase className="h-3 w-3" /> {c.funcao}
                          </span>
                          <span className="flex items-center gap-1">
                            <Building className="h-3 w-3" /> {c.equipe}
                          </span>
                        </div>
                      </motion.button>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Mensagem quando não há resultados */}
            <AnimatePresence>
              {showResults &&
                searchTerm &&
                filtered.length === 0 &&
                !isSearching && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="mt-2 rounded-md bg-amber-50 p-3 text-center text-sm text-amber-800 dark:bg-amber-900/20 dark:text-amber-500"
                  >
                    <p>Nenhum colaborador encontrado com esse nome.</p>
                    <p className="text-xs">Tente outro termo de busca.</p>
                  </motion.div>
                )}
            </AnimatePresence>

            {/* instrução para obrigatoriedade */}
            <p className="mt-2 px-1 text-xs text-gray-500 dark:text-gray-400">
              Selecione um colaborador existente para preencher automaticamente
              nome, função e contrato.
            </p>
          </div>

          {/* Cartão do colaborador selecionado */}
          <AnimatePresence>
            {selectedColab && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                transition={{ duration: 0.3 }}
                className="mx-4 mt-4 overflow-hidden rounded-lg border border-green-200 bg-green-50 shadow-sm dark:border-green-900/50 dark:bg-green-900/20"
              >
                <div className="flex items-center justify-between border-b border-green-200 bg-green-100 px-4 py-2 dark:border-green-900/30 dark:bg-green-900/30">
                  <div className="flex items-center gap-2">
                    <User className="h-5 w-5 text-green-700 dark:text-green-500" />
                    <h3 className="font-medium text-green-900 dark:text-green-400">
                      Colaborador Selecionado
                    </h3>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setSelectedColab(null)}
                    className="h-8 w-8 rounded-full p-0 text-green-700 hover:bg-green-200 dark:text-green-400 dark:hover:bg-green-800/50"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
                <div className="p-4">
                  <div className="flex flex-wrap gap-3">
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 text-green-700 dark:text-green-500" />
                      <span className="font-medium text-green-900 dark:text-green-400">
                        {selectedColab.nome}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Briefcase className="h-4 w-4 text-green-700 dark:text-green-500" />
                      <span className="text-green-800 dark:text-green-500">
                        {selectedColab.funcao}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Building className="h-4 w-4 text-green-700 dark:text-green-500" />
                      <span className="text-green-800 dark:text-green-500">
                        {selectedColab.equipe}
                      </span>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Formulário em etapas */}
          <AnimatePresence mode="wait">
            {selectedColab && (
              <motion.form
                key={`form-step-${formStep}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                onSubmit={handleSubmit}
                className="mt-6 space-y-6 px-4"
              >
                {/* Etapa 1: Informações básicas */}
                {formStep === 1 && (
                  <motion.div
                    initial={{ x: 20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    exit={{ x: -20, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-6"
                  >
                    <div className="mb-4 flex items-center justify-between">
                      <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                        Informações Básicas
                      </h3>
                      <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400">
                        Etapa 1 de 3
                      </Badge>
                    </div>

                    {/* 1ª linha: nome (ocupando linha inteira) */}
                    <div className="grid grid-cols-1 gap-4">
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <div className="flex flex-col space-y-1.5">
                              <Label className="flex items-center gap-2">
                                <User className="h-4 w-4" />
                                Nome
                                <Badge className="ml-1 bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400">
                                  Automático
                                </Badge>
                              </Label>
                              <Input
                                id="nome"
                                value={selectedColab.nome}
                                readOnly
                                placeholder="Nome preenchido automaticamente"
                                className="border-blue-200 bg-blue-50 focus:border-blue-300 focus:ring-blue-200 dark:border-blue-800 dark:bg-blue-900/20 dark:focus:border-blue-700"
                              />
                            </div>
                          </TooltipTrigger>
                          <TooltipContent side="top">
                            <p>Campo preenchido automaticamente do RM Apoio</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>

                    {/* 2ª linha: telefone + email */}
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                      <div className="flex flex-col space-y-1.5">
                        <Label
                          htmlFor="telefone"
                          className="flex items-center gap-2"
                        >
                          <Phone className="h-4 w-4" />
                          Telefone
                        </Label>
                        <Input
                          id="telefone"
                          type="tel"
                          value={telefone}
                          onChange={handleTelefoneChange}
                          placeholder="(00) 00000-0000"
                          required
                          className={`border-gray-300 focus:border-blue-500 focus:ring-blue-200 dark:border-gray-700 dark:focus:border-blue-600 ${
                            errors.telefone ? 'border-red-500' : ''
                          }`}
                        />
                        {errors.telefone && (
                          <p className="mt-1 text-sm text-red-500">
                            {errors.telefone}
                          </p>
                        )}
                      </div>

                      <div className="flex flex-col space-y-1.5">
                        <Label
                          htmlFor="email"
                          className="flex items-center gap-2"
                        >
                          <Mail className="h-4 w-4" />
                          Email
                        </Label>
                        <Input
                          id="email"
                          type="email"
                          placeholder="exemplo@dominio.com"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          required
                          className={`border-gray-300 focus:border-blue-500 focus:ring-blue-200 dark:border-gray-700 dark:focus:border-blue-600 ${
                            errors.email ? 'border-red-500' : ''
                          }`}
                        />
                        {errors.email && (
                          <p className="mt-1 text-sm text-red-500">
                            {errors.email}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* 3ª linha: status + nível de acesso */}
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                      <div className="flex flex-col space-y-1.5">
                        <Label className="flex items-center gap-2">
                          Status
                        </Label>
                        <div className="flex overflow-hidden rounded-lg border border-gray-300 dark:border-gray-600">
                          <Button
                            variant={status === 'ativo' ? 'default' : 'outline'}
                            className={`flex-1 justify-center gap-2 rounded-none rounded-l-md border-none ${
                              status === 'ativo'
                                ? 'bg-green-600 text-white hover:bg-green-700'
                                : ''
                            }`}
                            onClick={() => setStatus('ativo')}
                            type="button"
                          >
                            <Check className="h-4 w-4" /> Ativo
                          </Button>
                          <Button
                            variant={
                              status === 'inativo' ? 'default' : 'outline'
                            }
                            className={`flex-1 justify-center gap-2 rounded-none rounded-r-md border-none ${
                              status === 'inativo'
                                ? 'bg-red-600 text-white hover:bg-red-700'
                                : ''
                            }`}
                            onClick={() => setStatus('inativo')}
                            type="button"
                          >
                            <X className="h-4 w-4" /> Inativo
                          </Button>
                        </div>
                      </div>

                      <div className="flex flex-col space-y-1.5">
                        <Label className="flex items-center gap-2">
                          Nível de Acesso
                        </Label>
                        <Select
                          value={nivelAcesso}
                          onValueChange={setNivelAcesso}
                        >
                          <SelectTrigger
                            className={`border-gray-300 focus:border-blue-500 focus:ring-blue-200 dark:border-gray-700 dark:focus:border-blue-600 ${errors.nivelAcesso ? 'border-red-500' : ''}`}
                          >
                            <SelectValue placeholder="Selecione o nível" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="admin">Administrador</SelectItem>
                            <SelectItem value="gestor">Gestor</SelectItem>
                            <SelectItem value="usuario">Usuário</SelectItem>
                          </SelectContent>
                        </Select>
                        {errors.nivelAcesso && (
                          <p className="mt-1 text-sm text-red-500">
                            {errors.nivelAcesso}
                          </p>
                        )}
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* Etapa 2: Informações profissionais */}
                {formStep === 2 && (
                  <motion.div
                    initial={{ x: 20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    exit={{ x: -20, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-6"
                  >
                    <div className="mb-4 flex items-center justify-between">
                      <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                        Informações Profissionais
                      </h3>
                      <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400">
                        Etapa 2 de 3
                      </Badge>
                    </div>

                    {/* 1ª linha: contrato (ocupando linha inteira) */}
                    <div className="grid grid-cols-1 gap-4">
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <div className="flex flex-col space-y-1.5">
                              <Label className="flex items-center gap-2">
                                <Building className="h-4 w-4" />
                                Contrato
                                <Badge className="ml-1 bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400">
                                  Automático
                                </Badge>
                              </Label>
                              <Input
                                id="contrato"
                                value={selectedColab.equipe}
                                readOnly
                                placeholder="Contrato preenchida automaticamente"
                                className="border-blue-200 bg-blue-50 focus:border-blue-300 focus:ring-blue-200 dark:border-blue-800 dark:bg-blue-900/20 dark:focus:border-blue-700"
                              />
                            </div>
                          </TooltipTrigger>
                          <TooltipContent side="top">
                            <p>Campo preenchido automaticamente do RM Apoio</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>

                    {/* 2ª linha: função + grupo */}
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <div className="flex flex-col space-y-1.5">
                              <Label className="flex items-center gap-2">
                                <Briefcase className="h-4 w-4" />
                                Função
                                <Badge className="ml-1 bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400">
                                  Automático
                                </Badge>
                              </Label>
                              <Input
                                id="funcao"
                                value={selectedColab.funcao}
                                readOnly
                                placeholder="Função preenchida automaticamente"
                                className="border-blue-200 bg-blue-50 focus:border-blue-300 focus:ring-blue-200 dark:border-blue-800 dark:bg-blue-900/20 dark:focus:border-blue-700"
                              />
                            </div>
                          </TooltipTrigger>
                          <TooltipContent side="top">
                            <p>Campo preenchido automaticamente do RM Apoio</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>

                      <div className="flex flex-col space-y-1.5">
                        <Label
                          htmlFor="grupo"
                          className="flex min-h-[22px] items-center gap-2"
                        >
                          <Users className="h-4 w-4" />
                          Grupo
                        </Label>
                        <Select value={grupo} onValueChange={setGrupo}>
                          <SelectTrigger
                            className={`border-gray-300 focus:border-blue-500 focus:ring-blue-200 dark:border-gray-700 dark:focus:border-blue-600 ${errors.grupo ? 'border-red-500' : ''}`}
                          >
                            <SelectValue placeholder="Selecione o grupo" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="grupo1">Grupo 1</SelectItem>
                            <SelectItem value="grupo2">Grupo 2</SelectItem>
                            <SelectItem value="grupo3">Grupo 3</SelectItem>
                          </SelectContent>
                        </Select>
                        {errors.grupo && (
                          <p className="mt-1 text-sm text-red-500">
                            {errors.grupo}
                          </p>
                        )}
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* Etapa 3: Módulos e finalização */}
                {formStep === 3 && (
                  <motion.div
                    initial={{ x: 20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    exit={{ x: -20, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-6"
                  >
                    <div className="mb-4 flex items-center justify-between">
                      <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                        Módulos de Acesso
                      </h3>
                      <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400">
                        Etapa 3 de 3
                      </Badge>
                    </div>

                    {/* Módulos */}
                    <div className="flex flex-col space-y-3">
                      <Label className="flex items-center gap-2">
                        Selecione os módulos de acesso
                      </Label>
                      {errors.modulos && (
                        <p className="text-sm text-red-500">{errors.modulos}</p>
                      )}
                      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-5">
                        {['I', 'II', 'III', 'IV', 'V'].map((num) => (
                          <motion.label
                            key={num}
                            whileHover={{ scale: 1.03 }}
                            whileTap={{ scale: 0.98 }}
                            className={`flex cursor-pointer flex-col items-center justify-center rounded-lg border p-3 text-center transition-all ${
                              selectedModules.includes(num)
                                ? 'border-blue-500 bg-blue-50 dark:border-blue-600 dark:bg-blue-900/30'
                                : 'border-gray-200 bg-white hover:border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:hover:border-gray-600'
                            }`}
                          >
                            <div
                              className={`mb-2 flex h-10 w-10 items-center justify-center rounded-full ${
                                selectedModules.includes(num)
                                  ? 'bg-blue-500 text-white'
                                  : 'bg-gray-100 text-gray-500 dark:bg-gray-700 dark:text-gray-400'
                              }`}
                            >
                              {num}
                            </div>
                            <span
                              className={`text-sm font-medium ${
                                selectedModules.includes(num)
                                  ? 'text-blue-700 dark:text-blue-400'
                                  : 'text-gray-700 dark:text-gray-300'
                              }`}
                            >
                              Módulo {num}
                            </span>
                            <Checkbox
                              checked={selectedModules.includes(num)}
                              onCheckedChange={() => toggleModule(num)}
                              className="mt-2 h-4 w-4 rounded-sm accent-blue-600 dark:accent-blue-500"
                            />
                          </motion.label>
                        ))}
                      </div>
                    </div>

                    {/* Aviso de senha */}
                    <div className="rounded-lg border border-amber-200 bg-amber-50 p-3 text-center text-sm text-amber-800 dark:border-amber-900/50 dark:bg-amber-900/20 dark:text-amber-500">
                      <p>
                        O usuário será cadastrado com a senha padrão{' '}
                        <strong>&quot;12345678&quot;</strong>
                      </p>
                      <p className="mt-1 text-xs">
                        A plataforma automaticamente exigirá a troca de senha no
                        primeiro acesso.
                      </p>
                    </div>
                  </motion.div>
                )}

                {/* Botões de navegação */}
                <div className="flex items-center justify-between pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={prevStep}
                    disabled={formStep === 1}
                    className={formStep === 1 ? 'invisible' : ''}
                  >
                    Voltar
                  </Button>

                  {formStep < 3 ? (
                    <Button
                      type="button"
                      onClick={nextStep}
                      className="bg-blue-600 text-white hover:bg-blue-700"
                    >
                      Próximo
                    </Button>
                  ) : (
                    <Button
                      type="submit"
                      className="bg-green-600 text-white hover:bg-green-700"
                    >
                      Salvar Usuário
                    </Button>
                  )}
                </div>
              </motion.form>
            )}
          </AnimatePresence>
        </div>
      </DialogContent>
    </Dialog>
  )
}
