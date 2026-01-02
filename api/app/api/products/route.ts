import { NextRequest, NextResponse } from 'next/server'
import { prisma, cacheSet, cacheGet } from '@/lib/db-simple'

// GET /api/products - Получить все товары
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category')
    const featured = searchParams.get('featured')
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')

    // Кэш ключ
    const cacheKey = `products:${category}:${featured}:${page}:${limit}`
    
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
      where.category = {
        slug: category
      }
    }

    if (featured === 'true') {
      where.featured = true
    }

    // Запрос в БД
    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        include: {
          category: true
        },
        orderBy: [
          { sortOrder: 'asc' },
          { createdAt: 'desc' }
        ],
        skip: (page - 1) * limit,
        take: limit
      }),
      prisma.product.count({ where })
    ])

    const result = {
      data: products,
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
    console.error('Products GET error:', error)
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    )
  }
}
