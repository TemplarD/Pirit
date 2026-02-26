import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

// GET /api/admin/requests - Получить все заявки (только для админа)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')
    const type = searchParams.get('type')
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')

    // Фильтры
    const where: any = {}

    if (status && status !== 'all') {
      where.status = status
    }

    if (type && type !== 'all') {
      where.type = type
    }

    const [requests, total] = await Promise.all([
      prisma.request.findMany({
        where,
        include: {
          product: {
            include: {
              category: true
            }
          },
          service: true
        },
        orderBy: {
          createdAt: 'desc'
        },
        skip: (page - 1) * limit,
        take: limit
      }),
      prisma.request.count({ where })
    ])

    const result = {
      data: requests,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    }

    return NextResponse.json(result)
  } catch (error) {
    console.error('Admin requests GET error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// PUT /api/admin/requests/:id - Обновить статус заявки
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    const { status } = body

    if (!status) {
      return NextResponse.json(
        { error: 'Status is required' },
        { status: 400 }
      )
    }

    const updatedRequest = await prisma.request.update({
      where: {
        id: params.id
      },
      data: {
        status,
        updatedAt: new Date()
      },
      include: {
        product: {
          include: {
            category: true
          }
        },
        service: true
      }
    })

    return NextResponse.json(updatedRequest)
  } catch (error) {
    console.error('Admin requests PUT error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
