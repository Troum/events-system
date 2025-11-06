<script setup lang="ts">
const currentYear = new Date().getFullYear()
</script>

<template>
  <UFooter class="border-t border-primary-200/50 dark:border-primary-800/50 backdrop-blur-md bg-white/80 dark:bg-gray-900/80 mt-20">
    <template #top>
      <UContainer class="py-12">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          <!-- О нас -->
          <div>
            <div class="flex items-center gap-3 mb-4">
              <div class="w-10 h-10 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center">
                <UIcon name="i-heroicons-map-pin" class="w-6 h-6 text-white" />
              </div>
              <span class="text-xl font-bold gradient-text">Camp Events</span>
            </div>
            <p class="text-gray-600 dark:text-gray-400">
              Платформа для организации поездок на мероприятия
            </p>
          </div>

          <!-- Навигация -->
          <div>
            <h3 class="font-bold text-lg mb-4 text-gray-900 dark:text-white">Навигация</h3>
            <ul class="space-y-2">
              <li>
                <NuxtLink to="/" class="text-gray-600 dark:text-gray-400 hover:text-primary-500 transition-colors">
                  Главная
                </NuxtLink>
              </li>
              <li>
                <NuxtLink to="/events" class="text-gray-600 dark:text-gray-400 hover:text-primary-500 transition-colors">
                  Мероприятия
                </NuxtLink>
              </li>
              <li>
                <NuxtLink to="/contact" class="text-gray-600 dark:text-gray-400 hover:text-primary-500 transition-colors">
                  Контакты
                </NuxtLink>
              </li>
            </ul>
          </div>

          <!-- Контакты -->
          <div>
            <h3 class="font-bold text-lg mb-4 text-gray-900 dark:text-white">Контакты</h3>
            <ul class="space-y-2 text-gray-600 dark:text-gray-400">
              <li class="flex items-center gap-2">
                <UIcon name="i-heroicons-envelope" class="w-5 h-5 text-primary-500" />
                <a href="mailto:info@camp-events.ru" class="hover:text-primary-500 transition-colors">
                  info@camp-events.ru
                </a>
              </li>
              <li class="flex items-center gap-2">
                <UIcon name="i-heroicons-phone" class="w-5 h-5 text-primary-500" />
                <a href="tel:+79991234567" class="hover:text-primary-500 transition-colors">
                  +7 (999) 123-45-67
                </a>
              </li>
            </ul>
          </div>
        </div>
      </UContainer>
    </template>

    <template #bottom>
      <UContainer class="py-6">
        <div class="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
          <p>
            © {{ currentYear }} Camp Events. Все права защищены.
          </p>
          <div class="flex items-center gap-4">
            <NuxtLink to="/contact" class="hover:text-primary-500 transition-colors">
              Связаться с нами
            </NuxtLink>
          </div>
        </div>
      </UContainer>
    </template>
  </UFooter>
</template>

<style scoped>
</style>
