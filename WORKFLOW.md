# 🚀 Рабочий процесс с ветками

## 📍 Текущая ветка: `develop`

Мы работаем в ветке `develop` для всей разработки. Остальные ветки обновляются только по команде.

## 🔄 Процесс обновления веток

### 1. Разработка (всегда в `develop`)
```bash
# Убедимся, что мы в develop
git checkout develop
git pull origin develop

# Создаем feature-ветку для новой задачи
git checkout -b feature/название-задачи

# Разработка...
git add .
git commit -m "feat: описание задачи"
git push origin feature/название-задачи
```

### 2. Слияние в develop
```bash
git checkout develop
git merge feature/название-задачи
git push origin develop
```

### 3. Обновление других веток (только по команде!)

#### Для тестирования:
```bash
git checkout test
git merge develop
git push origin test
```

#### Для продакшена:
```bash
git checkout production  
git merge develop
git push origin production
```

#### Для основного репозитория:
```bash
git checkout main
git merge production
git push origin main
```

## 📋 Команды для обновления веток

### 🧪 Обновить TEST ветку:
```bash
git checkout test && git merge develop && git push origin test && git checkout develop
```

### 🚀 Обновить PRODUCTION ветку:
```bash
git checkout production && git merge develop && git push origin production && git checkout develop
```

### 🌟 Обновить MAIN ветку (продакшн):
```bash
git checkout main && git merge production && git push origin main && git checkout develop
```

## ⚠️ Важные правила:

1. **Всегда работаем в `develop`**
2. **Другие ветки обновляем только по команде**
3. **Перед слиянием всегда делаем `git pull`**
4. **Используем conventional commits**
5. **Не работаем напрямую в `main`, `production`, `test`**

## 🎯 Статус веток:

- **`develop`** - активная разработка ✅
- **`test`** - тестирование (обновляется по команде)
- **`production`** - пред-продакшн (обновляется по команде)  
- **`main`** - продакшн (обновляется по команде)

## 🔍 Проверка текущей ветки:
```bash
git branch
git status
```
