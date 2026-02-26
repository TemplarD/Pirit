import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

// Тест создания authSession
export async function GET(request: NextRequest) {
  try {
    const session = await prisma.authSession.create({
      data: {
        userId: 'test-user-id',
        email: 'test@example.com',
        token: 'test-token-123',
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000)
      }
    })
    
    return NextResponse.json({
      success: true,
      session,
      timestamp: new Date().toISOString()
    })
  } catch (error: any) {
    console.error('AuthSession test error:', error)
    return NextResponse.json({
      error: error.message,
      timestamp: new Date().toISOString()
    }, { status: 500 })
  }
}
