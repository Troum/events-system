<script setup lang="ts">
import type { Event } from '~/types'

useSeo({
  title: 'Все мероприятия',
  description: 'Полный каталог мероприятий. Выберите интересующее вас событие и забронируйте место.',
})

const events = useEvents()
const eventsList = ref<Event[]>([])
const loading = ref(true)
const error = ref<string | null>(null)
const currentPage = ref(1)
const pagination = ref({
  total: 0,
  per_page: 12,
  last_page: 1,
})

const loadEvents = async (page: number = 1) => {
  try {
    loading.value = true
    error.value = null
    const response = await events.getEvents({ page, per_page: pagination.value.per_page })
    eventsList.value = response.data
    pagination.value = {
      total: response.total,
      per_page: response.per_page,
      last_page: response.last_page,
    }
  } catch (e: any) {
    error.value = e.message || 'Ошибка при загрузке мероприятий'
    console.error('Error loading events:', e)
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  loadEvents(currentPage.value)
})

watch(currentPage, (newPage) => {
  loadEvents(newPage)
  window.scrollTo({ top: 0, behavior: 'smooth' })
})
</script>

<template>
  <div class="min-h-screen py-16">
    <UContainer>
      <!-- Header -->
      <div class="text-center mb-16">
        <h1 class="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
          <span class="gradient-text">Все мероприятия</span>
        </h1>
        <p class="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
          Выберите интересующее вас мероприятие
        </p>
      </div>

      <!-- Content -->
      <div v-if="loading" class="flex justify-center items-center py-20">
        <UIcon name="i-heroicons-arrow-path" class="w-12 h-12 animate-spin text-primary-500" />
      </div>

      <UAlert
        v-else-if="error"
        variant="soft"
        :title="error"
        class="max-w-2xl mx-auto bg-red-100 text-white"
      />

      <div v-else-if="eventsList && eventsList.length > 0">
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          <EventCard
            v-for="event in eventsList"
            :key="event.id"
            :event="event"
          />
        </div>

        <!-- Pagination -->
        <div v-if="pagination.last_page > 1" class="flex justify-center">
          <UPagination
            v-model="currentPage"
            :page-count="pagination.per_page"
            :total="pagination.total"
            :max="7"
            color="primary"
            size="lg"
          />
        </div>
      </div>

      <!-- Empty State -->
      <EmptyStateEvents v-else />
    </UContainer>
  </div>
</template>
