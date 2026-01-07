import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

// Тест с prisma
export async function GET(request: NextRequest) {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        role: true
      },
      take: 5
    })
    
    return NextResponse.json({
      users,
      count: users.length,
      timestamp: new Date().toISOString()
    })
  } catch (error: any) {
    console.error('Prisma test error:', error)
    return NextResponse.json({
      error: error.message,
      timestamp: new Date().toISOString()
    }, { status: 500 })
  }
}
