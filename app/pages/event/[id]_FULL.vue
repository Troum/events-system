<script setup lang="ts">
import type { Event, Trip } from '~/types'

const route = useRoute()
const router = useRouter()
const eventId = Number(route.params.id)

const events = useEvents()
const { getImageUrl } = useImageUrl()

const event = ref<Event | null>(null)
const tripsList = ref<Trip[]>([])
const loading = ref(true)
const error = ref<string | null>(null)

const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString('ru-RU', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  })
}

const formatTime = (datetime: string) => {
  return new Date(datetime).toLocaleTimeString('ru-RU', {
    hour: '2-digit',
    minute: '2-digit'
  })
}

const formatPrice = (price: number | string) => {
  const numPrice = typeof price === 'string' ? parseFloat(price) : price
  return new Intl.NumberFormat('ru-RU', {
    style: 'currency',
    currency: 'RUB',
  }).format(numPrice)
}

const navigateToTrip = (tripId: number) => {
  router.push(`/book/${tripId}`)
}

onMounted(async () => {
  try {
    loading.value = true
    const eventResponse = await events.getEvent(eventId)
    event.value = eventResponse.data

    if (event.value) {
      useSeo({
        title: event.value.title,
        description: event.value.description,
        image: event.value.image || undefined,
      })

      tripsList.value = event.value.trips || []
    }
  } catch (e: any) {
    error.value = e.message || 'Ошибка при загрузке мероприятия'
    console.error('Error loading event:', e)
  } finally {
    loading.value = false
  }
})
</script>

