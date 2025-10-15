import { NextRequest, NextResponse } from 'next/server'

import { extractTokenFromHeader, verifyToken } from '@/lib/auth'
import { supabaseAdmin } from '@/lib/supabase'

// GET - Buscar grupo por ID
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } },
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
    if (!payload) {
      return NextResponse.json(
        { success: false, message: 'Token inválido' },
        { status: 401 },
      )
    }

    const id = parseInt(params.id)

    // Buscar grupo com usuários
    const { data: grupo, error } = await supabaseAdmin
      .from('grupos')
      .select(
        `
        id,
        nome,
        descricao,
        status,
        created_at,
        updated_at,
        usuarios (
          matricula,
          nome,
          email,
          telefone,
          role,
          status
        )
      `,
      )
      .eq('id', id)
      .single()

    if (error || !grupo) {
      return NextResponse.json(
        { success: false, message: 'Grupo não encontrado' },
        { status: 404 },
      )
    }

    return NextResponse.json({
      success: true,
      data: grupo,
    })
  } catch (error) {
    console.error('Erro ao buscar grupo:', error)
    return NextResponse.json(
      { success: false, message: 'Erro interno do servidor' },
      { status: 500 },
    )
  }
}

// PUT - Atualizar grupo (apenas admins)
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } },
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
    if (!payload || payload.role !== 'admin') {
      return NextResponse.json(
        { success: false, message: 'Acesso negado' },
        { status: 403 },
      )
    }

    const id = parseInt(params.id)
    const body = await request.json()

    // Preparar dados para atualização
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const updateData: any = {
      updated_at: new Date().toISOString(),
    }

    if (body.nome) updateData.nome = body.nome
    if (body.descricao !== undefined) updateData.descricao = body.descricao
    if (body.status) updateData.status = body.status

    // Atualizar grupo
    const { data: grupo, error } = await supabaseAdmin
      .from('grupos')
      .update(updateData)
      .eq('id', id)
      .select()
      .single()

    if (error) {
      console.error('Erro ao atualizar grupo:', error)
      return NextResponse.json(
        { success: false, message: 'Erro ao atualizar grupo' },
        { status: 500 },
      )
    }

    return NextResponse.json({
      success: true,
      data: grupo,
      message: 'Grupo atualizado com sucesso',
    })
  } catch (error) {
    console.error('Erro na atualização de grupo:', error)
    return NextResponse.json(
      { success: false, message: 'Erro interno do servidor' },
      { status: 500 },
    )
  }
}

// DELETE - Desativar grupo (apenas admins)
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } },
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
    if (!payload || payload.role !== 'admin') {
      return NextResponse.json(
        { success: false, message: 'Acesso negado' },
        { status: 403 },
      )
    }

    const id = parseInt(params.id)

    // Verificar se há usuários no grupo
    const { data: usuarios, error: usuariosError } = await supabaseAdmin
      .from('usuarios')
      .select('matricula')
      .eq('grupo_id', id)
      .eq('status', 'ativo')

    if (usuariosError) {
      console.error('Erro ao verificar usuários do grupo:', usuariosError)
      return NextResponse.json(
        { success: false, message: 'Erro ao verificar usuários do grupo' },
        { status: 500 },
      )
    }

    if (usuarios && usuarios.length > 0) {
      return NextResponse.json(
        {
          success: false,
          message: 'Não é possível desativar grupo com usuários ativos',
        },
        { status: 400 },
      )
    }

    // Desativar grupo (soft delete)
    const { error } = await supabaseAdmin
      .from('grupos')
      .update({
        status: 'inativo',
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)

    if (error) {
      console.error('Erro ao desativar grupo:', error)
      return NextResponse.json(
        { success: false, message: 'Erro ao desativar grupo' },
        { status: 500 },
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Grupo desativado com sucesso',
    })
  } catch (error) {
    console.error('Erro na desativação de grupo:', error)
    return NextResponse.json(
      { success: false, message: 'Erro interno do servidor' },
      { status: 500 },
    )
  }
}
