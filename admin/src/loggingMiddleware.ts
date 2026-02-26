// Middleware для логирования действий в админке

// Глобальные переменные для отслеживания производительности
let pageLoadStartTime = Date.now()
let errorCount = 0
let lastError: string | null = null

// Функция для определения браузера
function detectBrowser(userAgent: string): string {
  if (userAgent.includes('Chrome')) return 'Chrome'
  if (userAgent.includes('Firefox')) return 'Firefox'
  if (userAgent.includes('Safari')) return 'Safari'
  if (userAgent.includes('Edge')) return 'Edge'
  return 'Unknown'
}

// Функция для определения ОС
function detectOS(userAgent: string): string {
  if (userAgent.includes('Windows')) return 'Windows'
  if (userAgent.includes('Mac')) return 'macOS'
  if (userAgent.includes('Linux')) return 'Linux'
  if (userAgent.includes('Ubuntu')) return 'Linux'
  if (userAgent.includes('Android')) return 'Android'
  if (userAgent.includes('iOS')) return 'iOS'
  return 'Unknown'
}

// Отправка лога на сервер
async function sendLog(type: string, action: string, details: any = {}) {
  try {
    const userAgent = navigator.userAgent
    const logData = {
      type,
      action,
      userId: 'admin', // В реальном приложении здесь будет ID текущего пользователя
      browser: detectBrowser(userAgent),
      os: detectOS(userAgent),
      details,
      timestamp: new Date().toISOString()
    }

    await fetch('http://localhost:3000/api/logs', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(logData)
    })
  } catch (error) {
    console.error('Failed to send log:', error)
  }
}

// Логирование ошибок
export function logError(error: Error | string, context?: string) {
  errorCount++
  lastError = error instanceof Error ? error.message : error
  
  sendLog('error', 'javascript_error', {
    message: lastError,
    context,
    stack: error instanceof Error ? error.stack : null,
    errorCount,
    url: window.location.href,
    timestamp: new Date().toISOString()
  })
}

// Логирование производительности
export function logPerformance(metric: string, value: number) {
  sendLog('performance', metric, {
    value,
    url: window.location.href,
    loadTime: Date.now() - pageLoadStartTime
  })
}

// Логирование сетевых ошибок
export function logNetworkError(url: string, status: number, error: string) {
  sendLog('error', 'network_error', {
    url,
    status,
    error,
    timestamp: new Date().toISOString()
  })
}

// Логирование посещений
export function logVisit(page: string, duration?: number) {
  sendLog('visit', 'page_view', {
    page,
    duration,
    loadTime: Date.now() - pageLoadStartTime,
    timestamp: new Date().toISOString()
  })
}

// Логирование действий
export function logAction(action: string, details?: any) {
  sendLog('action', action, {
    ...details,
    timestamp: new Date().toISOString()
  })
}

// Инициализация глобального обработчика ошибок
export function initErrorTracking() {
  // Отслеживание ошибок JavaScript
  window.addEventListener('error', (event) => {
    logError(event.error || event.message, 'Global Error Handler')
  })

  // Отслеживание промисов
  window.addEventListener('unhandledrejection', (event) => {
    logError(event.reason instanceof Error ? event.reason.message : String(event.reason), 'Unhandled Promise Rejection')
  })

  // Отслеживание загрузки страницы
  window.addEventListener('load', () => {
    const loadTime = Date.now() - pageLoadStartTime
    logPerformance('page_load_time', loadTime)
    logVisit(window.location.pathname, loadTime)
  })

  // Отслеживание видимости страницы
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'hidden') {
      logAction('page_hidden', { 
        timeOnPage: Date.now() - pageLoadStartTime 
      })
    } else if (document.visibilityState === 'visible') {
      pageLoadStartTime = Date.now()
      logAction('page_visible')
    }
  })
}

// Получение статистики ошибок
export function getErrorStats() {
  return {
    errorCount,
    lastError,
    uptime: Date.now() - pageLoadStartTime
  }
}

// Логирование CRUD операций
export function logCRUD(operation: 'create' | 'edit' | 'delete', resource: string, resourceId?: any, changes?: any) {
  logAction(`${operation}_${resource}`, {
    resource,
    resourceId,
    changes,
    timestamp: new Date().toISOString()
  })
}

// Автоматическое логирование при загрузке страницы
export function initAdminLogging() {
  // Логируем посещение дашборда
  logVisit('dashboard')
  
  // Логируем информацию о браузере
  const userAgent = navigator.userAgent
  const browser = detectBrowser(userAgent)
  const os = detectOS(userAgent)
  
  logAction('browser_info', {
    browser,
    os,
    userAgent,
    screenResolution: `${screen.width}x${screen.height}`,
    language: navigator.language
  })

  // Логируем время сессии
  const sessionStart = Date.now()
  
  // Отправляем лог при уходе со страницы
  const handleBeforeUnload = () => {
    const sessionDuration = Math.floor((Date.now() - sessionStart) / 1000)
    logAction('session_end', {
      duration: sessionDuration,
      page: window.location.pathname
    })
  }

  window.addEventListener('beforeunload', handleBeforeUnload)
  
  // Логируем клики по навигации
  document.addEventListener('click', (e) => {
    const target = e.target as HTMLElement
    const href = target.getAttribute('href')
    const onClick = target.getAttribute('onclick')
    
    if (href && href.includes('/')) {
      logAction('navigation_click', {
        destination: href,
        element: target.tagName.toLowerCase(),
        text: target.textContent?.slice(0, 50)
      })
    }
  })

  // Логируем ошибки JavaScript
  window.addEventListener('error', (e) => {
    logError('javascript_error', {
      message: e.message,
      filename: e.filename,
      lineno: e.lineno,
      colno: e.colno,
      stack: e.error?.stack
    })
  })

  // Логируем ошибки Promise
  window.addEventListener('unhandledrejection', (e) => {
    logError('promise_rejection', {
      reason: e.reason,
      stack: e.reason?.stack
    })
  })
}

// Hook для React компонентов
export function useAdminLogging() {
  return {
    logVisit,
    logAction,
    logError,
    logCRUD
  }
}
