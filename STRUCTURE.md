# Архитектура и структура проекта "ГриндерМастер"

## Обзор архитектуры

Проект представляет собой современную Full Stack архитектуру с микросервисным подходом, где каждый компонент выполняет свою специфическую функцию и взаимодействует с другими через четко определенные API.

## Технологический стек

### Frontend Layer
- **Next.js 14 (App Router)** - основной фреймворк для клиентского сайта
- **TypeScript** - строгая типизация на всех уровнях
- **Tailwind CSS** - utility-first CSS фреймворк для стилизации
- **React Three Fiber + Three.js** - 3D графика и интерактивные модели
- **GSAP + Framer Motion** - сложные анимации и переходы

### Backend Layer
- **Next.js API Routes** - нативный API сервер
- **Prisma ORM** - работа с базой данных через типизированные модели
- **PostgreSQL** - основная база данных
- **Redis** - кэширование и хранение сессий
- **NextAuth.js** - аутентификация и управление сессиями

### Admin Layer
- **React Admin + Vite** - панель управления контентом
- **TypeScript** - типизация админских компонентов
- **Custom API integration** - взаимодействие с Next.js API

### Infrastructure Layer
- **Docker + Docker Compose** - контейнеризация всех сервисов
- **Nginx** - балансировщик и reverse proxy
- **PostgreSQL** - персистентное хранение данных
- **Redis** - высокоскоростной кэш

## Структура директорий и файлов

```
Perit/
├── 📁 frontend/                    # Next.js клиентское приложение
│   ├── 📁 src/
│   │   ├── 📁 app/                 # App Router страницы
│   │   │   ├── 📄 layout.tsx       # Корневой layout
│   │   │   ├── 📄 page.tsx         # Главная страница
│   │   │   ├── 📁 products/        # Страницы товаров
│   │   │   ├── 📁 services/        # Страницы услуг
│   │   │   └── 📁 api/             # API роуты для фронтенда
│   │   ├── 📁 components/          # Переиспользуемые компоненты
│   │   │   ├── 📁 ui/              # Базовые UI компоненты
│   │   │   ├── 📁 layout/           # Компоненты layout
│   │   │   ├── 📁 forms/            # Формы
│   │   │   └── 📁 3d/              # 3D компоненты
│   │   ├── 📁 lib/                 # Утилиты и хелперы
│   │   ├── 📁 hooks/               # Custom React hooks
│   │   └── 📁 types/               # TypeScript типы
│   ├── 📄 package.json             # Зависимости фронтенда
│   ├── 📄 next.config.ts           # Конфигурация Next.js
│   ├── 📄 tailwind.config.ts       # Конфигурация Tailwind
│   └── 📄 tsconfig.json            # Конфигурация TypeScript
│
├── 📁 api/                         # Next.js API Backend
│   ├── 📁 app/
│   │   └── 📁 api/                 # API эндпоинты
│   │       ├── 📁 products/         # CRUD товаров
│   │       ├── 📁 services/         # CRUD услуг
│   │       ├── 📁 categories/       # CRUD категорий
│   │       ├── 📁 requests/         # Заявки клиентов
│   │       ├── 📁 admin/            # Админские эндпоинты
│   │       └── 📁 auth/             # Аутентификация
│   ├── 📁 lib/                     # Бизнес-логика
│   │   ├── 📄 prisma.ts             # Клиент Prisma
│   │   ├── 📄 redis.ts              # Клиент Redis
│   │   ├── 📄 auth.ts               # Логика аутентификации
│   │   └── 📄 middleware.ts         # Middleware безопасности
│   ├── 📁 prisma/                  # Схема базы данных
│   │   ├── 📄 schema.prisma         # Модели данных
│   │   └── 📁 migrations/           # Миграции БД
│   ├── 📄 package.json             # Зависимости API
│   ├── 📄 next.config.js            # Конфигурация Next.js API
│   └── 📄 tsconfig.json             # Конфигурация TypeScript
│
├── 📁 admin/                       # React Admin панель
│   ├── 📁 src/
│   │   ├── 📁 components/           # Кастомные компоненты
│   │   ├── 📁 providers/            # Провайдеры контекста
│   │   ├── 📁 resources/            # Ресурсы React Admin
│   │   │   ├── 📄 products.ts       # Ресурс товаров
│   │   │   ├── 📄 services.ts       # Ресурс услуг
│   │   │   ├── 📄 categories.ts     # Ресурс категорий
│   │   │   └── 📄 requests.ts       # Ресурс заявок
│   │   ├── 📄 App.tsx               # Основное приложение
│   │   └── 📄 index.tsx             # Точка входа
│   ├── 📄 package.json              # Зависимости админки
│   ├── 📄 vite.config.ts            # Конфигурация Vite
│   └── 📄 tsconfig.json             # Конфигурация TypeScript
│
├── 📁 database/                    # Файлы базы данных
│   └── 📄 init.sql                  # Инициализация БД
│
├── 📁 nginx/                       # Nginx конфигурация
│   ├── 📄 nginx.conf                # Основной конфиг
│   ├── 📄 ssl/                      # SSL сертификаты
│   └── 📁 sites-available/          # Конфиги сайтов
│
├── 📁 scripts/                     # Скрипты деплоя
│   ├── 📄 deploy.sh                 # Деплой на VPS
│   ├── 📄 backup.sh                 # Бэкап БД
│   └── 📄 restore.sh                # Восстановление БД
│
├── 📄 docker-compose.yml           # Docker сервисы
├── 📄 .env                         # Переменные окружения
├── 📄 .env.example                 # Пример переменных
└── 📄 config.admin.json            # Конфиг админки (новый)
```

