import { NextRequest, NextResponse } from 'next/server'

import { generateToken, verifyPassword } from '@/lib/auth'
import { findUserByPhone } from '@/lib/supabase'
import { AuthResponse, LoginCredentials } from '@/types'

export async function POST(request: NextRequest) {
  try {
    console.log('🔐 [LOGIN] Iniciando processo de login...')

    const body: LoginCredentials = await request.json()
    const { telefone, password } = body

    console.log('📞 [LOGIN] Dados recebidos:', {
      telefone: telefone || 'VAZIO',
      password: password ? '***' : 'VAZIO',
    })

    // Validar dados de entrada
    if (!telefone || !password) {
      console.log('❌ [LOGIN] Dados de entrada inválidos')
      return NextResponse.json(
        { success: false, message: 'Telefone e senha são obrigatórios' },
        { status: 400 },
      )
    }

    console.log('🔍 [LOGIN] Buscando usuário...')

    // Buscar usuário usando a nova função com fallback
    const { data: usuario, error, source } = await findUserByPhone(telefone)

    console.log('📊 [LOGIN] Resultado da busca:')
    console.log('  - Fonte:', source)
    console.log('  - Error:', error?.message || 'Nenhum')
    console.log('  - Usuario encontrado:', usuario ? 'SIM' : 'NÃO')

    if (error || !usuario) {
      console.log('❌ [LOGIN] Usuário não encontrado')
      return NextResponse.json(
        { success: false, message: 'Credenciais inválidas' },
        { status: 401 },
      )
    }

    if (usuario) {
      console.log('  - Nome:', usuario.nome)
      console.log('  - Email:', usuario.email)
      console.log('  - Role:', usuario.role)
      console.log('  - Status:', usuario.status)
      console.log(
        '  - Tem password_hash:',
        usuario.password_hash ? 'SIM' : 'NÃO',
      )
    }

    console.log('🔑 [LOGIN] Verificando senha...')

    // Verificar senha
    const isValidPassword = await verifyPassword(
      password,
      usuario.password_hash,
    )
    console.log(
      '🔑 [LOGIN] Resultado da verificação de senha:',
      isValidPassword,
    )

    if (!isValidPassword) {
      console.log('❌ [LOGIN] Senha inválida')
      return NextResponse.json(
        { success: false, message: 'Credenciais inválidas' },
        { status: 401 },
      )
    }

    console.log('🎫 [LOGIN] Gerando token JWT...')

    // Gerar token JWT
    const token = generateToken(usuario)
    console.log('🎫 [LOGIN] Token gerado:', token ? 'SIM' : 'NÃO')

    // Remover senha do objeto de resposta
    // eslint-disable-next-line camelcase, @typescript-eslint/no-unused-vars
    const { password_hash, ...userWithoutPassword } = usuario

    const response: AuthResponse = {
      success: true,
      token,
      user: {
        ...userWithoutPassword,
        source, // Adicionar informação da fonte dos dados
      },
    }

    console.log(
      '✅ [LOGIN] Login realizado com sucesso para usuário:',
      usuario.nome,
    )
    console.log('📍 [LOGIN] Fonte dos dados:', source)
    console.log('🍪 [LOGIN] Definindo cookie httpOnly com JWT')

    // Criar resposta com JWT no body e cookie
    const jsonResponse = NextResponse.json(response)

    // Definir cookie httpOnly com o JWT
    jsonResponse.cookies.set('auth-token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 dias
      path: '/',
    })

    console.log('🍪 [LOGIN] Cookie auth-token definido com sucesso')

    return jsonResponse
  } catch (error) {
    console.error('💥 [LOGIN] Erro crítico no login:', error)
    console.error(
      '💥 [LOGIN] Stack trace:',
      error instanceof Error ? error.stack : 'N/A',
    )

    // Tratamento específico para diferentes tipos de erro
    if (error instanceof Error) {
      if (error.message.includes('fetch')) {
        console.error('🌐 [LOGIN] Erro de conectividade detectado')
        return NextResponse.json(
          {
            success: false,
            message: 'Erro de conectividade. Tentando modo offline...',
            details: 'Verifique sua conexão com a internet',
          },
          { status: 503 },
        )
      }

      if (error.message.includes('timeout')) {
        console.error('⏱️ [LOGIN] Timeout detectado')
        return NextResponse.json(
          {
            success: false,
            message: 'Timeout na conexão. Tente novamente.',
            details: 'O servidor demorou muito para responder',
          },
          { status: 504 },
        )
      }
    }

    return NextResponse.json(
      {
        success: false,
        message: 'Erro interno do servidor',
        details:
          process.env.NODE_ENV === 'development'
            ? error instanceof Error
              ? error.message
              : 'Erro desconhecido'
            : undefined,
      },
      { status: 500 },
    )
  }
}
