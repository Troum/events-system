<script setup lang="ts">
const props = defineProps<{
  src: string
  alt: string
  loading?: 'lazy' | 'eager'
  preset?: 'hero' | 'card' | 'thumbnail' | 'avatar'
  class?: string
}>()

// Проверяем, является ли src внешним URL
const isExternal = computed(() => {
  return props.src.startsWith('http://') || props.src.startsWith('https://')
})
</script>

<template>
  <!-- Для внешних URL используем обычный img -->
  <img
    v-if="isExternal"
    :src="src"
    :alt="alt"
    :loading="loading || 'lazy'"
    :class="props.class"
  />
  
  <!-- Для локальных файлов используем NuxtImg с оптимизацией -->
  <NuxtImg
    v-else
    :src="src"
    :alt="alt"
    :loading="loading || 'lazy'"
    :preset="preset"
    :class="props.class"
  />
</template>

