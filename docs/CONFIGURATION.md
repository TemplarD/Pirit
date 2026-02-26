# Конфигурационный файл GrinderMaster

## Обзор

Файл `config.admin.yml` содержит все настройки проекта в едином месте. Это позволяет легко управлять конфигурацией для разных окружений (разработка, продакшен, VPS).

## Структура файла

### 🚀 Основные секции

- **`project`** - общая информация о проекте
- **`ports`** - порты для всех сервисов
- **`hosts`** - URL для разных окружений
- **`admin`** - настройки админ-панели
- **`api`** - конфигурация бэкенда
- **`frontend`** - настройки фронтенда
- **`deployment`** - параметры деплоя
- **`logging`** - логирование
- **`monitoring`** - мониторинг
- **`backup`** - резервное копирование
- **`notifications`** - уведомления
- **`seo`** - SEO настройки
- **`development`** - режим разработки
- **`testing`** - тестирование

## 📡 Порты и хосты

### Порты по умолчанию
```yaml
ports:
  frontend: 
    development: 3002    # Разработка
    testing: 80          # Тестирование
    production: 3002    # Продакшен
    docker: 3002         # Docker
  api: 3004             # API (в Docker)
  admin: 3001           # Админ-панель
  postgresql: 5432      # База данных
  redis: 6379           # Кэш
```

### URL для окружений
```yaml
hosts:
  development:
    frontend: "http://localhost:3002"
    api: "http://localhost:3004"
    admin: "http://localhost:3001"
  
  testing:
    frontend: "http://localhost:80"
    api: "http://localhost:3004"
    admin: "http://localhost:3001"
  
  production:
    frontend: "${PRODUCTION_FRONTEND_URL}"
    api: "${PRODUCTION_API_URL}"
    admin: "${PRODUCTION_ADMIN_URL}"
```

## 🔧 Админ-панель

### Аутентификация
```yaml
admin:
  authentication:
    type: "jwt"
    secret: "${JWT_SECRET}"        # Из .env файла
    expiresIn: "24h"
```

### Безопасность
```yaml
admin:
  security:
    ipWhitelist:
      development: ["127.0.0.1", "localhost"]
      production: ["${PRODUCTION_ADMIN_IP}"]  # Из .env файла
    
    rateLimit:
      requests: 1000
      window: "1h"
```

### Функции
```yaml
admin:
  features:
    fileUpload:
      maxSize: "10MB"
      allowedTypes: ["image/jpeg", "image/png"]
    
    3dModels:
      maxSize: "50MB"
      formats: [".glb", ".gltf"]
```

## 🗄️ База данных

### PostgreSQL
```yaml
api:
  database:
    url: "${DATABASE_URL}"
    pool:
      min: 2
      max: 10
```

### Redis
```yaml
api:
  redis:
    url: "${REDIS_URL}"
    keyPrefix: "grindermaster:"
    ttl:
      default: 3600
      short: 300
```

## 🚀 Деплоймент

### Разработка
```yaml
deployment:
  development:
    command: "docker compose up -d"
    services: ["postgres", "redis", "api", "admin", "frontend"]
```

### Продакшен
```yaml
deployment:
  production:
    command: "docker compose --profile production up -d"
    services: ["postgres", "redis", "api", "admin", "nginx"]
    ssl: true
```

## 📊 Мониторинг

### Метрики
```yaml
monitoring:
  metrics:
    enabled: true
    endpoint: "/metrics"
    interval: 30000
  
  health:
    checks: ["database", "redis", "disk", "memory"]
    interval: 60000
```

### Алерты
```yaml
monitoring:
  alerts:
    email: "admin@grindermaster.ru"
    telegram: "@grindermaster_admin"
    thresholds:
      cpu: 80
      memory: 85
      disk: 90
```

## 💾 Резервное копирование

### База данных
```yaml
backup:
  database:
    enabled: true
    schedule: "0 2 * * *"    # Каждый день в 2:00
    retention: 30             # Хранить 30 дней
    compression: true
```

### Файлы
```yaml
backup:
  files:
    enabled: true
    schedule: "0 3 * * 0"    # Каждое воскресенье в 3:00
    retention: 7              # Хранить 7 дней
```

## 📧 Уведомления

### Email
```yaml
notifications:
  email:
    smtp:
      host: "${SMTP_HOST}"
      port: 587
      auth:
        user: "${SMTP_USER}"
        pass: "${SMTP_PASS}"
```

### Telegram
```yaml
notifications:
  telegram:
    botToken: "${TELEGRAM_BOT_TOKEN}"
    chatId: "${TELEGRAM_CHAT_ID}"
    enabled: true
```

## 🔍 SEO

### Базовые настройки
```yaml
seo:
  default:
    title: "ГриндерМастер - Профессиональное оборудование"
    description: "Продажа и ремонт гриндеров"
    keywords: ["гриндер", "шлифовальный станок"]
```

### Open Graph
```yaml
seo:
  openGraph:
    type: "website"
    locale: "ru_RU"
    siteName: "ГриндерМастер"
```

## 🛠️ Использование в коде

### JavaScript/TypeScript
```javascript
import yaml from 'js-yaml';
import fs from 'fs';

// Загрузка конфигурации
const config = yaml.load(fs.readFileSync('config.admin.yml', 'utf8'));

// Получение порта для API
const apiPort = config.ports.api[config.project.environment];

// URL для текущего окружения
const apiHost = config.hosts[config.project.environment].api;
```

