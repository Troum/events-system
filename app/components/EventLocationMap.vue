<template>
  <div class="event-location">
    <div class="location-header">
      <h2 class="location-title">
        <svg class="location-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
        Место проведения
      </h2>
      
      <div v-if="event.venue_name" class="venue-details">
        <h3 class="venue-name">{{ event.venue_name }}</h3>
        <p v-if="event.venue_address" class="venue-address">{{ event.venue_address }}</p>
        <p v-if="event.venue_description" class="venue-description">
          {{ event.venue_description }}
        </p>
      </div>
    </div>

    <DynamicMap
      v-if="hasCoordinates"
      :latitude="event.venue_latitude"
      :longitude="event.venue_longitude"
      :zoom="14"
      :title="event.venue_name || 'Место проведения'"
      :address="event.venue_address"
      :show-info="false"
      height="500px"
    />

    <div v-else class="no-map">
      <svg class="no-map-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
      </svg>
      <p>Координаты места проведения будут добавлены позже</p>
    </div>

    <!-- Дополнительная информация -->
    <div v-if="event.airport_distance || (event.recommended_flights && event.recommended_flights.length > 0)" class="travel-info">
      <h3 class="travel-title">Как добраться</h3>
      
      <div v-if="event.airport_distance" class="info-card">
        <svg class="info-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
        </svg>
        <div>
          <p class="info-label">Расстояние от аэропорта</p>
          <p class="info-value">{{ event.airport_distance }}</p>
        </div>
      </div>

      <div v-if="event.recommended_flights && event.recommended_flights.length > 0" class="info-card">
        <svg class="info-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
        </svg>
        <div>
          <p class="info-label">Рекомендуемые рейсы</p>
          <ul class="flights-list">
            <li v-for="(flight, index) in event.recommended_flights" :key="index">
              {{ flight }}
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';

interface Event {
  venue_name?: string;
  venue_address?: string;
  venue_description?: string;
  venue_latitude?: number;
  venue_longitude?: number;
  airport_distance?: string;
  recommended_flights?: string[];
}

const props = defineProps<{
  event: Event;
}>();

const hasCoordinates = computed(() => {
  return props.event.venue_latitude && props.event.venue_longitude;
});
</script>

<style scoped>
.event-location {
  margin: 48px 0;
}

.location-header {
  margin-bottom: 24px;
}

.location-title {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 32px;
  font-weight: 700;
  color: #111827;
  margin: 0 0 24px 0;
}

.location-icon {
  width: 36px;
  height: 36px;
  color: #667eea;
}

.venue-details {
  padding: 24px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 12px;
  color: white;
}

.venue-name {
  font-size: 24px;
  font-weight: 600;
  margin: 0 0 8px 0;
}

.venue-address {
  font-size: 16px;
  margin: 0 0 16px 0;
  opacity: 0.9;
}

.venue-description {
  font-size: 14px;
  line-height: 1.6;
  margin: 0;
  opacity: 0.85;
}

.no-map {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 400px;
  background: #f9fafb;
  border-radius: 12px;
  color: #6b7280;
}

.no-map-icon {
  width: 64px;
  height: 64px;
  margin-bottom: 16px;
  opacity: 0.5;
}

.no-map p {
  font-size: 16px;
  margin: 0;
}

.travel-info {
  margin-top: 32px;
  padding: 24px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1);
}

.travel-title {
  font-size: 24px;
  font-weight: 600;
  color: #111827;
  margin: 0 0 20px 0;
}

.info-card {
  display: flex;
  gap: 16px;
  padding: 16px;
  background: #f9fafb;
  border-radius: 8px;
  margin-bottom: 16px;
}

.info-card:last-child {
  margin-bottom: 0;
}

.info-icon {
  width: 24px;
  height: 24px;
  color: #667eea;
  flex-shrink: 0;
}

.info-label {
  font-size: 14px;
  font-weight: 500;
  color: #6b7280;
  margin: 0 0 4px 0;
}

.info-value {
  font-size: 16px;
  font-weight: 600;
  color: #111827;
  margin: 0;
}

.flights-list {
  list-style: none;
  padding: 0;
  margin: 8px 0 0 0;
}

.flights-list li {
  padding: 8px 0;
  border-bottom: 1px solid #e5e7eb;
  font-size: 14px;
  color: #374151;
}

.flights-list li:last-child {
  border-bottom: none;
}

/* Dark mode */
@media (prefers-color-scheme: dark) {
  .location-title {
    color: #f9fafb;
  }

  .travel-info {
    background: #1f2937;
  }

  .travel-title {
    color: #f9fafb;
  }

  .info-card {
    background: #111827;
  }

  .info-label {
    color: #9ca3af;
  }

  .info-value {
    color: #f9fafb;
  }

  .flights-list li {
    border-bottom-color: #374151;
    color: #d1d5db;
  }

  .no-map {
    background: #1f2937;
    color: #9ca3af;
  }
}

/* Responsive */
@media (max-width: 768px) {
  .location-title {
    font-size: 24px;
  }

  .location-icon {
    width: 28px;
    height: 28px;
  }

  .venue-details {
    padding: 16px;
  }

  .venue-name {
    font-size: 20px;
  }

  .venue-address {
    font-size: 14px;
  }

  .travel-info {
    padding: 16px;
  }

  .travel-title {
    font-size: 20px;
  }

  .info-card {
    flex-direction: column;
    gap: 8px;
  }
}
</style>

