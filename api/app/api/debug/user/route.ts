import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

// GET /api/debug/user - Отладка пользователя
export async function GET(request: NextRequest) {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        createdAt: true
      }
    })

    return NextResponse.json({
      users,
      count: users.length
    })
  } catch (error: any) {
    console.error('Debug user error:', error)
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    )
  }
}
