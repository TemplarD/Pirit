import crypto from 'crypto'
import bcrypt from 'bcryptjs'
import { authenticator } from 'otplib'

// Хеширование пароля
export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12)
}

// Проверка пароля
export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash)
}

// Генерация токена
export function generateToken(length: number = 32): string {
  return crypto.randomBytes(length).toString('hex')
}

// Генерация секрета для Google Authenticator
export function generateGoogleAuthSecret(): string {
  return authenticator.generateSecret()
}

// Верификация TOTP кода
export function verifyTOTP(token: string, secret: string): boolean {
  try {
    return authenticator.verify({ token, secret })
  } catch (error) {
    console.error('TOTP verification error:', error)
    return false
  }
}

// Генерация backup кодов
export function generateBackupCodes(count: number = 10): string[] {
  const codes = []
  for (let i = 0; i < count; i++) {
    codes.push(Math.floor(10000000 + Math.random() * 90000000).toString())
  }
  return codes
}

// Проверка сессии
export async function verifySession(token: string): Promise<any> {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3004'}/api/auth/verify`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    })
    
    if (response.ok) {
      return await response.json()
    }
    return null
  } catch (error) {
    console.error('Session verification error:', error)
    return null
  }
}
