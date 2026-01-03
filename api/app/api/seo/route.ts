import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const skip = (page - 1) * limit

    // Возвращаем моковые данные для SEO, так как таблица еще не создана
    const mockData = [
      {
        id: '1',
        page: 'home',
        title: 'ГриндерМастер - Промышленное оборудование',
        description: 'Продажа и ремонт промышленных гриндеров и шлифовальных станков',
        keywords: 'гриндер, шлифовальный станок, промышленное оборудование, ремонт гриндеров',
        canonical: 'https://grindermaster.ru',
        active: true,
        ogTitle: 'ГриндерМастер - Промышленное оборудование',
        ogDescription: 'Продажа и ремонт промышленных гриндеров и шлифовальных станков',
        ogImage: '/images/og-home.jpg',
        twitterCard: 'summary_large_image',
        twitterTitle: 'ГриндерМастер - Промышленное оборудование',
        twitterDescription: 'Продажа и ремонт промышленных гриндеров и шлифовальных станков',
        twitterImage: '/images/twitter-home.jpg',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: '2',
        page: 'products',
        title: 'Товары - ГриндерМастер',
        description: 'Каталог промышленных гриндеров и шлифовальных станков',
        keywords: 'гриндеры, шлифовальные станки, каталог, промышленное оборудование',
        canonical: 'https://grindermaster.ru/products',
        active: true,
        ogTitle: 'Товары - ГриндерМастер',
        ogDescription: 'Каталог промышленных гриндеров и шлифовальных станков',
        ogImage: '/images/og-products.jpg',
        twitterCard: 'summary_large_image',
        twitterTitle: 'Товары - ГриндерМастер',
        twitterDescription: 'Каталог промышленных гриндеров и шлифовальных станков',
        twitterImage: '/images/twitter-products.jpg',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: '3',
        page: 'services',
        title: 'Услуги - ГриндерМастер',
        description: 'Профессиональный ремонт и диагностика промышленного оборудования',
        keywords: 'ремонт гриндеров, диагностика оборудования, сервисное обслуживание',
        canonical: 'https://grindermaster.ru/services',
        active: true,
        ogTitle: 'Услуги - ГриндерМастер',
        ogDescription: 'Профессиональный ремонт и диагностика промышленного оборудования',
        ogImage: '/images/og-services.jpg',
        twitterCard: 'summary_large_image',
        twitterTitle: 'Услуги - ГриндерМастер',
        twitterDescription: 'Профессиональный ремонт и диагностика промышленного оборудования',
        twitterImage: '/images/twitter-services.jpg',
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
    console.error('SEO GET Error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch SEO data' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Возвращаем созданный SEO с mock ID
    const newSEO = {
      id: Date.now().toString(),
      ...body,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }

    return NextResponse.json({ data: newSEO }, { status: 201 })
  } catch (error) {
    console.error('SEO POST Error:', error)
    return NextResponse.json(
      { error: 'Failed to create SEO data' },
      { status: 500 }
    )
  }
}
