<script setup lang="ts">
import type { Event } from '~/types'

useSeo({
  title: 'Главная',
  description: 'Платформа для организации поездок на мероприятия. Бронируйте места и отправляйтесь на интересные события.',
})

const events = useEvents()
const eventsList = ref<Event[]>([])
const loading = ref(true)
const error = ref<string | null>(null)

onMounted(async () => {
  try {
    loading.value = true
    const response = await events.getEvents({ per_page: 6 })
    eventsList.value = response.data
  } catch (e: any) {
    error.value = e.message || 'Ошибка при загрузке мероприятий'
  } finally {
    loading.value = false
  }
})
</script>

<template>
  <div class="min-h-screen">
    <!-- Hero Section -->
    <section class="relative py-20 lg:py-32 overflow-hidden">
      <!-- Декоративные элементы -->
      <div class="absolute top-0 right-0 w-[500px] h-[500px] bg-primary-200/30 rounded-full blur-3xl animate-pulse" />
      <div class="absolute bottom-0 left-0 w-[600px] h-[600px] bg-primary-300/20 rounded-full blur-3xl animate-pulse" style="animation-delay: 1s;" />
      <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-primary-400/10 rounded-full blur-3xl" />

      <UContainer class="relative z-10">
        <div class="text-center max-w-5xl mx-auto">
          <!-- Иконка -->
          <div class="mb-8 flex justify-center">
            <div class="w-24 h-24 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center shadow-2xl animate-bounce">
              <UIcon name="i-heroicons-map-pin" class="w-12 h-12 text-white" />
            </div>
          </div>

          <h1 class="text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold mb-8 leading-tight">
            <span class="gradient-text">Поездки на мероприятия</span>
          </h1>

          <p class="text-xl md:text-2xl lg:text-3xl text-gray-600 dark:text-gray-300 mb-12 leading-relaxed">
            Забронируйте место и отправляйтесь на интересные события
          </p>

          <!-- Features -->
          <div class="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto mb-12">
            <div class="p-6 rounded-2xl backdrop-blur-md bg-white/80 dark:bg-gray-900/80 border-2 border-primary-200/50 dark:border-primary-800/50 shadow-lg hover:shadow-xl transition-all">
              <div class="w-12 h-12 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center mx-auto mb-4">
                <UIcon name="i-heroicons-calendar-days" class="w-6 h-6 text-white" />
              </div>
              <h3 class="font-bold text-lg mb-2 gradient-text">Удобное бронирование</h3>
              <p class="text-gray-600 dark:text-gray-400 text-sm">
                Выбирайте мероприятия и бронируйте места в несколько кликов
              </p>
            </div>

            <div class="p-6 rounded-2xl backdrop-blur-md bg-white/80 dark:bg-gray-900/80 border-2 border-primary-200/50 dark:border-primary-800/50 shadow-lg hover:shadow-xl transition-all">
              <div class="w-12 h-12 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center mx-auto mb-4">
                <UIcon name="i-heroicons-credit-card" class="w-6 h-6 text-white" />
              </div>
              <h3 class="font-bold text-lg mb-2 gradient-text">Безопасная оплата</h3>
              <p class="text-gray-600 dark:text-gray-400 text-sm">
                Оплачивайте онлайн через проверенные платежные системы
              </p>
            </div>

            <div class="p-6 rounded-2xl backdrop-blur-md bg-white/80 dark:bg-gray-900/80 border-2 border-primary-200/50 dark:border-primary-800/50 shadow-lg hover:shadow-xl transition-all">
              <div class="w-12 h-12 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center mx-auto mb-4">
                <UIcon name="i-heroicons-bell-alert" class="w-6 h-6 text-white" />
              </div>
              <h3 class="font-bold text-lg mb-2 gradient-text">Уведомления</h3>
              <p class="text-gray-600 dark:text-gray-400 text-sm">
                Получайте напоминания на email и в Telegram
              </p>
            </div>
          </div>

          <div class="flex flex-col sm:flex-row gap-4 justify-center">
            <UButton
              to="/events"
              color="primary"
              size="xl"
              class="gradient-primary hover:opacity-90 text-white font-bold shadow-xl hover:shadow-2xl transition-all duration-300 text-lg px-12 py-4"
            >
              Смотреть мероприятия
            </UButton>
            <UButton
              to="/contact"
              variant="outline"
              size="xl"
              class="border-2 border-primary-400 hover:bg-primary-50 dark:hover:bg-primary-900/20 font-bold text-lg px-12 py-4 text-primary-500"
            >
              Связаться с нами
            </UButton>
          </div>
        </div>
      </UContainer>
    </section>

    <!-- Events Section -->
    <section class="py-16 lg:py-24">
      <UContainer>
        <div class="text-center mb-12">
          <h2 class="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
            <span class="gradient-text">Ближайшие мероприятия</span>
          </h2>
          <p class="text-lg md:text-xl text-gray-600 dark:text-gray-300">
            Выберите интересующее вас событие
          </p>
        </div>

        <div v-if="loading" class="flex justify-center items-center py-20">
          <UIcon name="i-heroicons-arrow-path" class="w-12 h-12 animate-spin text-primary-500" />
        </div>

        <UAlert
          v-else-if="error"
          color="neutral"
          variant="soft"
          :title="error"
          class="max-w-2xl mx-auto"
        />

        <div v-else-if="eventsList && eventsList.length > 0">
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            <EventCard
              v-for="event in eventsList"
              :key="event.id"
              :event="event"
            />
          </div>

          <div class="text-center">
            <UButton
              to="/events"
              color="primary"
              variant="outline"
              size="xl"
              class="border-2 border-primary-400 hover:bg-primary-50 dark:hover:bg-primary-900/20 font-bold text-lg px-12 py-4 text-primary-500"
            >
              Все мероприятия
            </UButton>
          </div>
        </div>

        <!-- Empty State with Visual -->
        <div v-else class="py-20">
          <div class="max-w-[75%] mx-auto text-center">
            <!-- Декоративная иллюстрация -->
            <div class="relative mb-12">
              <div class="absolute inset-0 flex items-center justify-center">
                <div class="w-64 h-64 bg-primary-200/30 rounded-full blur-3xl" />
              </div>
              <div class="relative flex justify-center items-center gap-4">
                <div class="w-32 h-32 rounded-2xl bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center shadow-2xl animate-pulse">
                  <UIcon name="i-heroicons-calendar-days" class="w-16 h-16 text-white" />
                </div>
                <div class="w-24 h-24 rounded-2xl bg-gradient-to-br from-primary-300 to-primary-500 flex items-center justify-center shadow-xl animate-pulse" style="animation-delay: 0.3s;">
                  <UIcon name="i-heroicons-ticket" class="w-12 h-12 text-white" />
                </div>
              </div>
            </div>

            <h3 class="text-3xl md:text-4xl font-bold mb-6 gradient-text">
              Скоро появятся новые мероприятия!
            </h3>
            <p class="text-xl text-gray-600 dark:text-gray-400 mb-8 leading-relaxed">
              Мы работаем над добавлением интересных событий. Подпишитесь на уведомления, чтобы не пропустить!
            </p>

            <div class="flex flex-col sm:flex-row gap-4 justify-center">
              <UButton
                to="/contact"
                size="xl"
                class="gradient-primary hover:opacity-90 text-white font-bold shadow-xl hover:shadow-2xl transition-all duration-300 text-lg px-12 py-4 text-white"
              >
                <div class="flex items-center gap-2">
                  <UIcon name="i-heroicons-envelope" class="w-6 h-6 text-white" />
                  <span>Связаться с нами</span>
                </div>
              </UButton>
            </div>

            <!-- Дополнительные иконки -->
            <div class="mt-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
              <div class="group p-10 rounded-3xl backdrop-blur-md bg-white/80 dark:bg-gray-900/80 border-2 border-primary-200/50 dark:border-primary-800/50 hover:border-primary-400 dark:hover:border-primary-600 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2">
                <div class="relative mb-6">
                  <div class="absolute inset-0 bg-gradient-to-br from-cyan-400 via-blue-500 to-purple-600 rounded-3xl blur-2xl opacity-50 group-hover:opacity-75 transition-opacity" />
                  <div class="relative w-24 h-24 rounded-3xl bg-gradient-to-br from-cyan-400 via-blue-500 to-purple-600 flex items-center justify-center mx-auto shadow-2xl">
                    <UIcon name="i-heroicons-map-pin" class="w-12 h-12 text-white" />
                  </div>
                </div>
                <p class="text-lg font-bold bg-gradient-to-r from-cyan-600 via-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Разные города
                </p>
              </div>

              <div class="group p-10 rounded-3xl backdrop-blur-md bg-white/80 dark:bg-gray-900/80 border-2 border-primary-200/50 dark:border-primary-800/50 hover:border-primary-400 dark:hover:border-primary-600 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2">
                <div class="relative mb-6">
                  <div class="absolute inset-0 bg-gradient-to-br from-pink-400 via-rose-500 to-orange-600 rounded-3xl blur-2xl opacity-50 group-hover:opacity-75 transition-opacity" />
                  <div class="relative w-24 h-24 rounded-3xl bg-gradient-to-br from-pink-400 via-rose-500 to-orange-600 flex items-center justify-center mx-auto shadow-2xl">
                    <UIcon name="i-heroicons-users" class="w-12 h-12 text-white" />
                  </div>
                </div>
                <p class="text-lg font-bold bg-gradient-to-r from-pink-600 via-rose-600 to-orange-600 bg-clip-text text-transparent">
                  Групповые поездки
                </p>
              </div>

              <div class="group p-10 rounded-3xl backdrop-blur-md bg-white/80 dark:bg-gray-900/80 border-2 border-primary-200/50 dark:border-primary-800/50 hover:border-primary-400 dark:hover:border-primary-600 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2">
                <div class="relative mb-6">
                  <div class="absolute inset-0 bg-gradient-to-br from-yellow-400 via-amber-500 to-orange-600 rounded-3xl blur-2xl opacity-50 group-hover:opacity-75 transition-opacity" />
                  <div class="relative w-24 h-24 rounded-3xl bg-gradient-to-br from-yellow-400 via-amber-500 to-orange-600 flex items-center justify-center mx-auto shadow-2xl">
                    <UIcon name="i-heroicons-star" class="w-12 h-12 text-white" />
                  </div>
                </div>
                <p class="text-lg font-bold bg-gradient-to-r from-yellow-600 via-amber-600 to-orange-600 bg-clip-text text-transparent">
                  Лучшие события
                </p>
              </div>

              <div class="group p-10 rounded-3xl backdrop-blur-md bg-white/80 dark:bg-gray-900/80 border-2 border-primary-200/50 dark:border-primary-800/50 hover:border-primary-400 dark:hover:border-primary-600 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2">
                <div class="relative mb-6">
                  <div class="absolute inset-0 bg-gradient-to-br from-emerald-400 via-teal-500 to-cyan-600 rounded-3xl blur-2xl opacity-50 group-hover:opacity-75 transition-opacity" />
                  <div class="relative w-24 h-24 rounded-3xl bg-gradient-to-br from-emerald-400 via-teal-500 to-cyan-600 flex items-center justify-center mx-auto shadow-2xl">
                    <UIcon name="i-heroicons-shield-check" class="w-12 h-12 text-white" />
                  </div>
                </div>
                <p class="text-lg font-bold bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 bg-clip-text text-transparent">
                  Безопасно
                </p>
              </div>
            </div>
          </div>
        </div>
      </UContainer>
    </section>

    <!-- CTA Section -->
    <section class="py-20 lg:py-32">
      <UContainer>
        <div class="relative overflow-hidden rounded-3xl backdrop-blur-md bg-gradient-to-br from-primary-500/90 to-primary-700/90 dark:from-primary-600/90 dark:to-primary-800/90 p-12 lg:p-20 shadow-2xl">
          <!-- Декоративные элементы -->
          <div class="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
          <div class="absolute bottom-0 left-0 w-96 h-96 bg-white/10 rounded-full blur-3xl" />

          <div class="relative z-10 text-center max-w-3xl mx-auto">
            <h2 class="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6">
              Готовы к новым впечатлениям?
            </h2>
            <p class="text-xl md:text-2xl text-white/90 mb-10 leading-relaxed">
              Присоединяйтесь к нам и откройте для себя мир незабываемых событий
            </p>
            <UButton
              to="/events"
              size="xl"
              class="bg-white hover:bg-gray-100 text-primary-600 font-bold shadow-xl hover:shadow-2xl transition-all duration-300 text-lg px-12 py-4"
            >
              Начать путешествие
            </UButton>
          </div>
        </div>
      </UContainer>
    </section>
  </div>
</template>
