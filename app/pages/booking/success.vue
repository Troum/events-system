<script setup lang="ts">
definePageMeta({
  title: 'Бронирование успешно',
})

const route = useRoute()
const bookingId = computed(() => route.query.booking_id as string)
</script>

<template>
  <div class="min-h-screen flex items-center justify-center p-4">
    <UContainer>
      <div class="max-w-2xl mx-auto">
        <!-- Успешное бронирование -->
        <div class="text-center space-y-8">
          <!-- Иконка успеха -->
          <div class="flex justify-center">
            <div class="w-32 h-32 rounded-full bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center shadow-2xl animate-bounce">
              <UIcon name="i-heroicons-check" class="w-20 h-20 text-white" />
            </div>
          </div>

          <!-- Заголовок -->
          <div class="space-y-4">
            <h1 class="text-4xl md:text-5xl font-bold gradient-text">
              Бронирование успешно создано!
            </h1>
            <p class="text-xl text-gray-600 dark:text-gray-400">
              Ваша бронь принята и ожидает подтверждения
            </p>
          </div>

          <!-- Информация о брони -->
          <div v-if="bookingId" class="p-8 rounded-3xl bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 border-2 border-gray-200 dark:border-gray-700 shadow-lg">
            <div class="space-y-4">
              <div class="flex items-center justify-center gap-3 text-gray-600 dark:text-gray-400">
                <UIcon name="i-heroicons-ticket" class="w-6 h-6" />
                <span class="text-lg">Номер бронирования:</span>
              </div>
              <p class="text-3xl font-bold gradient-text">
                #{{ bookingId }}
              </p>
            </div>
          </div>

          <!-- Информационный блок -->
          <div class="p-6 rounded-2xl bg-blue-50 dark:bg-blue-900/20 border-2 border-blue-200 dark:border-blue-800">
            <div class="flex items-start gap-4 text-left">
              <div class="w-12 h-12 rounded-xl bg-blue-500 flex items-center justify-center flex-shrink-0">
                <UIcon name="i-heroicons-information-circle" class="w-6 h-6 text-white" />
              </div>
              <div class="space-y-2">
                <p class="font-bold text-lg text-blue-900 dark:text-blue-100">
                  Что дальше?
                </p>
                <ul class="space-y-2 text-blue-800 dark:text-blue-200">
                  <li class="flex items-start gap-2">
                    <UIcon name="i-heroicons-check-circle" class="w-5 h-5 flex-shrink-0 mt-0.5" />
                    <span>Информация о бронировании отправлена на вашу почту</span>
                  </li>
                  <li class="flex items-start gap-2">
                    <UIcon name="i-heroicons-check-circle" class="w-5 h-5 flex-shrink-0 mt-0.5" />
                    <span>Организатор свяжется с вами для подтверждения</span>
                  </li>
                  <li class="flex items-start gap-2">
                    <UIcon name="i-heroicons-check-circle" class="w-5 h-5 flex-shrink-0 mt-0.5" />
                    <span>Оплата производится при встрече с водителем</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          <!-- Кнопки действий -->
          <div class="flex flex-col sm:flex-row gap-4 justify-center">
            <UButton
              to="/"
              color="primary"
              size="xl"
              class="gradient-primary text-white font-bold shadow-lg hover:shadow-xl transition-all text-lg py-4 px-8 rounded-2xl"
            >
              <UIcon name="i-heroicons-home" class="w-6 h-6" />
              На главную
            </UButton>

            <UButton
              to="/events"
              variant="outline"
              size="xl"
              color="primary"
              class="font-bold text-lg py-4 px-8 rounded-2xl"
            >
              <UIcon name="i-heroicons-calendar-days" class="w-6 h-6" />
              Другие события
            </UButton>
          </div>
        </div>
      </div>
    </UContainer>
  </div>
</template>

