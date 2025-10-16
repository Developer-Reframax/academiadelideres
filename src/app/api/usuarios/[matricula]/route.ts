import { NextRequest, NextResponse } from 'next/server'

import { extractTokenFromHeader, hashPassword, verifyToken } from '@/lib/auth'
import { supabaseAdmin } from '@/lib/supabase'
import { UpdateUsuarioData } from '@/types'

// GET - Buscar usuário por matrícula
export async function GET(
  request: NextRequest,
  { params }: { params: { matricula: string } },
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

    const matricula = parseInt(params.matricula)

    // Verificar se é admin ou se está buscando seus próprios dados
    if (payload.role !== 'admin' && payload.matricula !== matricula) {
      return NextResponse.json(
        { success: false, message: 'Acesso negado' },
        { status: 403 },
      )
    }

    // Buscar usuário
    const { data: usuario, error } = await supabaseAdmin
      .from('usuarios')
      .select(
        `
        matricula,
        nome,
        email,
        telefone,
        role,
        contrato_id,
        grupo_id,
        status,
        created_at,
        updated_at,
        contratos:contrato_id (
          id,
          codigo,
          descricao,
          gerente_geral,
          gerente_operacoes,
          coordenador
        ),
        grupos:grupo_id (
          id,
          grupo,
          desafiado
        )
      `,
      )
      .eq('matricula', matricula)
      .single()

    if (error || !usuario) {
      return NextResponse.json(
        { success: false, message: 'Usuário não encontrado' },
        { status: 404 },
      )
    }

    return NextResponse.json({
      success: true,
      data: usuario,
    })
  } catch (error) {
    console.error('Erro ao buscar usuário:', error)
    return NextResponse.json(
      { success: false, message: 'Erro interno do servidor' },
      { status: 500 },
    )
  }
}

// PUT - Atualizar usuário
export async function PUT(
  request: NextRequest,
  { params }: { params: { matricula: string } },
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

    const matricula = parseInt(params.matricula)
    const body: UpdateUsuarioData = await request.json()

    // Verificar se é admin ou se está atualizando seus próprios dados
    if (payload.role !== 'admin' && payload.matricula !== matricula) {
      return NextResponse.json(
        { success: false, message: 'Acesso negado' },
        { status: 403 },
      )
    }

    // Preparar dados para atualização
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const updateData: any = {
      updated_at: new Date().toISOString(),
    }

    // Apenas admins podem alterar role, grupo_id e status
    if (payload.role === 'admin') {
      if (body.nome) updateData.nome = body.nome
      if (body.email) updateData.email = body.email
      if (body.telefone) updateData.telefone = body.telefone
      if (body.role) updateData.role = body.role
      if (body.grupo_id !== undefined) updateData.grupo_id = body.grupo_id
      if (body.status) updateData.status = body.status
    } else {
      // Usuários comuns só podem alterar dados pessoais
      if (body.nome) updateData.nome = body.nome
      if (body.email) updateData.email = body.email
      if (body.telefone) updateData.telefone = body.telefone
    }

    // Se há nova senha, fazer hash
    if (body.password) {
      updateData.password_hash = await hashPassword(body.password)
    }

    // Atualizar usuário
    const { data: usuario, error } = await supabaseAdmin
      .from('usuarios')
      .update(updateData)
      .eq('matricula', matricula)
      .select()
      .single()

    if (error) {
      console.error('Erro ao atualizar usuário:', error)
      return NextResponse.json(
        { success: false, message: 'Erro ao atualizar usuário' },
        { status: 500 },
      )
    }

    // Remover senha do retorno
    // eslint-disable-next-line @typescript-eslint/no-unused-vars, camelcase
    const { password_hash, ...usuarioSemSenha } = usuario

    return NextResponse.json({
      success: true,
      data: usuarioSemSenha,
      message: 'Usuário atualizado com sucesso',
    })
  } catch (error) {
    console.error('Erro na atualização de usuário:', error)
    return NextResponse.json(
      { success: false, message: 'Erro interno do servidor' },
      { status: 500 },
    )
  }
}

// DELETE - Desativar usuário (apenas admins)
export async function DELETE(
  request: NextRequest,
  { params }: { params: { matricula: string } },
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

    const matricula = parseInt(params.matricula)

    // Desativar usuário (soft delete)
    const { error } = await supabaseAdmin
      .from('usuarios')
      .update({
        status: 'inativo',
        updated_at: new Date().toISOString(),
      })
      .eq('matricula', matricula)

    if (error) {
      console.error('Erro ao desativar usuário:', error)
      return NextResponse.json(
        { success: false, message: 'Erro ao desativar usuário' },
        { status: 500 },
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Usuário desativado com sucesso',
    })
  } catch (error) {
    console.error('Erro na desativação de usuário:', error)
    return NextResponse.json(
      { success: false, message: 'Erro interno do servidor' },
      { status: 500 },
    )
  }
}