## Взаимодействие компонентов

### 1. Поток данных (Data Flow)

```
Пользователь → Frontend (Next.js) → API (Next.js) → Database (PostgreSQL)
                    ↑                      ↓
                3D/Animations        Cache (Redis)
                    ↑                      ↓
                Admin Panel ←←←←←←←←←←←←←←←
```

### 2. API Gateway Pattern

Next.js API выступает как API Gateway:
- **Public Endpoints** (`/api/*`) - доступны всем
- **Protected Endpoints** (`/api/admin/*`) - только по IP/токену
- **Authentication** (`/api/auth/*`) - логин и регистрация

### 3. Database Layer

**PostgreSQL** через **Prisma ORM**:
```typescript
// Модели данных
Category → Products (1:N)
Category → Services (1:N)
Products → Requests (1:N)
Services → Requests (1:N)
Users → Requests (1:N)
```

**Redis** для:
- Кэширования популярных запросов
- Хранения сессий пользователей
- Rate limiting
- Временных данных для 3D моделей

### 4. Frontend Architecture

**Next.js App Router**:
- Server Components для SEO и начальной загрузки
- Client Components для интерактивности (3D, формы)
- Streaming для быстрой загрузки
- ISR для кэширования страниц

**Component Structure**:
```
Layout Components
├── Header (навигация, логотип)
├── Footer (контакты, карта)
└── Sidebar (фильтры, корзина)

Feature Components
├── ProductCard (карточка товара)
├── ServiceCard (карточка услуги)
├── 3DViewer (просмотр 3D моделей)
├── Calculator (калькулятор стоимости)
└── RequestForm (форма заявки)
```

### 5. Admin Panel Architecture

**React Admin** с кастомными ресурсами:
- **Data Providers** - взаимодействие с Next.js API
- **Auth Providers** - аутентификация в админке
- **Custom Components** - загрузка изображений, 3D модели
- **Export Functions** - CSV/Excel экспорт данных

## Сетевое взаимодействие

### Local Development
```
Frontend: http://localhost:3002
API:      http://localhost:3000 (через Docker 3004)
Admin:    http://localhost:3001
DB:       localhost:5432
Redis:    localhost:6379
```

### Production VPS
```
Internet → Hosting → Nginx (80/443)
                        ├─→ Frontend (Vercel)
                        ├─→ API (localhost:3000)
                        └─→ Admin (localhost:3001, IP protection)
```

## Безопасность

### Multi-layer Security:
1. **Network Layer**: Nginx
2. **Application Layer**: Next.js middleware
3. **Data Layer**: PostgreSQL, Redis
4. **Authentication**: JWT + NextAuth.js

### Protection Mechanisms:
- **Rate Limiting**: 1000 запросов/час на IP
- **IP Whitelisting**: для админских функций
- **CORS**: строгие доменные политики
- **Security Headers**: XSS, CSRF защита
- **Input Validation**: Zod схемы для всех данных

## Производительность

### Optimization Strategies:
- **Database**: индексы, connection pooling
- **Caching**: Redis для горячих данных
- **Images**: WebP/AVIF, lazy loading
- **3D Models**: LOD, compression, streaming
- **Code Splitting**: динамический импорт
- **CDN**: Vercel Edge Network

### Monitoring:
- **Sentry**: ошибки и performance
- **Lighthouse**: Core Web Vitals
- **Custom Metrics**: API response times
- **Database Queries**: Prisma query logging

## Масштабирование

### Horizontal Scaling:
- **Frontend**: Vercel auto-scaling
- **API**: Docker swarm/Kubernetes
- **Database**: Read replicas
- **Cache**: Redis Cluster

### Vertical Scaling:
- **CPU**: больше ядер для 3D рендеринга
- **RAM**: больше памяти для кэша
- **Storage**: SSD для быстрой загрузки

## Разработка и деплой

### Git Workflow:
- **main**: продакшен
- **develop**: разработка
- **feature/***: новые функции
- **hotfix/***: исправления

### CI/CD Pipeline:
1. **Push** → GitHub Actions
2. **Test** → Unit + Integration tests
3. **Build** → Docker images
4. **Deploy** → VPS (staging/production)

### Environment Management:
- **Development**: локальный Docker
- **Staging**: тестовый VPS
- **Production**: основной VPS

## Будущее развитие

### Planned Features:
- **AI Integration**: генерация контента
- **Multi-language**: интернационализация
- **Mobile App**: React Native
- **Analytics**: продвинутая аналитика
- **PWA**: Progressive Web App

### Technology Evolution:
- **Next.js 15**: последние фичи
- **React 19**: новые возможности
- **PostgreSQL 16**: улучшения производительности
- **Redis 8**: новые типы данных

---

*Этот документ описывает текущую архитектуру проекта и планы по его развитию.*
