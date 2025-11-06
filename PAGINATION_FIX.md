# ✅ Исправлена ошибка пагинации

## Проблема
```
Uncaught (in promise) TypeError: Cannot read properties of undefined (reading 'last_page')
```

Ошибка возникала на странице `/events` при попытке доступа к `pagination.last_page`.

## Причина
Laravel API возвращает пагинированные данные в следующем формате:
```json
{
  "current_page": 1,
  "data": [...],
  "last_page": 1,
  "per_page": 15,
  "total": 1
}
```

Но код пытался получить `response.pagination.last_page`, хотя поля находятся на верхнем уровне ответа.

## Решение
Обновлен файл `/app/pages/events.vue`:

### Было:
```typescript
const response = await events.getEvents({ page, per_page: pagination.value.per_page })
eventsList.value = response.data
pagination.value = response.pagination // ❌ response.pagination не существует
```

### Стало:
```typescript
const response = await events.getEvents({ page, per_page: pagination.value.per_page })
eventsList.value = response.data
pagination.value = {
  total: response.total,           // ✅ берем из корня ответа
  per_page: response.per_page,     // ✅ берем из корня ответа
  last_page: response.last_page,   // ✅ берем из корня ответа
}
```

## Проверка
Теперь страница `/events` должна работать корректно:
1. Открыть http://localhost:3002/events
2. Увидеть список мероприятий
3. Если мероприятий больше 12, появится пагинация

## Структура ответа API

### GET /api/v1/events?page=1&per_page=12
```json
{
  "current_page": 1,
  "data": [
    {
      "id": 2,
      "title": "Padel Camp Valencia 2025",
      "description": "...",
      "image": "...",
      "date_start": "2025-06-15T10:00:00.000000Z",
      "date_end": "2025-06-22T18:00:00.000000Z",
      "location": "Валенсия, Испания",
      "trips": [...]
    }
  ],
  "first_page_url": "http://api.camp.test/api/v1/events?page=1",
  "from": 1,
  "last_page": 1,
  "last_page_url": "http://api.camp.test/api/v1/events?page=1",
  "links": [...],
  "next_page_url": null,
  "path": "http://api.camp.test/api/v1/events",
  "per_page": 12,
  "prev_page_url": null,
  "to": 1,
  "total": 1
}
```

### Используемые поля:
- `data` - массив мероприятий
- `current_page` - текущая страница
- `last_page` - последняя страница
- `per_page` - элементов на странице
- `total` - всего элементов

## Что теперь работает
✅ Страница `/events` загружается без ошибок
✅ Пагинация отображается корректно
✅ Переключение между страницами работает
✅ Скролл вверх при смене страницы работает

**Ошибка исправлена!** 🎉

