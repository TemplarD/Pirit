# ГриндерМастер - Корпоративный сайт

> 🏭 Корпоративный сайт с интернет-магазином и 3D-конструктором гриндеров

**📚 Документация:** [Архитектура](docs/ARCHITECTURE.md) | [Разработка](docs/DEVELOPMENT.md) | [Тестирование](docs/TESTING.md) | [Деплой](docs/DEPLOYMENT.md) | [Ветвление](docs/BRANCHING.md) | [Конфигурация](docs/CONFIGURATION.md)

---

Проект корпоративного сайта для компании "ГриндерМастер" с двумя лендингами: продажа гриндеров и услуги ремонта.

## 🚀 Новая архитектура (Обновлено!)

**Полностью переписан на современный стек с полным контролем:**
- ✅ **Custom Next.js API** вместо Strapi
- ✅ **PostgreSQL + Prisma ORM** для данных
- ✅ **React Admin** для управления
- ✅ **Docker контейнеризация**
- ✅ **Гибридная безопасность** (публичный + IP-защита)

## 🆕 Ключевые преимущества

- **🔥 Полный контроль** над кодом и логикой
- **⚡ Быстродействие** - нативный Next.js API
- **🛡️ Безопасность** - кастомная middleware
- **📊 SEO оптимизация** - Server Components из коробки
- **🌐 Гибридный доступ** - публичные + защищенные эндпоинты
- **💰 Стоимость** - нет лицензионных ограничений

## Архитектура

Современный Full Stack с TypeScript:
- **Frontend**: Next.js 14 (App Router) + TypeScript + Tailwind CSS
- **Backend API**: Next.js API Routes + Prisma ORM
- **Admin Panel**: React Admin + Vite + TypeScript
- **Database**: PostgreSQL + Redis (кэш)
- **Authentication**: JWT + NextAuth + 2FA (Google Authenticator)
- **Security**: Helmet, CORS, Rate Limiting, CSRF Protection
- **Integration**: Telegram Bot API для кодов доступа
- **3D/Animations**: Three.js / React Three Fiber + GSAP + Framer Motion
- **Infrastructure**: Docker + Nginx + VPS

### 🆕 Ключевые зависимости безопасности:
- `next-auth@^4.24.5` - аутентификация
- `otplib@^12.0.1` - двухфакторная аутентификация
- `qrcode@^1.5.4` - QR коды для 2FA
- `helmet@^7.1.0` - security headers
- `express-rate-limit@^7.1.5` - rate limiting
- `bcryptjs@^2.4.3` - хеширование паролей
- `jsonwebtoken@^9.0.2` - JWT токены

## Структура проекта

```
Perit/
├── frontend/          # Next.js сайт (готов к обновлению)
├── api/               # Next.js API Routes ✅
├── admin/             # React Admin панель ✅
├── database/          # SQL миграции ✅
├── nginx/             # Nginx конфигурация ✅
├── scripts/           # Деплой скрипты ✅
├── docker-compose.yml # Все сервисы ✅
├── .env               # Переменные окружения ✅
└── README.md          # Этот файл
```

## 🚀 Быстрый старт

### 1. Клонирование и установка

```bash
git clone <repository-url>
cd Perit
```

### 2. Запуск с Docker (рекомендуется)

```bash
# Запуск всех сервисов
sudo docker compose up -d

# Просмотр логов
sudo docker compose logs -f
```

Доступ:
- **API**: http://localhost:3000/api/health
- **Admin Panel**: http://localhost:3001
- **Frontend**: http://localhost:3002 (будет обновлен)

### 3. Локальная разработка

#### API (Next.js)

```bash
cd api
npm install
DATABASE_URL="postgresql://postgres:postgres123@localhost:5432/grindermaster" npm run dev
```

#### Admin Panel (React Admin)

```bash
cd admin
npm install
npm run dev
```

#### Frontend (Next.js)

```bash
cd frontend
npm install
npm run dev
```

## 🌐 API Эндпоинты

### Публичные (доступны всем):
- `GET /api/health` - проверка работы API
- `GET /api/products` - товары с фильтрами
- `GET /api/services` - услуги с фильтрами  
- `GET /api/categories` - категории товаров
- `POST /api/requests` - заявки от клиентов

