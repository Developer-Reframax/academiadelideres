/* eslint-disable camelcase */
import { NextRequest, NextResponse } from 'next/server'

import { extractTokenFromHeader, verifyToken } from '@/lib/auth'
import { supabaseAdmin } from '@/lib/supabase'

// GET - Buscar colaborador por chapa_matricula
export async function GET(
  request: NextRequest,
  { params }: { params: { chapa_matricula: string } },
) {
  try {
    // Verificar autenticação
    let token = extractTokenFromHeader(request.headers.get('authorization'))
    if (!token) {
      token = request.cookies.get('auth-token')?.value || null
    }

    if (!token) {
      return NextResponse.json(
        { success: false, message: 'Token não fornecido' },
        { status: 401 },
      )
    }

    const payload = verifyToken(token)
    if (!payload || !['admin', 'gestor'].includes(payload.role)) {
      return NextResponse.json(
        { success: false, message: 'Acesso negado' },
        { status: 403 },
      )
    }

    const chapa_matricula = params.chapa_matricula

    // Buscar colaborador
    const { data: colaborador, error } = await supabaseAdmin
      .from('rm_apoio')
      .select(
        `
         chapa_matricula,
         nome,
         cod_funcao,
         funcao,
         cod_equipe,
         equipe,
         cod_situacao,
         data_nasc,
         data_admissao,
         created_at,
         updated_at
      `,
      )
      .eq('chapa_matricula', chapa_matricula)
      .single()

    if (error || !colaborador) {
      return NextResponse.json(
        { success: false, message: 'Colaborador não encontrado' },
        { status: 404 },
      )
    }

    return NextResponse.json({
      success: true,
      data: colaborador,
    })
  } catch (error) {
    console.error('Erro ao buscar colaborador:', error)
    return NextResponse.json(
      { success: false, message: 'Erro interno do servidor' },
      { status: 500 },
    )
  }
}

// Métodos não permitidos
export async function PUT() {
  return NextResponse.json(
    { success: false, message: 'Operação não permitida nesta rota' },
    { status: 405 },
  )
}

export async function DELETE() {
  return NextResponse.json(
    { success: false, message: 'Operação não permitida nesta rota' },
    { status: 405 },
  )
}
