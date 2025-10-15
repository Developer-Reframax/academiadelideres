import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

import { JWTPayload, Usuario } from '@/types'

const JWT_SECRET = process.env.JWT_SECRET!

// Gerar token JWT
export function generateToken(user: Usuario): string {
  const payload: Omit<JWTPayload, 'iat' | 'exp'> = {
    matricula: user.matricula,
    nome: user.nome,
    email: user.email,
    telefone: user.telefone,
    role: user.role,
    status: user.status,
  }

  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: '24h',
  })
}

// Verificar token JWT
export function verifyToken(token: string): JWTPayload | null {
  try {
    console.log('🔐 [AUTH] Verificando token JWT...')
    console.log('🔐 [AUTH] JWT_SECRET definido:', JWT_SECRET ? 'SIM' : 'NÃO')
    console.log(
      '🔐 [AUTH] JWT_SECRET (primeiros 10 chars):',
      JWT_SECRET ? JWT_SECRET.substring(0, 10) + '...' : 'UNDEFINED',
    )

    const decoded = jwt.verify(token, JWT_SECRET) as JWTPayload
    console.log('✅ [AUTH] Token verificado com sucesso')
    return decoded
  } catch (error) {
    console.log(
      '❌ [AUTH] Erro na verificação do token:',
      error instanceof Error ? error.message : 'Erro desconhecido',
    )
    if (error instanceof jwt.JsonWebTokenError) {
      console.log('❌ [AUTH] Tipo de erro JWT:', error.name)
    }
    return null
  }
}

// Hash da senha
export async function hashPassword(password: string): Promise<string> {
  const saltRounds = 10
  return bcrypt.hash(password, saltRounds)
}

// Verificar senha
export async function verifyPassword(
  password: string,
  hash: string,
): Promise<boolean> {
  return bcrypt.compare(password, hash)
}

// Gerar senha padrão baseada na matrícula
export function generateDefaultPassword(matricula: number): string {
  return `acad${matricula}`
}

// Validar formato de telefone brasileiro
export function validatePhoneNumber(phone: string): boolean {
  const phoneRegex = /^\+55\d{2}9?\d{8}$/
  return phoneRegex.test(phone)
}

// Validar formato de email
export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

// Extrair token do header Authorization
export function extractTokenFromHeader(
  authHeader: string | null,
): string | null {
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null
  }
  return authHeader.substring(7)
}
