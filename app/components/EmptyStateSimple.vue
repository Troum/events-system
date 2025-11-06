<script setup lang="ts">
interface Props {
  title?: string
  description?: string
  icon?: string
  buttonText?: string
  buttonLink?: string
}

withDefaults(defineProps<Props>(), {
  title: 'Поездки в разработке',
  description: 'Мы работаем над организацией поездок на это мероприятие',
  icon: 'i-heroicons-truck',
  buttonText: 'Узнать подробнее',
  buttonLink: '/contact',
})
</script>

<template>
  <div class="py-12 text-center">
    <div class="mb-6">
      <div class="w-24 h-24 rounded-2xl bg-gradient-to-br from-primary-300 to-primary-500 flex items-center justify-center mx-auto shadow-xl animate-pulse">
        <UIcon :name="icon" class="w-12 h-12 text-white" />
      </div>
    </div>
    <h3 class="text-xl font-bold gradient-text mb-3">
      {{ title }}
    </h3>
    <p class="text-gray-600 dark:text-gray-400 mb-6 text-sm leading-relaxed" v-html="description" />
    <UButton
      :to="buttonLink"
      color="primary"
      variant="outline"
      size="lg"
      class="border-2 border-primary-400 hover:bg-primary-50 dark:hover:bg-primary-900/20"
    >
      <div class="flex items-center gap-2">
        <UIcon name="i-heroicons-envelope" class="w-5 h-5" />
        <span>{{ buttonText }}</span>
      </div>
    </UButton>
  </div>
</template>