<template>
  <div class="min-h-screen">
    <UContainer>
      <div v-if="loading" class="flex justify-center items-center py-20">
        <UIcon name="i-heroicons-arrow-path" class="w-12 h-12 animate-spin text-primary-500" />
      </div>

      <UAlert
        v-else-if="error"
        color="neutral"
        variant="soft"
        :title="error"
        class="max-w-2xl mx-auto bg-red-100 my-8"
      />

      <div v-else-if="event" class="pb-16">
        <!-- Hero Section -->
        <div class="relative h-[60vh] min-h-[500px] -mx-4 sm:-mx-6 lg:-mx-8 mb-12">
          <img
            v-if="event.image"
            :src="getImageUrl(event.image)"
            :alt="event.title"
            class="w-full h-full object-cover"
          />
          <div class="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-transparent" />

          <div class="absolute inset-0 flex items-end">
            <UContainer class="pb-16">
              <UButton
                to="/events"
                variant="soft"
                icon="i-heroicons-arrow-left"
                class="mb-6"
              >
                Назад к списку
              </UButton>

              <h1 class="text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-4 drop-shadow-2xl">
                {{ event.title }}
              </h1>

              <p v-if="event.subtitle" class="text-2xl text-white/90 mb-8 drop-shadow-lg">
                {{ event.subtitle }}
              </p>

              <div class="flex flex-wrap gap-6 text-white">
                <div class="flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-xl">
                  <UIcon name="i-heroicons-map-pin" class="w-6 h-6" />
                  <span class="text-lg font-semibold">{{ event.location }}</span>
                </div>
                <div class="flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-xl">
                  <UIcon name="i-heroicons-calendar-days" class="w-6 h-6" />
                  <span class="text-lg font-semibold">{{ formatDate(event.date_start) }}</span>
                </div>
              </div>
            </UContainer>
          </div>
        </div>

        <!-- Main Content -->
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <!-- Content Column -->
          <div class="lg:col-span-2 space-y-12">
            <!-- О мероприятии -->
            <section v-if="event.about">
              <h2 class="text-3xl font-bold mb-6 gradient-text">О мероприятии</h2>
              <div class="prose prose-lg dark:prose-invert max-w-none">
                <p class="text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-line">
                  {{ event.about }}
                </p>
              </div>
            </section>

            <!-- Особенности -->
            <section v-if="event.features && event.features.length > 0">
              <h2 class="text-3xl font-bold mb-6 gradient-text">Особенности</h2>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div
                  v-for="(feature, index) in event.features"
                  :key="index"
                  class="p-6 rounded-2xl bg-gradient-to-br from-primary-50 to-primary-100/50 dark:from-primary-900/20 dark:to-primary-800/10 border-2 border-primary-200/50 dark:border-primary-800/50"
                >
                  <div class="flex items-start gap-4">
                    <div class="w-12 h-12 rounded-xl bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center text-white flex-shrink-0">
                      <UIcon :name="`i-lucide-${feature.icon || 'star'}`" class="w-6 h-6" />
                    </div>
                    <div>
                      <h3 class="font-bold text-lg mb-2">{{ feature.title }}</h3>
                      <p class="text-gray-600 dark:text-gray-400">{{ feature.description }}</p>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            <!-- Программа -->
            <section v-if="event.schedule && event.schedule.length > 0">
              <h2 class="text-3xl font-bold mb-6 gradient-text">Программа</h2>
              <div class="space-y-6">
                <div
                  v-for="(day, index) in event.schedule"
                  :key="index"
                  class="border-l-4 border-primary-500 pl-6 py-4"
                >
                  <div class="flex items-center gap-3 mb-3">
                    <span class="px-3 py-1 bg-primary-500 text-white rounded-lg font-bold">
                      {{ day.date }}
                    </span>
                    <h3 class="text-xl font-bold">{{ day.title }}</h3>
                  </div>
                  <div v-if="day.activities && day.activities.length > 0" class="space-y-3">
                    <div
                      v-for="(activity, actIndex) in day.activities"
                      :key="actIndex"
                      class="flex gap-4 p-4 rounded-xl bg-gray-50 dark:bg-gray-800/50"
                    >
                      <span class="text-primary-600 dark:text-primary-400 font-bold whitespace-nowrap">
                        {{ activity.time }}
                      </span>
                      <div>
                        <p class="font-semibold">{{ activity.title }}</p>
                        <p v-if="activity.description" class="text-sm text-gray-600 dark:text-gray-400">
                          {{ activity.description }}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            <!-- Инфраструктура -->
            <section v-if="event.infrastructure && event.infrastructure.length > 0">
              <h2 class="text-3xl font-bold mb-6 gradient-text">Инфраструктура</h2>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div
                  v-for="(item, index) in event.infrastructure"
                  :key="index"
                  class="p-6 rounded-2xl bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700"
                >
                  <h3 class="font-bold text-lg mb-2">{{ item.name }}</h3>
                  <p class="text-gray-600 dark:text-gray-400">{{ item.description }}</p>
                </div>
              </div>
            </section>

            <!-- Команда -->
            <section v-if="event.team && event.team.length > 0">
              <h2 class="text-3xl font-bold mb-6 gradient-text">Команда</h2>
              <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div
                  v-for="(member, index) in event.team"
                  :key="index"
                  class="text-center p-6 rounded-2xl bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900"
                >
                  <div v-if="member.photo" class="w-24 h-24 mx-auto mb-4 rounded-full overflow-hidden">
                    <img :src="getImageUrl(member.photo)" :alt="member.name" class="w-full h-full object-cover" />
                  </div>
                  <h3 class="font-bold text-lg mb-1">{{ member.name }}</h3>
                  <p class="text-primary-600 dark:text-primary-400 text-sm mb-2">{{ member.role }}</p>
                  <p v-if="member.bio" class="text-sm text-gray-600 dark:text-gray-400">{{ member.bio }}</p>
                </div>
              </div>
            </section>

            <!-- FAQ -->
            <section v-if="event.faq && event.faq.length > 0">
              <h2 class="text-3xl font-bold mb-6 gradient-text">Вопросы и ответы</h2>
              <UAccordion :items="event.faq.map(q => ({ label: q.question, content: q.answer }))" />
            </section>

            <!-- Галерея -->
            <section v-if="event.gallery && event.gallery.length > 0">
              <h2 class="text-3xl font-bold mb-6 gradient-text">Галерея</h2>
              <div class="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div
                  v-for="(image, index) in event.gallery"
                  :key="index"
                  class="aspect-square rounded-xl overflow-hidden"
                >
                  <img :src="getImageUrl(image)" :alt="`Gallery ${index + 1}`" class="w-full h-full object-cover" />
                </div>
              </div>
            </section>
          </div>

          <!-- Sidebar -->
          <div class="lg:col-span-1">
            <div class="sticky top-24 space-y-6">
              <!-- Доступные поездки -->
              <UCard class="backdrop-blur-md bg-white/90 dark:bg-gray-900/90 border-2 border-primary-200/50 dark:border-primary-800/50 shadow-xl">
                <template #header>
                  <h2 class="text-2xl font-bold gradient-text">Выберите город отправления</h2>
                </template>

                <div v-if="tripsList && tripsList.length > 0" class="space-y-4">
                  <div
                    v-for="trip in tripsList"
                    :key="trip.id"
                    class="p-5 border-2 border-primary-200/50 dark:border-primary-800/50 rounded-xl hover:border-primary-500 dark:hover:border-primary-400 transition-all cursor-pointer bg-gradient-to-br from-primary-50/30 to-transparent dark:from-primary-900/10 hover:shadow-lg transform hover:-translate-y-1 duration-300"
                    @click="navigateToTrip(trip.id)"
                  >
                    <div class="flex justify-between items-start mb-3">
                      <span class="font-bold text-lg">{{ trip.city_from }}</span>
                      <span class="text-2xl font-bold gradient-text">
                        {{ formatPrice(trip.price) }}
                      </span>
                    </div>
                    <div class="text-sm text-gray-600 dark:text-gray-400 mb-3 flex items-center gap-2">
                      <UIcon name="i-heroicons-clock" class="w-5 h-5 text-primary-500" />
                      {{ formatTime(trip.departure_time) }}
                    </div>
                    <div class="flex items-center justify-between text-sm">
                      <span class="text-gray-600 dark:text-gray-400">
                        Мест: <span class="font-semibold text-primary-600 dark:text-primary-400">{{ trip.seats_total - trip.seats_taken }} / {{ trip.seats_total }}</span>
                      </span>
                      <UIcon name="i-heroicons-arrow-right" class="w-5 h-5 text-primary-500" />
                    </div>
                  </div>
                </div>

                <EmptyStateSimple v-else />
              </UCard>

              <!-- Организатор -->
              <UCard v-if="event.organizer_name" class="backdrop-blur-md bg-white/90 dark:bg-gray-900/90 border-2 border-primary-200/50 dark:border-primary-800/50">
                <template #header>
                  <h3 class="font-bold text-lg">Организатор</h3>
                </template>

                <div class="space-y-3">
                  <p class="font-semibold">{{ event.organizer_name }}</p>
                  <div v-if="event.organizer_phone" class="flex items-center gap-2 text-sm">
                    <UIcon name="i-heroicons-phone" class="w-5 h-5 text-primary-500" />
                    <a :href="`tel:${event.organizer_phone}`" class="hover:text-primary-500">
                      {{ event.organizer_phone }}
                    </a>
                  </div>
                  <div v-if="event.organizer_email" class="flex items-center gap-2 text-sm">
                    <UIcon name="i-heroicons-envelope" class="w-5 h-5 text-primary-500" />
                    <a :href="`mailto:${event.organizer_email}`" class="hover:text-primary-500">
                      {{ event.organizer_email }}
                    </a>
                  </div>
                </div>
              </UCard>
            </div>
          </div>
        </div>
      </div>
    </UContainer>
  </div>
</template>

