import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

export const prisma = globalForPrisma.prisma ?? new PrismaClient({
  log: ['query'],
})

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma

// Временное хранилище в памяти (замена Redis)
const memoryCache = new Map<string, { data: any; expiry: number }>()

export async function cacheGet(key: string): Promise<any | null> {
  const item = memoryCache.get(key)
  if (!item) return null
  
  if (Date.now() > item.expiry) {
    memoryCache.delete(key)
    return null
  }
  
  return item.data
}

export async function cacheSet(key: string, value: any, ttl: number = 3600): Promise<void> {
  memoryCache.set(key, {
    data: value,
    expiry: Date.now() + (ttl * 1000)
  })
}
