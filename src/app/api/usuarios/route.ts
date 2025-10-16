/* eslint-disable camelcase */
import { NextRequest, NextResponse } from 'next/server'

import {
  extractTokenFromHeader,
  generateDefaultPassword,
  hashPassword,
  verifyToken,
} from '@/lib/auth'
import { supabaseAdmin } from '@/lib/supabase'
import { CreateUsuarioData } from '@/types'

// GET - Listar usuários (apenas admins)
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
    if (!payload || payload.role !== 'admin') {
      return NextResponse.json(
        { success: false, message: 'Acesso negado' },
        { status: 403 },
      )
    }

    // Buscar usuários com informações do grupo
    const { data: usuarios, error } = await supabaseAdmin
      .from('usuarios')
      .select(
        `
        matricula,
        nome,
        email,
        telefone,
        role,
        grupo_id,
        contrato_id,
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
      .order('nome')

    if (error) {
      console.error('Erro ao buscar usuários:', error)
      return NextResponse.json(
        { success: false, message: 'Erro ao buscar usuários' },
        { status: 500 },
      )
    }

    return NextResponse.json({
      success: true,
      data: usuarios,
    })
  } catch (error) {
    console.error('Erro na API de usuários:', error)
    return NextResponse.json(
      { success: false, message: 'Erro interno do servidor' },
      { status: 500 },
    )
  }
}

// POST - Criar usuário (apenas admins)
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

    const body: CreateUsuarioData = await request.json()
    const { matricula, nome, email, telefone, role, grupo_id, contrato_id } =
      body

    // Validar dados obrigatórios
    if (!matricula || !nome || !email || !telefone) {
      return NextResponse.json(
        { success: false, message: 'Dados obrigatórios não fornecidos' },
        { status: 400 },
      )
    }

    // Gerar senha padrão e hash
    const defaultPassword = generateDefaultPassword(matricula)
    const passwordHash = await hashPassword(defaultPassword)

    // Criar usuário
    const { data: usuario, error } = await supabaseAdmin
      .from('usuarios')
      .insert({
        matricula,
        nome,
        email,
        telefone,
        role: role || 'user',
        grupo_id,
        contrato_id,
        password_hash: passwordHash,
        status: 'ativo',
      })
      .select()
      .single()

    if (error) {
      console.error('Erro ao criar usuário:', error)
      return NextResponse.json(
        { success: false, message: 'Erro ao criar usuário' },
        { status: 500 },
      )
    }

    // Remover senha do retorno
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password_hash, ...usuarioSemSenha } = usuario

    return NextResponse.json({
      success: true,
      data: usuarioSemSenha,
      message: 'Usuário criado com sucesso',
    })
  } catch (error) {
    console.error('Erro na criação de usuário:', error)
    return NextResponse.json(
      { success: false, message: 'Erro interno do servidor' },
      { status: 500 },
    )
  }
}
