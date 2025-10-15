import { NextRequest, NextResponse } from 'next/server'

import { extractTokenFromHeader, verifyToken } from '@/lib/auth'
import { supabaseAdmin } from '@/lib/supabase'
import { CreateGrupoData } from '@/types'

// GET - Listar grupos
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
    if (!payload) {
      return NextResponse.json(
        { success: false, message: 'Token inválido' },
        { status: 401 },
      )
    }

    // Buscar grupos com contagem de usuários
    const { data: grupos, error } = await supabaseAdmin
      .from('grupos')
      .select(
        `
        id,
        grupo,
        desafiado,
        created_at,
        updated_at
      `,
      )
      .order('grupo')

    if (error) {
      console.error('Erro ao buscar grupos:', error)
      return NextResponse.json(
        { success: false, message: 'Erro ao buscar grupos' },
        { status: 500 },
      )
    }

    // Formatar dados para incluir contagem de usuários
    const gruposFormatados = grupos.map((grupo) => ({
      ...grupo,
    }))

    return NextResponse.json({
      success: true,
      data: gruposFormatados,
    })
  } catch (error) {
    console.error('Erro na API de grupos:', error)
    return NextResponse.json(
      { success: false, message: 'Erro interno do servidor' },
      { status: 500 },
    )
  }
}

// POST - Criar grupo (apenas admins)
export async function POST(request: NextRequest) {
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
    if (!payload || payload.role !== 'admin') {
      return NextResponse.json(
        { success: false, message: 'Acesso negado' },
        { status: 403 },
      )
    }

    const body: CreateGrupoData = await request.json()
    const { nome, descricao } = body

    // Validar dados obrigatórios
    if (!nome) {
      return NextResponse.json(
        { success: false, message: 'Nome do grupo é obrigatório' },
        { status: 400 },
      )
    }

    // Criar grupo
    const { data: grupo, error } = await supabaseAdmin
      .from('grupos')
      .insert({
        nome,
        descricao,
        status: 'ativo',
      })
      .select()
      .single()

    if (error) {
      console.error('Erro ao criar grupo:', error)
      return NextResponse.json(
        { success: false, message: 'Erro ao criar grupo' },
        { status: 500 },
      )
    }

    return NextResponse.json({
      success: true,
      data: grupo,
      message: 'Grupo criado com sucesso',
    })
  } catch (error) {
    console.error('Erro na criação de grupo:', error)
    return NextResponse.json(
      { success: false, message: 'Erro interno do servidor' },
      { status: 500 },
    )
  }
}
