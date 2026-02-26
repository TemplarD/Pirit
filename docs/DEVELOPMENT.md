# Разработка GrinderMaster

> 🔧 Руководство по разработке, настройке окружения и отладке

**См. также:** [Архитектура](ARCHITECTURE.md) | [Ветвление](BRANCHING.md) | [Конфигурация](CONFIGURATION.md) | [Главная](README.md)

---

## 📋 Содержание

- [Быстрый старт](#-быстрый-старт)
- [Требования к окружению](#-требования-к-окружению)
- [Установка и запуск](#-установка-и-запуск)
- [Структура проекта](#-структура-проекта)
- [Разработка компонентов](#-разработка-компонентов)
- [Отладка](#-отладка)
- [Часто задаваемые вопросы](#-часто-задаваемые-вопросы)

---

## 🚀 Быстрый старт

### 1. Клонирование репозитория

```bash
git clone https://github.com/TemplarD/Pirit.git
cd Perit
```

### 2. Настройка переменных окружения

```bash
# Копируем пример .env
cp .env.example .env

# Редактируем .env (обязательно измените секреты!)
nano .env
```

**Обязательные переменные:**
```env
# База данных
DATABASE_URL="postgresql://postgres:postgres123@localhost:5432/grindermaster"
POSTGRES_PASSWORD=postgres123
REDIS_PASSWORD=redis123

# JWT секреты (ЗАМЕНИТЕ НА СВОИ!)
JWT_SECRET=your-super-secret-jwt-key-change-in-production
NEXTAUTH_SECRET=your-nextauth-secret-change-in-production

# Telegram Bot (опционально)
TELEGRAM_BOT_TOKEN=your-telegram-bot-token-here
TELEGRAM_CHAT_ID=your-telegram-chat-id-here
```

### 3. Запуск с Docker (рекомендуется)

```bash
# Запуск всех сервисов
docker-compose up -d

# Проверка статуса
docker-compose ps

# Просмотр логов
docker-compose logs -f
```

**Доступ после запуска:**
- **API**: http://localhost:3000
- **Admin Panel**: http://localhost:3001
- **Frontend**: http://localhost:3002
- **PostgreSQL**: localhost:5432
- **Redis**: localhost:6379

### 4. Проверка работоспособности

```bash
# Health check API
curl http://localhost:3000/api/health

# Проверка PostgreSQL
docker-compose exec postgres pg_isready

# Проверка Redis
docker-compose exec redis redis-cli ping
```

---

## 💻 Требования к окружению

### Минимальные требования

| Компонент | Версия | Примечание |
|-----------|--------|------------|
| **Node.js** | 20.x+ | LTS версия |
| **npm** | 10.x+ | Менеджер пакетов |
| **Docker** | 27.x+ | Контейнеризация |
| **Docker Compose** | 2.x+ | Оркестрация |
| **Git** | 2.x+ | Система контроля версий |

### Рекомендуемые требования

| Компонент | Версия | Примечание |
|-----------|--------|------------|
| **CPU** | 4 ядра+ | Для комфортной разработки |
| **RAM** | 16GB+ | Для всех сервисов |
| **Disk** | 50GB+ | SSD рекомендовано |
| **OS** | Linux/macOS | Ubuntu 22.04+ рекомендовано |

### Проверка версий

```bash
node --version    # v20.x.x
npm --version     # 10.x.x
docker --version  # Docker 27.x.x
docker-compose --version  # Docker Compose 2.x.x
git --version     # git 2.x.x
```

---

## 🛠️ Установка и запуск

### Локальная разработка (без Docker)

#### API (Next.js Backend)

```bash
cd api

# Установка зависимостей
npm install

# Генерация Prisma клиента
npx prisma generate

# Применение миграций
npx prisma migrate deploy

# Запуск seed данных (опционально)
npx prisma db seed

# Запуск в режиме разработки
npm run dev
```

**Доступ:** http://localhost:3000

#### Admin Panel (React Admin)

```bash
cd admin

# Установка зависимостей
npm install

# Запуск в режиме разработки
npm run dev
```

**Доступ:** http://localhost:3001

#### Frontend (Next.js)

```bash
cd frontend

# Установка зависимостей
npm install

# Запуск в режиме разработки
npm run dev
```

**Доступ:** http://localhost:3002

### Запуск через Docker

```bash
# Запуск всех сервисов
docker-compose up -d

# Запуск конкретного сервиса
docker-compose up -d api

# Перезапуск сервиса
docker-compose restart api

# Остановка всех сервисов
docker-compose down

# Остановка с удалением томов (данные будут удалены!)
docker-compose down -v
```

---

## 📁 Структура проекта

```
Perit/
├── 📁 api/                  # Next.js API Backend
│   ├── 📁 app/
│   │   └── 📁 api/          # API endpoints
│   │       ├── 📁 auth/     # Аутентификация
│   │       ├── 📁 products/ # Товары CRUD
│   │       ├── 📁 services/ # Услуги CRUD
│   │       ├── 📁 categories/ # Категории
│   │       └── 📁 requests/ # Заявки
│   ├── 📁 lib/              # Бизнес-логика
│   ├── 📁 prisma/           # Prisma схема и миграции
│   └── 📄 package.json
│
├── 📁 admin/                # React Admin панель
│   ├── 📁 src/
│   │   ├── 📁 resources/    # Ресурсы (товары, услуги)
│   │   └── 📄 App.tsx
│   └── 📄 package.json
│
├── 📁 frontend/             # Next.js сайт
│   ├── 📁 src/
│   │   ├── 📁 app/          # App Router страницы
│   │   └── 📁 components/   # React компоненты
│   └── 📄 package.json
│
├── 📁 database/             # SQL миграции
│   └── 📄 init.sql
│
├── 📁 docs/                 # Документация
│   ├── 📄 README.md         # Навигация
│   ├── 📄 ARCHITECTURE.md   # Архитектура
│   ├── 📄 BRANCHING.md      # Git workflow
│   ├── 📄 CONFIGURATION.md  # Конфигурация
│   ├── 📄 DEPLOYMENT.md     # Деплой
│   ├── 📄 DEVELOPMENT.md    # Это файл
│   └── 📄 TESTING.md        # Тестирование
│
├── 📄 docker-compose.yml    # Docker сервисы
├── 📄 config.admin.yml      # Централизованная конфигурация
├── 📄 .env                  # Переменные окружения
└── 📄 .env.example          # Пример переменных
```

---

## 🔨 Разработка компонентов

### Добавление нового API endpoint

```bash
# Создаём новый endpoint в api/app/api/
mkdir -p api/app/api/new-feature

# Создаём route.ts
cat > api/app/api/new-feature/route.ts << EOF
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  return NextResponse.json({ message: 'Hello from new feature' })
}
EOF
```

### Добавление новой модели Prisma

```prisma
// api/prisma/schema.prisma
model NewFeature {
  id        String   @id @default(cuid())
  name      String
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
```

```bash
# Создаём миграцию
npx prisma migrate dev --name add_new_feature

# Генерируем клиент
npx prisma generate
```

### Добавление ресурса в админку

```typescript
// admin/src/resources/newFeature.ts
export const newFeature = {
  list: () => <ListGuesser />,
  create: () => <CreateGuesser />,
  edit: () => <EditGuesser />,
  show: () => <ShowGuesser />,
}
```

---

## 🐛 Отладка

### Логи Docker

```bash
# Все сервисы
docker-compose logs -f

# Конкретный сервис
docker-compose logs -f api
docker-compose logs -f postgres
docker-compose logs -f redis

# Последние 100 строк
docker-compose logs --tail=100 api
```

### Отладка API

```bash
# Health check
curl http://localhost:3000/api/health

# Получение товаров
curl http://localhost:3000/api/products

# Отладка Prisma запросов (добавить в .env)
# DEBUG=prisma:client
```

### Отладка базы данных

```bash
# Подключение к PostgreSQL
docker-compose exec postgres psql -U postgres -d grindermaster

# Просмотр таблиц
\dt

# Просмотр данных
SELECT * FROM products LIMIT 10;

# Выход
\q
```

### Отладка Redis

```bash
# Подключение к Redis
docker-compose exec redis redis-cli

# Просмотр всех ключей
KEYS *

# Просмотр значения
GET grindermaster:session:abc123

# Выход
exit
```

---

## ❓ Часто задаваемые вопросы

### Q: Как сбросить базу данных?

```bash
# Warning: Это удалит все данные!
docker-compose down -v
docker-compose up -d postgres
npx prisma migrate deploy
npx prisma db seed
```

### Q: Как добавить тестовые данные?

```bash
# Seed данные определяются в api/prisma/seed.ts
npx prisma db seed
```

### Q: Почему админка не подключается к API?

Проверьте:
1. API запущен: `curl http://localhost:3000/api/health`
2. Переменные окружения в admin/.env:
   ```
   REACT_APP_API_URL=http://localhost:3000/api
   ```
3. CORS настройки в API

### Q: Как изменить порт сервиса?

Отредактируйте `docker-compose.yml`:
```yaml
services:
  api:
    ports:
      - "3000:3000"  # Измените первое число
```

### Q: Где хранятся загруженные файлы?

```bash
# Локально
./api/uploads/

# В Docker
docker volume ls
docker-compose exec api ls /app/uploads
```

### Q: Как посмотреть миграции Prisma?

```bash
# Статус миграций
npx prisma migrate status

# Просмотр файлов миграций
ls api/prisma/migrations/
```

---

## 🔗 Полезные ссылки

### Документация
- [Техническое задание](../ТЗ.txt) — полные требования
- [Архитектура](ARCHITECTURE.md) — структура проекта
- [Ветвление](BRANCHING.md) — Git workflow
- [Конфигурация](CONFIGURATION.md) — настройки
- [Деплой](DEPLOYMENT.md) — развёртывание на VPS
- [Тестирование](TESTING.md) — тесты и CI/CD

### Технологии
- **Next.js**: https://nextjs.org/docs
- **React Admin**: https://marmelab.com/react-admin/
- **Prisma**: https://www.prisma.io/docs
- **PostgreSQL**: https://www.postgresql.org/docs/
- **Redis**: https://redis.io/docs/
- **Docker**: https://docs.docker.com/

---

## 📞 Поддержка

- **Telegram**: @TemplarD
- **Email**: admin@grindermaster.ru
- **Issues**: https://github.com/TemplarD/Pirit/issues

---

**Последнее обновление:** 26 февраля 2026  
**Версия руководства:** 1.0
