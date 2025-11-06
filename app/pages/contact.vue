<script setup lang="ts">
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
            <div class="flex items-start gap-5 p-5 rounded-xl bg-primary-50/50 dark:bg-primary-900/20 hover:bg-primary-100/50 dark:hover:bg-primary-900/30 transition-colors">
              <div class="w-12 h-12 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center flex-shrink-0">
                <UIcon name="i-heroicons-envelope" class="w-6 h-6 text-white" />
              </div>
              <div>
                <p class="font-semibold text-lg mb-2 text-gray-800 dark:text-gray-200">Email</p>
                <a href="mailto:info@camp-events.ru" class="text-primary-600 dark:text-primary-400 hover:underline text-lg">
                  info@camp-events.ru
                </a>
              </div>
            </div>

            <div class="flex items-start gap-5 p-5 rounded-xl bg-primary-50/50 dark:bg-primary-900/20 hover:bg-primary-100/50 dark:hover:bg-primary-900/30 transition-colors">
              <div class="w-12 h-12 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center flex-shrink-0">
                <UIcon name="i-heroicons-phone" class="w-6 h-6 text-white" />
              </div>
              <div>
                <p class="font-semibold text-lg mb-2 text-gray-800 dark:text-gray-200">Телефон</p>
                <a href="tel:+79991234567" class="text-primary-600 dark:text-primary-400 hover:underline text-lg">
                  +7 (999) 123-45-67
                </a>
              </div>
            </div>

            <div class="flex items-start gap-5 p-5 rounded-xl bg-primary-50/50 dark:bg-primary-900/20 hover:bg-primary-100/50 dark:hover:bg-primary-900/30 transition-colors">
              <div class="w-12 h-12 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center flex-shrink-0">
                <UIcon name="i-heroicons-clock" class="w-6 h-6 text-white" />
              </div>
              <div>
                <p class="font-semibold text-lg mb-2 text-gray-800 dark:text-gray-200">Время работы</p>
                <p class="text-gray-600 dark:text-gray-400 text-lg">
                  Пн-Пт: 9:00 - 18:00<br>
                  Сб-Вс: 10:00 - 16:00
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