### 🆕 Авторизация и аутентификация:
- `POST /api/auth/login` - вход с email/паролем
- `POST /api/auth/verify-2fa` - подтверждение 2FA кода
- `POST /api/auth/telegram-code` - отправка кода в Telegram
- `POST /api/auth/refresh` - обновление токена
- `POST /api/auth/logout` - выход и удаление сессии
- `GET /api/auth/me` - информация о текущем пользователе
- `POST /api/auth/setup-2fa` - настройка 2FA
- `GET /api/auth/backup-codes` - получение резервных кодов

### Защищенные (только по IP/токену):
- `POST /api/products` - создание товаров
- `POST /api/services` - создание услуг
- `PUT /api/admin/requests/:id` - обновление заявок
- `GET /api/admin/*` - админские функции
- `GET /api/logs` - получение логов системы

## 🛡️ Безопасность и Авторизация

### 🆕 Система авторизации:
- **JWT токены** для аутентификации
- **Двухфакторная аутентификация (2FA)** через Google Authenticator
- **Telegram интеграция** для получения кодов подтверждения
- **Управление сессиями** с отслеживанием активности
- **Rate limiting**: 1000 запросов/час на IP
- **IP фильтрация**: белые списки для админских функций
- **CORS**: настройка доменов
- **Security headers**: XSS, CSRF защита
- **Продвинутое логирование**: все действия пользователей и ошибки

### Модели безопасности:
```sql
users (id, email, name, role, passwordHash, telegramId)
auth_sessions (id, userId, email, token, expiresAt, twoFactorCode)
two_factor_auth (id, userId, secret, backupCodes, isEnabled)
```

### Временный доступ для демонстрации:
```bash
# Дать доступ на 1 час
curl -X POST http://localhost:3000/api/admin/access \
  -H "Content-Type: application/json" \
  -d '{"ip":"123.45.67.89","duration":3600}'
```

## 📊 База данных

### Структура (PostgreSQL + Prisma):
```sql
categories (id, name, slug, description)
products (id, name, slug, description, price, categoryId, imageUrl, specifications, featured, active)
services (id, name, slug, description, price, category, icon, duration, warranty)
requests (id, name, phone, email, type, productId, serviceId, message, status)
users (id, email, name, role, passwordHash, telegramId)
auth_sessions (id, userId, email, token, expiresAt, twoFactorCode, twoFactorExpires)
two_factor_auth (id, userId, secret, backupCodes[], isEnabled)
```

### Особенности:
- **UUID первичные ключи**
- **JSON поля** для характеристик товаров
- **Soft delete** через флаги active/displayOnSite
- **Индексы** для быстрого поиска

## 🔧 Админ-панель (React Admin)

### 🆕 Функциональность с авторизацией:
- **Система входа** с email/паролем и 2FA
- **Telegram интеграция** для получения кодов доступа
- **Управление сессиями** - отслеживание активных подключений
- **Продвинутое логирование** - все действия пользователей
- **Управление товарами**: CRUD, загрузка изображений, характеристики
- **Управление услугами**: категории, цены, сроки
- **Обработка заявок**: статусы, экспорт в CSV
- **Аналитика и мониторинг** - статистика использования
- **Настройки безопасности** - 2FA, резервные коды

### Доступ:
- **Локально**: http://localhost:3001
- **Production**: по JWT токену + 2FA
- **Вход**: email + пароль + код из Telegram/Google Authenticator

## 🎨 3D и анимации

### Используемые библиотеки:
- **React Three Fiber** - 3D графика
- **GSAP** - сложные анимации
- **Framer Motion** - компонентные анимации

### Оптимизация:
- LOD-версии для мобильных
- Lazy loading 3D моделей
- Fallback для устройств без WebGL
- GLTF/GLB форматы с компрессией

## 🌍 SEO оптимизация

### Автоматическая SEO-оптимизация:
- Динамические мета-теги
- Schema.org разметка (JSON-LD)
- Генерация sitemap.xml
- Оптимизация изображений (WebP + AVIF)
- Core Web Vitals оптимизация

### SEO-компоненты:
- `SeoHead` - мета-теги и Open Graph
- `SchemaMarkup` - структурированные данные
- `Breadcrumbs` - навигационная цепочка
- `SitemapGenerator` - автогенерация sitemap

## 🚀 Деплоймент

### Продакшен инфраструктура:

```
Домен → Cloudflare → Vercel (Frontend)
                        ↓
                  API запросы → VPS (Next.js API + PostgreSQL)
                        ↓
                  React Admin → VPS (защищенный доступ)
```

