interface TelegramMessage {
  chat_id: string
  text: string
  parse_mode?: 'HTML' | 'Markdown'
}

class TelegramService {
  private botToken: string
  private baseUrl: string

  constructor() {
    this.botToken = process.env.TELEGRAM_BOT_TOKEN || ''
    this.baseUrl = `https://api.telegram.org/bot${this.botToken}`
  }

  // Отправка сообщения
  async sendMessage(chatId: string, text: string, parseMode?: 'HTML' | 'Markdown'): Promise<boolean> {
    if (!this.botToken) {
      console.log('🤖 Telegram бот не настроен. Сообщение для', chatId, ':', text)
      return false
    }

    try {
      const message: TelegramMessage = {
        chat_id: chatId,
        text,
        parse_mode: parseMode
      }

      const response = await fetch(`${this.baseUrl}/sendMessage`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(message)
      })

      if (!response.ok) {
        const error = await response.text()
        console.error('❌ Ошибка отправки в Telegram:', error)
        return false
      }

      const result = await response.json() as any
      return result.ok
    } catch (error) {
      console.error('❌ Ошибка отправки в Telegram:', error)
      return false
    }
  }

  // Отправка кода двухфакторной аутентификации
  async send2FACode(telegramId: string, code: string, email: string): Promise<boolean> {
    const message = `🔐 <b>Код подтверждения</b>

📧 <i>Для входа в админ-панель GrinderMaster</i>
👤 <b>Email:</b> <code>${email}</code>
🔢 <b>Код:</b> <code>${code}</code>

⏰ Код действителен 5 минут

🚫 <i>Никому не сообщайте этот код!</i>`

    return this.sendMessage(telegramId, message, 'HTML')
  }

  // Отправка уведомления об успешном входе
  async sendLoginNotification(telegramId: string, email: string, ip?: string): Promise<boolean> {
    const message = `✅ <b>Успешный вход в админ-панель</b>

👤 <b>Email:</b> <code>${email}</code>
🌐 <b>IP:</b> <code>${ip || 'неизвестно'}</code>
🕐 <b>Время:</b> <code>${new Date().toLocaleString('ru-RU')}</code>

🔒 Если это не вы - срочно смените пароль!`

    return this.sendMessage(telegramId, message, 'HTML')
  }

  // Привязка Telegram к аккаунту
  async sendBindingCode(telegramId: string, code: string, email: string): Promise<boolean> {
    const message = `🔗 <b>Привязка Telegram к аккаунту</b>

👤 <b>Email:</b> <code>${email}</code>
🔢 <b>Код привязки:</b> <code>${code}</code>

⏰ Код действителен 10 минут

💡 <i>После ввода кода ваш Telegram будет привязан к аккаунту для двухфакторной аутентификации</i>`

    return this.sendMessage(telegramId, message, 'HTML')
  }

  // Проверка валидности токена бота
  async checkBotToken(): Promise<boolean> {
    if (!this.botToken) {
      return false
    }

    try {
      const response = await fetch(`${this.baseUrl}/getMe`)
      if (!response.ok) {
        return false
      }

      const result = await response.json() as any
      return result.ok
    } catch (error) {
      console.error('❌ Ошибка проверки токена Telegram:', error)
      return false
    }
  }

  // Получение информации о боте
  async getBotInfo(): Promise<any> {
    if (!this.botToken) {
      return null
    }

    try {
      const response = await fetch(`${this.baseUrl}/getMe`)
      if (!response.ok) {
        return null
      }

      const result = await response.json() as any
      return result.ok ? result.result : null
    } catch (error) {
      console.error('❌ Ошибка получения информации о боте:', error)
      return null
    }
  }
}

export const telegramService = new TelegramService()
