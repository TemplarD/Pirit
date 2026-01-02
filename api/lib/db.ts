import { PrismaClient } from '@prisma/client'
import { createClient } from 'redis'
import jwt from 'jsonwebtoken'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

const globalForRedis = globalThis as unknown as {
  redis: ReturnType<typeof createClient> | undefined
}

export const prisma = globalForPrisma.prisma ?? new PrismaClient({
  log: ['query'],
})

export const redis = globalForRedis.redis ?? createClient({
  url: process.env.REDIS_URL || 'redis://:redis123@localhost:6379'
})

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma
if (process.env.NODE_ENV !== 'production') globalForRedis.redis = redis

// Безопасность: проверка IP адреса
export const ALLOWED_IPS = [
  // Ваш белый IP (замените на реальный)
  'YOUR_WHITE_IP',
  // Local сети для разработки
  '127.0.0.1',
  'localhost',
  '::1',
  // Docker сеть
  '172.16.0.0/12',
  '10.0.0.0/8',
  '192.168.0.0/16'
]

// Временные IP для демонстрации (можно добавить через API)
export const TEMP_ALLOWED_IPS = new Set<string>()

// Функция проверки IP
export function isAllowedIP(ip: string): boolean {
  return ALLOWED_IPS.includes(ip) || 
         TEMP_ALLOWED_IPS.has(ip) ||
         ALLOWED_IPS.some(allowed => {
           if (allowed.includes('/')) {
             // CIDR проверка
             const [network, prefix] = allowed.split('/')
             return isInSameNetwork(ip, network, parseInt(prefix))
           }
           return false
         })
}

// Проверка CIDR сети
function isInSameNetwork(ip: string, network: string, prefix: number): boolean {
  const ipParts = ip.split('.').map(Number)
  const networkParts = network.split('.').map(Number)
  
  const mask = (0xFFFFFFFF << (32 - prefix)) >>> 0
  const ipNum = (ipParts[0] << 24) + (ipParts[1] << 16) + (ipParts[2] << 8) + ipParts[3]
  const networkNum = (networkParts[0] << 24) + (networkParts[1] << 16) + (networkParts[2] << 8) + (networkParts[3])
  
  return (ipNum & mask) === (networkNum & mask)
}

// JWT функции
export function generateJWT(payload: any): string {
  return jwt.sign(payload, process.env.JWT_SECRET!, { expiresIn: '7d' })
}

export function verifyJWT(token: string): any {
  return jwt.verify(token, process.env.JWT_SECRET!)
}

// Rate limiting в Redis
export async function checkRateLimit(
  identifier: string, 
  limit: number = 100, 
  window: number = 3600000 // 1 час
): Promise<{ allowed: boolean; remaining: number }> {
  try {
    await redis.connect()
    const key = `rate_limit:${identifier}`
    const current = await redis.incr(key)
    
    if (current === 1) {
      await redis.expire(key, window / 1000)
    }
    
    return {
      allowed: current <= limit,
      remaining: Math.max(0, limit - current)
    }
  } catch (error) {
    console.error('Redis rate limit error:', error)
    return { allowed: true, remaining: limit }
  } finally {
    await redis.disconnect()
  }
}

// Кэширование в Redis
export async function cacheGet(key: string): Promise<any | null> {
  try {
    await redis.connect()
    const value = await redis.get(key)
    return value ? JSON.parse(value) : null
  } catch (error) {
    console.error('Redis cache get error:', error)
    return null
  } finally {
    await redis.disconnect()
  }
}

export async function cacheSet(key: string, value: any, ttl: number = 3600): Promise<void> {
  try {
    await redis.connect()
    await redis.setEx(key, ttl, JSON.stringify(value))
  } catch (error) {
    console.error('Redis cache set error:', error)
  } finally {
    await redis.disconnect()
  }
}

// Логирование безопасности
export function logSecurityEvent(event: string, details: any) {
  const logEntry = {
    timestamp: new Date().toISOString(),
    event,
    details,
    ip: details.ip
  }
  
  console.log('🔒 SECURITY:', JSON.stringify(logEntry))
  
  // В будущем можно отправлять в Sentry или другой сервис
}
