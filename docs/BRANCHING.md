# Ветвление в проекте GrinderMaster

> 📋 Git workflow для проекта GrinderMaster

**См. также:** [Архитектура](ARCHITECTURE.md) | [Разработка](DEVELOPMENT.md) | [Главная](README.md)

---

## 🌳 Структура веток

### `production` (пред-продакшн)
- **Назначение**: Финальное тестирование перед продакшеном
- **Содержит**: Код, прошедший тестирование в `test`
- **Правила**: Только через Pull Request из `develop`

### `test` (тестовая ветка)
- **Назначение**: Интеграционное тестирование
- **Содержит**: Фичи из `develop`, готовые к тестированию
- **Правила**: Только через Pull Request из `develop`

### `develop` (ветка разработки)
- **Назначение**: Основная разработка
- **Содержит**: Актуальные изменения и новые фичи
- **Правила**: Прямая работа разработчиков
- **Статус**: ✅ **Текущая активная ветка**

## 🔄 Процесс работы

### 1. Новая фича
```bash
git checkout develop
git pull origin develop
git checkout -b feature/название-фичи
# разработка...
git add .
git commit -m "feat: добавлена новая фича"
git push origin feature/название-фичи
```

### 2. Тестирование
```bash
git checkout develop
git merge feature/название-фичи
git push origin develop
# Создать Pull Request develop → test
```

### 3. Продакшен
```bash
# После успешного тестирования
git checkout production
git merge develop
git push origin production
```

### 4. Деплой на VPS
```bash
git checkout production
# Деплой с production ветки
```

## 📋 Правила коммитов

Используйте [Conventional Commits](https://www.conventionalcommits.org/):

- `feat:` - новая функциональность
- `fix:` - исправление бага
- `docs:` - документация
- `style:` - форматирование кода
- `refactor:` - рефакторинг
- `test:` - тесты
- `chore:` - рутинные задачи

## 🚀 Запуск проекта

### Разработка
```bash
git checkout develop
npm run dev
```

### Тестирование
```bash
git checkout test
npm run test
npm run build
```

### Продакшен
```bash
git checkout production
npm run build
npm start
```

## 🔗 Полезные ссылки

- **GitHub Repository**: https://github.com/TemplarD/Pirit
- **Issues**: https://github.com/TemplarD/Pirit/issues
- **Pull Requests**: https://github.com/TemplarD/Pirit/pulls
- **Conventional Commits**: https://www.conventionalcommits.org/

---

**См. также:**
- [Архитектура проекта](ARCHITECTURE.md)
- [Настройка окружения](DEVELOPMENT.md)
- [Конфигурация](CONFIGURATION.md)
- [Деплой на VPS](DEPLOYMENT.md)
