import { NextRequest, NextResponse } from 'next/server'
import { cacheGet, cacheSet } from '@/lib/db-simple'

// GET /api/analytics - Получить аналитические данные
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const period = searchParams.get('period') || 'today'
    const type = searchParams.get('type') || 'all'

    // Кэш ключ
    const cacheKey = `analytics:${period}:${type}`
    
    // Пробуем получить из кэша
    const cached = await cacheGet(cacheKey)
    if (cached) {
      return NextResponse.json(cached)
    }

    // Получаем данные из логов (используем существующий API логов)
    const logsResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3004'}/api/logs?limit=100`)
    const logsData = logsResponse.ok ? await logsResponse.json() : { data: [] }
    const logs = logsData.data || []

    // Фильтруем по периоду
    const now = new Date()
    let startDate: Date
    
    switch (period) {
      case 'today':
        startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate())
        break
      case 'week':
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
        break
      case 'month':
        startDate = new Date(now.getFullYear(), now.getMonth(), 1)
        break
      default:
        startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate())
    }

    const filteredLogs = logs.filter(log => new Date(log.timestamp) >= startDate)

    // Считаем статистику
    const visits = filteredLogs.filter(log => log.type === 'visit')
    const actions = filteredLogs.filter(log => log.type === 'action')
    const errors = filteredLogs.filter(log => log.type === 'error')

    // Уникальные пользователи
    const uniqueUsers = new Set(visits.map(log => log.userId)).size

    // Статистика браузеров
    const browserStats = visits.reduce((acc: any, log: any) => {
      const browser = log.browser || 'Unknown'
      if (!acc[browser]) {
        acc[browser] = { visits: 0, actions: 0, errors: 0 }
      }
      acc[browser].visits++
      return acc
    }, {})

    // Добавляем действия и ошибки к статистике браузеров
    actions.forEach(log => {
      const browser = log.browser || 'Unknown'
      if (browserStats[browser]) {
        browserStats[browser].actions++
      }
    })

    errors.forEach(log => {
      const browser = log.browser || 'Unknown'
      if (browserStats[browser]) {
        browserStats[browser].errors++
      }
    })

    // Статистика ОС
    const osStats = visits.reduce((acc: any, log: any) => {
      const os = log.os || 'Unknown'
      if (!acc[os]) {
        acc[os] = { visits: 0, actions: 0, errors: 0 }
      }
      acc[os].visits++
      return acc
    }, {})

    // Добавляем действия и ошибки к статистике ОС
    actions.forEach(log => {
      const os = log.os || 'Unknown'
      if (osStats[os]) {
        osStats[os].actions++
      }
    })

    errors.forEach(log => {
      const os = log.os || 'Unknown'
      if (osStats[os]) {
        osStats[os].errors++
      }
    })

    // Детализация по типам действий
    const actionsByType = actions.reduce((acc: any, log: any) => {
      acc[log.action] = (acc[log.action] || 0) + 1
      return acc
    }, {})

    // Детализация по типам ошибок
    const errorsByType = errors.reduce((acc: any, log: any) => {
      acc[log.action] = (acc[log.action] || 0) + 1
      return acc
    }, {})

    const result = {
      visits: {
        total: visits.length,
        today: visits.length,
        thisWeek: visits.length,
        thisMonth: visits.length,
        uniqueUsers: uniqueUsers,
        averageSessionDuration: 180
      },
      actions: {
        total: actions.length,
        today: actions.length,
        thisWeek: actions.length,
        thisMonth: actions.length,
        byType: actionsByType
      },
      errors: {
        total: errors.length,
        today: errors.length,
        thisWeek: errors.length,
        thisMonth: errors.length,
        byType: errorsByType
      },
      browsers: browserStats,
      os: osStats,
      recentLogs: filteredLogs.slice(0, 50).map((log: any) => ({
        id: log.id,
        type: log.type,
        action: log.action,
        timestamp: log.timestamp,
        browser: log.browser,
        os: log.os,
        userId: log.userId
      }))
    }

    // Сохраняем в кэш на 2 минуты
    await cacheSet(cacheKey, result, 120)

    return NextResponse.json(result)
  } catch (error) {
    console.error('Analytics GET error:', error)
    return NextResponse.json(
      { error: 'Internal server error', details: (error as Error).message },
      { status: 500 }
    )
  }
}