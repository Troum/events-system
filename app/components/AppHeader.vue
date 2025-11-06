<template>
  <UHeader class="backdrop-blur-md bg-white/80 dark:bg-gray-900/80 border-b border-primary-200/50 dark:border-primary-800/50 shadow-sm sticky top-0 z-50">
    <template #left>
      <NuxtLink
        to="/"
        class="flex items-center gap-3 hover:opacity-80 transition-opacity"
      >
        <div class="w-10 h-10 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center">
          <UIcon name="i-heroicons-map-pin" class="w-6 h-6 text-white" />
        </div>
        <span class="text-2xl font-bold gradient-text hidden sm:block">
          Camp Events
        </span>
      </NuxtLink>
    </template>

    <template #right>
      <div class="flex items-center gap-2">
        <UButton
          to="/events"
          variant="ghost"
          color="primary"
          size="lg"
          class="hover:bg-primary-100/50 dark:hover:bg-primary-900/50 font-medium text-primary-500"
        >
          Мероприятия
        </UButton>
        <UButton
          to="/contact"
          variant="ghost"
          color="primary"
          size="lg"
          class="hover:bg-primary-100/50 dark:hover:bg-primary-900/50 font-medium text-primary-500"
        >
          Контакты
        </UButton>
      </div>
    </template>
  </UHeader>
</template>
