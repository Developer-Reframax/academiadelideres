import { NextResponse } from 'next/server'

export async function POST() {
  try {
    console.log('🚪 [LOGOUT] Processando logout...')

    // Criar resposta
    const response = NextResponse.json({
      success: true,
      message: 'Logout realizado com sucesso',
    })

    // Remover cookie de autenticação
    response.cookies.set('auth-token', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 0, // Expira imediatamente
      path: '/',
    })

    console.log('✅ [LOGOUT] Cookie removido com sucesso')
    return response
  } catch (error) {
    console.error('💥 [LOGOUT] Erro no logout:', error)
    return NextResponse.json(
      { success: false, message: 'Erro interno do servidor' },
      { status: 500 },
    )
  }
}
