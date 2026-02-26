import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { telegramService } from '@/lib/telegram'
import crypto from 'crypto'

// POST /api/auth/telegram/bind - Привязка Telegram к аккаунту
export async function POST(request: NextRequest) {
  try {
    const { email, telegramId, code } = await request.json()

    if (!email || !telegramId) {
      return NextResponse.json(
        { error: 'Email и Telegram ID обязательны' },
        { status: 400 }
      )
    }

    // Проверяем пользователя
    const user = await prisma.user.findUnique({
      where: { email }
    })

    if (!user) {
      return NextResponse.json(
        { error: 'Пользователь не найден' },
        { status: 404 }
      )
    }

    if (!code) {
      // Генерируем код привязки
      const bindingCode = Math.floor(100000 + Math.random() * 900000).toString()
      const expires = new Date()
      expires.setMinutes(expires.getMinutes() + 10)

      // Сохраняем код в сессию
      const sessionToken = crypto.randomUUID()
      const sessionExpiresAt = new Date()
      sessionExpiresAt.setHours(sessionExpiresAt.getHours() + 1)

      await prisma.authSession.create({
        data: {
          userId: user.id,
          email: user.email,
          token: sessionToken,
          twoFactorCode: bindingCode,
          twoFactorExpires: expires,
          expiresAt: sessionExpiresAt
        }
      })

      // Отправляем код в Telegram
      await telegramService.sendBindingCode(telegramId, bindingCode, email)

      return NextResponse.json({
        requiresCode: true,
        message: 'Код привязки отправлен в Telegram',
        sessionToken
      })
    } else {
      // Проверяем код привязки
      const session = await prisma.authSession.findFirst({
        where: {
          email,
          token: request.headers.get('Authorization')?.replace('Bearer ', ''),
          twoFactorCode: code,
          twoFactorExpires: { gte: new Date() }
        }
      })

      if (!session) {
        return NextResponse.json(
          { error: 'Неверный или просроченный код' },
          { status: 401 }
        )
      }

      // Привязываем Telegram к пользователю
      await prisma.user.update({
        where: { id: session.userId },
        data: { telegramId }
      })

      // Очищаем сессию
      await prisma.authSession.delete({
        where: { id: session.id }
      })

      return NextResponse.json({
        success: true,
        message: 'Telegram успешно привязан к аккаунту'
      })
    }
  } catch (error) {
    console.error('Telegram bind error:', error)
    return NextResponse.json(
      { error: 'Внутренняя ошибка сервера' },
      { status: 500 }
    )
  }
}

// DELETE /api/auth/telegram/unbind - Отвязка Telegram
export async function DELETE(request: NextRequest) {
  try {
    const token = request.headers.get('Authorization')?.replace('Bearer ', '')
    
    if (!token) {
      return NextResponse.json(
        { error: 'Токен отсутствует' },
        { status: 401 }
      )
    }

    // Ищем сессию
    const session = await prisma.authSession.findUnique({
      where: { token }
    })

    if (!session || !session.isActive || session.expiresAt < new Date()) {
      return NextResponse.json(
        { error: 'Сессия недействительна' },
        { status: 401 }
      )
    }

    // Отвязываем Telegram
    await prisma.user.update({
      where: { id: session.userId },
      data: { telegramId: null }
    })

    return NextResponse.json({
      success: true,
      message: 'Telegram успешно отвязан от аккаунта'
    })
  } catch (error) {
    console.error('Telegram unbind error:', error)
    return NextResponse.json(
      { error: 'Внутренняя ошибка сервера' },
      { status: 500 }
    )
  }
}
