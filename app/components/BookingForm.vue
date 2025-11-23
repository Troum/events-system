<script setup lang="ts">
import type { Trip } from '~/types'

interface Props {
  trip: Trip
  availableSeats: number
}

const props = defineProps<Props>()
const emit = defineEmits<{
  submit: [data: any]
}>()

const formData = reactive({
  user_name: '',
  user_phone: '',
  user_email: '',
  seats: 1,
  payment_gateway: '' as string,
})

const paymentGateways = [
  {
    value: 'pay_on_arrival',
    label: 'Оплата по факту',
    description: 'Оплатите при встрече с водителем',
    icon: 'i-heroicons-banknotes',
  },
  {
    value: 'yookassa',
    label: 'ЮKassa',
    description: 'Банковская карта, СБП',
    icon: 'i-heroicons-credit-card',
  },
  {
    value: 'stripe',
    label: 'Stripe',
    description: 'Международные карты',
    icon: 'i-heroicons-globe-alt',
  },
  {
    value: 'paypal',
    label: 'PayPal',
    description: 'PayPal аккаунт',
    icon: 'i-heroicons-currency-dollar',
  },
  {
    value: 'webpay',
    label: 'WebPay',
    description: 'Онлайн платежи',
    icon: 'i-heroicons-device-phone-mobile',
  },
] as const

// Фильтруем доступные способы оплаты для этой поездки
const availableGateways = computed(() => {
  if (!props.trip.available_payment_gateways || props.trip.available_payment_gateways.length === 0) {
    // Если не указано, доступна только оплата по факту
    return paymentGateways.filter(g => g.value === 'pay_on_arrival')
  }
  return paymentGateways.filter(g => props.trip.available_payment_gateways?.includes(g.value))
})

// Устанавливаем первый доступный способ оплаты по умолчанию
watch(availableGateways, (gateways) => {
  if (gateways.length > 0 && !formData.payment_gateway) {
    formData.payment_gateway = gateways[0].value
  }
}, { immediate: true })

const errors = reactive({
  user_name: '',
  user_phone: '',
  user_email: '',
  seats: '',
})

const loading = ref(false)

const isFormValid = computed(() => {
  return formData.user_name && formData.user_phone && formData.user_email && formData.seats > 0 && formData.seats <= props.availableSeats
})

const { formatPrice } = useFormatters()

