import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

// Verificar se as variáveis de ambiente estão definidas
if (!supabaseUrl || !supabaseAnonKey || !supabaseServiceKey) {
  console.error('❌ [SUPABASE] Variáveis de ambiente não configuradas:')
  console.error('  - SUPABASE_URL:', supabaseUrl ? 'OK' : 'MISSING')
  console.error('  - ANON_KEY:', supabaseAnonKey ? 'OK' : 'MISSING')
  console.error('  - SERVICE_KEY:', supabaseServiceKey ? 'OK' : 'MISSING')
}

// Cliente para uso no frontend (com anon key)
export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Cliente para uso no backend (com service role key) - configuração com timeout e SSL
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
  global: {
    fetch: (url, options = {}) => {
      return fetch(url, {
        ...options,
        signal: AbortSignal.timeout(10000), // 10 segundos timeout
      })
    },
  },
})

// Função para normalizar telefone - remove espaços, parênteses, hífens
export function normalizePhone(phone: string): string {
  if (!phone) return ''

  // Remove todos os caracteres que não são dígitos ou o sinal de +
  const normalized = phone.replace(/[^\d+]/g, '')

  console.log('📱 [NORMALIZE] Telefone original:', phone)
  console.log('📱 [NORMALIZE] Telefone normalizado:', normalized)

  return normalized
}

// Função para testar conectividade com retry
export async function testSupabaseConnection(retries = 3): Promise<boolean> {
  for (let i = 0; i < retries; i++) {
    try {
      console.log(
        `🔍 [SUPABASE] Testando conectividade (tentativa ${i + 1}/${retries})...`,
      )

      const { error } = await supabaseAdmin
        .from('usuarios')
        .select('count')
        .limit(1)
        .single()

      if (!error) {
        console.log('✅ [SUPABASE] Conectividade OK')
        return true
      }

      console.log(`⚠️ [SUPABASE] Erro na tentativa ${i + 1}:`, error.message)

      // Aguardar antes da próxima tentativa
      if (i < retries - 1) {
        await new Promise((resolve) => setTimeout(resolve, 1000 * (i + 1)))
      }
    } catch (err) {
      console.log(`❌ [SUPABASE] Falha na tentativa ${i + 1}:`, err)

      // Aguardar antes da próxima tentativa
      if (i < retries - 1) {
        await new Promise((resolve) => setTimeout(resolve, 1000 * (i + 1)))
      }
    }
  }

  console.log('❌ [SUPABASE] Todas as tentativas de conectividade falharam')
  return false
}

// Função para buscar usuário - apenas conexão real com Supabase
export async function findUserByPhone(telefone: string) {
  try {
    // Normalizar o telefone de entrada
    const normalizedPhone = normalizePhone(telefone)
    console.log(
      '🔍 [SEARCH] Buscando por telefone normalizado:',
      normalizedPhone,
    )

    console.log('🔍 [SUPABASE] Buscando usuário no Supabase...')
    console.log('🔍 [SUPABASE] URL:', supabaseUrl)
    console.log('🔍 [SUPABASE] Service Key disponível:', !!supabaseServiceKey)

    // Usar o cliente Supabase com configuração SSL apropriada
    const { data, error } = await supabaseAdmin
      .from('usuarios')
      .select('*')
      .eq('telefone', normalizedPhone)
      .maybeSingle()

    if (error) {
      console.log('⚠️ [SUPABASE] Erro na query:', error.message)
      console.log('⚠️ [SUPABASE] Detalhes do erro:', error)
      return {
        data: null,
        error: { message: 'Usuário não encontrado' },
        source: 'supabase',
      }
    }

    if (data) {
      console.log('✅ [SUPABASE] Usuário encontrado no Supabase')
      return { data, error: null, source: 'supabase' }
    }

    console.log('⚠️ [SUPABASE] Usuário não encontrado no Supabase')
    return {
      data: null,
      error: { message: 'Usuário não encontrado' },
      source: 'supabase',
    }
  } catch (error) {
    console.error('💥 [ERROR] Erro ao buscar usuário:', error)
    return {
      data: null,
      error: { message: 'Erro de conectividade com Supabase' },
      source: 'error',
    }
  }
}
