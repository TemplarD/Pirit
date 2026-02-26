# GrinderMaster VPS Deployment

## 🚀 Архитектура для VPS

### **Сервисы**
- **PostgreSQL 15** - основная база данных
- **Redis 7** - кэш и сессии
- **Next.js API** - backend API (порт 3000)
- **React Admin** - админка (порт 3001)
- **Next.js Frontend** - сайт (порт 3002)
- **Nginx** - балансировщик (порты 80/443)

### **Порты**
- `80/443` - Nginx (основной вход)
- `3000` - API
- `3001` - Админка
- `3002` - Фронтенд
- `5432` - PostgreSQL (внутри сети)
- `6379` - Redis (внутри сети)

## 📋 VPS требования

### **Минимальные**
- **CPU**: 2 ядра
- **RAM**: 4GB
- **Disk**: 50GB SSD
- **OS**: Ubuntu 22.04 LTS

### **Рекомендуемые**
- **CPU**: 4 ядра
- **RAM**: 8GB
- **Disk**: 100GB SSD
- **OS**: Ubuntu 22.04 LTS

## 🛠️ Установка на VPS

### 1. Подготовка сервера
```bash
# Обновление системы
sudo apt update && sudo apt upgrade -y

# Установка Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# Установка Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# Создание директории проекта
sudo mkdir -p /opt/grindermaster
sudo chown $USER:$USER /opt/grindermaster
cd /opt/grindermaster
```

### 2. Клонирование и настройка
```bash
# Клонирование проекта
git clone <your-repo> .

# Настройка переменных окружения
cp .env.example .env
nano .env  # Настройте для production
```

### 3. Деплой
```bash
# Запуск деплоя
./scripts/deploy.sh
```

## 🔧 Конфигурация для production

### **.env для VPS**
```env
NODE_ENV=production
DOMAIN=https://grindermaster.ru

POSTGRES_PASSWORD=your-strong-postgres-password
REDIS_PASSWORD=your-strong-redis-password

JWT_SECRET=your-super-strong-jwt-secret
NEXTAUTH_SECRET=your-super-strong-nextauth-secret
```

### **SSL сертификаты**
```bash
# Установка Certbot
sudo apt install certbot python3-certbot-nginx

# Получение сертификата
sudo certbot --nginx -d grindermaster.ru -d www.grindermaster.ru

# Автопродление
sudo crontab -e
# Добавить: 0 12 * * * /usr/bin/certbot renew --quiet
```

## 📊 Мониторинг

### **Логи**
```bash
# Все сервисы
docker-compose logs -f

# Конкретный сервис
docker-compose logs -f api
docker-compose logs -f postgres
```

### **Статус**
```bash
# Статус контейнеров
docker-compose ps

# Перезапуск сервиса
docker-compose restart api
```

### **Бэкапы**
```bash
# Бэкап PostgreSQL
docker-compose exec postgres pg_dump -U postgres grindermaster > backup_$(date +%Y%m%d).sql

# Восстановление
docker-compose exec -T postgres psql -U postgres grindermaster < backup_20240102.sql
```

## 🔄 Обновление

### **Процесс обновления**
```bash
# 1. Пулл изменений
git pull origin main

# 2. Сборка и запуск
./scripts/deploy.sh

# 3. Проверка
curl http://localhost/api/health
```

## 🚨 Безопасность

### **Базовая настройка**
```bash
# Настройка файрвола
sudo ufw allow ssh
sudo ufw allow 80
sudo ufw allow 443
sudo ufw enable

# Отключение пароля для root
sudo passwd -l root
```

### **Безопасность Docker**
```bash
# Ограничение логов
sudo nano /etc/docker/daemon.json
# Добавить: {"log-driver": "json-file", "log-opts": {"max-size": "10m", "max-file": "3"}}
```

## 📈 Производительность

### **Оптимизация**
- **Redis кэш** - 100x быстрее запросов
- **Nginx gzip** - сжатие ответов
- **PostgreSQL индексы** - быстрая выборка
- **Docker layers** - быстрая сборка

### **Масштабирование**
- **Горизонтальное** - добавление серверов
- **Вертикальное** - увеличение ресурсов VPS
- **CDN** - для статических файлов