const handleSubmit = async () => {
  if (!isFormValid.value) return

  loading.value = true
  try {
    emit('submit', formData)
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="space-y-8">
    <!-- Информация о поездке -->
    <div class="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary-500 to-primary-600 p-6 text-white shadow-2xl">
      <div class="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
      <div class="relative">
        <div class="flex items-center gap-3 mb-4">
          <div class="w-12 h-12 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
            <UIcon name="i-heroicons-map-pin" class="w-6 h-6" />
          </div>
          <div>
            <p class="text-sm opacity-90">Откуда</p>
            <p class="text-xl font-bold">{{ trip.city_from }}</p>
          </div>
        </div>
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm opacity-90">Цена за место</p>
            <p class="text-2xl font-bold">{{ formatPrice(trip.price) }}</p>
          </div>
          <div class="text-right">
            <p class="text-sm opacity-90">Доступно мест</p>
            <p class="text-2xl font-bold">{{ availableSeats }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Форма бронирования -->
    <UForm :state="formData" @submit="handleSubmit" class="space-y-6">
      <!-- Контактные данные -->
      <div class="space-y-6">
        <h3 class="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
          <div class="w-10 h-10 rounded-xl bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center">
            <UIcon name="i-heroicons-user-circle" class="w-6 h-6 text-primary-600 dark:text-primary-400" />
          </div>
          Контактные данные
        </h3>

        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div class="lg:col-span-2 w-full">
            <UFormField
              label="Ваше имя"
              name="user_name"
              :error="errors.user_name"
              required
              class="w-full"
            >
              <UInput
                v-model="formData.user_name"
                placeholder="Иван Иванов"
                size="xl"
                :ui="{
                  base: 'rounded-2xl px-4 py-3 text-xl',
                }"
                icon="i-heroicons-user"
                class="w-full"
              />
            </UFormField>
          </div>

          <div class="w-full">
            <UFormField
              label="Телефон"
              name="user_phone"
              :error="errors.user_phone"
              required
              class="w-full"
            >
              <UInput
                v-model="formData.user_phone"
                type="tel"
                placeholder="+7 (999) 123-45-67"
                size="xl"
                :ui="{
                  base: 'rounded-2xl px-4 py-3 text-xl',
                }"
                icon="i-heroicons-phone"
                class="w-full"
              />
            </UFormField>
          </div>

          <div class="w-full">
            <UFormField
              label="Email"
              name="user_email"
              :error="errors.user_email"
              required
              class="w-full"
            >
              <UInput
                v-model="formData.user_email"
                type="email"
                placeholder="example@email.com"
                size="xl"
                :ui="{
                  base: 'rounded-2xl px-4 py-3 text-xl',
                }"
                icon="i-heroicons-envelope"
                class="w-full"
              />
            </UFormField>
          </div>
        </div>
      </div>

      <!-- Количество мест -->
      <div class="space-y-6">
        <div class="flex items-center gap-3 mb-4">
          <h3 class="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
            Количество мест
          </h3>
          <div class="w-10 h-10 rounded-xl bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center">
            <UIcon name="i-heroicons-ticket" class="w-6 h-6 text-primary-600 dark:text-primary-400" />
          </div>
        </div>

        <div class="w-full">
          <UFormField
            label="Сколько мест вы хотите забронировать?"
            name="seats"
            :error="errors.seats"
            :hint="`Доступно: ${availableSeats} ${availableSeats === 1 ? 'место' : availableSeats < 5 ? 'места' : 'мест'}`"
            required
            class="w-full"
          >
            <UInputNumber
              v-model="formData.seats"
              :min="1"
              :max="availableSeats"
              :step="1"
              placeholder="Выберите количество"
              :increment="{
                color: 'primary',
                variant: 'soft',
                size: 'xl',
                class: 'rounded-2xl'
              }"
              :decrement="{
                color: 'primary',
                variant: 'soft',
                size: 'xl',
                class: 'rounded-2xl'
              }"
              increment-icon="i-heroicons-plus"
              decrement-icon="i-heroicons-minus"
              :ui="{
                base: 'rounded-2xl text-3xl font-bold text-center',
              }"
              class="w-full"
            />
          </UFormField>
        </div>
      </div>

      <!-- Способ оплаты -->
      <div v-if="availableGateways.length > 0" class="space-y-6">
        <h3 class="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
          <div class="w-10 h-10 rounded-xl bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center">
            <UIcon name="i-heroicons-credit-card" class="w-6 h-6 text-primary-600 dark:text-primary-400" />
          </div>
          Способ оплаты
        </h3>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <button
            v-for="gateway in availableGateways"
            :key="gateway.value"
            type="button"
            @click="formData.payment_gateway = gateway.value"
            :class="[
              'p-5 rounded-2xl border-2 transition-all duration-300 text-left',
              formData.payment_gateway === gateway.value
                ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20 shadow-lg scale-105'
                : 'border-gray-200 dark:border-gray-700 hover:border-primary-300 dark:hover:border-primary-700'
            ]"
          >
            <div class="flex items-start gap-4">
              <div :class="[
                'w-12 h-12 rounded-xl flex items-center justify-center transition-all',
                formData.payment_gateway === gateway.value
                  ? 'bg-primary-500 text-white'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400'
              ]">
                <UIcon :name="gateway.icon" class="w-6 h-6" />
              </div>
              <div class="flex-1">
                <div class="flex items-center justify-between mb-1">
                  <p class="font-bold text-lg">{{ gateway.label }}</p>
                  <div v-if="formData.payment_gateway === gateway.value" class="w-6 h-6 rounded-full bg-primary-500 flex items-center justify-center">
                    <UIcon name="i-heroicons-check" class="w-4 h-4 text-white" />
                  </div>
                </div>
                <p class="text-sm text-gray-600 dark:text-gray-400">{{ gateway.description }}</p>
              </div>
            </div>
          </button>
        </div>
      </div>

      <!-- Итоговая стоимость -->
      <div class="relative overflow-hidden rounded-3xl bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 p-8 border-2 border-gray-200 dark:border-gray-700 shadow-lg">
        <div class="space-y-5">
          <div class="flex justify-between items-center text-gray-600 dark:text-gray-400">
            <span class="text-lg">Цена за место</span>
            <span class="text-xl font-semibold">{{ formatPrice(trip.price) }}</span>
          </div>
          <div class="flex justify-between items-center text-gray-600 dark:text-gray-400">
            <span class="text-lg">Количество мест</span>
            <span class="text-xl font-semibold">{{ formData.seats }}</span>
          </div>
          <div class="h-px bg-gradient-to-r from-transparent via-gray-300 dark:via-gray-600 to-transparent" />
          <div class="flex justify-between items-center pt-2">
            <span class="text-2xl font-bold text-gray-900 dark:text-white">Итого к оплате</span>
            <span class="text-4xl font-bold gradient-text">
              {{ formatPrice(trip.price * formData.seats) }}
            </span>
          </div>
        </div>
      </div>

      <!-- Кнопка отправки -->
      <UButton
        type="submit"
        color="primary"
        size="xl"
        block
        :loading="loading"
        :disabled="!isFormValid || loading"
        class="gradient-primary hover:opacity-90 text-white font-bold shadow-xl hover:shadow-2xl transition-all duration-300 text-xl py-6 rounded-2xl"
      >
        <span class="flex items-center justify-center gap-3">
          <UIcon name="i-heroicons-check-circle" class="w-7 h-7" />
          <span>{{ loading ? 'Бронирование...' : 'Забронировать места' }}</span>
        </span>
      </UButton>

      <!-- Подсказка -->
      <p class="text-base text-center text-gray-500 dark:text-gray-400">
        <template v-if="formData.payment_gateway === 'pay_on_arrival'">
          Бронирование с оплатой по факту
        </template>
        <template v-else>
          После бронирования вы будете перенаправлены на страницу оплаты
        </template>
      </p>
    </UForm>
  </div>
</template>
