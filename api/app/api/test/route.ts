import { NextRequest, NextResponse } from 'next/server'

// GET /api/test - Тестовый эндпоинт без БД
export async function GET(request: NextRequest) {
  return NextResponse.json({
    message: 'API работает!',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
    databaseUrl: process.env.DATABASE_URL ? 'настроен' : 'не настроен'
  })
}
