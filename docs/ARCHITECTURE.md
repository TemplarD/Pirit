# Архитектура GrinderMaster

> 🏗️ Краткое описание архитектуры проекта

**См. также:** [Главная](README.md) | [Разработка](DEVELOPMENT.md) | [Конфигурация](CONFIGURATION.md) | [Техническое задание](../ТЗ.txt) (Часть 7)

---

## 📋 Технологический стек

### Frontend
- **Next.js 16** (App Router) + TypeScript
- **Tailwind CSS** + **Framer Motion** + **GSAP**
- **Three.js** + **React Three Fiber** (3D графика)

### Backend
- **Next.js API Routes** + **Prisma ORM**
- **PostgreSQL 15** + **Redis 7**
- **NextAuth.js** + **JWT** + **2FA**

### Admin
- **React Admin 4** + **Vite**

### Infrastructure
- **Docker** + **Nginx** + **VPS**

---

## 📁 Структура проекта

```
Perit/
├── frontend/           # Next.js сайт
├── api/                # Next.js API Backend
├── admin/              # React Admin панель
├── database/           # SQL миграции
├── docs/               # Документация
├── docker-compose.yml  # Docker сервисы
└── config.admin.yml    # Конфигурация
```

**Подробная структура:** См. [ТЗ Часть 7](../ТЗ.txt)

---

## 🔄 Архитектура взаимодействия

```
Пользователь → Frontend (Next.js) → API (Next.js) → Database (PostgreSQL)
                    ↑                      ↓
                3D/Animations        Cache (Redis)
                    ↑                      ↓
                Admin Panel ←←←←←←←←←←←←←←←
```

---

## 🔗 Полезные ссылки

- **[Техническое задание](../ТЗ.txt)** — полная архитектура (Часть 7)
- **[Конфигурация](CONFIGURATION.md)** — настройки проекта
- **[Разработка](DEVELOPMENT.md)** — настройка окружения

---

**Последнее обновление:** 26 февраля 2026  
**Версия:** 1.0 (сокращённая)
