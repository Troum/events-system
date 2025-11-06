<script setup lang="ts">
interface Props {
  title?: string
  description?: string
  showBackButton?: boolean
  showContactButton?: boolean
}

withDefaults(defineProps<Props>(), {
  title: 'Мероприятия скоро появятся',
  description: 'Мы работаем над добавлением интересных событий. Следите за обновлениями!',
  showBackButton: true,
  showContactButton: true,
})
</script>

<template>
  <div class="py-20">
    <div class="max-w-3xl mx-auto text-center">
      <!-- Декоративная иллюстрация -->
      <div class="relative mb-12">
        <div class="absolute inset-0 flex items-center justify-center">
          <div class="w-80 h-80 bg-primary-200/30 rounded-full blur-3xl" />
        </div>
        <div class="relative flex justify-center items-center gap-6">
          <div class="w-40 h-40 rounded-3xl bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center shadow-2xl animate-pulse">
            <UIcon name="i-heroicons-calendar-days" class="w-20 h-20 text-white" />
          </div>
          <div class="flex flex-col gap-4">
            <div class="w-28 h-28 rounded-2xl bg-gradient-to-br from-primary-300 to-primary-500 flex items-center justify-center shadow-xl animate-pulse" style="animation-delay: 0.2s;">
              <UIcon name="i-heroicons-ticket" class="w-14 h-14 text-white" />
            </div>
            <div class="w-28 h-28 rounded-2xl bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center shadow-xl animate-pulse" style="animation-delay: 0.4s;">
              <UIcon name="i-heroicons-map-pin" class="w-14 h-14 text-white" />
            </div>
          </div>
        </div>
      </div>

      <h2 class="text-4xl md:text-5xl font-bold mb-6 gradient-text">
        {{ title }}
      </h2>
      <p class="text-xl md:text-2xl text-gray-600 dark:text-gray-400 mb-10 leading-relaxed" v-html="description" />

      <div v-if="showBackButton || showContactButton" class="flex flex-col sm:flex-row gap-4 justify-center mb-16">
        <UButton
          v-if="showBackButton"
          to="/"
          color="primary"
          size="xl"
          class="gradient-primary hover:opacity-90 text-white font-bold shadow-xl hover:shadow-2xl transition-all duration-300 text-lg px-12 py-4"
        >
          <div class="flex items-center gap-2">
            <UIcon name="i-heroicons-home" class="w-6 h-6" />
            <span>На главную</span>
          </div>
        </UButton>
        <UButton
          v-if="showContactButton"
          to="/contact"
          color="primary"
          variant="outline"
          size="xl"
          class="border-2 border-primary-400 hover:bg-primary-50 dark:hover:bg-primary-900/20 font-bold text-lg px-12 py-4"
        >
          <div class="flex items-center gap-2">
            <UIcon name="i-heroicons-envelope" class="w-6 h-6" />
            <span>Связаться</span>
          </div>
        </UButton>
      </div>

      <!-- Информационные карточки -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div class="p-8 rounded-2xl backdrop-blur-md bg-white/80 dark:bg-gray-900/80 border-2 border-primary-200/50 dark:border-primary-800/50 shadow-lg hover:shadow-xl transition-all">
          <div class="w-16 h-16 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center mx-auto mb-4">
            <UIcon name="i-heroicons-bell-alert" class="w-8 h-8 text-white" />
          </div>
          <h3 class="font-bold text-lg mb-2 gradient-text">Уведомления</h3>
          <p class="text-gray-600 dark:text-gray-400 text-sm">
            Подпишитесь, чтобы узнать о новых мероприятиях первыми
          </p>
        </div>

        <div class="p-8 rounded-2xl backdrop-blur-md bg-white/80 dark:bg-gray-900/80 border-2 border-primary-200/50 dark:border-primary-800/50 shadow-lg hover:shadow-xl transition-all">
          <div class="w-16 h-16 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center mx-auto mb-4">
            <UIcon name="i-heroicons-users" class="w-8 h-8 text-white" />
          </div>
          <h3 class="font-bold text-lg mb-2 gradient-text">Групповые поездки</h3>
          <p class="text-gray-600 dark:text-gray-400 text-sm">
            Путешествуйте в компании единомышленников
          </p>
        </div>

        <div class="p-8 rounded-2xl backdrop-blur-md bg-white/80 dark:bg-gray-900/80 border-2 border-primary-200/50 dark:border-primary-800/50 shadow-lg hover:shadow-xl transition-all">
          <div class="w-16 h-16 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center mx-auto mb-4">
            <UIcon name="i-heroicons-shield-check" class="w-8 h-8 text-white" />
          </div>
          <h3 class="font-bold text-lg mb-2 gradient-text">Безопасность</h3>
          <p class="text-gray-600 dark:text-gray-400 text-sm">
            Надежная система бронирования и оплаты
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

