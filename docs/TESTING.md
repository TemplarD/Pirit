# Тестирование GrinderMaster

> 🧪 Руководство по тестированию: Unit, Integration, E2E тесты и CI/CD

**См. также:** [Архитектура](ARCHITECTURE.md) | [Разработка](DEVELOPMENT.md) | [Главная](README.md)

---

## 📋 Содержание

- [Архитектура тестирования](#-архитектура-тестирования)
- [Запуск тестов](#-запуск-тестов)
- [Unit тесты](#-unit-тесты)
- [Integration тесты](#-integration-тесты)
- [E2E тесты](#-e2e-тесты)
- [CI/CD](#-cicd)
- [Покрытие кода](#-покрытие-кода)
- [Отчётность](#-отчётность)

---

## 🏗️ Архитектура тестирования

### Пирамида тестирования

```
                    ┌─────────────┐
                    │   E2E       │  10% - Сквозные тесты
                    │   Tests     │  (Playwright)
                    └─────────────┘
                 ┌───────────────────┐
                 │  Integration      │  20% - Интеграционные тесты
                 │  Tests            │  (API, Database)
                 └───────────────────┘
              ┌─────────────────────────┐
              │      Unit Tests         │  70% - Модульные тесты
              │  (Vitest)               │  (Компоненты, функции)
              └─────────────────────────┘
```

### Типы тестирования

| Тип | Инструмент | Покрытие | Автоматизация |
|-----|------------|----------|---------------|
| **Unit** | Vitest | 80%+ кода | ✅ CI/CD |
| **Integration** | Vitest + Supertest | 70%+ API | ✅ CI/CD |
| **E2E** | Playwright | Критические пути | ✅ CI/CD |
| **Нагрузочное** | k6 | API endpoints | ⚠️ По требованию |
| **Кроссбраузерное** | BrowserStack | Все браузеры | ⚠️ Ручное |

---

## 🚀 Запуск тестов

### Все тесты

```bash
# Запуск всех тестов
npm run test

# Запуск с покрытием
npm run test:coverage

# Запуск в режиме watch (разработка)
npm run test:watch
```

### По типам тестов

```bash
# Unit тесты
npm run test:unit

# Integration тесты
npm run test:integration

# E2E тесты
npm run test:e2e

# E2E с UI
npm run test:e2e:ui
```

### В Docker

```bash
# Запуск тестов в контейнере
docker-compose run api npm run test

# Запуск с покрытием
docker-compose run api npm run test:coverage
```

---

## 🧪 Unit тесты

### Что тестировать

- ✅ Компоненты React
- ✅ Утилиты и хелперы
- ✅ Хуки
- ✅ Функции валидации
- ✅ Бизнес-логика

### Пример Unit теста

```typescript
// api/__tests__/unit/validateProduct.test.ts
import { describe, it, expect } from 'vitest'
import { validateProduct } from '@/lib/validate'

describe('validateProduct', () => {
  it('должен возвращать true для валидного товара', () => {
    const product = {
      name: 'Гриндер Про',
      price: 50000,
      description: 'Описание'
    }
    
    expect(validateProduct(product)).toBe(true)
  })

  it('должен возвращать false для товара без названия', () => {
    const product = {
      name: '',
      price: 50000,
      description: 'Описание'
    }
    
    expect(validateProduct(product)).toBe(false)
  })

  it('должен возвращать false для товара с отрицательной ценой', () => {
    const product = {
      name: 'Гриндер',
      price: -100,
      description: 'Описание'
    }
    
    expect(validateProduct(product)).toBe(false)
  })
})
```

### Запуск Unit тестов

```bash
# Все Unit тесты
npm run test:unit

# Конкретный файл
npm run test:unit -- validateProduct.test.ts

# С покрытием
npm run test:unit -- --coverage
```

---

## 🔗 Integration тесты

### Что тестировать

- ✅ API endpoints
- ✅ Взаимодействие с БД
- ✅ Сервисы
- ✅ Middleware

### Пример Integration теста

```typescript
// api/__tests__/integration/products.test.ts
import { describe, it, expect, beforeAll, afterAll } from 'vitest'
import request from 'supertest'
import { app } from '@/app'

describe('Products API', () => {
  // GET /api/products
  it('должен возвращать список товаров', async () => {
    const response = await request(app)
      .get('/api/products')
      .expect(200)

    expect(response.body).toHaveProperty('data')
    expect(Array.isArray(response.body.data)).toBe(true)
  })

  // GET /api/products/:id
  it('должен возвращать товар по ID', async () => {
    const response = await request(app)
      .get('/api/products/test-product-id')
      .expect(200)

    expect(response.body).toHaveProperty('id', 'test-product-id')
    expect(response.body).toHaveProperty('name')
  })

  // POST /api/products (защищённый)
  it('должен требовать авторизацию для создания', async () => {
    await request(app)
      .post('/api/products')
      .send({ name: 'Новый товар', price: 1000 })
      .expect(401)
  })
})
```

### Запуск Integration тестов

```bash
# Все Integration тесты
npm run test:integration

# Конкретный файл
npm run test:integration -- products.test.ts

# С покрытием
npm run test:integration -- --coverage
```

---

## 🎭 E2E тесты

### Что тестировать

- ✅ Критические пути пользователя
- ✅ Покупка товара
- ✅ Сборка гриндера в конструкторе
- ✅ Авторизация
- ✅ Оформление заказа

### Пример E2E теста (Playwright)

```typescript
// e2e/tests/shop.spec.ts
import { test, expect } from '@playwright/test'

test.describe('Интернет-магазин', () => {
  test('должен отображать главную страницу', async ({ page }) => {
    await page.goto('http://localhost:3002')
    
    await expect(page).toHaveTitle(/ГриндерМастер/)
    await expect(page.locator('h1')).toBeVisible()
  })

  test('должен показывать каталог товаров', async ({ page }) => {
    await page.goto('http://localhost:3002/catalog')
    
    await expect(page.locator('[data-testid="product-card"]'))
      .toHaveCount.greaterThan(0)
  })

  test('должен добавлять товар в корзину', async ({ page }) => {
    await page.goto('http://localhost:3002/catalog')
    
    // Нажимаем "В корзину"
    await page.click('[data-testid="add-to-cart"]:first-child')
    
    // Проверяем счётчик корзины
    const cartCount = await page.locator('[data-testid="cart-count"]').textContent()
    expect(cartCount).toBe('1')
  })

  test('должен оформлять заказ', async ({ page }) => {
    await page.goto('http://localhost:3002/checkout')
    
    // Заполняем форму
    await page.fill('[name="name"]', 'Иван Иванов')
    await page.fill('[name="email"]', 'ivan@example.com')
    await page.fill('[name="phone"]', '+7 (999) 123-45-67')
    
    // Отправляем
    await page.click('[type="submit"]')
    
    // Проверяем подтверждение
    await expect(page.locator('[data-testid="order-success"]'))
      .toBeVisible()
  })
})
```

### Запуск E2E тестов

```bash
# Все E2E тесты (headless)
npm run test:e2e

# E2E тесты с UI (открывает браузер)
npm run test:e2e:ui

# Конкретный файл
npm run test:e2e -- shop.spec.ts

# С отладкой
npm run test:e2e -- --debug
```

---

## ⚙️ CI/CD

### GitHub Actions Workflow

```yaml
# .github/workflows/test.yml
name: Testing Pipeline

on:
  push:
    branches: [production, develop]
  pull_request:
    branches: [production, develop]

jobs:
  # Unit тесты
  unit-tests:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
      - run: npm ci
      - run: npm run test:unit -- --coverage
      - uses: codecov/codecov-action@v4
        with:
          files: ./coverage/lcov.info

  # Integration тесты
  integration-tests:
    runs-on: ubuntu-latest
    services:
      postgres:
        image: postgres:16
        env:
          POSTGRES_USER: postgres
          POSTGRES_PASSWORD: postgres
          POSTGRES_DB: test
      redis:
        image: redis:7
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
      - run: npm ci
      - run: npx prisma migrate deploy
      - run: npm run test:integration

  # E2E тесты
  e2e-tests:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
      - run: npm ci
      - uses: microsoft/playwright-action@v2
        with:
          command: npm run test:e2e
      - uses: actions/upload-artifact@v4
        if: failure()
        with:
          name: playwright-report
          path: playwright-report/

  # Линтинг
  lint:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
      - run: npm ci
      - run: npm run lint

  # Сборка
  build:
    runs-on: ubuntu-latest
    needs: [unit-tests, integration-tests]
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
      - run: npm ci
      - run: npm run build
```

---

## 📊 Покрытие кода

### Целевые показатели

| Тип теста | Минимум | Цель |
|-----------|---------|------|
| **Lines** | 75% | 85%+ |
| **Branches** | 70% | 80%+ |
| **Functions** | 75% | 85%+ |
| **Statements** | 75% | 85%+ |

### Запуск с покрытием

```bash
# Все тесты с покрытием
npm run test:coverage

# Только Unit с покрытием
npm run test:unit -- --coverage

# Просмотр отчёта
open coverage/index.html
```

### Отчёт о покрытии

```
=============================== Coverage summary ===============================
Statements   : 82.5% ( 1234/1496 )
Branches     : 76.3% ( 456/598 )
Functions    : 84.1% ( 234/278 )
Lines        : 83.2% ( 1189/1429 )
================================================================================
```

---

## 📑 Отчётность

### Формат отчёта о тестировании

```markdown
# Отчёт о тестировании - Этап X

## Общая информация
- **Дата:** 2026-XX-XX
- **Тестировщик:** [Имя]
- **Статус:** ✅ Пройдено / ⚠️ Частично / ❌ Провалено

## Метрики
- **Покрытие тестами:** 85%
- **Найдено багов:** 12 (3 критических, 5 средних, 4 мелких)
- **Исправлено багов:** 10

## Результаты

### Unit тесты
- **Всего:** 245
- **Прошло:** 243
- **Упало:** 2
- **Покрытие:** 87%

### Integration тесты
- **Всего:** 89
- **Прошло:** 87
- **Упало:** 2

### E2E тесты
- **Всего сценариев:** 24
- **Прошло:** 22
- **Упало:** 2
- **Время выполнения:** 12 мин

## Критические проблемы
1. [CRITICAL] Описание проблемы
2. [HIGH] Описание проблемы

## Рекомендации
1. Рекомендация 1
2. Рекомендация 2
```

---

## 🔗 Полезные ссылки

### Документация
- [Техническое задание](../ТЗ.txt) — Часть 12: Система тестирования
- [Разработка](DEVELOPMENT.md) — настройка окружения
- [CI/CD](../.github/workflows/test.yml) — pipeline

### Инструменты
- **Vitest**: https://vitest.dev/
- **Playwright**: https://playwright.dev/
- **Supertest**: https://github.com/ladjs/supertest
- **Testing Library**: https://testing-library.com/

---

## 📞 Поддержка

- **Telegram**: @TemplarD
- **Email**: admin@grindermaster.ru
- **Issues**: https://github.com/TemplarD/Pirit/issues

---

**Последнее обновление:** 26 февраля 2026  
**Версия руководства:** 1.0
