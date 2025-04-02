# LogTail Project

## Описание
LogTail — это веб-приложение для обработки и визуализации логов. Проект использует Nginx и PHP в контейнерах Docker для обеспечения простой разработки и развертывания.


## Установка и запуск

### Локальная разработка
```bash
docker compose --profile dev up -d
Приложение будет доступно по адресу: http://localhost:8080
```
Копировать
```bash
docker compose --profile prod up -d
Приложение будет доступно по домену logtail.ru
```

Остановка контейнеров
Копировать
# Для локальной разработки
```bash
docker compose --profile dev down```

# Для продакшн
```bash
docker compose --profile prod down```
Логи
Копировать
# Просмотр логов Nginx
```bash
docker logs logtail-nginx-dev  # для разработки
docker logs logtail-nginx      # для продакшн
```

# Просмотр логов PHP
```bash
docker logs logtail-php-dev    # для разработки
docker logs logtail-php        # для продакшн
```
Заметки по разработке
Все изменения в файлах в директории public/ сразу отражаются в работающем приложении
Для применения изменений в конфигурации Nginx требуется перезапуск контейнера
Контакты
Для вопросов и предложений обращайтесь к IT-директору проекта.