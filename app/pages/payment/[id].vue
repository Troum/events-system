<script setup lang="ts">
import type { Booking, PaymentCreateDto } from '~/types'

const route = useRoute()
const router = useRouter()
const bookings = useBookings()
const payments = usePayments()

const booking = ref<Booking | null>(null)
const paymentId = ref<number | null>(null)
const paymentUrl = ref<string | null>(null)
const paymentCreated = ref(false)
const loading = ref(true)
const paymentLoading = ref(false)
const error = ref<string | null>(null)

const formatPrice = (price: number | string) => {
  const numPrice = typeof price === 'string' ? parseFloat(price) : price
  return new Intl.NumberFormat('ru-RU', {
    style: 'currency',
    currency: 'RUB',
  }).format(numPrice)
}

const paymentGatewayInfo = computed(() => {
  if (!booking.value?.payment_gateway) return null

  const gatewayMap = {
    yookassa: {
      label: 'ЮKassa',
      description: 'Банковская карта, СБП',
      icon: 'i-heroicons-credit-card',
    },
    stripe: {
      label: 'Stripe',
      description: 'Международные карты',
      icon: 'i-heroicons-globe-alt',
    },
    paypal: {
      label: 'PayPal',
      description: 'PayPal аккаунт',
      icon: 'i-heroicons-currency-dollar',
    },
    webpay: {
      label: 'WebPay',
      description: 'Онлайн платежи',
      icon: 'i-heroicons-device-phone-mobile',
    },
  }

  return gatewayMap[booking.value.payment_gateway as keyof typeof gatewayMap] || null
})

const loadBooking = async () => {
  try {
    loading.value = true
    const id = parseInt(route.params.id as string)
    const response = await bookings.getBooking(id)
    booking.value = response.data

    useSeo({
      title: 'Оплата бронирования',
      description: 'Оплатите ваше бронирование через безопасные платежные системы',
    })

    if (booking.value.payment_status === 'paid') {
      error.value = 'Бронирование уже оплачено'
      return
    }

    // Если выбрана оплата по факту, редиректим на страницу успеха
    if (booking.value.payment_gateway === 'pay_on_arrival') {
      router.push(`/booking/success?booking_id=${booking.value.id}`)
      return
    }
  } catch (e: any) {
    error.value = e.message || 'Ошибка при загрузке бронирования'
  } finally {
    loading.value = false
  }
}

const createPayment = async () => {
  if (!booking.value || !booking.value.payment_gateway) return

  try {
    paymentLoading.value = true
    const data: PaymentCreateDto = {
      booking_id: booking.value.id,
      provider: booking.value.payment_gateway,
    }

    const response = await payments.createPayment(data)
    paymentId.value = response.data.id
    paymentUrl.value = response.payment_url || null

    if (response.payment_url) {
      window.location.href = response.payment_url
    } else {
      paymentCreated.value = true
    }
  } catch (e: any) {
    error.value = e.message || 'Ошибка при создании платежа'
  } finally {
    paymentLoading.value = false
  }
}

onMounted(() => {
  loadBooking()
})
</script>

