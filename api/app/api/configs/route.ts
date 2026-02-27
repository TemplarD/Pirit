import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

// GET /api/configs - Получить конфигурации
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const isPreset = searchParams.get('preset')
    const isPublic = searchParams.get('public')

    const where: any = {}

    if (isPreset !== null && isPreset !== undefined) {
      where.isPreset = isPreset === 'true'
    }

    if (isPublic !== null && isPublic !== undefined) {
      where.isPublic = isPublic === 'true'
    }

    const configs = await prisma.grinderConfig.findMany({
      where,
      orderBy: { createdAt: 'desc' }
    })

    return NextResponse.json({ data: configs })
  } catch (error) {
    console.error('Configs GET error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// POST /api/configs - Сохранить конфигурацию
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    const config = await prisma.grinderConfig.create({
      data: {
        name: body.name,
        description: body.description,
        configuration: body.configuration,
        basePrice: body.basePrice || 0,
        componentsTotal: body.componentsTotal || 0,
        discount: body.discount || 0,
        totalPrice: body.totalPrice || 0,
        userId: body.userId,
        isPublic: body.isPublic || false,
        isPreset: body.isPreset || false,
        isActive: body.isActive !== false,
      }
    })

    return NextResponse.json({ data: config }, { status: 201 })
  } catch (error) {
    console.error('Configs POST error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
