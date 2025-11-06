<script setup lang="ts">
definePageMeta({
  title: 'Ошибка бронирования',
})

const route = useRoute()
const errorMessage = computed(() => route.query.message as string || 'Во время бронирования произошла ошибка')
</script>

<template>
  <div class="min-h-screen flex items-center justify-center p-4">
    <UContainer>
      <div class="max-w-2xl mx-auto">
        <!-- Ошибка бронирования -->
        <div class="text-center space-y-8">
          <!-- Иконка ошибки -->
          <div class="flex justify-center">
            <div class="w-32 h-32 rounded-full bg-gradient-to-br from-red-400 to-red-600 flex items-center justify-center shadow-2xl">
              <UIcon name="i-heroicons-x-mark" class="w-20 h-20 text-white" />
            </div>
          </div>

          <!-- Заголовок -->
          <div class="space-y-4">
            <h1 class="text-4xl md:text-5xl font-bold text-red-600 dark:text-red-400">
              Ошибка бронирования
            </h1>
            <p class="text-xl text-gray-600 dark:text-gray-400">
              {{ errorMessage }}
            </p>
          </div>

          <!-- Информационный блок -->
          <div class="p-6 rounded-2xl bg-red-50 dark:bg-red-900/20 border-2 border-red-200 dark:border-red-800">
            <div class="flex items-start gap-4 text-left">
              <div class="w-12 h-12 rounded-xl bg-red-500 flex items-center justify-center flex-shrink-0">
                <UIcon name="i-heroicons-exclamation-triangle" class="w-6 h-6 text-white" />
              </div>
              <div class="space-y-2">
                <p class="font-bold text-lg text-red-900 dark:text-red-100">
                  Что делать?
                </p>
                <ul class="space-y-2 text-red-800 dark:text-red-200">
                  <li class="flex items-start gap-2">
                    <UIcon name="i-heroicons-arrow-path" class="w-5 h-5 flex-shrink-0 mt-0.5" />
                    <span>Попробуйте еще раз через несколько минут</span>
                  </li>
                  <li class="flex items-start gap-2">
                    <UIcon name="i-heroicons-phone" class="w-5 h-5 flex-shrink-0 mt-0.5" />
                    <span>Свяжитесь со службой поддержки</span>
                  </li>
                  <li class="flex items-start gap-2">
                    <UIcon name="i-heroicons-calendar-days" class="w-5 h-5 flex-shrink-0 mt-0.5" />
                    <span>Выберите другую дату или поездку</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          <!-- Кнопки действий -->
          <div class="flex flex-col sm:flex-row gap-4 justify-center">
            <UButton
              @click="$router.back()"
              color="primary"
              size="xl"
              class="gradient-primary text-white font-bold shadow-lg hover:shadow-xl transition-all text-lg py-4 px-8 rounded-2xl"
            >
              <UIcon name="i-heroicons-arrow-left" class="w-6 h-6" />
              Попробовать снова
            </UButton>

            <UButton
              to="/contact"
              variant="outline"
              size="xl"
              class="font-bold text-lg py-4 px-8 rounded-2xl"
            >
              <UIcon name="i-heroicons-chat-bubble-left-right" class="w-6 h-6" />
              Связаться с нами
            </UButton>
          </div>
        </div>
      </div>
    </UContainer>
  </div>
</template>

