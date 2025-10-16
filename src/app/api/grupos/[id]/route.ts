import { NextRequest, NextResponse } from 'next/server'

import { extractTokenFromHeader, verifyToken } from '@/lib/auth'
import { supabaseAdmin } from '@/lib/supabase'

// GET - Buscar grupo por ID
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    let token = extractTokenFromHeader(request.headers.get('authorization'))
    if (!token) token = request.cookies.get('auth-token')?.value || null
    if (!token)
      return NextResponse.json(
        { success: false, message: 'Token não fornecido' },
        { status: 401 },
      )

    const payload = verifyToken(token)
    if (!payload)
      return NextResponse.json(
        { success: false, message: 'Token inválido' },
        { status: 401 },
      )

    const id = parseInt(params.id)

    const { data: grupo, error } = await supabaseAdmin
      .from('grupos')
      .select('id, grupo, desafiado, created_at, updated_at')
      .eq('id', id)
      .single()

    if (error || !grupo) {
      return NextResponse.json(
        { success: false, message: 'Grupo não encontrado' },
        { status: 404 },
      )
    }

    return NextResponse.json({ success: true, data: grupo })
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
    let token = extractTokenFromHeader(request.headers.get('authorization'))
    if (!token) token = request.cookies.get('auth-token')?.value || null
    if (!token)
      return NextResponse.json(
        { success: false, message: 'Token não fornecido' },
        { status: 401 },
      )

    const payload = verifyToken(token)
    if (!payload || payload.role !== 'admin')
      return NextResponse.json(
        { success: false, message: 'Acesso negado' },
        { status: 403 },
      )

    const id = parseInt(params.id)
    const body = await request.json()
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const updateData: any = { updated_at: new Date().toISOString() }

    if (body.grupo) updateData.grupo = body.grupo
    if (body.desafiado !== undefined) updateData.desafiado = body.desafiado

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

// DELETE - Excluir grupo (apenas admins)
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    let token = extractTokenFromHeader(request.headers.get('authorization'))
    if (!token) token = request.cookies.get('auth-token')?.value || null
    if (!token)
      return NextResponse.json(
        { success: false, message: 'Token não fornecido' },
        { status: 401 },
      )

    const payload = verifyToken(token)
    if (!payload || payload.role !== 'admin')
      return NextResponse.json(
        { success: false, message: 'Acesso negado' },
        { status: 403 },
      )

    const id = parseInt(params.id)

    // Verificar se há usuários associados
    const { data: usuarios, error: usuariosError } = await supabaseAdmin
      .from('usuarios')
      .select('matricula')
      .eq('id_grupo', id)

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
          message: 'Não é possível excluir grupo com usuários associados',
        },
        { status: 400 },
      )
    }

    // Excluir grupo
    const { error } = await supabaseAdmin.from('grupos').delete().eq('id', id)

    if (error) {
      console.error('Erro ao excluir grupo:', error)
      return NextResponse.json(
        { success: false, message: 'Erro ao excluir grupo' },
        { status: 500 },
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Grupo excluído com sucesso',
    })
  } catch (error) {
    console.error('Erro na exclusão de grupo:', error)
    return NextResponse.json(
      { success: false, message: 'Erro interno do servidor' },
      { status: 500 },
    )
  }
}
