<script setup lang="ts">
const { contacts, fetchContacts, getTelegramUrl, getInstagramUrl, getWhatsAppUrl } = useSettings()

// Загружаем контакты при загрузке страницы (обновляем кеш)
onMounted(async () => {
  await fetchContacts()
})

useSeo({
  title: 'Контакты',
  description: 'Свяжитесь с нами, если у вас возникли вопросы. Мы всегда рады помочь!',
})
</script>

<template>
  <div class="min-h-screen py-16">
    <UContainer>
      <!-- Header -->
      <div class="text-center mb-16">
        <h1 class="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
          <span class="gradient-text">Контакты</span>
        </h1>
        <p class="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
          Свяжитесь с нами, если у вас возникли вопросы
        </p>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
        <!-- Contact Info -->
        <UCard class="backdrop-blur-md bg-white/90 dark:bg-gray-900/90 border-2 border-primary-200/50 dark:border-primary-800/50 shadow-2xl">
          <template #header>
            <h2 class="text-3xl font-bold gradient-text">Связаться с нами</h2>
          </template>

          <div class="space-y-8">
            <!-- Email -->
            <div v-if="contacts?.email" class="flex items-start gap-5 p-5 rounded-xl bg-primary-50/50 dark:bg-primary-900/20 hover:bg-primary-100/50 dark:hover:bg-primary-900/30 transition-colors">
              <div class="w-12 h-12 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center flex-shrink-0">
                <UIcon name="i-heroicons-envelope" class="w-6 h-6 text-white" />
              </div>
              <div>
                <p class="font-semibold text-lg mb-2 text-gray-800 dark:text-gray-200">Email</p>
                <a :href="`mailto:${contacts.email}`" class="text-primary-600 dark:text-primary-400 hover:underline text-lg">
                  {{ contacts.email }}
                </a>
              </div>
            </div>

            <!-- Телефон -->
            <div v-if="contacts?.phone" class="flex items-start gap-5 p-5 rounded-xl bg-primary-50/50 dark:bg-primary-900/20 hover:bg-primary-100/50 dark:hover:bg-primary-900/30 transition-colors">
              <div class="w-12 h-12 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center flex-shrink-0">
                <UIcon name="i-heroicons-phone" class="w-6 h-6 text-white" />
              </div>
              <div>
                <p class="font-semibold text-lg mb-2 text-gray-800 dark:text-gray-200">Телефон</p>
                <a :href="`tel:${contacts.phone.replace(/\s/g, '')}`" class="text-primary-600 dark:text-primary-400 hover:underline text-lg">
                  {{ contacts.phone }}
                </a>
              </div>
            </div>

            <!-- WhatsApp -->
            <div v-if="contacts?.whatsapp" class="flex items-start gap-5 p-5 rounded-xl bg-primary-50/50 dark:bg-primary-900/20 hover:bg-primary-100/50 dark:hover:bg-primary-900/30 transition-colors">
              <div class="w-12 h-12 rounded-full bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center flex-shrink-0">
                <UIcon name="i-heroicons-chat-bubble-left-right" class="w-6 h-6 text-white" />
              </div>
              <div>
                <p class="font-semibold text-lg mb-2 text-gray-800 dark:text-gray-200">WhatsApp</p>
                <a :href="getWhatsAppUrl() || '#'" target="_blank" rel="noopener noreferrer" class="text-green-600 dark:text-green-400 hover:underline text-lg">
                  {{ contacts.whatsapp }}
                </a>
              </div>
            </div>

            <!-- Telegram -->
            <div v-if="contacts?.telegram" class="flex items-start gap-5 p-5 rounded-xl bg-primary-50/50 dark:bg-primary-900/20 hover:bg-primary-100/50 dark:hover:bg-primary-900/30 transition-colors">
              <div class="w-12 h-12 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center flex-shrink-0">
                <UIcon name="i-heroicons-paper-airplane" class="w-6 h-6 text-white" />
              </div>
              <div>
                <p class="font-semibold text-lg mb-2 text-gray-800 dark:text-gray-200">Telegram</p>
                <a :href="getTelegramUrl() || '#'" target="_blank" rel="noopener noreferrer" class="text-blue-600 dark:text-blue-400 hover:underline text-lg">
                  {{ contacts.telegram }}
                </a>
              </div>
            </div>

            <!-- Instagram -->
            <div v-if="contacts?.instagram" class="flex items-start gap-5 p-5 rounded-xl bg-primary-50/50 dark:bg-primary-900/20 hover:bg-primary-100/50 dark:hover:bg-primary-900/30 transition-colors">
              <div class="w-12 h-12 rounded-full bg-gradient-to-br from-pink-400 to-purple-600 flex items-center justify-center flex-shrink-0">
                <UIcon name="i-heroicons-photo" class="w-6 h-6 text-white" />
              </div>
              <div>
                <p class="font-semibold text-lg mb-2 text-gray-800 dark:text-gray-200">Instagram</p>
                <a :href="getInstagramUrl() || '#'" target="_blank" rel="noopener noreferrer" class="text-pink-600 dark:text-pink-400 hover:underline text-lg">
                  {{ contacts.instagram }}
                </a>
              </div>
            </div>

            <!-- VK -->
            <div v-if="contacts?.vk" class="flex items-start gap-5 p-5 rounded-xl bg-primary-50/50 dark:bg-primary-900/20 hover:bg-primary-100/50 dark:hover:bg-primary-900/30 transition-colors">
              <div class="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center flex-shrink-0">
                <UIcon name="i-heroicons-globe-alt" class="w-6 h-6 text-white" />
              </div>
              <div>
                <p class="font-semibold text-lg mb-2 text-gray-800 dark:text-gray-200">VKontakte</p>
                <a :href="contacts.vk" target="_blank" rel="noopener noreferrer" class="text-blue-600 dark:text-blue-400 hover:underline text-lg">
                  {{ contacts.vk }}
                </a>
              </div>
            </div>

            <!-- Facebook -->
            <div v-if="contacts?.facebook" class="flex items-start gap-5 p-5 rounded-xl bg-primary-50/50 dark:bg-primary-900/20 hover:bg-primary-100/50 dark:hover:bg-primary-900/30 transition-colors">
              <div class="w-12 h-12 rounded-full bg-gradient-to-br from-blue-600 to-blue-800 flex items-center justify-center flex-shrink-0">
                <UIcon name="i-heroicons-globe-alt" class="w-6 h-6 text-white" />
              </div>
              <div>
                <p class="font-semibold text-lg mb-2 text-gray-800 dark:text-gray-200">Facebook</p>
                <a :href="contacts.facebook" target="_blank" rel="noopener noreferrer" class="text-blue-600 dark:text-blue-400 hover:underline text-lg">
                  {{ contacts.facebook }}
                </a>
              </div>
            </div>

            <!-- Адрес -->
            <div v-if="contacts?.address" class="flex items-start gap-5 p-5 rounded-xl bg-primary-50/50 dark:bg-primary-900/20 hover:bg-primary-100/50 dark:hover:bg-primary-900/30 transition-colors">
              <div class="w-12 h-12 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center flex-shrink-0">
                <UIcon name="i-heroicons-map-pin" class="w-6 h-6 text-white" />
              </div>
              <div>
                <p class="font-semibold text-lg mb-2 text-gray-800 dark:text-gray-200">Адрес</p>
                <p class="text-gray-600 dark:text-gray-400 text-lg">
                  {{ contacts.address }}
                </p>
              </div>
            </div>
          </div>
        </UCard>

        <!-- FAQ -->
        <UCard class="backdrop-blur-md bg-white/90 dark:bg-gray-900/90 border-2 border-primary-200/50 dark:border-primary-800/50 shadow-2xl">
          <template #header>
            <h2 class="text-3xl font-bold gradient-text">Часто задаваемые вопросы</h2>
          </template>

          <div class="space-y-8">
            <div class="p-5 rounded-xl bg-primary-50/30 dark:bg-primary-900/10 border border-primary-200/50 dark:border-primary-800/50">
              <h3 class="font-bold text-lg mb-3 text-gray-800 dark:text-gray-200">Как забронировать место?</h3>
              <p class="text-gray-600 dark:text-gray-400 leading-relaxed">
                Выберите интересующее мероприятие, затем поездку и заполните форму бронирования.
                После этого вы сможете оплатить бронирование онлайн.
              </p>
            </div>

            <div class="p-5 rounded-xl bg-primary-50/30 dark:bg-primary-900/10 border border-primary-200/50 dark:border-primary-800/50">
              <h3 class="font-bold text-lg mb-3 text-gray-800 dark:text-gray-200">Какие способы оплаты доступны?</h3>
              <p class="text-gray-600 dark:text-gray-400 leading-relaxed">
                Мы принимаем оплату через ЮKassa, Stripe, PayPal, WebPay, а также оплату по факту. Выберите удобный способ при бронировании. Оплата происходит безопасно и защищено.
              </p>
            </div>

            <div class="p-5 rounded-xl bg-primary-50/30 dark:bg-primary-900/10 border border-primary-200/50 dark:border-primary-800/50">
              <h3 class="font-bold text-lg mb-3 text-gray-800 dark:text-gray-200">Можно ли вернуть деньги?</h3>
              <p class="text-gray-600 dark:text-gray-400 leading-relaxed">
                Возврат средств возможен в соответствии с условиями бронирования.
                Подробности уточните у нашего менеджера.
              </p>
            </div>

            <div class="p-5 rounded-xl bg-primary-50/30 dark:bg-primary-900/10 border border-primary-200/50 dark:border-primary-800/50">
              <h3 class="font-bold text-lg mb-3 text-gray-800 dark:text-gray-200">Придут ли уведомления?</h3>
              <p class="text-gray-600 dark:text-gray-400 leading-relaxed">
                Да, после бронирования и оплаты вы получите уведомления на указанный email
                и Telegram (если подключен).
              </p>
            </div>
          </div>
        </UCard>
      </div>
    </UContainer>
  </div>
</template>
