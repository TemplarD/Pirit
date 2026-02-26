import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { verifyPassword } from '@/lib/auth'
import { telegramService } from '@/lib/telegram'
import crypto from 'crypto'

// POST /api/auth/login - Вход в систему
export async function POST(request: NextRequest) {
  try {
    const { email, password, telegramCode } = await request.json()

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email и пароль обязательны' },
        { status: 400 }
      )
    }

    // Проверяем пользователя (пока используем существующую модель User)
    const user = await prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        passwordHash: true
        // telegramId: true - временно отключено
      }
    })

    if (!user || !user.passwordHash) {
      return NextResponse.json(
        { error: 'Неверный email или пароль' },
        { status: 401 }
      )
    }

    // Проверяем пароль
    const isValidPassword = await verifyPassword(password, user.passwordHash)
    if (!isValidPassword) {
      return NextResponse.json(
        { error: 'Неверный email или пароль' },
        { status: 401 }
      )
    }

    // Проверяем роль пользователя
    if (user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Доступ запрещен' },
        { status: 403 }
      )
    }

    // Создаем сессию
    const sessionToken = crypto.randomUUID()
    const expiresAt = new Date()
    expiresAt.setHours(expiresAt.getHours() + 24) // 24 часа

    const session = await prisma.authSession.create({
      data: {
        userId: user.id,
        email: user.email,
        token: sessionToken,
        expiresAt
      }
    })

    // Проверяем 2FA если включен
    const ENABLE_2FA = process.env.ENABLE_2FA === 'true' // Флаговое включение 2FA
    const twoFactor = await prisma.twoFactorAuth.findUnique({
      where: { userId: user.id }
    })

    if (ENABLE_2FA && twoFactor && twoFactor.isEnabled) {
      if (!telegramCode) {
        // Генерируем код для Telegram
        const code = Math.floor(100000 + Math.random() * 900000).toString()
        const expires = new Date()
        expires.setMinutes(expires.getMinutes() + 5)

        await prisma.authSession.update({
          where: { id: session.id },
          data: {
            twoFactorCode: code,
            twoFactorExpires: expires
          }
        })

        // Отправляем код в Telegram если привязан
        // if (user.telegramId) {
        //   // await telegramService.send2FACode(user.telegramId, code, email)
        //   console.log(`Telegram 2FA code for ${email}: ${code} (Telegram ID: ${user.telegramId})`)
        // } else {
          console.log('⚠️ Telegram не привязан к аккаунту', email)
          // Если Telegram не привязан, возвращаем код в ответе для тестов
          return NextResponse.json({
            requiresTwoFactor: true,
            sessionId: session.id,
            method: 'telegram',
            debugCode: process.env.NODE_ENV === 'development' ? code : undefined
          })
        // }

        return NextResponse.json({
          requiresTwoFactor: true,
          sessionId: session.id,
          method: 'telegram'
        })
      } else {
        // Проверяем код из Telegram
        if (session.twoFactorCode !== telegramCode || 
            session.twoFactorExpires && session.twoFactorExpires < new Date()) {
          return NextResponse.json(
            { error: 'Неверный или просроченный код' },
            { status: 401 }
          )
        }

        // Очищаем код 2FA
        await prisma.authSession.update({
          where: { id: session.id },
          data: {
            twoFactorCode: null,
            twoFactorExpires: null
          }
        })
      }
    }

    return NextResponse.json({
      success: true,
      token: sessionToken,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role
      }
    })

  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json(
      { error: 'Внутренняя ошибка сервера' },
      { status: 500 }
    )
  }
}
