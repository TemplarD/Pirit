import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

// GET /api/assembly-nodes - Получить все узлы сборки
export async function GET(request: NextRequest) {
  try {
    const nodes = await prisma.assemblyNode.findMany({
      include: {
        components: {
          where: { active: true }
        }
      },
      orderBy: { sortOrder: 'asc' }
    })

    return NextResponse.json({ data: nodes })
  } catch (error) {
    console.error('Assembly nodes GET error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// POST /api/assembly-nodes - Создать узел сборки
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    const node = await prisma.assemblyNode.create({
      data: {
        name: body.name,
        slug: body.slug,
        nodeType: body.nodeType,
        description: body.description,
        isRequired: body.isRequired !== false,
        sortOrder: body.sortOrder || 0,
        mountPoints: body.mountPoints,
      },
      include: {
        components: true
      }
    })

    return NextResponse.json({ data: node }, { status: 201 })
  } catch (error) {
    console.error('Assembly nodes POST error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
