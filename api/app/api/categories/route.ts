import { NextRequest, NextResponse } from 'next/server'
import { prisma, cacheSet, cacheGet } from '@/lib/db'

// GET /api/categories - Получить все категории
export async function GET(request: NextRequest) {
  try {
    // Кэш ключ
    const cacheKey = 'categories:all'
    
    // Пробуем получить из кэша
    const cached = await cacheGet(cacheKey)
    if (cached) {
      return NextResponse.json(cached)
    }

    const categories = await prisma.category.findMany({
      include: {
        _count: {
          select: {
            products: {
              where: {
                active: true,
                displayOnSite: true
              }
            }
          }
        }
      },
      orderBy: {
        name: 'asc'
      }
    })

    const result = {
      data: categories
    }

    // Сохраняем в кэш на 10 минут
    await cacheSet(cacheKey, result, 600)

    return NextResponse.json(result)
  } catch (error) {
    console.error('Categories GET error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// POST /api/categories - Создать категорию (только для админа)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    const category = await prisma.category.create({
      data: {
        name: body.name,
        slug: body.slug,
        description: body.description
      },
      include: {
        _count: {
          select: {
            products: true
          }
        }
      }
    })

    // Очищаем кэш
    await cacheSet('categories:*', null, 1)

    return NextResponse.json(category, { status: 201 })
  } catch (error) {
    console.error('Categories POST error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
