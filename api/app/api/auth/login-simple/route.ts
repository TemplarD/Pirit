import { NextRequest, NextResponse } from 'next/server'

// Упрощенный login для теста
export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()
    
    console.log('Login attempt:', email)
    
    if (email === 'admin@grindermaster.ru' && password === 'admin123') {
      return NextResponse.json({
        success: true,
        token: 'test-token-123',
        user: {
          id: '1',
          email: 'admin@grindermaster.ru',
          name: 'Administrator',
          role: 'ADMIN'
        }
      })
    }
    
    return NextResponse.json({
      error: 'Неверный email или пароль'
    }, { status: 401 })
    
  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json({
      error: 'Внутренняя ошибка сервера'
    }, { status: 500 })
  }
}
