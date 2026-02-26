import { NextRequest, NextResponse } from 'next/server'

// Health check endpoint
export async function GET(request: NextRequest) {
  return NextResponse.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    version: '1.0.0',
    endpoints: {
      api: '/api',
      admin: '/admin',
      health: '/api/health'
    },
    security: {
      rateLimit: 'enabled',
      ipWhitelist: 'enabled',
      cors: 'enabled'
    }
  })
}
