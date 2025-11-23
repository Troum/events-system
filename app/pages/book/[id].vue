<script setup lang="ts">
import type { Trip, BookingCreateDto } from '~/types'

const route = useRoute()
const router = useRouter()
const trips = useTrips()
const bookings = useBookings()

const trip = ref<Trip | null>(null)
const loading = ref(true)
const error = ref<string | null>(null)

const availableSeats = computed(() => {
  if (!trip.value) return 0
  return trip.value.seats_total - trip.value.seats_taken
})

const { formatTime } = useFormatters()

const loadTrip = async () => {
  try {
    loading.value = true
    const id = parseInt(route.params.id as string)
    const response = await trips.getTrip(id)
    trip.value = response.data

    useSeo({
      title: trip.value.event ? `Бронирование - ${trip.value.event.title}` : 'Бронирование',
      description: trip.value.event ? `Забронируйте место на мероприятие ${trip.value.event.title}` : 'Забронируйте место на поездку',
    })

    if (availableSeats.value <= 0) {
      error.value = 'К сожалению, все места заняты'
    }
  } catch (e: any) {
    error.value = e.message || 'Ошибка при загрузке поездки'
  } finally {
    loading.value = false
  }
}

const handleBookingSubmit = async (data: any) => {
  const toast = useToast()
  
  try {
    if (!trip.value) {
      error.value = 'Поездка не найдена'
      return
    }

    // Добавляем trip_id к данным формы
    const bookingData: BookingCreateDto = {
      ...data,
      trip_id: trip.value.id
    }

    console.log('Sending booking data:', bookingData)

    const response = await bookings.createBooking(bookingData)
    const booking = response.data

    console.log('Booking created:', booking)

    // Проверяем способ оплаты из ответа API
    if (booking.payment_gateway === 'pay_on_arrival') {
      // Оплата по факту - редиректим на страницу успеха
      toast.add({
        title: 'Бронирование создано!',
        description: 'Оплата при встрече с водителем',
        color: 'green',
        icon: 'i-heroicons-check-circle'
      })

      setTimeout(() => {
        router.push(`/booking/success?booking_id=${booking.id}`)
      }, 1000)
    } else {
      // Онлайн оплата - редиректим на страницу оплаты
      toast.add({
        title: 'Бронирование создано!',
        description: 'Переходим к оплате...',
        color: 'green',
        icon: 'i-heroicons-check-circle'
      })

      setTimeout(() => {
        router.push(`/payment/${booking.id}`)
      }, 1000)
    }
  } catch (e: any) {
    console.error('Booking error:', e)
    
    // Обработка ошибок валидации
    if (e.response?.status === 422 && e.response?.data?.errors) {
      const errors = e.response.data.errors
      const errorMessages = Object.values(errors).flat().join(', ')
      const errorMessageStr = String(errorMessages)
      
      toast.add({
        title: 'Ошибка валидации',
        description: errorMessageStr,
        color: 'red',
        icon: 'i-heroicons-x-circle'
      })

      // Редиректим на страницу ошибки
      setTimeout(() => {
        router.push(`/booking/error?message=${encodeURIComponent(errorMessageStr)}`)
      }, 2000)
    } else if (e.response?.data?.message) {
      const errorMessage = e.response.data.message
      
      toast.add({
        title: 'Ошибка',
        description: errorMessage,
        color: 'red',
        icon: 'i-heroicons-x-circle'
      })

      // Редиректим на страницу ошибки
      setTimeout(() => {
        router.push(`/booking/error?message=${encodeURIComponent(errorMessage)}`)
      }, 2000)
    } else {
      const errorMessage = e.message || 'Ошибка при создании бронирования'
      
      toast.add({
        title: 'Ошибка',
        description: errorMessage,
        color: 'red',
        icon: 'i-heroicons-x-circle'
      })

      // Редиректим на страницу ошибки
      setTimeout(() => {
        router.push('/booking/error')
      }, 2000)
    }
  }
}

onMounted(() => {
  loadTrip()
})
</script>

<template>
  <div class="min-h-screen py-16">
    <UContainer>
      <div class="max-w-3xl mx-auto">
        <!-- Back Button -->
        <div class="mb-8">
          <UButton
            :to="trip && trip.event ? `/event/${trip.event.slug}` : trip && trip.event_slug ? `/event/${trip.event_slug}` : '/events'"
            color="primary"
            variant="ghost"
            icon="i-heroicons-arrow-left"
            size="lg"
            class="hover:bg-primary-100/50 dark:hover:bg-primary-900/50 text-primary-500"
          >
            Назад
          </UButton>
        </div>

        <div v-if="loading" class="flex justify-center items-center py-20">
          <UIcon name="i-heroicons-arrow-path" class="w-12 h-12 animate-spin text-primary-500" />
        </div>

        <UAlert
          v-else-if="error"
          variant="soft"
          :title="error"
          class="mb-8 bg-red-100"
        />

        <div v-else-if="trip">
          <!-- Trip Info -->
          <UCard class="mb-8 backdrop-blur-md bg-white/90 dark:bg-gray-900/90 border-2 border-primary-200/50 dark:border-primary-800/50 shadow-xl">
            <template #header>
              <h1 class="text-3xl font-bold gradient-text">Бронирование</h1>
            </template>

            <div class="space-y-4">
              <div v-if="trip.event">
                <h2 class="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-4">{{ trip.event.title }}</h2>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div class="p-4 rounded-lg bg-primary-50/50 dark:bg-primary-900/20">
                    <p class="text-sm text-gray-500 dark:text-gray-400 mb-1">Откуда</p>
                    <p class="font-semibold text-lg">{{ trip.city_from }}</p>
                  </div>
                  <div class="p-4 rounded-lg bg-primary-50/50 dark:bg-primary-900/20">
                    <p class="text-sm text-gray-500 dark:text-gray-400 mb-1">Время отправления</p>
                    <p class="font-semibold text-lg">{{ formatTime(trip.departure_time) }}</p>
                  </div>
                  <div class="p-4 rounded-lg bg-primary-50/50 dark:bg-primary-900/20 md:col-span-2">
                    <p class="text-sm text-gray-500 dark:text-gray-400 mb-1">Место проведения</p>
                    <p class="font-semibold text-lg">{{ trip.event.location }}</p>
                  </div>
                </div>
              </div>
            </div>
          </UCard>

          <!-- Booking Form -->
          <UCard class="backdrop-blur-md bg-white/90 dark:bg-gray-900/90 border-2 border-primary-200/50 dark:border-primary-800/50 shadow-xl">
            <template #header>
              <h2 class="text-2xl font-bold gradient-text">Заполните данные</h2>
            </template>

            <BookingForm
              :trip="trip"
              :available-seats="availableSeats"
              @submit="handleBookingSubmit"
            />
          </UCard>
        </div>
      </div>
    </UContainer>
  </div>
</template>
