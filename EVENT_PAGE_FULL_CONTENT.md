# 📄 Полная страница события с богатым контентом

## Проблема

На странице события отображалась только базовая информация:
- Заголовок
- Описание
- Локация
- Даты
- Список поездок

Но модель `Event` содержит гораздо больше полей!

## Решение

Создана новая полноценная страница события со всеми секциями из модели.

## Структура новой страницы

### 1. Hero Section (Главный баннер)
```vue
<div class="relative h-[60vh]">
  <img :src="event.image" class="hero-image" />
  <div class="overlay">
    <h1>{{ event.title }}</h1>
    <p>{{ event.subtitle }}</p>
    <div>{{ event.location }} | {{ event.date_start }}</div>
  </div>
</div>
```

**Отображаемые поля:**
- `title` - Заголовок
- `subtitle` - Подзаголовок
- `image` - Главное изображение
- `location` - Локация
- `date_start` - Дата начала

### 2. О мероприятии
```vue
<section v-if="event.about">
  <h2>О мероприятии</h2>
  <p>{{ event.about }}</p>
</section>
```

**Поле:** `about`

### 3. Особенности
```vue
<section v-if="event.features">
  <div v-for="feature in event.features">
    <Icon :name="feature.icon" />
    <h3>{{ feature.title }}</h3>
    <p>{{ feature.description }}</p>
  </div>
</section>
```

**Поле:** `features` (array)
- `icon` - Иконка Lucide
- `title` - Заголовок
- `description` - Описание

**Пример JSON:**
```json
{
  "features": [
    {
      "icon": "wifi",
      "title": "Wi-Fi",
      "description": "Бесплатный высокоскоростной интернет"
    },
    {
      "icon": "utensils",
      "title": "Питание",
      "description": "Трёхразовое питание включено"
    }
  ]
}
```

### 4. Программа (Расписание)
```vue
<section v-if="event.schedule">
  <div v-for="day in event.schedule">
    <h3>{{ day.date }} - {{ day.title }}</h3>
    <div v-for="activity in day.activities">
      <span>{{ activity.time }}</span>
      <div>
        <p>{{ activity.title }}</p>
        <p>{{ activity.description }}</p>
      </div>
    </div>
  </div>
</section>
```

**Поле:** `schedule` (array)
- `date` - Дата/День
- `title` - Название дня
- `activities` - Массив активностей
  - `time` - Время
  - `title` - Название
  - `description` - Описание

**Пример JSON:**
```json
{
  "schedule": [
    {
      "date": "15 июня",
      "title": "День заезда",
      "activities": [
        {
          "time": "10:00",
          "title": "Встреча в аэропорту",
          "description": "Трансфер в отель"
        },
        {
          "time": "14:00",
          "title": "Заселение",
          "description": ""
        }
      ]
    }
  ]
}
```

### 5. Инфраструктура
```vue
<section v-if="event.infrastructure">
  <div v-for="item in event.infrastructure">
    <h3>{{ item.name }}</h3>
    <p>{{ item.description }}</p>
  </div>
</section>
```

**Поле:** `infrastructure` (array)
- `name` - Название
- `description` - Описание

### 6. Команда
```vue
<section v-if="event.team">
  <div v-for="member in event.team">
    <img :src="member.photo" />
    <h3>{{ member.name }}</h3>
    <p>{{ member.role }}</p>
    <p>{{ member.bio }}</p>
  </div>
</section>
```

**Поле:** `team` (array)
- `photo` - Фото
- `name` - Имя
- `role` - Роль
- `bio` - Биография

### 7. FAQ (Вопросы и ответы)
```vue
<section v-if="event.faq">
  <UAccordion :items="faqItems" />
</section>
```

**Поле:** `faq` (array)
- `question` - Вопрос
- `answer` - Ответ

### 8. Галерея
```vue
<section v-if="event.gallery">
  <div v-for="image in event.gallery">
    <img :src="getImageUrl(image)" />
  </div>
</section>
```

**Поле:** `gallery` (array)

### 9. Sidebar (Боковая панель)

#### Выбор поездки
```vue
<UCard>
  <h2>Выберите город отправления</h2>
  <div v-for="trip in tripsList">
    <!-- Карточка поездки -->
  </div>
</UCard>
```

#### Организатор
```vue
<UCard v-if="event.organizer_name">
  <h3>Организатор</h3>
  <p>{{ event.organizer_name }}</p>
  <a :href="`tel:${event.organizer_phone}`">
    {{ event.organizer_phone }}
  </a>
  <a :href="`mailto:${event.organizer_email}`">
    {{ event.organizer_email }}
  </a>
</UCard>
```

