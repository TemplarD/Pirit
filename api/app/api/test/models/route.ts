import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

// Проверка доступных моделей
export async function GET(request: NextRequest) {
  try {
    const prisma = new PrismaClient()
    
    // Проверяем, какие модели доступны
    const models = Object.keys(prisma as any).filter(key => 
      key !== 'constructor' && 
      key !== '_extensions' && 
      typeof (prisma as any)[key] === 'object'
    )
    
    return NextResponse.json({
      availableModels: models,
      timestamp: new Date().toISOString()
    })
  } catch (error: any) {
    console.error('Models check error:', error)
    return NextResponse.json({
      error: error.message,
      timestamp: new Date().toISOString()
    }, { status: 500 })
  }
}
