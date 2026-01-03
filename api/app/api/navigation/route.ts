import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const skip = (page - 1) * limit

    // Возвращаем моковые данные для навигации, так как таблица еще не создана
    const mockData = [
      {
        id: '1',
        type: 'header',
        label: 'Главная',
        url: '/',
        position: 'left',
        order: 1,
        active: true,
        isMain: true,
        icon: '🏠',
        description: 'Главная страница сайта',
        external: false,
        target: '_self',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: '2',
        type: 'header',
        label: 'Товары',
        url: '/products',
        position: 'center',
        order: 2,
        active: true,
        isMain: false,
        icon: '📦',
        description: 'Каталог товаров',
        external: false,
        target: '_self',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: '3',
        type: 'header',
        label: 'Услуги',
        url: '/services',
        position: 'center',
        order: 3,
        active: true,
        isMain: false,
        icon: '🔧',
        description: 'Услуги по ремонту и обслуживанию',
        external: false,
        target: '_self',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: '4',
        type: 'header',
        label: 'О нас',
        url: '/about',
        position: 'right',
        order: 4,
        active: true,
        isMain: false,
        icon: 'ℹ️',
        description: 'Информация о компании',
        external: false,
        target: '_self',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: '5',
        type: 'header',
        label: 'Контакты',
        url: '/contacts',
        position: 'right',
        order: 5,
        active: true,
        isMain: false,
        icon: '📞',
        description: 'Контактная информация',
        external: false,
        target: '_self',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: '6',
        type: 'footer',
        label: 'Политика конфиденциальности',
        url: '/privacy',
        position: 'left',
        order: 1,
        active: true,
        isMain: false,
        icon: '🔒',
        description: 'Политика конфиденциальности',
        external: false,
        target: '_self',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    ]

    const total = mockData.length
    const data = mockData.slice(skip, skip + limit)

    return NextResponse.json({
      data,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    })
  } catch (error) {
    console.error('Navigation GET Error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch navigation data' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Возвращаем созданный элемент навигации с mock ID
    const newNavigation = {
      id: Date.now().toString(),
      ...body,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }

    return NextResponse.json({ data: newNavigation }, { status: 201 })
  } catch (error) {
    console.error('Navigation POST Error:', error)
    return NextResponse.json(
      { error: 'Failed to create navigation data' },
      { status: 500 }
    )
  }
}
