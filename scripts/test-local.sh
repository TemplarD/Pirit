#!/bin/bash

# Скрипт для локального тестирования с белым IP
# Использует ngrok для создания туннелей

echo "🚀 Запуск локального тестирования ГриндерМастер"
echo "=============================================="

# Проверка наличия ngrok
if ! command -v ngrok &> /dev/null; then
    echo "❌ ngrok не найден. Установите его:"
    echo "   brew install ngrok  # macOS"
    echo "   sudo apt install ngrok  # Ubuntu"
    echo "   Или скачайте с https://ngrok.com/"
    exit 1
fi

# Проверка запущенных процессов
echo "📋 Проверка запущенных процессов..."

# Проверка Next.js
if ! pgrep -f "next dev" > /dev/null; then
    echo "❌ Next.js не запущен. Запускаю..."
    cd frontend && npm run dev &
    sleep 5
else
    echo "✅ Next.js уже запущен"
fi

# Проверка Strapi
if ! pgrep -f "strapi" > /dev/null; then
    echo "⚠️  Strapi не запущен. Убедитесь что он работает на http://localhost:1337"
else
    echo "✅ Strapi запущен"
fi

# Создание туннелей
echo ""
echo "🌐 Создание туннелей через ngrok..."

# Туннель для фронтенда
echo "📡 Создание туннеля для фронтенда (порт 3000)..."
ngrok http 3000 --log=stdout > /tmp/ngrok_frontend.log &
FRONTEND_PID=$!

# Туннель для бэкенда
echo "📡 Создание туннеля для бэкенда (порт 1337)..."
ngrok http 1337 --log=stdout > /tmp/ngrok_backend.log &
BACKEND_PID=$!

# Ожидание инициализации
sleep 10

# Получение URL
FRONTEND_URL=$(grep -o 'https://[^[:space:]]*\.ngrok\.io' /tmp/ngrok_frontend.log | head -1)
BACKEND_URL=$(grep -o 'https://[^[:space:]]*\.ngrok\.io' /tmp/ngrok_backend.log | head -1)

echo ""
echo "✅ Туннели созданы!"
echo "=============================================="
echo "🌐 Фронтенд: $FRONTEND_URL"
echo "🔧 Бэкенд: $BACKEND_URL"
echo "📊 Админка Strapi: $BACKEND_URL/admin"
echo "=============================================="

# Создание временного файла с URL
echo "FRONTEND_URL=$FRONTEND_URL" > .temp_urls
echo "BACKEND_URL=$BACKEND_URL" >> .temp_urls

echo ""
echo "💡 Советы:"
echo "   - Отправьте $FRONTEND_URL для демонстрации"
echo "   - Используйте $BACKEND_URL/admin для настройки контента"
echo "   - Нажмите Ctrl+C для остановки туннелей"

# Ожидание прерывания
trap 'echo ""; echo "🛑 Остановка туннелей..."; kill $FRONTEND_PID $BACKEND_PID 2>/dev/null; rm -f .temp_urls; echo "✅ Готово"; exit 0' INT

echo ""
echo "⏳ Ожидаю прерывания (Ctrl+C)..."
while true; do
    sleep 1
done