<template>
  <div class="min-h-screen py-16">
    <UContainer>
      <div class="max-w-3xl mx-auto">
        <div v-if="loading" class="flex justify-center items-center py-20">
          <UIcon name="i-heroicons-arrow-path" class="w-12 h-12 animate-spin text-primary-500" />
        </div>

        <UAlert
          v-else-if="error"
          color="error"
          variant="soft"
          :title="error"
          class="mb-8"
        />

        <div v-else-if="booking">
          <!-- Booking Info -->
          <UCard class="mb-8 backdrop-blur-md bg-white/90 dark:bg-gray-900/90 border-2 border-primary-200/50 dark:border-primary-800/50 shadow-xl">
            <template #header>
              <h1 class="text-3xl font-bold gradient-text">Оплата бронирования</h1>
            </template>

            <div class="space-y-6">
              <div v-if="booking.trip?.event">
                <h2 class="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-4">{{ booking.trip.event.title }}</h2>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div class="p-4 rounded-lg bg-primary-50/50 dark:bg-primary-900/20">
                    <p class="text-sm text-gray-500 dark:text-gray-400 mb-1">Имя</p>
                    <p class="font-semibold text-lg">{{ booking.user_name }}</p>
                  </div>
                  <div class="p-4 rounded-lg bg-primary-50/50 dark:bg-primary-900/20">
                    <p class="text-sm text-gray-500 dark:text-gray-400 mb-1">Email</p>
                    <p class="font-semibold text-lg">{{ booking.user_email }}</p>
                  </div>
                  <div class="p-4 rounded-lg bg-primary-50/50 dark:bg-primary-900/20">
                    <p class="text-sm text-gray-500 dark:text-gray-400 mb-1">Телефон</p>
                    <p class="font-semibold text-lg">{{ booking.user_phone }}</p>
                  </div>
                  <div class="p-4 rounded-lg bg-primary-50/50 dark:bg-primary-900/20">
                    <p class="text-sm text-gray-500 dark:text-gray-400 mb-1">Количество мест</p>
                    <p class="font-semibold text-lg">{{ booking.seats }}</p>
                  </div>
                </div>

                <div v-if="booking.trip" class="mt-6 p-6 rounded-xl bg-gradient-to-br from-primary-100 to-primary-50 dark:from-primary-900/30 dark:to-primary-800/20 border-2 border-primary-300/50 dark:border-primary-700/50">
                  <div class="flex justify-between items-center">
                    <span class="text-xl text-gray-700 dark:text-gray-300">К оплате:</span>
                    <span class="text-4xl font-bold gradient-text">
                      {{ formatPrice(booking.trip.price * booking.seats) }}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </UCard>

          <!-- Payment Method -->
          <UCard v-if="!paymentCreated && paymentGatewayInfo" class="backdrop-blur-md bg-white/90 dark:bg-gray-900/90 border-2 border-primary-200/50 dark:border-primary-800/50 shadow-xl">
            <template #header>
              <h2 class="text-2xl font-bold gradient-text">Оплата</h2>
            </template>

            <div class="space-y-6">
              <!-- Выбранный способ оплаты -->
              <div class="p-6 rounded-2xl border-2 border-primary-300 dark:border-primary-700 bg-primary-50/50 dark:bg-primary-900/20">
                <div class="flex items-center gap-4 mb-4">
                  <div class="w-14 h-14 rounded-xl bg-primary-500 flex items-center justify-center">
                    <UIcon :name="paymentGatewayInfo.icon" class="w-8 h-8 text-white" />
                  </div>
                  <div class="flex-1">
                    <h3 class="text-xl font-bold text-gray-900 dark:text-white">
                      {{ paymentGatewayInfo.label }}
                    </h3>
                    <p class="text-sm text-gray-600 dark:text-gray-400">
                      {{ paymentGatewayInfo.description }}
                    </p>
                  </div>
                </div>
                <p class="text-sm text-gray-500 dark:text-gray-400">
                  Вы выбрали этот способ оплаты при бронировании
                </p>
              </div>

              <!-- Кнопка оплаты -->
              <UButton
                color="primary"
                size="xl"
                block
                :loading="paymentLoading"
                @click="createPayment()"
                class="gradient-primary hover:opacity-90 text-white font-bold shadow-xl hover:shadow-2xl transition-all duration-300 text-lg py-6"
              >
                <div class="flex items-center justify-center gap-3">
                  <UIcon :name="paymentGatewayInfo.icon" class="w-6 h-6" />
                  <span>Перейти к оплате</span>
                </div>
              </UButton>

              <p class="text-sm text-center text-gray-500 dark:text-gray-400">
                После нажатия вы будете перенаправлены на безопасную страницу оплаты
              </p>
            </div>
          </UCard>

          <!-- Payment Form (if created) -->
          <div v-else-if="paymentId">
            <PaymentForm :payment-id="paymentId" :payment-url="paymentUrl" />
          </div>
        </div>
      </div>
    </UContainer>
  </div>
</template>
