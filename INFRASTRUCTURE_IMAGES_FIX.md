# 🖼️ Изображения инфраструктуры на странице события

## Проблема

В Filament для инфраструктуры есть поле `images` (множественная загрузка), но на frontend эти изображения не отображались.

## Решение

Добавлено отображение изображений инфраструктуры с индикатором количества фото.

## Структура данных

### В Laravel (Event Model)

```php
protected $casts = [
    'infrastructure' => 'array',
    // ...
];
```

### JSON структура

```json
{
  "infrastructure": [
    {
      "name": "Бассейн",
      "description": "25-метровый бассейн с подогревом",
      "images": [
        "infrastructure/pool-1.jpg",
        "infrastructure/pool-2.jpg",
        "infrastructure/pool-3.jpg"
      ]
    },
    {
      "name": "Спортзал",
      "description": "Современное оборудование",
      "images": [
        "infrastructure/gym-1.jpg"
      ]
    }
  ]
}
```

## Обновленный компонент

### Было (без изображений)

```vue
<div class="p-6 rounded-2xl bg-white border-2">
  <h3>{{ item.name }}</h3>
  <p>{{ item.description }}</p>
</div>
```

### Стало (с изображениями)

```vue
<div class="rounded-2xl bg-white border-2 overflow-hidden">
  <!-- Изображения инфраструктуры -->
  <div v-if="item.images && item.images.length > 0" class="relative h-48">
    <img 
      :src="getImageUrl(item.images[0])" 
      :alt="item.name"
      class="w-full h-full object-cover"
    />
    <div v-if="item.images.length > 1" class="badge">
      +{{ item.images.length - 1 }} фото
    </div>
  </div>
  
  <!-- Контент -->
  <div class="p-6">
    <h3>{{ item.name }}</h3>
    <p>{{ item.description }}</p>
  </div>
</div>
```

## Визуальное представление

### Карточка с одним изображением

```
┌─────────────────────────────────┐
│                                 │
│     [Изображение бассейна]      │
│                                 │
├─────────────────────────────────┤
│ Бассейн                         │
│ 25-метровый бассейн с подогревом│
└─────────────────────────────────┘
```

### Карточка с несколькими изображениями

```
┌─────────────────────────────────┐
│                         +2 фото │
│     [Изображение бассейна]      │
│                                 │
├─────────────────────────────────┤
│ Бассейн                         │
│ 25-метровый бассейн с подогревом│
└─────────────────────────────────┘
```

### Карточка без изображений

```
┌─────────────────────────────────┐
│ Спортзал                        │
│ Современное оборудование        │
└─────────────────────────────────┘
```

## Особенности реализации

### 1. Отображение первого изображения
```vue
<img :src="getImageUrl(item.images[0])" />
```
- Показывается только первое изображение из массива
- Высота фиксирована: `h-48` (192px)
- `object-cover` - заполняет всю область

### 2. Индикатор количества фото
```vue
<div v-if="item.images.length > 1" class="badge">
  +{{ item.images.length - 1 }} фото
</div>
```
- Показывается, только если больше 1 фото
- Отображает количество оставшихся фото
- Позиция: правый нижний угол
- Стиль: темный с прозрачностью

### 3. Адаптивность
```vue
<div class="grid grid-cols-1 md:grid-cols-2 gap-6">
```
- Mobile: 1 колонка
- Desktop: 2 колонки

### 4. Fallback (нет изображений)
Если `images` пустой или отсутствует, показывается только текстовый блок без изображения.

## CSS классы

### Контейнер карточки
```css
rounded-2xl          /* Закругленные углы */
bg-white             /* Белый фон */
border-2             /* Рамка 2px */
overflow-hidden      /* Скрыть overflow для изображений */
```

### Изображение
```css
relative h-48        /* Позиционирование + высота 192px */
w-full h-full        /* Заполнить контейнер */
object-cover         /* Обрезка с сохранением пропорций */
```

### Индикатор фото
```css
absolute bottom-2 right-2   /* Позиция */
px-2 py-1                   /* Отступы */
bg-black/70                 /* Черный с прозрачностью 70% */
text-white text-xs          /* Белый текст, маленький */
rounded-lg                  /* Закругленные углы */
```

## Загрузка изображений в Filament

### В EventResource

```php
Forms\Components\Repeater::make('infrastructure')
    ->schema([
        Forms\Components\TextInput::make('name')
            ->label('Название')
            ->required(),
        
        Forms\Components\Textarea::make('description')
            ->label('Описание')
            ->rows(3),
        
        Forms\Components\FileUpload::make('images')
            ->label('Изображения')
            ->image()
            ->multiple()                    // ← Множественная загрузка
            ->directory('infrastructure')   // ← Папка storage/infrastructure
            ->columnSpanFull(),
    ])
```

### Процесс загрузки

1. В Filament загружаете изображения
2. Файлы сохраняются в `storage/app/public/infrastructure/`
3. Laravel возвращает пути: `["infrastructure/file1.jpg", "infrastructure/file2.jpg"]`
4. Frontend формирует URL: `http://api.camp.test/storage/infrastructure/file1.jpg`
5. Изображения отображаются на странице

## Будущие улучшения

### 1. Галерея (Lightbox)
```vue
<div @click="openGallery(item.images, 0)">
  <img :src="getImageUrl(item.images[0])" />
</div>
```

### 2. Слайдер изображений
```vue
<UCarousel :items="item.images">
  <template #item="{ item }">
    <img :src="getImageUrl(item)" />
  </template>
</UCarousel>
```

### 3. Превью всех изображений
```vue
<div class="grid grid-cols-3 gap-1">
  <img 
    v-for="(image, idx) in item.images.slice(0, 3)" 
    :key="idx"
    :src="getImageUrl(image)" 
  />
</div>
```

## Примеры использования

### Пример 1: Бассейн с галереей

**В Filament:**
- Название: "Бассейн"
- Описание: "25-метровый олимпийский бассейн с подогревом"
- Изображения: pool-main.jpg, pool-inside.jpg, pool-night.jpg

**На Frontend:**
```
┌─────────────────────────────────┐
│                        +2 фото │
│   [pool-main.jpg]              │
├─────────────────────────────────┤
│ Бассейн                         │
│ 25-метровый олимпийский бассейн │
│ с подогревом                    │
└─────────────────────────────────┘
```

### Пример 2: Спортзал без галереи

**В Filament:**
- Название: "Спортзал"
- Описание: "Современное оборудование"
- Изображения: gym.jpg

**На Frontend:**
```
┌─────────────────────────────────┐
│   [gym.jpg]                    │
├─────────────────────────────────┤
│ Спортзал                        │
│ Современное оборудование        │
└─────────────────────────────────┘
```

### Пример 3: Конференц-зал без фото

**В Filament:**
- Название: "Конференц-зал"
- Описание: "Вместимость до 50 человек"
- Изображения: (пусто)

**На Frontend:**
```
┌─────────────────────────────────┐
│ Конференц-зал                   │
│ Вместимость до 50 человек       │
└─────────────────────────────────┘
```

## Итог

✅ **Добавлено отображение изображений** для инфраструктуры
✅ **Индикатор количества фото** (+X фото)
✅ **Адаптивная сетка** - 1-2 колонки
✅ **Fallback** - работает без изображений
✅ **Использует `getImageUrl`** - правильные URL из Laravel Storage

**Теперь карточки инфраструктуры показывают фотографии!** 🖼️✨

