import { NextRequest, NextResponse } from 'next/server'

import { extractTokenFromHeader, verifyToken } from '@/lib/auth'
import { supabaseAdmin } from '@/lib/supabase'

// GET - Buscar contrato por ID
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

    // Buscar contrato com informações do grupo
    const { data: contrato, error } = await supabaseAdmin
      .from('contratos')
      .select(
        `
        id,
        numero,
        nome,
        descricao,
        valor,
        data_inicio,
        data_fim,
        status,
        grupo_id,
        created_at,
        updated_at,
        grupos:grupo_id (
          id,
          nome,
          descricao
        )
      `,
      )
      .eq('id', id)
      .single()

    if (error || !contrato) {
      return NextResponse.json(
        { success: false, message: 'Contrato não encontrado' },
        { status: 404 },
      )
    }

    return NextResponse.json({
      success: true,
      data: contrato,
    })
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

    if (body.numero) updateData.numero = body.numero
    if (body.nome) updateData.nome = body.nome
    if (body.descricao !== undefined) updateData.descricao = body.descricao
    if (body.valor) updateData.valor = body.valor
    if (body.data_inicio) updateData.data_inicio = body.data_inicio
    if (body.data_fim) updateData.data_fim = body.data_fim
    if (body.grupo_id !== undefined) updateData.grupo_id = body.grupo_id
    if (body.status) updateData.status = body.status

    // Validar datas se fornecidas
    if (body.data_inicio && body.data_fim) {
      const dataInicio = new Date(body.data_inicio)
      const dataFim = new Date(body.data_fim)

      if (dataFim <= dataInicio) {
        return NextResponse.json(
          {
            success: false,
            message: 'Data de fim deve ser posterior à data de início',
          },
          { status: 400 },
        )
      }
    }

    // Atualizar contrato
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

// DELETE - Desativar contrato (apenas admins)
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

    // Desativar contrato (soft delete)
    const { error } = await supabaseAdmin
      .from('contratos')
      .update({
        status: 'inativo',
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)

    if (error) {
      console.error('Erro ao desativar contrato:', error)
      return NextResponse.json(
        { success: false, message: 'Erro ao desativar contrato' },
        { status: 500 },
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Contrato desativado com sucesso',
    })
  } catch (error) {
    console.error('Erro na desativação de contrato:', error)
    return NextResponse.json(
      { success: false, message: 'Erro interno do servidor' },
      { status: 500 },
    )
  }
}
