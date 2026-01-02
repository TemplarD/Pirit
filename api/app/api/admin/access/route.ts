import { NextRequest, NextResponse } from 'next/server'
import { TEMP_ALLOWED_IPS, logSecurityEvent } from '@/lib/db'

// Временный доступ для демонстрации
export async function POST(request: NextRequest) {
  try {
    const { ip, duration = 3600 } = await request.json() // duration в секундах
    
    if (!ip) {
      return NextResponse.json(
        { error: 'IP address is required' },
        { status: 400 }
      )
    }

    // Добавляем IP во временный список
    TEMP_ALLOWED_IPS.add(ip)
    
    // Удаляем через указанное время
    setTimeout(() => {
      TEMP_ALLOWED_IPS.delete(ip)
      console.log(`🔓 Temporary access expired for IP: ${ip}`)
    }, duration * 1000)

    logSecurityEvent('TEMP_ACCESS_GRANTED', { ip, duration })

    return NextResponse.json({
      message: 'Temporary access granted',
      ip,
      duration,
      expiresAt: new Date(Date.now() + duration * 1000).toISOString()
    })
  } catch (error) {
    return NextResponse.json(
      { error: 'Invalid request' },
      { status: 400 }
    )
  }
}

// Показать текущие временные IP (только для админа)
export async function GET(request: NextRequest) {
  const tempIps = Array.from(TEMP_ALLOWED_IPS)
  
  return NextResponse.json({
    temporaryIPs: tempIps,
    count: tempIps.length
  })
}
