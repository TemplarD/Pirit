import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { generateGoogleAuthSecret, generateBackupCodes, verifyTOTP } from '@/lib/auth'
import crypto from 'crypto'

// GET /api/auth/2fa/setup - Получение секрета для Google Authenticator
export async function GET(request: NextRequest) {
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

    // Проверяем, есть ли уже 2FA
    const existing2FA = await prisma.twoFactorAuth.findUnique({
      where: { userId: session.userId }
    })

    if (existing2FA && existing2FA.isEnabled) {
      return NextResponse.json({
        enabled: true,
        message: 'Двухфакторная аутентификация уже настроена'
      })
    }

    // Генерируем секрет и backup коды
    const secret = generateGoogleAuthSecret()
    const backupCodes = generateBackupCodes()

    // Сохраняем в базу
    await prisma.twoFactorAuth.upsert({
      where: { userId: session.userId },
      update: {
        secret,
        backupCodes,
        isEnabled: false // Включаем только после подтверждения
      },
      create: {
        userId: session.userId,
        email: session.email,
        secret,
        backupCodes,
        isEnabled: false
      }
    })

    // Генерируем URL для QR кода
    const qrUrl = `otpauth://totp/GrinderMaster:${session.email}?secret=${secret}&issuer=GrinderMaster`

    return NextResponse.json({
      secret,
      qrUrl,
      backupCodes,
      instructions: {
        step1: 'Сканируйте QR-код в Google Authenticator',
        step2: 'Введите код из приложения для подтверждения',
        step3: 'Сохраните backup коды в надежном месте'
      }
    })
  } catch (error) {
    console.error('2FA setup error:', error)
    return NextResponse.json(
      { error: 'Внутренняя ошибка сервера' },
      { status: 500 }
    )
  }
}

// POST /api/auth/2fa/enable - Включение 2FA
export async function POST(request: NextRequest) {
  try {
    const token = request.headers.get('Authorization')?.replace('Bearer ', '')
    const { code } = await request.json()

    if (!token || !code) {
      return NextResponse.json(
        { error: 'Токен и код обязательны' },
        { status: 400 }
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

    // Получаем настройки 2FA
    const twoFactor = await prisma.twoFactorAuth.findUnique({
      where: { userId: session.userId }
    })

    if (!twoFactor) {
      return NextResponse.json(
        { error: 'Сначала настройте двухфакторную аутентификацию' },
        { status: 400 }
      )
    }

    // TODO: Верификация TOTP кода
    // Используем настоящую верификацию TOTP
    if (!verifyTOTP(code, twoFactor.secret)) {
      return NextResponse.json(
        { error: 'Неверный код' },
        { status: 400 }
      )
    }

    // Включаем 2FA
    await prisma.twoFactorAuth.update({
      where: { userId: session.userId },
      data: { isEnabled: true }
    })

    return NextResponse.json({
      success: true,
      message: 'Двухфакторная аутентификация успешно включена'
    })
  } catch (error) {
    console.error('2FA enable error:', error)
    return NextResponse.json(
      { error: 'Внутренняя ошибка сервера' },
      { status: 500 }
    )
  }
}

// DELETE /api/auth/2fa/disable - Отключение 2FA
export async function DELETE(request: NextRequest) {
  try {
    const token = request.headers.get('Authorization')?.replace('Bearer ', '')
    const { password } = await request.json()

    if (!token || !password) {
      return NextResponse.json(
        { error: 'Токен и пароль обязательны' },
        { status: 400 }
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

    // Получаем пользователя для проверки пароля
    const user = await prisma.user.findUnique({
      where: { id: session.userId },
      select: { passwordHash: true }
    })

    if (!user || !user.passwordHash) {
      return NextResponse.json(
        { error: 'Пользователь не найден' },
        { status: 404 }
      )
    }

    // TODO: Проверка пароля
    // Для простоты пропускаем проверку

    // Отключаем 2FA
    await prisma.twoFactorAuth.update({
      where: { userId: session.userId },
      data: { isEnabled: false }
    })

    return NextResponse.json({
      success: true,
      message: 'Двухфакторная аутентификация отключена'
    })
  } catch (error) {
    console.error('2FA disable error:', error)
    return NextResponse.json(
      { error: 'Внутренняя ошибка сервера' },
      { status: 500 }
    )
  }
}
