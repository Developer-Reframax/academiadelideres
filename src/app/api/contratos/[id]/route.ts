import { NextRequest, NextResponse } from 'next/server'

import { extractTokenFromHeader, verifyToken } from '@/lib/auth'
import { supabaseAdmin } from '@/lib/supabase'

// GET - Buscar contrato por ID
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
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

    const { data: contrato, error } = await supabaseAdmin
      .from('contratos')
      .select(
        'id, codigo, descricao, gerente_geral, gerente_operacoes, coordenador, created_at, updated_at',
      )
      .eq('id', id)
      .single()

    if (error || !contrato) {
      return NextResponse.json(
        { success: false, message: 'Contrato não encontrado' },
        { status: 404 },
      )
    }

    return NextResponse.json({ success: true, data: contrato })
  } catch (error) {
    console.error('Erro ao buscar contrato:', error)
    return NextResponse.json(
      { success: false, message: 'Erro interno do servidor' },
      { status: 500 },
    )
  }
}

// PUT - Atualizar contrato (apenas admins)
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
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

    const updateData: Partial<{
      codigo: string
      descricao: string
      gerente_geral: number
      gerente_operacoes: number
      coordenador: number
      updated_at: string
    }> = {
      updated_at: new Date().toISOString(),
    }

    if (body.codigo !== undefined) updateData.codigo = body.codigo
    if (body.descricao !== undefined) updateData.descricao = body.descricao
    if (body.gerente_geral !== undefined)
      updateData.gerente_geral = body.gerente_geral
    if (body.gerente_operacoes !== undefined)
      updateData.gerente_operacoes = body.gerente_operacoes
    if (body.coordenador !== undefined)
      updateData.coordenador = body.coordenador

    const { data: contrato, error } = await supabaseAdmin
      .from('contratos')
      .update(updateData)
      .eq('id', id)
      .select()
      .single()

    if (error) {
      console.error('Erro ao atualizar contrato:', error)
      return NextResponse.json(
        { success: false, message: 'Erro ao atualizar contrato' },
        { status: 500 },
      )
    }

    return NextResponse.json({
      success: true,
      data: contrato,
      message: 'Contrato atualizado com sucesso',
    })
  } catch (error) {
    console.error('Erro na atualização de contrato:', error)
    return NextResponse.json(
      { success: false, message: 'Erro interno do servidor' },
      { status: 500 },
    )
  }
}

// DELETE - Desativar contrato (soft delete não existe, então apenas retornamos erro se houver FK)
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
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

    // Tentar deletar, mas cuidado com FK na tabela usuarios
    const { error } = await supabaseAdmin
      .from('contratos')
      .delete()
      .eq('id', id)

    if (error) {
      console.error('Erro ao deletar contrato:', error)
      return NextResponse.json(
        {
          success: false,
          message:
            'Não foi possível deletar o contrato. Verifique se há usuários vinculados.',
        },
        { status: 400 },
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Contrato deletado com sucesso',
    })
  } catch (error) {
    console.error('Erro na exclusão de contrato:', error)
    return NextResponse.json(
      { success: false, message: 'Erro interno do servidor' },
      { status: 500 },
    )
  }
}