**Поля:**
- `organizer_name` - Имя организатора
- `organizer_phone` - Телефон
- `organizer_email` - Email
- `organizer_telegram` - Telegram
- `organizer_whatsapp` - WhatsApp

## Все используемые поля Event

### ✅ Отображаемые на странице

1. `title` - Заголовок (Hero)
2. `subtitle` - Подзаголовок (Hero)
3. `image` - Главное изображение (Hero)
4. `location` - Локация (Hero)
5. `date_start` - Дата начала (Hero)
6. `date_end` - Дата окончания
7. `about` - О мероприятии (Секция)
8. `features` - Особенности (Секция с иконками)
9. `schedule` - Программа (Секция с расписанием)
10. `infrastructure` - Инфраструктура (Секция)
11. `team` - Команда (Секция с фото)
12. `faq` - Вопросы и ответы (Аккордеон)
13. `gallery` - Галерея (Сетка изображений)
14. `organizer_name` - Организатор (Sidebar)
15. `organizer_phone` - Телефон (Sidebar)
16. `organizer_email` - Email (Sidebar)
17. `trips` - Поездки (Sidebar)

### 📋 Дополнительные поля (можно добавить)

- `hero_description` - Описание в hero
- `hero_images` - Слайдер изображений
- `packages` - Пакеты/тарифы
- `not_included` - Что не включено
- `venue_name` - Название места
- `venue_description` - Описание места
- `venue_address` - Адрес
- `venue_latitude` / `venue_longitude` - Координаты (карта)
- `airport_distance` - Расстояние до аэропорта
- `recommended_flights` - Рекомендованные рейсы
- `show_booking_form` - Показывать форму бронирования
- `show_countdown` - Показывать обратный отсчет
- `max_participants` - Максимум участников
- `current_participants` - Текущих участников

## Визуальная структура

```
┌─────────────────────────────────────────────────────────────┐
│ HERO SECTION                                                │
│ Изображение на весь экран                                   │
│ + Заголовок, Подзаголовок, Локация, Даты                   │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────┬───────────────────────────────┐
│ КОНТЕНТ (2/3 ширины)         │ SIDEBAR (1/3 ширины)         │
│                              │                               │
│ 📖 О мероприятии             │ 🚌 Выбор поездки             │
│                              │                               │
│ ⭐ Особенности               │ • Москва - 15 000 ₽          │
│ • Wi-Fi                      │ • СПб - 18 000 ₽             │
│ • Питание                    │                               │
│ • Трансфер                   │ 👤 Организатор               │
│                              │ • Имя                         │
│ 📅 Программа                 │ • Телефон                    │
│ День 1: Заезд                │ • Email                      │
│ • 10:00 Встреча              │                               │
│ • 14:00 Заселение            │                               │
│                              │                               │
│ 🏢 Инфраструктура            │                               │
│ • Бассейн                    │                               │
│ • Спортзал                   │                               │
│                              │                               │
│ 👥 Команда                   │                               │
│ [Фото] Имя                   │                               │
│ Роль: Тренер                 │                               │
│                              │                               │
│ ❓ FAQ                       │                               │
│ Аккордеон с вопросами        │                               │
│                              │                               │
│ 🖼️ Галерея                   │                               │
│ [Фото] [Фото] [Фото]         │                               │
│                              │                               │
└─────────────────────────────┴───────────────────────────────┘
```

## Дизайн

### Hero
- Высота: 60vh (минимум 500px)
- Изображение: Cover
- Градиент: От черного к прозрачному
- Текст: Белый с тенями

### Секции
- Заголовки: `text-3xl font-bold gradient-text`
- Отступы: `space-y-12` между секциями
- Карточки: Закругленные `rounded-2xl`

### Особенности
- Сетка: 2 колонки на desktop
- Иконки: Lucide в цветном фоне
- Градиент: От primary-50 до primary-100

### Программа
- Бордер слева: 4px primary-500
- Время: Primary цвет
- Карточки активностей: Закругленные

### FAQ
- Компонент: `UAccordion` из Nuxt UI
- Автоматическое раскрытие/скрытие

### Галерея
- Сетка: 2-3 колонки
- Aspect ratio: Square
- Hover: Масштабирование

## Итог

✅ **Полная страница события** со всем богатым контентом
✅ **Hero section** - эффектный баннер
✅ **8+ секций** - вся информация из модели
✅ **Sidebar** - поездки и организатор
✅ **Адаптивный дизайн** - mobile + desktop
✅ **Современный UI** - градиенты, тени, анимации

**Теперь страница события показывает ВСЮ информацию из модели!** 📄✨