### Environment переменные
```bash
# .env файл
NODE_ENV=development
DOMAIN=http://localhost:3005

# База данных
DATABASE_URL="postgresql://postgres:postgres123@localhost:5432/grindermaster"
POSTGRES_PASSWORD=postgres123
REDIS_PASSWORD=redis123

# JWT секреты
JWT_SECRET=your-super-secret-jwt-key-change-in-production
NEXTAUTH_SECRET=your-nextauth-secret-change-in-production

# Telegram Bot
TELEGRAM_BOT_TOKEN=your-telegram-bot-token-here
TELEGRAM_CHAT_ID=your-telegram-chat-id-here

# Email настройки
SMTP_HOST=smtp.gmail.com
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password

# Production IP для админки
PRODUCTION_ADMIN_IP=YOUR_PRODUCTION_IP_HERE

# URL для production
PRODUCTION_FRONTEND_URL=https://grindermaster.ru
PRODUCTION_API_URL=https://api.grindermaster.ru
PRODUCTION_ADMIN_URL=https://admin.grindermaster.ru
```

## 🔄 Переключение окружений

### Разработка
```bash
export NODE_ENV=development
# config.project.environment = "development"
```

### Тестирование
```bash
export NODE_ENV=testing
# config.project.environment = "testing"
# Фронтенд будет доступен на http://localhost:80
```

### Продакшен
```bash
export NODE_ENV=production
# config.project.environment = "production"
```

## 📝 Примеры использования

### Запуск с нужными портами
```bash
# Получаем порты из конфига
FRONTEND_PORT=$(yq e '.ports.frontend.development' config.admin.yml)
API_PORT=$(yq e '.ports.api.docker' config.admin.yml)
ADMIN_PORT=$(yq e '.ports.admin.development' config.admin.yml)

# Для тестирования на 80 порту
TESTING_PORT=$(yq e '.ports.frontend.testing' config.admin.yml)

# Запускаем сервисы
npm run dev -- --port $FRONTEND_PORT
```

### Запуск в тестовом режиме
```bash
# Устанавливаем окружение тестирования
export NODE_ENV=testing

# Запускаем с портом 80 для фронтенда
docker compose up -d

# Фронтенд доступен на http://localhost:80
# Админка на http://localhost:3001
# API на http://localhost:3004
```

### Настройка Nginx
```nginx
# Используем URL из конфига
upstream api {
    server $(yq e '.hosts.production.api' config.admin.yml);
}

upstream admin {
    server $(yq e '.hosts.production.admin' config.admin.yml);
}
```

### Docker Compose
```yaml
# docker-compose.yml
services:
  api:
    ports:
      - "${API_PORT:-3004}:3000"
    environment:
      NODE_ENV: ${NODE_ENV:-development}
```

## 🔧 Кастомизация

### Добавление нового окружения
```yaml
hosts:
  staging:
    frontend: "https://staging.grindermaster.ru"
    api: "https://api-staging.grindermaster.ru"
    admin: "https://admin-staging.grindermaster.ru"
```

### Новые функции
```yaml
admin:
  features:
    newFeature:
      enabled: true
      setting1: "value1"
      setting2: 123
```

## 📋 Чек-лист перед деплоем

- [ ] Установить `NODE_ENV=production`
- [ ] Добавить production IP в `PRODUCTION_ADMIN_IP`
- [ ] Настроить все переменные окружения в `.env`:
  - [ ] `JWT_SECRET` - сильный секрет для JWT
  - [ ] `NEXTAUTH_SECRET` - секрет для NextAuth
  - [ ] `TELEGRAM_BOT_TOKEN` - токен Telegram бота
  - [ ] `TELEGRAM_CHAT_ID` - ID чата для уведомлений
  - [ ] `SMTP_HOST`, `SMTP_USER`, `SMTP_PASS` - email настройки
  - [ ] `PRODUCTION_*_URL` - URL для продакшена
- [ ] Проверить порты для production
- [ ] Настроить SSL сертификаты
- [ ] Включить мониторинг и алерты
- [ ] Настроить резервное копирование
- [ ] Проверить SEO настройки

---

## 🔒 Безопасность и переменные окружения

### Чувствительные данные в .env
Все чувствительные данные вынесены в `.env` файл:

```bash
# 🔐 Секреты и токены
JWT_SECRET=your-super-secret-jwt-key-change-in-production
NEXTAUTH_SECRET=your-nextauth-secret-change-in-production

# 🤖 Telegram
TELEGRAM_BOT_TOKEN=your-telegram-bot-token-here
TELEGRAM_CHAT_ID=your-telegram-chat-id-here

# 📧 Email
SMTP_HOST=smtp.gmail.com
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password

# 🌐 Production URL
PRODUCTION_FRONTEND_URL=https://grindermaster.ru
PRODUCTION_API_URL=https://api.grindermaster.ru
PRODUCTION_ADMIN_URL=https://admin.grindermaster.ru

# 🛡️ IP для админки
PRODUCTION_ADMIN_IP=YOUR_PRODUCTION_IP_HERE
```

### Использование в конфиге
В YAML конфиге все чувствительные данные заменены на переменные:

```yaml
# Вместо жестко заданных значений
admin:
  security:
    ipWhitelist:
      production: ["${PRODUCTION_ADMIN_IP}"]

notifications:
  telegram:
    botToken: "${TELEGRAM_BOT_TOKEN}"
    chatId: "${TELEGRAM_CHAT_ID}"
```

### Правила безопасности
1. **Никогда** не храните `.env` файл в Git
2. **Всегда** добавляйте `.env` в `.gitignore`
3. **Используйте** разные значения для development и production
4. **Генерируйте** сильные секреты для production
5. **Ограничивайте** доступ к `.env` файлу (`chmod 600`)

### Генерация секретов
```bash
# Генерация JWT секрета
openssl rand -base64 32

# Генерация NextAuth секрета
openssl rand -base64 32
```

---

*Этот конфигурационный файл централизует все настройки проекта и делает управление окружениями простым и надежным.*
