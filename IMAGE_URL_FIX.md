# 🖼️ Исправление работы с изображениями

## Проблема

URL изображений вида `http://localhost:3000/_ipx/_/events/01K91209NRH4GVTP4W4V2JV6M7.png` не работали.

### Причина

1. **Nuxt Image (IPX)** пытался обработать изображения из Laravel Storage
2. Неправильная конфигурация `image.domains` (указан `https://api.camp.test` с протоколом)
3. `NuxtImg` не может напрямую загружать изображения с внешнего сервера без правильной настройки

## Решение

Заменили `NuxtImg` на обычный `<img>` с composable для формирования правильных URL.

### 1. Создан composable `useImageUrl`

**Файл:** `app/composables/useImageUrl.ts`

```typescript
export const useImageUrl = () => {
  const config = useRuntimeConfig()
  const apiBase = config.public.apiBase.replace('/api/v1', '')

  const getImageUrl = (path: string | null): string => {
    if (!path) return ''
    
    // Если это уже полный URL, возвращаем как есть
    if (path.startsWith('http://') || path.startsWith('https://')) {
      return path
    }
    
    // Если путь начинается с /, убираем его
    const cleanPath = path.startsWith('/') ? path.substring(1) : path
    
    // Формируем полный URL к Laravel storage
    return `${apiBase}/storage/${cleanPath}`
  }

  return {
    getImageUrl
  }
}
```

**Что делает:**
- Получает базовый URL API из конфигурации
- Убирает `/api/v1` из URL
- Формирует путь к Laravel Storage: `http://api.camp.test/storage/...`
- Поддерживает уже готовые полные URL

### 2. Обновлена конфигурация Nuxt

**Файл:** `nuxt.config.ts`

```typescript
image: {
  domains: ['api.camp.test', 'localhost'],  // ✅ Без протокола
  alias: {
    api: 'http://api.camp.test'
  }
}
```

**Было:**
```typescript
image: {
  domains: ['https://api.camp.test']  // ❌ С протоколом - неправильно
}
```

### 3. Обновлены компоненты

#### EventCard.vue

**Было:**
```vue
<NuxtImg
  v-if="event.image"
  :src="event.image"
  :alt="event.title"
  class="..."
/>
```

**Стало:**
```vue
<script setup>
const { getImageUrl } = useImageUrl()
</script>

<template>
  <img
    v-if="event.image"
    :src="getImageUrl(event.image)"
    :alt="event.title"
    class="..."
    loading="lazy"
  />
</template>
```

#### event/[id].vue

Аналогично заменено `NuxtImg` на `<img>` с `getImageUrl()`.

## Как работает

### Laravel возвращает путь
```json
{
  "image": "events/01K91209NRH4GVTP4W4V2JV6M7.png"
}
```

### Composable формирует URL
```typescript
getImageUrl("events/01K91209NRH4GVTP4W4V2JV6M7.png")
// → "http://api.camp.test/storage/events/01K91209NRH4GVTP4W4V2JV6M7.png"
```

### Браузер загружает изображение
```html
<img src="http://api.camp.test/storage/events/01K91209NRH4GVTP4W4V2JV6M7.png" />
```

## Преимущества решения

✅ **Простота** - не нужна сложная настройка IPX
✅ **Прямой доступ** - изображения загружаются напрямую с Laravel
✅ **Производительность** - нет промежуточной обработки
✅ **Гибкость** - работает с любыми URL
✅ **Надежность** - нет зависимости от IPX

## Когда использовать NuxtImg

`NuxtImg` полезен когда нужно:
- Автоматическое изменение размера
- Конвертация форматов (WebP, AVIF)
- Lazy loading с placeholder
- Оптимизация изображений

Но для нашего случая (прямая загрузка с внешнего сервера) достаточно обычного `<img>`.

## Альтернативное решение с NuxtImg

Если всё же хочется использовать `NuxtImg`, нужно:

### 1. Настроить провайдер

```typescript
// providers/laravel-storage.ts
import { joinURL } from 'ufo'

export const getImage: ProviderGetImage = (src, { modifiers = {} } = {}) => {
  const baseURL = 'http://api.camp.test/storage'
  
  return {
    url: joinURL(baseURL, src)
  }
}
```

### 2. Настроить в nuxt.config.ts

```typescript
image: {
  providers: {
    laravel: {
      provider: '~/providers/laravel-storage',
      options: {}
    }
  }
}
```

### 3. Использовать с provider

```vue
<NuxtImg
  provider="laravel"
  :src="event.image"
  :alt="event.title"
/>
```

Но это сложнее, чем текущее решение.

## Структура URL

### API Base
```
http://api.camp.test/api/v1
```

### Storage URL
```
http://api.camp.test/storage/events/image.png
```

### Логика
```
apiBase = "http://api.camp.test/api/v1"
apiBase.replace('/api/v1', '') = "http://api.camp.test"
url = apiBase + "/storage/" + path
```

## Тестирование

1. **Откройте главную страницу:**
   ```
   http://localhost:3000
   ```

2. **Проверьте изображения событий:**
   - Должны загружаться из Laravel Storage
   - URL должен быть: `http://api.camp.test/storage/events/...`

3. **Проверьте страницу события:**
   ```
   http://localhost:3000/event/2
   ```

4. **В DevTools → Network:**
   - Найдите запросы изображений
   - Убедитесь, что URL правильные
   - Status должен быть 200

## Итог

✅ **Заменен `NuxtImg` на `<img>`**
✅ **Создан composable `useImageUrl`**
✅ **Обновлена конфигурация `nuxt.config.ts`**
✅ **Обновлены компоненты `EventCard` и `event/[id]`**
✅ **Изображения теперь загружаются напрямую с Laravel**

**Проблема решена!** 🎉

