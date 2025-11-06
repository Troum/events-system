# ✨ Обновление до UInputNumber

## Что изменилось

Заменили обычный `UInput type="number"` с кастомными кнопками на специализированный компонент [UInputNumber](https://ui.nuxt.com/docs/components/input-number).

## До (старый код)

```vue
<div class="flex items-center gap-4">
  <UButton
    icon="i-heroicons-minus"
    size="xl"
    color="gray"
    variant="soft"
    :disabled="formData.seats <= 1"
    @click="formData.seats = Math.max(1, formData.seats - 1)"
    class="rounded-xl"
  />
  
  <UInput
    v-model.number="formData.seats"
    type="number"
    :min="1"
    :max="availableSeats"
    size="xl"
    class="flex-1"
  />
  
  <UButton
    icon="i-heroicons-plus"
    size="xl"
    color="gray"
    variant="soft"
    :disabled="formData.seats >= availableSeats"
    @click="formData.seats = Math.min(availableSeats, formData.seats + 1)"
    class="rounded-xl"
  />
</div>
```

**Проблемы:**
- ❌ Много кода для простой задачи
- ❌ Ручная логика для кнопок +/-
- ❌ Ручная проверка min/max
- ❌ Нужно управлять layout (flex, gap)
- ❌ Дублирование стилей

## После (новый код)

```vue
<UInputNumber
  v-model="formData.seats"
  :min="1"
  :max="availableSeats"
  :step="1"
  size="xl"
  placeholder="Выберите количество"
  :increment="{
    color: 'primary',
    variant: 'soft',
    size: 'lg',
    class: 'rounded-xl'
  }"
  :decrement="{
    color: 'primary',
    variant: 'soft',
    size: 'lg',
    class: 'rounded-xl'
  }"
  increment-icon="i-heroicons-plus"
  decrement-icon="i-heroicons-minus"
  :ui="{ 
    base: 'rounded-xl text-2xl font-bold text-center',
  }"
/>
```

**Преимущества:**
- ✅ Компактный код (в 3 раза меньше)
- ✅ Встроенная логика +/- из коробки
- ✅ Автоматическая проверка min/max/step
- ✅ Правильная обработка числовых значений
- ✅ Доступность (ARIA) из коробки
- ✅ Кастомизация через props
- ✅ Поддержка клавиатуры (стрелки вверх/вниз)
- ✅ Поддержка колеса мыши

## Возможности UInputNumber

### 1. Базовое использование
```vue
<UInputNumber v-model="value" />
```

### 2. С ограничениями
```vue
<UInputNumber 
  v-model="value" 
  :min="0" 
  :max="100" 
  :step="5" 
/>
```

### 3. Вертикальная ориентация
```vue
<UInputNumber 
  v-model="value" 
  orientation="vertical" 
/>
```

### 4. Без кнопок
```vue
<UInputNumber 
  v-model="value" 
  :increment="false"
  :decrement="false"
/>
```

### 5. С форматированием (проценты)
```vue
<UInputNumber 
  v-model="value" 
  :step="0.01"
  :format-options="{
    style: 'percent'
  }"
/>
```

### 6. С форматированием (валюта)
```vue
<UInputNumber 
  v-model="value" 
  :format-options="{
    style: 'currency',
    currency: 'RUB',
    currencyDisplay: 'symbol'
  }"
/>
```

### 7. Кастомные иконки
```vue
<UInputNumber 
  v-model="value" 
  increment-icon="i-heroicons-arrow-up"
  decrement-icon="i-heroicons-arrow-down"
/>
```

### 8. Кастомные кнопки
```vue
<UInputNumber 
  v-model="value" 
  :increment="{
    color: 'primary',
    variant: 'solid',
    size: 'xs'
  }"
  :decrement="{
    color: 'primary',
    variant: 'solid',
    size: 'xs'
  }"
/>
```

## Наш кейс в BookingForm

```vue
<UFormField 
  label="Сколько мест вы хотите забронировать?" 
  name="seats" 
  :error="errors.seats"
  :hint="`Доступно: ${availableSeats} мест`"
  required
>
  <UInputNumber
    v-model="formData.seats"
    :min="1"
    :max="availableSeats"
    :step="1"
    size="xl"
    placeholder="Выберите количество"
    :increment="{
      color: 'primary',
      variant: 'soft',
      size: 'lg',
      class: 'rounded-xl'
    }"
    :decrement="{
      color: 'primary',
      variant: 'soft',
      size: 'lg',
      class: 'rounded-xl'
    }"
    increment-icon="i-heroicons-plus"
    decrement-icon="i-heroicons-minus"
    :ui="{ 
      base: 'rounded-xl text-2xl font-bold text-center',
    }"
  />
</UFormField>
```

### Что делает этот код:
1. **v-model** - двустороннее связывание с `formData.seats`
2. **min/max** - ограничивает диапазон от 1 до `availableSeats`
3. **step** - шаг изменения (1 место за раз)
4. **size="xl"** - крупный размер компонента
5. **increment/decrement** - кастомизация кнопок (цвет, вариант, размер)
6. **increment-icon/decrement-icon** - иконки для кнопок
7. **ui.base** - стили для поля ввода (закругления, шрифт, выравнивание)

## Интеграция с @internationalized/number

`UInputNumber` использует пакет `@internationalized/number` для:
- Правильного форматирования чисел в разных локалях
- Поддержки различных систем счисления
- Форматирования валют, процентов, дробей
- Парсинга введенных значений

## Доступность (Accessibility)

Компонент автоматически добавляет:
- `role="spinbutton"` - для скринридеров
- `aria-valuenow` - текущее значение
- `aria-valuemin` - минимальное значение
- `aria-valuemax` - максимальное значение
- Поддержка клавиатуры (↑↓, Home, End, PageUp, PageDown)
- Поддержка колеса мыши

## Сравнение кода

| Характеристика | UInput + кнопки | UInputNumber |
|----------------|-----------------|--------------|
| Строк кода | ~40 | ~20 |
| Логика +/- | Ручная | Встроенная |
| Проверка min/max | Ручная | Автоматическая |
| Клавиатура | Частичная | Полная |
| Accessibility | Базовая | Полная |
| Форматирование | Нет | Да |
| Layout | Ручной | Автоматический |

## Результат

✅ **Код стал проще** - меньше строк, понятнее логика
✅ **Функциональность богаче** - клавиатура, колесо мыши, форматирование
✅ **Доступность лучше** - полная поддержка ARIA
✅ **Поддержка легче** - используем стандартный компонент Nuxt UI
✅ **Стиль консистентный** - все компоненты из одной библиотеки

## Проверка

Откройте страницу бронирования:
```
http://localhost:3002/book/4
```

Попробуйте:
- ✅ Кликнуть на кнопки +/-
- ✅ Ввести число вручную
- ✅ Использовать стрелки ↑↓ на клавиатуре
- ✅ Прокрутить колесо мыши на поле
- ✅ Попробовать ввести значение > max или < min
- ✅ Проверить в темной теме

**Обновление завершено!** 🎉

## Ссылки

- [UInputNumber документация](https://ui.nuxt.com/docs/components/input-number)
- [Nuxt UI v4](https://ui.nuxt.com/)
- [@internationalized/number](https://react-spectrum.adobe.com/internationalized/number/index.html)

