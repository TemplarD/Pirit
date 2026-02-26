import { NextRequest, NextResponse } from 'next/server'

// Middleware для безопасности (упрощенная версия)
export async function middleware(request: NextRequest) {
  const ip = request.ip || 
             request.headers.get('x-forwarded-for')?.split(',')[0] || 
             request.headers.get('x-real-ip') || 
             'unknown'

  // Логирование всех запросов
  console.log(`📝 ${request.method} ${request.url} from ${ip}`)

  // Базовая защита от DDoS (простой rate limiting по памяти)
  const rateLimitKey = `rate_limit_${ip}`
  const lastRequest = globalThis[rateLimitKey] || 0
  const now = Date.now()
  
  // 100 запросов в час
  if (now - lastRequest < 360) { // 3.6 секунды между запросами = 1000 в час
    return NextResponse.json(
      { error: 'Too many requests' },
      { status: 429 }
    )
  }
  
  globalThis[rateLimitKey] = now

  // Проверка IP адреса (только для защищенных эндпоинтов)
  if (request.nextUrl.pathname.startsWith('/api/')) {
    // Публичные эндпоинты (доступны всем)
    const publicPaths = [
      '/api/health',
      '/api/auth/login',
      '/api/public',
      '/api/products',  // Товары для всех
      '/api/services',  // Услуги для всех
      '/api/categories', // Категории для всех
      '/api/requests'   // Заявки от клиентов
    ]
    
    // Защищенные эндпоинты (только по IP)
    const protectedPaths = [
      '/api/admin',
      '/api/users',
      '/api/settings'
    ]
    
    const isPublic = publicPaths.some(path => request.nextUrl.pathname.startsWith(path))
    const isProtected = protectedPaths.some(path => request.nextUrl.pathname.startsWith(path))
    
    // Белые IP для разработки
    const ALLOWED_IPS = [
      '127.0.0.1',
      'localhost',
      '::1',
      // Docker сеть
      '172.16.0.0/12',
      '10.0.0.0/8',
      '192.168.0.0/16'
    ]
    
    // Проверяем IP только для защищенных эндпоинтов
    if (isProtected && !ALLOWED_IPS.includes(ip)) {
      console.log('🔒 BLOCKED_IP_ACCESS', { 
        ip, 
        url: request.url, 
        userAgent: request.headers.get('user-agent') 
      })
      
      return NextResponse.json(
        { error: 'Access denied' },
        { status: 403 }
      )
    }
  }

  // Добавление заголовков безопасности
  const response = NextResponse.next()
  
  response.headers.set('X-Frame-Options', 'DENY')
  response.headers.set('X-Content-Type-Options', 'nosniff')
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin')
  response.headers.set('X-XSS-Protection', '1; mode=block')
  
  // CORS для API
  if (request.nextUrl.pathname.startsWith('/api/')) {
    response.headers.set('Access-Control-Allow-Origin', '*')
    response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
    response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization')
  }

  return response
}

export const config = {
  matcher: [
    '/api/:path*',
    '/admin/:path*',
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ]
}
