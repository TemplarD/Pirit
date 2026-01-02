import { NextRequest, NextResponse } from 'next/server'
import { prisma, cacheSet, cacheGet } from '@/lib/db'

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
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// POST /api/products - Создать товар (только для админа)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    const product = await prisma.product.create({
      data: {
        name: body.name,
        slug: body.slug,
        description: body.description,
        price: body.price,
        categoryId: body.categoryId,
        imageUrl: body.imageUrl,
        specifications: body.specifications || [],
        featured: body.featured || false,
        active: body.active !== false,
        displayOnSite: body.displayOnSite !== false,
        sortOrder: body.sortOrder || 0
      },
      include: {
        category: true
      }
    })

    // Очищаем кэш
    await cacheSet('products:*', null, 1)

    return NextResponse.json(product, { status: 201 })
  } catch (error) {
    console.error('Products POST error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
