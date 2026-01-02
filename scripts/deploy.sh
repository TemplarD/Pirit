#!/bin/bash

# Деплой GrinderMaster на VPS
# Использование: ./scripts/deploy.sh

set -e

echo "🚀 Начинаем деплой GrinderMaster..."

# Проверка переменных окружения
if [ ! -f .env ]; then
    echo "❌ Файл .env не найден. Создайте его на основе .env.example"
    exit 1
fi

# Остановка существующих контейнеров
echo "🛑 Останавливаем существующие контейнеры..."
docker-compose down

# Сборка образов
echo "🔨 Собираем Docker образы..."
docker-compose build --no-cache

# Запуск в production режиме
echo "🚀 Запускаем контейнеры..."
docker-compose --profile production up -d

# Ожидание запуска PostgreSQL
echo "⏳ Ожидаем запуск PostgreSQL..."
sleep 10

# Выполнение миграций
echo "🗄️ Выполняем миграции базы данных..."
docker-compose exec postgres psql -U postgres -d grindermaster -c "SELECT version();"

# Проверка здоровья сервисов
echo "🔍 Проверяем здоровье сервисов..."
sleep 5

# Проверка API
if curl -f http://localhost/api/health > /dev/null 2>&1; then
    echo "✅ API работает"
else
    echo "❌ API не отвечает"
fi

# Проверка админки
if curl -f http://localhost/admin/ > /dev/null 2>&1; then
    echo "✅ Админка работает"
else
    echo "❌ Админка не отвечает"
fi

# Проверка фронтенда
if curl -f http://localhost/ > /dev/null 2>&1; then
    echo "✅ Фронтенд работает"
else
    echo "❌ Фронтенд не отвечает"
fi

echo "🎉 Деплой завершен!"
echo "📊 Статус контейнеров:"
docker-compose ps

echo "🌐 Доступные URL:"
echo "   Сайт: http://localhost/"
echo "   API: http://localhost/api/"
echo "   Админка: http://localhost/admin/"
