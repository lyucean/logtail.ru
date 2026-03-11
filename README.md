# LogTail Project - Проект переехал в приватный репозиторий

## Описание
LogTail - это веб-приложение для обработки и визуализации логов. Проект использует la и PHP в контейнерах Docker для обеспечения простой разработки и развертывания.

## Как проект устроен

Go (Gin) - HTTP сервис приема логов

ClickHouse - основная БД для логов

Redis - hot storage и кэш

PostgreSQL - пользователи, проекты, биллинг

NATS JetStream - очередь сообщений

PHP 8.2 + Laravel 12 - веб приложение и dashboard

Laravel Octane (Swoole) - ускорение Laravel

Vue 3 - фронтенд

Laravel Echo - real-time обновления

Nginx - reverse proxy + SSL

Docker + Docker Compose — контейнеризация

Prometheus - сбор метрик

Grafana - визуализация метрик

Loki - логи самих сервисов

