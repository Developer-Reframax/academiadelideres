/* eslint-disable @typescript-eslint/no-explicit-any */
import { createClient } from '@supabase/supabase-js'
import jwt from 'jsonwebtoken'
import { NextRequest, NextResponse } from 'next/server'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!
const jwtSecret = process.env.JWT_SECRET!

const supabase = createClient(supabaseUrl, supabaseServiceKey)

export interface AuthenticatedUser {
  matricula: number
  nome: string
  email: string
  telefone: string
  role: string
  status: string
  contrato_id?: number
  grupo_id?: number
}

export interface JWTVerificationResult {
  success: boolean
  user?: AuthenticatedUser
  error?: string
  status?: number
}

// Rotas que não precisam de autenticação
const publicRoutes = ['/login']

// Rotas que precisam de autenticação
const protectedRoutes = [
  '/user/dashboard',
  '/user/desafios',
  '/user/riscos-criticos',
  '/user/abrangencia-acidentes',
  '/admin/usuarios',
  '/admin/grupos',
  '/admin/contratos',
]

// Rotas que só admins podem acessar
const adminRoutes = ['/admin/usuarios', '/admin/grupos', '/admin/contratos']

/**
 * Middleware para verificar JWT token
 */
export async function verifyJWTToken(
  request: NextRequest,
): Promise<JWTVerificationResult> {
  try {
    console.log('JWT Middleware - Starting verification')
    const authHeader = request.headers.get('authorization')
    console.log(
      'JWT Middleware - Auth header:',
      authHeader ? 'present' : 'missing',
    )

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      console.log('JWT Middleware - No valid auth header')
      return {
        success: false,
        error: 'Token de autorização não fornecido',
        status: 401,
      }
    }

    const token = authHeader.substring(7)
    console.log('JWT Middleware - Token extracted, length:', token.length)

    // Verificar e decodificar JWT
    let decoded: any
    try {
      console.log('JWT Middleware - Verifying token with secret:', !!jwtSecret)

      // Verificação adicional para garantir que jwtSecret não seja undefined
      if (!jwtSecret) {
        console.log('JWT Middleware - JWT Secret not available')
        return {
          success: false,
          error: 'Configuração de segurança não disponível',
          status: 500,
        }
      }

      decoded = jwt.verify(token, jwtSecret)
      console.log(
        'JWT Middleware - Token verified successfully, user:',
        decoded.matricula,
      )
    } catch (jwtError) {
      console.log('JWT Middleware - Token verification failed:', jwtError)
      return {
        success: false,
        error: 'Token inválido ou expirado',
        status: 401,
      }
    }

    // Verificar se o usuário ainda existe e está ativo
    const { data: user, error } = await supabase
      .from('usuarios')
      .select(
        'matricula, nome, email, telefone, role, status, contrato_id, grupo_id',
      )
      .eq('matricula', decoded.matricula)
      .eq('status', 'ativo')
      .single()

    if (error || !user) {
      return {
        success: false,
        error: 'Usuário não encontrado ou inativo',
        status: 401,
      }
    }

    return {
      success: true,
      user: {
        matricula: user.matricula,
        nome: user.nome,
        email: user.email,
        telefone: user.telefone,
        role: user.role,
        status: user.status,
        contrato_id: user.contrato_id,
        grupo_id: user.grupo_id,
      },
    }
  } catch (error) {
    console.error('JWT verification error:', error)
    return {
      success: false,
      error: 'Erro interno na verificação do token',
      status: 500,
    }
  }
}

/**
 * Middleware para verificar se o usuário é administrador
 */
export async function requireAdmin(
  user: AuthenticatedUser,
): Promise<{ success: boolean; error?: string; status?: number }> {
  if (user.role !== 'admin') {
    return {
      success: false,
      error: 'Acesso negado - privilégios de administrador necessários',
      status: 403,
    }
  }

  return { success: true }
}

/**
 * Middleware para verificar se o usuário pode acessar o recurso
 * (próprio perfil ou é admin)
 */
export function canAccessResource(
  user: AuthenticatedUser,
  targetMatricula: string,
): boolean {
  return user.role === 'admin' || user.matricula.toString() === targetMatricula
}

/**
 * Helper para criar resposta de erro de autenticação
 */
export function createAuthErrorResponse(
  error: string,
  status: number = 401,
): NextResponse {
  return NextResponse.json({ success: false, message: error }, { status })
}

/**
 * Wrapper para rotas protegidas
 */
export function withAuth(
  handler: (
    request: NextRequest,
    user: AuthenticatedUser,
  ) => Promise<NextResponse>,
) {
  return async (request: NextRequest): Promise<NextResponse> => {
    const authResult = await verifyJWTToken(request)

    if (!authResult.success) {
      return createAuthErrorResponse(authResult.error!, authResult.status!)
    }

    return handler(request, authResult.user!)
  }
}

