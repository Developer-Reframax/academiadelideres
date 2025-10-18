/* eslint-disable camelcase */
import { NextRequest, NextResponse } from 'next/server'

import { extractTokenFromHeader, verifyToken } from '@/lib/auth'
import { supabaseAdmin } from '@/lib/supabase'

// GET - Listar colaboradores do EFETIVO RM
export async function GET(request: NextRequest) {
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

    // Obter parâmetro de busca
    const searchParams = request.nextUrl.searchParams
    const search = searchParams.get('search') || ''

    // Buscar colaboradores
    let query = supabaseAdmin.from('rm_apoio').select(`
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
    `)

    if (search) {
      query = query.ilike('nome', `%${search}%`)
    }

    query = query.limit(10)

    const { data: colaboradores, error } = await query

    if (error) {
      console.error('Erro ao buscar colaboradores:', error)
      return NextResponse.json(
        { success: false, message: 'Erro ao buscar colaboradores' },
        { status: 500 },
      )
    }

    return NextResponse.json({
      success: true,
      data: colaboradores,
    })
  } catch (error) {
    console.error('Erro na API de EFETIVO RM:', error)
    return NextResponse.json(
      { success: false, message: 'Erro interno do servidor' },
      { status: 500 },
    )
  }
}

// Métodos não permitidos
export async function POST() {
  return NextResponse.json(
    { success: false, message: 'Operação não permitida nesta rota' },
    { status: 405 },
  )
}

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
