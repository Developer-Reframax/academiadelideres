/* eslint-disable camelcase */
import { NextRequest, NextResponse } from 'next/server'

import { extractTokenFromHeader, verifyToken } from '@/lib/auth'
import { supabaseAdmin } from '@/lib/supabase'
import { CreateContratoData } from '@/types'

// GET - Listar contratos
export async function GET(request: NextRequest) {
  try {
    // Verificar autenticação
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

    // Buscar contratos
    const { data: contratos, error } = await supabaseAdmin
      .from('contratos')
      .select(
        'id, codigo, descricao, gerente_geral, gerente_operacoes, coordenador, created_at, updated_at',
      )
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Erro ao buscar contratos:', error)
      return NextResponse.json(
        { success: false, message: 'Erro ao buscar contratos' },
        { status: 500 },
      )
    }

    return NextResponse.json({ success: true, data: contratos })
  } catch (error) {
    console.error('Erro na API de contratos:', error)
    return NextResponse.json(
      { success: false, message: 'Erro interno do servidor' },
      { status: 500 },
    )
  }
}

// POST - Criar contrato (apenas admins)
export async function POST(request: NextRequest) {
  try {
    // Verificar autenticação
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

    const body: CreateContratoData = await request.json()
    const { codigo, descricao, gerente_geral, gerente_operacoes, coordenador } =
      body

    // Validar dados obrigatórios
    if (!codigo || !descricao) {
      return NextResponse.json(
        { success: false, message: 'Campos obrigatórios não fornecidos' },
        { status: 400 },
      )
    }

    // Criar contrato
    const { data: contrato, error } = await supabaseAdmin
      .from('contratos')
      .insert({
        codigo,
        descricao,
        gerente_geral,
        gerente_operacoes,
        coordenador,
      })
      .select()
      .single()

    if (error) {
      console.error('Erro ao criar contrato:', error)
      return NextResponse.json(
        { success: false, message: 'Erro ao criar contrato' },
        { status: 500 },
      )
    }

    return NextResponse.json({
      success: true,
      data: contrato,
      message: 'Contrato criado com sucesso',
    })
  } catch (error) {
    console.error('Erro na criação de contrato:', error)
    return NextResponse.json(
      { success: false, message: 'Erro interno do servidor' },
      { status: 500 },
    )
  }
}
