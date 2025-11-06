# Camp Events - Платформа для организации поездок на мероприятия

Frontend приложение на Nuxt 3 SSR для бронирования и оплаты поездок на мероприятия.

## Возможности

- 📅 Просмотр предстоящих мероприятий и поездок
- 🎫 Бронирование мест с валидацией
- 💳 Онлайн оплата через ЮKassa и Fondy
- 📧 Уведомления (email, Telegram)
- 🔍 SEO-оптимизация с OpenGraph мета-тегами
- 📱 Адаптивный дизайн

## Структура проекта

```
camp/
├── app/                    # Главный файл приложения
├── components/             # Vue компоненты
│   ├── AppHeader.vue      # Шапка сайта
│   ├── AppFooter.vue      # Футер сайта
│   ├── EventCard.vue      # Карточка мероприятия
│   ├── BookingForm.vue    # Форма бронирования
│   └── PaymentForm.vue    # Форма оплаты
├── composables/            # Композиции Vue
│   ├── useApi.ts          # Базовый API клиент
│   ├── useEvents.ts       # Работа с мероприятиями
│   ├── useTrips.ts        # Работа с поездками
│   ├── useBookings.ts     # Работа с бронированиями
│   ├── usePayments.ts     # Работа с платежами
│   └── useSeo.ts          # SEO мета-теги
├── layouts/               # Layouts
│   └── default.vue        # Основной layout
├── pages/                 # Страницы (автоматический роутинг)
│   ├── index.vue          # Главная страница
│   ├── events.vue          # Каталог мероприятий
│   ├── event/[id].vue      # Страница мероприятия
│   ├── book/[id].vue       # Страница бронирования
│   ├── payment/[id].vue    # Страница оплаты
│   └── contact.vue         # Контакты
├── types/                 # TypeScript типы
│   └── index.ts           # Типы данных
└── public/                # Статические файлы
```

## Технологии

- **Nuxt 3** - SSR фреймворк
- **Vue 3** - Прогрессивный JavaScript фреймворк
- **TypeScript** - Типизация
- **@nuxt/ui** - UI компоненты
- **@nuxt/image** - Оптимизация изображений

## Конфигурация

Создайте файл `.env` в корне проекта:

```env
NUXT_PUBLIC_API_BASE=http://backend.test/api/v1
NUXT_PUBLIC_SITE_URL=https://camp-events.ru
```

- `NUXT_PUBLIC_API_BASE` - базовый URL API бэкенда (по умолчанию: `http://backend.test/api/v1`)
- `NUXT_PUBLIC_SITE_URL` - URL сайта для SEO мета-тегов (по умолчанию: `https://camp-events.ru`)

## Setup

Make sure to install dependencies:

```bash
# npm
npm install

# pnpm
pnpm install

# yarn
yarn install

# bun
bun install
```

## Development Server

Start the development server on `http://localhost:3000`:

```bash
# npm
npm run dev

# pnpm
pnpm dev

# yarn
yarn dev

# bun
bun run dev
```

## Production

Build the application for production:

```bash
# npm
npm run build

# pnpm
pnpm build

# yarn
yarn build

# bun
bun run build
```

Locally preview production build:

```bash
# npm
npm run preview

# pnpm
pnpm preview

# yarn
yarn preview

# bun
bun run preview
```

Check out the [deployment documentation](https://nuxt.com/docs/getting-started/deployment) for more information.