/**
 * Wrapper para rotas que requerem privilégios de admin
 */
export function withAdminAuth(
  handler: (
    request: NextRequest,
    user: AuthenticatedUser,
  ) => Promise<NextResponse>,
) {
  return async (request: NextRequest): Promise<NextResponse> => {
    const authResult = await verifyJWTToken(request)

    if (!authResult.success) {
      return createAuthErrorResponse(authResult.error!, authResult.status!)
    }

    const adminCheck = await requireAdmin(authResult.user!)
    if (!adminCheck.success) {
      return createAuthErrorResponse(adminCheck.error!, adminCheck.status!)
    }

    return handler(request, authResult.user!)
  }
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  console.log('🔒 [MIDDLEWARE] Processando rota:', pathname)

  // Interceptar e bloquear requisições do Vite (que não devem existir em projetos Next.js)
  if (pathname.startsWith('/@vite/')) {
    console.log(
      '🚫 [MIDDLEWARE] Bloqueando requisição Vite (projeto usa Next.js):',
      pathname,
    )
    return new NextResponse('Not Found - This is a Next.js project, not Vite', {
      status: 404,
      headers: {
        'Content-Type': 'text/plain',
      },
    })
  }

  // Permitir acesso a arquivos estáticos e API routes
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.includes('.')
  ) {
    console.log(
      '🔓 [MIDDLEWARE] Permitindo acesso a arquivo estático/API:',
      pathname,
    )
    return NextResponse.next()
  }

  // Verificar se é uma rota pública
  if (publicRoutes.includes(pathname)) {
    console.log('🔓 [MIDDLEWARE] Rota pública permitida:', pathname)
    return NextResponse.next()
  }

  // Para navegação client-side, o middleware não consegue acessar sessionStorage
  // Então vamos ser mais permissivo e deixar o AuthContext gerenciar a autenticação
  if (protectedRoutes.some((route) => pathname.startsWith(route))) {
    console.log('🔐 [MIDDLEWARE] Rota protegida detectada:', pathname)

    const authHeader = request.headers.get('authorization')
    console.log(
      '🔑 [MIDDLEWARE] Authorization header:',
      authHeader ? 'PRESENTE' : 'AUSENTE',
    )

    // Se há Authorization header, verificar token
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.substring(7)
      console.log('🔍 [MIDDLEWARE] Verificando token do header...')

      try {
        const payload = jwt.verify(token, jwtSecret)
        console.log(
          '✅ [MIDDLEWARE] Token válido para usuário:',
          (payload as any).nome,
        )

        // Verificar se é uma rota que só admins podem acessar
        if (adminRoutes.some((route) => pathname.startsWith(route))) {
          console.log(
            '👑 [MIDDLEWARE] Verificando permissão de admin para:',
            pathname,
          )
          if ((payload as any).role !== 'admin') {
            console.log(
              '❌ [MIDDLEWARE] Usuário não é admin, redirecionando para dashboard',
            )
            return NextResponse.redirect(
              new URL('/user/dashboard', request.url),
            )
          }
          console.log('✅ [MIDDLEWARE] Usuário é admin, acesso permitido')
        }

        // Adicionar informações do usuário aos headers para uso nas páginas
        const requestHeaders = new Headers(request.headers)
        requestHeaders.set(
          'x-user-matricula',
          (payload as any).matricula.toString(),
        )
        requestHeaders.set('x-user-nome', (payload as any).nome)
        requestHeaders.set('x-user-email', (payload as any).email)
        requestHeaders.set('x-user-role', (payload as any).role)

        console.log(
          '✅ [MIDDLEWARE] Acesso autorizado com token válido para:',
          pathname,
        )
        return NextResponse.next({
          request: {
            headers: requestHeaders,
          },
        })
      } catch {
        console.log(
          '❌ [MIDDLEWARE] Token inválido no header, permitindo acesso (AuthContext verificará)',
        )
        // Não redirecionar aqui, deixar o AuthContext gerenciar
        return NextResponse.next()
      }
    }

    // Para navegação client-side sem Authorization header, permitir acesso
    // O AuthContext verificará a autenticação usando sessionStorage
    console.log(
      '🔄 [MIDDLEWARE] Navegação client-side detectada, permitindo acesso (AuthContext verificará)',
    )
    return NextResponse.next()
  }

  // Redirecionar para dashboard se estiver na raiz
  if (pathname === '/') {
    console.log('🏠 [MIDDLEWARE] Redirecionando raiz para dashboard')
    return NextResponse.redirect(new URL('/user/dashboard', request.url))
  }

  console.log('🔓 [MIDDLEWARE] Permitindo acesso padrão para:', pathname)
  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}
