#!/bin/bash

# Скрипт для быстрой локальной разработки

echo "🚀 Запуск ГриндерМастер в режиме разработки"
echo "=========================================="

# Проверка зависимостей
echo "📦 Проверка зависимостей..."

# Node.js
if ! command -v node &> /dev/null; then
    echo "❌ Node.js не установлен. Установите его с https://nodejs.org/"
    exit 1
fi

# Docker (опционально)
if command -v docker &> /dev/null; then
    echo "✅ Docker найден"
    DOCKER_AVAILABLE=true
else
    echo "⚠️  Docker не найден. Будет использована локальная разработка"
    DOCKER_AVAILABLE=false
fi

# Запуск в зависимости от доступности Docker
if [ "$DOCKER_AVAILABLE" = true ] && [ "$1" = "--docker" ]; then
    echo "🐳 Запуск через Docker..."
    
    # Проверка docker-compose
    if ! command -v docker-compose &> /dev/null; then
        echo "❌ docker-compose не найден"
        exit 1
    fi
    
    # Запуск PostgreSQL
    echo "🗄️  Запуск PostgreSQL..."
    docker-compose up -d postgres
    
    # Ожидание запуска базы данных
    sleep 5
    
    # Запуск бэкенда
    echo "🔧 Запуск Strapi..."
    cd backend && npm run develop &
    BACKEND_PID=$!
    
    # Ожидание запуска Strapi
    sleep 10
    
    # Запуск фронтенда
    echo "🌐 Запуск Next.js..."
    cd ../frontend && npm run dev &
    FRONTEND_PID=$!
    
else
    echo "💻 Запуск в локальном режиме..."
    
    # Запуск бэкенда
    if [ -d "backend" ] && [ -f "backend/package.json" ]; then
        echo "🔧 Запуск Strapi..."
        cd backend && npm run develop &
        BACKEND_PID=$!
        sleep 10
    else
        echo "⚠️  Backend не найден, запускаю только фронтенд"
        BACKEND_PID=""
    fi
    
    # Запуск фронтенда
    echo "🌐 Запуск Next.js..."
    cd frontend && npm run dev &
    FRONTEND_PID=$!
fi

# Ожидание запуска
sleep 5

echo ""
echo "✅ Серверы запущены!"
echo "=========================================="
echo "🌐 Frontend: http://localhost:3000"
echo "🔧 Backend: http://localhost:1337"
echo "📊 Admin Panel: http://localhost:1337/admin"
echo "=========================================="

if [ "$DOCKER_AVAILABLE" = true ] && [ "$1" = "--docker" ]; then
    echo "🐳 Docker режим активирован"
    echo "🗄️  PostgreSQL: localhost:5432"
fi

echo ""
echo "💡 Полезные команды:"
echo "   npm run build        # Сборка продакшн версии"
echo "   npm run test         # Запуск тестов"
echo "   npm run lint         # Проверка кода"
echo ""
echo "🛑 Нажмите Ctrl+C для остановки"

# Создание файла с PID для остановки
echo $FRONTEND_PID > .frontend_pid
if [ ! -z "$BACKEND_PID" ]; then
    echo $BACKEND_PID > .backend_pid
fi

# Ожидание прерывания
trap 'echo ""; echo "🛑 Остановка серверов..."; 
      if [ -f .frontend_pid ]; then kill $(cat .frontend_pid) 2>/dev/null; rm .frontend_pid; fi;
      if [ -f .backend_pid ]; then kill $(cat .backend_pid) 2>/dev/null; rm .backend_pid; fi;
      if [ "$DOCKER_AVAILABLE" = true ] && [ "$1" = "--docker" ]; then docker-compose down; fi;
      echo "✅ Готово"; exit 0' INT

echo ""
echo "⏳ Ожидаю прерывания (Ctrl+C)..."
while true; do
    sleep 1
done