### VPS развертывание:

```bash
# Клонирование на VPS
git clone <repository-url>
cd Perit

# Настройка переменных
cp .env.example .env
# Отредактировать .env для production

# Запуск всех сервисов
sudo docker compose --profile production up -d
```

### Хостинг:
- **Frontend**: Vercel (основной) / Netlify (резерв)
- **Backend API**: VPS (TimeWeb Cloud, Selectel)
- **База данных**: Managed PostgreSQL или self-hosted
- **Admin Panel**: VPS (защищенный доступ)

## 📈 Мониторинг

### Инструменты:
- **Sentry** - отслеживание ошибок
- **UptimeRobot** - доступность
- **Google Analytics 4** + **Яндекс.Метрика** - аналитика
- **Lighthouse** - производительность
- **Custom dashboard** - метрики API

## 💾 Резервное копирование

### Автоматическое:
- Daily backup PostgreSQL
- Backup медиафайлов в S3
- Git репозитории с полным бэкапом
- Docker volumes backup

## 🧪 Тестирование

### Локальное тестирование:

```bash
# Тестирование API
curl http://localhost:3004/api/health

# Тестирование товаров
curl http://localhost:3004/api/products

# Тестирование услуг
curl http://localhost:3004/api/services
```

### Демонстрация через туннель:

```bash
# ngrok для API
ngrok http 3004

# ngrok для админки
ngrok http 3001
```

## 📋 Статус разработки

### ✅ Выполнено:
- [x] Новая архитектура спроектирована и реализована
- [x] Docker окружение настроено (PostgreSQL + Redis)
- [x] Next.js API разработано с Prisma ORM
- [x] React Admin админ-панель создана
- [x] Middleware безопасности реализован
- [x] Тестовые данные добавлены в БД
- [x] Все публичные API эндпоинты работают
- [x] Защищенные эндпоинты по IP работают
- [x] 🆕 **Система авторизации с JWT токенами**
- [x] 🆕 **Двухфакторная аутентификация (2FA)**
- [x] 🆕 **Telegram интеграция для кодов доступа**
- [x] 🆕 **Управление сессиями пользователей**
- [x] 🆕 **Продвинутое логирование действий**
- [x] 🆕 **Защита от CSRF и XSS атак**

### ⏳ В процессе:
- [ ] Настройка компонентов React Admin
- [ ] Обновление фронтенда для работы с новым API
- [ ] 3D модели и анимации
- [ ] SEO компоненты и разметка

### 📋 План работ:
1. **Завершить админку** - кастомные компоненты для управления
2. **Обновить фронтенд** - новые API эндпоинты вместо Strapi
3. **Добавить 3D** - модели гриндеров и анимации
4. **Настроить VPS** - полное развертывание
5. **SEO оптимизация** - мета-теги и Schema.org разметка

## 📚 Документация

### Основная документация
- **[Техническое задание](ТЗ.txt)** — полное ТЗ с требованиями (6482 строки)
- **[API Documentation](api/README.md)** — документация по API

### Руководства (docs/)
- **[📋 Навигация](docs/README.md)** — вся документация проекта
- **[🏗️ Архитектура](docs/ARCHITECTURE.md)** — структура и архитектура
- **[🌳 Ветвление](docs/BRANCHING.md)** — Git workflow
- **[🔧 Разработка](docs/DEVELOPMENT.md)** — настройка окружения, отладка
- **[🧪 Тестирование](docs/TESTING.md)** — тесты и CI/CD
- **[⚙️ Конфигурация](docs/CONFIGURATION.md)** — управление настройками
- **[🚀 Деплой](docs/DEPLOYMENT.md)** — развёртывание на VPS

## 🤝 Поддержка и развитие

### Техническая поддержка:
- Полная документация по управлению контентом
- Инструкции для сотрудников
- Гайд по использованию админки

### Планы развития:
- AI для генерации SEO-текстов (3 месяца)
- Персонализация контента по регионам (6 месяцев)
- Мультиязычность для экспансии в СНГ (12 месяцев)

## 📄 Лицензия

MIT License

## 📞 Контакты

- **Telegram**: @TemplarD
- **Email**: admin@grindermaster.ru

---

**🚀 Проект полностью переписан на современную архитектуру Next.js + PostgreSQL + React Admin с сохранением всех функциональных требований!**
