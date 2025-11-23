<script setup lang="ts">
import type { Event } from '~/types'

interface Props {
  event: Event
}

const props = defineProps<Props>()

const { getImageUrl } = useImageUrl()
const { formatDate } = useFormatters()
</script>

<template>
  <NuxtLink :to="`/event/${event.slug}`" class="block group">
    <UCard class="h-full backdrop-blur-md bg-white/90 dark:bg-gray-900/90 border-2 border-primary-200/50 dark:border-primary-800/50 hover:border-primary-400 dark:hover:border-primary-600 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
      <template #header>
        <div class="relative h-56 overflow-hidden rounded-t-lg">
          <OptimizedImage
            v-if="event.image"
            :src="getImageUrl(event.image)"
            :alt="event.title"
            class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
            loading="lazy"
            preset="card"
          />
          <div v-else class="w-full h-full bg-gradient-to-br from-primary-100 to-primary-200 dark:from-primary-900/40 dark:to-primary-800/40 flex items-center justify-center">
            <UIcon name="i-heroicons-calendar" class="w-20 h-20 text-primary-500" />
          </div>
          
          <!-- Overlay градиент -->
          <div class="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </div>
      </template>

      <div class="space-y-4">
        <div>
          <h3 class="text-2xl font-bold gradient-text mb-3 group-hover:scale-105 transition-transform duration-300">
            {{ event.title }}
          </h3>
          <p class="text-gray-600 dark:text-gray-400 line-clamp-3 leading-relaxed">
            {{ event.description }}
          </p>
        </div>

        <div class="flex flex-col gap-3 pt-4 border-t border-primary-200/50 dark:border-primary-800/50">
          <div class="flex items-center gap-2 text-gray-600 dark:text-gray-400">
            <UIcon name="i-heroicons-map-pin" class="w-5 h-5 text-primary-500 flex-shrink-0" />
            <span class="text-sm">{{ event.location }}</span>
          </div>
          <div class="flex items-center gap-2 text-gray-600 dark:text-gray-400">
            <UIcon name="i-heroicons-calendar-days" class="w-5 h-5 text-primary-500 flex-shrink-0" />
            <span class="text-sm">{{ formatDate(event.date_start) }}</span>
          </div>
        </div>

        <div class="pt-4">
          <div class="inline-flex items-center gap-2 text-primary-600 dark:text-primary-400 font-semibold group-hover:gap-4 transition-all duration-300">
            <span>Подробнее</span>
            <UIcon name="i-heroicons-arrow-right" class="w-5 h-5" />
          </div>
        </div>
      </div>
    </UCard>
  </NuxtLink>
</template>
