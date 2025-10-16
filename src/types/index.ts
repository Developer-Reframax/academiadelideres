// Tipos para o sistema Academia de Líderes
export interface Grupo {
  id: number
  grupo: string
  nome: string
  desafiado: boolean
  created_at: string
  updated_at: string
}

export interface Contrato {
  id: number
  codigo: string
  descricao: string
  gerente_geral?: number
  gerente_operacoes?: number
  coordenador?: number
  created_at: string
  updated_at: string
}

export interface Usuario {
  matricula: number
  nome: string
  email: string
  telefone: string
  role: 'admin' | 'membro' | 'usuario'
  status: 'ativo' | 'inativo'
  contrato_id?: number
  contratos?: Contrato
  grupo_id?: number
  grupos?: Grupo
  password_hash: string
  pass_sub: boolean
  escolaridade?: string
  estado_civil?: string
  data_nascimento?: string
  assinatura_digital?: string
  funcao?: string
  foto?: string
  created_at: string
  updated_at: string
}

// Tipos para autenticação
export interface LoginCredentials {
  telefone: string
  password: string
}

export interface AuthResponse {
  success: boolean
  token?: string
  user?: Omit<Usuario, 'password_hash'>
  message?: string
}

// Alias para compatibilidade
export type User = Omit<Usuario, 'password_hash'>

// Tipos para JWT
export interface JWTPayload {
  matricula: number
  nome: string
  email: string
  telefone: string
  role: string
  status: string
  iat: number
  exp: number
}

// Tipos para formulários
export interface CreateUsuarioData {
  matricula: number
  nome: string
  email: string
  telefone: string
  role: 'admin' | 'membro' | 'usuario'
  contrato_id?: number
  grupo_id?: number
  escolaridade?: string
  estado_civil?: string
  data_nascimento?: string
  funcao?: string
}

export interface UpdateUsuarioData extends Partial<CreateUsuarioData> {
  status?: 'ativo' | 'inativo'
  pass_sub?: boolean
  password?: string
}

export interface CreateGrupoData {
  nome: string
  descricao?: string
  grupo: string
  desafiado: boolean
}

export interface CreateContratoData {
  numero: string
  nome: string
  codigo: string
  descricao: string
  valor: number
  data_inicio: string
  data_fim: string
  grupo_id?: number
  gerente_geral?: number
  gerente_operacoes?: number
  coordenador?: number
}

// Tipos para componentes
export interface DashboardStats {
  totalUsuarios: number
  usuariosAtivos: number
  totalGrupos: number
  gruposDesafiados: number
  totalContratos: number
  contratosAtivos: number
  gruposAtivos: number
}

export interface TableColumn {
  key: string
  label: string
  sortable?: boolean
}

export interface FilterOption {
  value: string
  label: string
}

// Tipos para tema
export interface ThemeContextType {
  theme: 'light' | 'dark'
  toggleTheme: () => void
}

// Tipos para notificações
export interface NotificationData {
  id: string
  type: 'success' | 'error' | 'warning' | 'info'
  title: string
  message: string
  timestamp: Date
}
