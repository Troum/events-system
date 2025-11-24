<script setup lang="ts">
import type { Event, Trip } from '~/types'

const route = useRoute()
const router = useRouter()
const eventSlug = String(route.params.slug) // Используем slug из параметра

const events = useEvents()
const { getImageUrl } = useImageUrl()

const event = ref<Event | null>(null)
const tripsList = ref<Trip[]>([])
const loading = ref(true)
const error = ref<string | null>(null)
const openFaqIndex = ref<number | null>(null)

const { formatDate, formatTime, formatPrice } = useFormatters()

const toggleFaq = (index: number) => {
  openFaqIndex.value = openFaqIndex.value === index ? null : index
}

const navigateToTrip = (tripId: number) => {
  router.push(`/book/${tripId}`)
}

// Проверка наличия координат для карты
const hasMapCoordinates = computed(() => {
  if (!event.value?.venue_latitude || !event.value?.venue_longitude) {
    return false
  }

  const lat = parseFloat(String(event.value.venue_latitude))
  const lng = parseFloat(String(event.value.venue_longitude))

  return !isNaN(lat) && !isNaN(lng)
})

onMounted(async () => {
  try {
    loading.value = true
    const eventResponse = await events.getEvent(eventSlug)
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
        <!-- Hero Slider Component -->
        <HeroSlider
          v-if="event.hero_images && event.hero_images.length > 0"
          :images="event.hero_images"
          :title="event.title"
          :subtitle="event.subtitle"
          :location="event.location"
          :date-start="event.date_start"
        >
          <template #back-button>
            <UButton
              to="/events"
              variant="soft"
              icon="i-heroicons-arrow-left"
              class="mb-6 text-white bg-primary-200/50 hover:bg-primary-200/30"
            >
              Назад к списку
            </UButton>
          </template>
        </HeroSlider>

        <!-- Fallback: Single Image Hero -->
        <div
          v-else-if="event.image"
          class="relative h-[60vh] min-h-[500px] w-screen -ml-[50vw] left-[50%] mb-12 overflow-hidden"
        >
          <OptimizedImage
            :src="getImageUrl(event.image)"
            :alt="event.title"
            class="w-full h-full object-cover"
            loading="eager"
            preset="hero"
          />

          <div class="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-transparent" />

          <div class="absolute inset-0 flex items-end">
            <UContainer class="pb-16">
              <UButton
                to="/events"
                variant="soft"
                icon="i-heroicons-arrow-left"
                class="mb-6 text-white bg-primary-200/50 hover:bg-primary-200/30"
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
                <p class="text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-line" v-html="event.about">
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
                      <UIcon :name="`i-${feature.icon || 'lucide-star'}`" class="w-6 h-6" />
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
                  class="rounded-2xl bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 overflow-hidden"
                >
                  <!-- Изображения инфраструктуры -->
                  <div v-if="item.images && item.images.length > 0" class="relative h-48">
                    <OptimizedImage
                      :src="getImageUrl(item.images[0])"
                      :alt="item.name"
                      class="w-full h-full object-cover"
                      loading="lazy"
                      preset="card"
                    />
                    <div v-if="item.images.length > 1" class="absolute bottom-2 right-2 px-2 py-1 bg-black/70 text-white text-xs rounded-lg">
                      +{{ item.images.length - 1 }} фото
                    </div>
                  </div>

                  <!-- Контент -->
                  <div class="p-6">
                    <h3 class="font-bold text-lg mb-2">{{ item.name }}</h3>
                    <p class="text-gray-600 dark:text-gray-400">{{ item.description }}</p>
                  </div>
                </div>
              </div>
            </section>

            <!-- Пакеты участия -->
            <section v-if="event.event_packages && event.event_packages.length > 0">
              <h2 class="text-3xl font-bold mb-6 gradient-text">Пакеты участия</h2>
              <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div
                  v-for="(pkg, index) in event.event_packages"
                  :key="index"
                  :class="[
                    'p-6 rounded-2xl border-2 relative overflow-hidden',
                    pkg.is_featured
                      ? 'border-primary-500 bg-gradient-to-br from-primary-50 to-primary-100 dark:from-primary-900/30 dark:to-primary-800/20 shadow-xl'
                      : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800'
                  ]"
                >
                  <div v-if="pkg.is_featured" class="absolute top-0 right-0 bg-primary-500 text-white px-3 py-1 text-xs font-bold rounded-bl-lg">
                    Рекомендуем
                  </div>

                  <div class="flex items-center gap-3 mb-4">
                    <div class="w-12 h-12 rounded-xl bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center text-white">
                      <UIcon :name="`i-${pkg.icon || 'lucide-package'}`" class="w-6 h-6" />
                    </div>
                    <h3 class="font-bold text-xl">{{ pkg.name }}</h3>
                  </div>

                  <div class="mb-4">
                    <div class="text-3xl font-bold gradient-text">{{ formatPrice(pkg.price) }}</div>
                    <p v-if="pkg.price_note" class="text-sm text-gray-600 dark:text-gray-400">{{ pkg.price_note }}</p>
                  </div>

                  <p v-if="pkg.description" class="text-gray-600 dark:text-gray-400 mb-4">{{ pkg.description }}</p>

                  <div v-if="pkg.includes && pkg.includes.length > 0" class="space-y-2 mb-4">
                    <p class="font-semibold text-sm text-gray-700 dark:text-gray-300">Включено:</p>
                    <ul class="space-y-1">
                      <li v-for="(item, i) in pkg.includes" :key="i" class="flex items-start gap-2 text-sm">
                        <UIcon name="i-heroicons-check-circle" class="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                        <span>{{ item.item || item }}</span>
                      </li>
                    </ul>
                  </div>

                  <div v-if="pkg.not_includes && pkg.not_includes.length > 0" class="space-y-2">
                    <p class="font-semibold text-sm text-gray-700 dark:text-gray-300">Не включено:</p>
                    <ul class="space-y-1">
                      <li v-for="(item, i) in pkg.not_includes" :key="i" class="flex items-start gap-2 text-sm text-gray-500">
                        <UIcon name="i-heroicons-x-circle" class="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5" />
                        <span>{{ item.item || item }}</span>
                      </li>
                    </ul>
                  </div>

                  <div v-if="pkg.max_participants" class="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                    <div class="flex justify-between text-sm">
                      <span class="text-gray-600 dark:text-gray-400">Мест:</span>
                      <span class="font-semibold">{{ pkg.max_participants - pkg.current_participants }} / {{ pkg.max_participants }}</span>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            <!-- Место проведения -->
            <section v-if="event.venue_name || event.venue_address">
              <h2 class="text-3xl font-bold mb-6 gradient-text">Место проведения</h2>
              <div class="rounded-2xl bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 overflow-hidden">
                <!-- Карта если есть координаты -->
                <div v-if="hasMapCoordinates" class="h-96 bg-gray-200 dark:bg-gray-700">
                  <DynamicMap
                    :latitude="parseFloat(String(event.venue_latitude))"
                    :longitude="parseFloat(String(event.venue_longitude))"
                    :zoom="14"
                    :title="event.venue_name || 'Место проведения'"
                    :address="event.venue_address"
                    :show-info="false"
                    height="100%"
                  />
                </div>

                <div class="p-6">
                  <h3 v-if="event.venue_name" class="font-bold text-xl mb-2">{{ event.venue_name }}</h3>
                  <p v-if="event.venue_description" class="text-gray-600 dark:text-gray-400 mb-4">{{ event.venue_description }}</p>

                  <div v-if="event.venue_address" class="flex items-start gap-3 mb-4">
                    <UIcon name="i-heroicons-map-pin" class="w-6 h-6 text-primary-500 flex-shrink-0" />
                    <div>
                      <p class="font-semibold mb-1">Адрес:</p>
                      <p class="text-gray-600 dark:text-gray-400">{{ event.venue_address }}</p>
                    </div>
                  </div>

                  <div v-if="event.airport_distance" class="flex items-start gap-3">
                    <UIcon name="i-heroicons-paper-airplane" class="w-6 h-6 text-primary-500 flex-shrink-0" />
                    <div>
                      <p class="font-semibold mb-1">От аэропорта:</p>
                      <p class="text-gray-600 dark:text-gray-400">{{ event.airport_distance }}</p>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            <!-- Команда -->
            <section v-if="event.team_members && event.team_members.length > 0">
              <h2 class="text-3xl font-bold mb-6 gradient-text">Команда</h2>
              <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div
                  v-for="(member, index) in event.team_members"
                  :key="index"
                  class="text-center p-6 rounded-2xl bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 border-2 border-gray-200 dark:border-gray-700"
                >
                  <div v-if="member.photo" class="w-24 h-24 mx-auto mb-4 rounded-full overflow-hidden border-4 border-primary-200 dark:border-primary-800">
                    <OptimizedImage
                      :src="getImageUrl(member.photo)"
                      :alt="member.name"
                      class="w-full h-full object-cover"
                      loading="lazy"
                      preset="avatar"
                    />
                  </div>
                  <h3 class="font-bold text-lg mb-1">{{ member.name }}</h3>
                  <p class="text-primary-600 dark:text-primary-400 text-sm mb-2">{{ member.pivot?.role_in_event || member.role }}</p>
                  <p v-if="member.bio" class="text-sm text-gray-600 dark:text-gray-400 mb-3">{{ member.bio }}</p>

                  <div v-if="member.rating" class="flex items-center justify-center gap-1 mb-2">
                    <UIcon name="i-heroicons-star-solid" class="w-4 h-4 text-yellow-500" />
                    <span class="text-sm font-semibold">{{ member.rating }}</span>
                  </div>

                  <div class="flex justify-center gap-2">
                    <a v-if="member.email" :href="`mailto:${member.email}`" class="text-gray-400 hover:text-primary-500">
                      <UIcon name="i-heroicons-envelope" class="w-5 h-5" />
                    </a>
                    <a v-if="member.phone" :href="`tel:${member.phone}`" class="text-gray-400 hover:text-primary-500">
                      <UIcon name="i-heroicons-phone" class="w-5 h-5" />
                    </a>
                  </div>
                </div>
              </div>
            </section>

            <!-- FAQ -->
            <section v-if="event.faq && event.faq.length > 0">
              <h2 class="text-3xl font-bold mb-8 gradient-text">Вопросы и ответы</h2>
              <div class="space-y-4">
                <div
                  v-for="(item, index) in event.faq"
                  :key="index"
                  class="group rounded-2xl bg-gradient-to-br from-white to-primary-50/30 dark:from-gray-800 dark:to-primary-900/20 border-2 border-primary-200/50 dark:border-primary-800/50 overflow-hidden backdrop-blur-sm transition-all duration-300 hover:shadow-xl hover:border-primary-400/50 dark:hover:border-primary-600/50"
                >
                  <button
                    @click="toggleFaq(index)"
                    class="w-full p-6 flex items-center justify-between gap-4 text-left hover:bg-primary-50/50 dark:hover:bg-primary-900/20 transition-colors"
                  >
                    <div class="flex items-start gap-4 flex-1">
                      <div class="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center text-white flex-shrink-0 group-hover:scale-110 transition-transform">
                        <UIcon name="i-heroicons-question-mark-circle" class="w-6 h-6" />
                      </div>
                      <h3 class="font-bold text-lg text-gray-900 dark:text-white pr-4">
                        {{ item.question }}
                      </h3>
                    </div>
                    <UIcon
                      :name="openFaqIndex === index ? 'i-heroicons-chevron-up' : 'i-heroicons-chevron-down'"
                      class="w-6 h-6 text-primary-500 flex-shrink-0 transition-transform duration-300"
                      :class="{ 'rotate-180': openFaqIndex === index }"
                    />
                  </button>
                  <div
                    v-show="openFaqIndex === index"
                    class="px-6 pb-6 pl-20 transition-all duration-300"
                  >
                    <div class="pt-4 border-t border-primary-200/50 dark:border-primary-800/50">
                      <p class="text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-line">
                        {{ item.answer }}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
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
                  <OptimizedImage
                    :src="getImageUrl(image)"
                    :alt="`Gallery ${index + 1}`"
                    class="w-full h-full object-cover"
                    loading="lazy"
                    preset="thumbnail"
                  />
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

                <UEmpty
                  v-else
                  icon="i-heroicons-truck"
                  description="Мы работаем над организацией поездок на это мероприятие"
                />
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


