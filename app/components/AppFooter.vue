<script setup lang="ts">
const { contacts, settings, fetchContacts, fetchSettings, getTelegramUrl, getInstagramUrl, getWhatsAppUrl } = useSettings()
const currentYear = new Date().getFullYear()

// Загружаем контакты и настройки при монтировании компонента
onMounted(async () => {
  await Promise.all([
    fetchContacts(),
    fetchSettings(),
  ])
})
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
              <span class="text-xl font-bold gradient-text">
                {{ settings?.general?.site_name || 'Camp Events' }}
              </span>
            </div>
            <p class="text-gray-600 dark:text-gray-400">
              {{ settings?.general?.site_description || 'Платформа для организации поездок на мероприятия' }}
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
              <li v-if="contacts?.email" class="flex items-center gap-2">
                <UIcon name="i-heroicons-envelope" class="w-5 h-5 text-primary-500" />
                <a :href="`mailto:${contacts.email}`" class="hover:text-primary-500 transition-colors">
                  {{ contacts.email }}
                </a>
              </li>
              <li v-if="contacts?.phone" class="flex items-center gap-2">
                <UIcon name="i-heroicons-phone" class="w-5 h-5 text-primary-500" />
                <a :href="`tel:${contacts.phone.replace(/\s/g, '')}`" class="hover:text-primary-500 transition-colors">
                  {{ contacts.phone }}
                </a>
              </li>
              <li v-if="contacts?.address" class="flex items-center gap-2">
                <UIcon name="i-heroicons-map-pin" class="w-5 h-5 text-primary-500" />
                <span>{{ contacts.address }}</span>
              </li>
            </ul>
            
            <!-- Социальные сети -->
            <div v-if="contacts?.telegram || contacts?.instagram || contacts?.whatsapp || contacts?.vk || contacts?.facebook" class="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
              <h4 class="font-semibold text-sm mb-3 text-gray-900 dark:text-white">Мы в соцсетях</h4>
              <div class="flex items-center gap-3">
                <a
                  v-if="contacts?.telegram"
                  :href="getTelegramUrl() || '#'"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="w-9 h-9 rounded-full bg-blue-500 hover:bg-blue-600 flex items-center justify-center transition-colors"
                  title="Telegram"
                >
                  <UIcon name="i-heroicons-paper-airplane" class="w-5 h-5 text-white" />
                </a>
                <a
                  v-if="contacts?.whatsapp"
                  :href="getWhatsAppUrl() || '#'"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="w-9 h-9 rounded-full bg-green-500 hover:bg-green-600 flex items-center justify-center transition-colors"
                  title="WhatsApp"
                >
                  <UIcon name="i-heroicons-chat-bubble-left-right" class="w-5 h-5 text-white" />
                </a>
                <a
                  v-if="contacts?.instagram"
                  :href="getInstagramUrl() || '#'"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="w-9 h-9 rounded-full bg-gradient-to-br from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 flex items-center justify-center transition-colors"
                  title="Instagram"
                >
                  <UIcon name="i-heroicons-photo" class="w-5 h-5 text-white" />
                </a>
                <a
                  v-if="contacts?.vk"
                  :href="contacts.vk"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="w-9 h-9 rounded-full bg-blue-600 hover:bg-blue-700 flex items-center justify-center transition-colors"
                  title="VKontakte"
                >
                  <UIcon name="i-heroicons-globe-alt" class="w-5 h-5 text-white" />
                </a>
                <a
                  v-if="contacts?.facebook"
                  :href="contacts.facebook"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="w-9 h-9 rounded-full bg-blue-700 hover:bg-blue-800 flex items-center justify-center transition-colors"
                  title="Facebook"
                >
                  <UIcon name="i-heroicons-globe-alt" class="w-5 h-5 text-white" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </UContainer>
    </template>

    <template #bottom>
      <UContainer class="py-6">
        <div class="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
          <p>
            © {{ currentYear }} {{ settings?.general?.site_name || 'Camp Events' }}. Все права защищены.
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
