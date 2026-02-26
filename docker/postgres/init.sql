-- Инициализация базы данных для Grindermaster
-- Этот файл выполняется при первом запуске контейнера PostgreSQL

-- Создаем расширения для оптимизации
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- Устанавливаем кодировку
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
