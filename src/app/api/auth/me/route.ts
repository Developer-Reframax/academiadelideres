import { NextRequest, NextResponse } from 'next/server'

import { verifyToken } from '@/lib/auth'

export async function GET(request: NextRequest) {
  try {
    console.log(
      '🔍 [AUTH/ME] Verificando autenticação via Authorization header...',
    )

    // Obter token do Authorization header
    const authHeader = request.headers.get('authorization')

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      console.log(
        '❌ [AUTH/ME] Authorization header não encontrado ou inválido',
      )
      return NextResponse.json(
        { success: false, message: 'Token de autorização não fornecido' },
        { status: 401 },
      )
    }

    const token = authHeader.substring(7) // Remove "Bearer "
    console.log('🎫 [AUTH/ME] Token extraído do header, verificando...')

    // Verificar token
    const decoded = verifyToken(token)

    if (!decoded) {
      console.log('❌ [AUTH/ME] Token inválido')
      return NextResponse.json(
        { success: false, message: 'Token inválido ou expirado' },
        { status: 401 },
      )
    }

    console.log('✅ [AUTH/ME] Token válido para usuário:', decoded.nome)

    // Retornar dados do usuário (sem informações sensíveis)
    const user = {
      matricula: decoded.matricula,
      nome: decoded.nome,
      email: decoded.email,
      telefone: decoded.telefone,
      role: decoded.role,
      status: decoded.status,
    }

    return NextResponse.json({
      success: true,
      user,
    })
  } catch (error) {
    console.error('💥 [AUTH/ME] Erro ao verificar autenticação:', error)
    return NextResponse.json(
      { success: false, message: 'Erro interno do servidor' },
      { status: 500 },
    )
  }
}
