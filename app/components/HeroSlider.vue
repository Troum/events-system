<script setup lang="ts">
const props = defineProps<{
  images: string[]
  title: string
  subtitle?: string
  location?: string
  dateStart?: string
}>()

const { getImageUrl } = useImageUrl()
const currentSlide = ref(0)

const nextSlide = () => {
  if (props.images.length > 0) {
    currentSlide.value = (currentSlide.value + 1) % props.images.length
  }
}

const prevSlide = () => {
  if (props.images.length > 0) {
    currentSlide.value = currentSlide.value === 0
      ? props.images.length - 1
      : currentSlide.value - 1
  }
}

const goToSlide = (index: number) => {
  currentSlide.value = index
}

const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString('ru-RU', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  })
}

// Auto-play slider
let autoPlayInterval: NodeJS.Timeout | null = null

onMounted(() => {
  if (props.images.length > 1) {
    autoPlayInterval = setInterval(() => {
      nextSlide()
    }, 5000) // Change slide every 5 seconds
  }
})

onUnmounted(() => {
  if (autoPlayInterval) {
    clearInterval(autoPlayInterval)
  }
})

// Pause auto-play on hover
const pauseAutoPlay = () => {
  if (autoPlayInterval) {
    clearInterval(autoPlayInterval)
    autoPlayInterval = null
  }
}

const resumeAutoPlay = () => {
  if (props.images.length > 1 && !autoPlayInterval) {
    autoPlayInterval = setInterval(() => {
      nextSlide()
    }, 5000)
  }
}
</script>

<template>
  <div
    class="relative h-[60vh] min-h-[500px] w-screen -ml-[50vw] left-[50%] mb-12 overflow-hidden"
    @mouseenter="pauseAutoPlay"
    @mouseleave="resumeAutoPlay"
  >
    <!-- Slides -->
    <div class="relative w-full h-full">
      <TransitionGroup name="slide-fade">
        <div
          v-for="(image, index) in images"
          v-show="currentSlide === index"
          :key="index"
          class="absolute inset-0"
        >
          <OptimizedImage
            :src="getImageUrl(image)"
            :alt="`${title} - ${index + 1}`"
            class="w-full h-full object-cover"
            loading="lazy"
            preset="hero"
          />
        </div>
      </TransitionGroup>
    </div>

    <!-- Navigation Buttons -->
    <button
      v-if="images.length > 1"
      @click="prevSlide"
      class="h-[48px] w-[48px]cuesor:pointer absolute left-4 top-1/2 -translate-y-1/2 z-10 bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white p-3 rounded-full transition-all hover:scale-110"
      aria-label="Previous slide"
    >
      <UIcon name="i-heroicons-chevron-left" class="w-6 h-6" />
    </button>
    <button
      v-if="images.length > 1"
      @click="nextSlide"
      class="h-[48px] w-[48px]cuesor:pointer absolute right-4 top-1/2 -translate-y-1/2 z-10 bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white p-3 rounded-full transition-all hover:scale-110"
      aria-label="Next slide"
    >
      <UIcon name="i-heroicons-chevron-right" class="w-6 h-6" />
    </button>

    <!-- Pagination Dots -->
    <div
      v-if="images.length > 1"
      class="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 flex gap-2"
    >
      <button
        v-for="(_, index) in images"
        :key="index"
        @click="goToSlide(index)"
        :class="[
          'h-3 rounded-full transition-all',
          currentSlide === index
            ? 'bg-white w-8'
            : 'bg-white/50 hover:bg-white/75 w-3'
        ]"
        :aria-label="`Go to slide ${index + 1}`"
      />
    </div>

    <!-- Gradient Overlay -->
    <div class="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-transparent pointer-events-none" />

    <!-- Content Overlay -->
    <div class="absolute inset-0 flex items-end pointer-events-none">
      <UContainer class="pb-16 pointer-events-auto">
        <slot name="back-button" />

        <h1 class="text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-4 drop-shadow-2xl">
          {{ title }}
        </h1>

        <p v-if="subtitle" class="text-2xl text-white/90 mb-8 drop-shadow-lg">
          {{ subtitle }}
        </p>

        <div class="flex flex-wrap gap-6 text-white">
          <div v-if="location" class="flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-xl">
            <UIcon name="i-heroicons-map-pin" class="w-6 h-6" />
            <span class="text-lg font-semibold">{{ location }}</span>
          </div>
          <div v-if="dateStart" class="flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-xl">
            <UIcon name="i-heroicons-calendar-days" class="w-6 h-6" />
            <span class="text-lg font-semibold">{{ formatDate(dateStart) }}</span>
          </div>
        </div>

        <slot name="additional-info" />
      </UContainer>
    </div>

    <!-- Slide Counter -->
    <div
      v-if="images.length > 1"
      class="absolute top-6 right-6 z-10 bg-black/50 backdrop-blur-sm text-white px-3 py-1 rounded-lg text-sm font-semibold"
    >
      {{ currentSlide + 1 }} / {{ images.length }}
    </div>
  </div>
</template>

<style scoped>
.slide-fade-enter-active,
.slide-fade-leave-active {
  transition: all 0.6s ease;
}

.slide-fade-enter-from {
  opacity: 0;
  transform: translateX(30px);
}

.slide-fade-leave-to {
  opacity: 0;
  transform: translateX(-30px);
}
</style>

