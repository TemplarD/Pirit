import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

// GET /api/components - Получить все компоненты
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category')
    const active = searchParams.get('active')

    const where: any = {}

    if (category && category !== 'all') {
      where.category = category
    }

    if (active !== null && active !== undefined) {
      where.active = active === 'true'
    }

    const components = await prisma.component.findMany({
      where,
      include: {
        assemblyNodes: true
      },
      orderBy: [
        { category: 'asc' },
        { sortOrder: 'asc' }
      ]
    })

    return NextResponse.json({ data: components })
  } catch (error) {
    console.error('Components GET error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// POST /api/components - Создать компонент
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    const component = await prisma.component.create({
      data: {
        name: body.name,
        slug: body.slug,
        category: body.category,
        description: body.description,
        model3DUrl: body.model3DUrl,
        thumbnailUrl: body.thumbnailUrl,
        position: body.position,
        rotation: body.rotation,
        scale: body.scale,
        specifications: body.specifications || {},
        price: body.price,
        stock: body.stock || 0,
        compatibleWith: body.compatibleWith || [],
        active: body.active !== false,
        isDefault: body.isDefault || false,
      },
      include: {
        assemblyNodes: true
      }
    })

    return NextResponse.json({ data: component }, { status: 201 })
  } catch (error) {
    console.error('Components POST error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
