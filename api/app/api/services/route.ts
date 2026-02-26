import { NextRequest, NextResponse } from 'next/server'
import { prisma, cacheSet, cacheGet } from '@/lib/db'

// GET /api/services - Получить все услуги
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category')
    const featured = searchParams.get('featured')
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')

    // Кэш ключ
    const cacheKey = `services:${category}:${featured}:${page}:${limit}`
    
    // Пробуем получить из кэша
    const cached = await cacheGet(cacheKey)
    if (cached) {
      return NextResponse.json(cached)
    }

    // Фильтры
    const where: any = {
      active: true,
      displayOnSite: true
    }

    if (category && category !== 'all') {
      where.category = category
    }

    if (featured === 'true') {
      where.featured = true
    }

    // Запрос в БД
    const [services, total] = await Promise.all([
      prisma.service.findMany({
        where,
        orderBy: [
          { sortOrder: 'asc' },
          { createdAt: 'desc' }
        ],
        skip: (page - 1) * limit,
        take: limit
      }),
      prisma.service.count({ where })
    ])

    const result = {
      data: services,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    }

    // Сохраняем в кэш на 5 минут
    await cacheSet(cacheKey, result, 300)

    return NextResponse.json(result)
  } catch (error) {
    console.error('Services GET error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// POST /api/services - Создать услугу (только для админа)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    const service = await prisma.service.create({
      data: {
        name: body.name,
        slug: body.slug,
        description: body.description,
        price: body.price,
        category: body.category || 'diagnostics',
        icon: body.icon,
        duration: body.duration,
        warranty: body.warranty || false,
        featured: body.featured || false,
        active: body.active !== false,
        displayOnSite: body.displayOnSite !== false,
        sortOrder: body.sortOrder || 0
      }
    })

    // Очищаем кэш
    await cacheSet('services:*', null, 1)

    return NextResponse.json(service, { status: 201 })
  } catch (error) {
    console.error('Services POST error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// DELETE /api/services/[id] - Удалить услугу (только для админа)
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id') || request.url.split('/').pop()
    
    if (!id) {
      return NextResponse.json(
        { error: 'Service ID is required' },
        { status: 400 }
      )
    }

    await prisma.service.delete({
      where: { id }
    })

    // Очищаем кэш
    await cacheSet('services:*', null, 1)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Services DELETE error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
