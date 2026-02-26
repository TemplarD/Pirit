import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

// POST /api/requests - Создать заявку (публичный)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Валидация обязательных полей
    if (!body.name || !body.phone || !body.type) {
      return NextResponse.json(
        { error: 'Name, phone and type are required' },
        { status: 400 }
      )
    }

    const requestData = await prisma.request.create({
      data: {
        name: body.name,
        phone: body.phone,
        email: body.email,
        type: body.type, // 'PRODUCT' или 'SERVICE'
        productId: body.productId,
        serviceId: body.serviceId,
        message: body.message,
        status: 'NEW'
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

    return NextResponse.json(requestData, { status: 201 })
  } catch (error) {
    console.error('Requests POST error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// GET /api/requests - Получить заявки (только для админа)
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
    console.error('Requests GET error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
