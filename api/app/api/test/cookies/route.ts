import { NextRequest, NextResponse } from 'next/server'

// GET /api/test/cookies - Проверить cookies
export async function GET(request: NextRequest) {
  const cookies = request.cookies.getAll()
  
  return NextResponse.json({
    cookies: cookies.map(c => ({
      name: c.name,
      value: c.value.substring(0, 10) + '...' // Скрываем полное значение
    })),
    count: cookies.length,
    timestamp: new Date().toISOString()
  })
}

// POST /api/test/cookies - Установить test cookie
export async function POST(request: NextRequest) {
  const response = NextResponse.json({
    message: 'Test cookie установлен',
    timestamp: new Date().toISOString()
  })
  
  response.cookies.set('test_cookie', 'test_value_' + Date.now(), {
    httpOnly: true,
    secure: true,
    sameSite: 'strict',
    maxAge: 3600
  })
  
  return response
}
