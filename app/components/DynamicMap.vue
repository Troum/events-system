<template>
  <div class="map-container">
    <div v-if="loading" class="loading">
      <div class="spinner"></div>
      <p>Загрузка карты...</p>
    </div>
    
    <!-- Яндекс Карты -->
    <ClientOnly>
      <yandex-map
        v-if="!loading && mapConfig.provider === 'yandex'"
        :settings="yandexSettings"
        :coordinates="coordinates"
        :zoom="zoom"
        class="map"
      >
        <yandex-map-default-scheme-layer />
        <yandex-map-default-features-layer />
        <yandex-map-marker
          :settings="markerSettings"
          :coordinates="coordinates"
        />
      </yandex-map>
    </ClientOnly>
    
    <!-- OpenStreetMap (Leaflet) -->
    <ClientOnly>
      <div
        v-if="!loading && mapConfig.provider === 'openstreetmap'"
        ref="osmMapRef"
        class="map"
      ></div>
    </ClientOnly>
    
    <!-- Информация о месте -->
    <div v-if="showInfo && !loading" class="map-info">
      <h3>{{ title }}</h3>
      <p v-if="address">{{ address }}</p>
      <div class="map-provider-badge">
        <span v-if="mapConfig.provider === 'yandex'">
          Яндекс.Карты
        </span>
        <span v-else>
          OpenStreetMap
        </span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, onBeforeUnmount } from 'vue';
import { YandexMap, YandexMapDefaultSchemeLayer, YandexMapDefaultFeaturesLayer, YandexMapMarker } from 'vue-yandex-maps';

const props = defineProps({
  latitude: {
    type: Number,
    required: true,
  },
  longitude: {
    type: Number,
    required: true,
  },
  zoom: {
    type: Number,
    default: 14,
  },
  title: {
    type: String,
    default: 'Место проведения',
  },
  address: {
    type: String,
    default: '',
  },
  showInfo: {
    type: Boolean,
    default: true,
  },
  height: {
    type: String,
    default: '400px',
  },
});

const loading = ref(true);
const mapConfig = ref({
  provider: 'yandex',
  api_key: '',
  country_code: 'RU',
});
const osmMapRef = ref<HTMLElement | null>(null);
let osmMapInstance: any = null;

const coordinates = computed(() => [props.latitude, props.longitude]);

const yandexSettings = computed(() => ({
  apikey: mapConfig.value.api_key,
  lang: 'ru_RU',
  coordorder: 'latlong',
  version: '3.0',
}));

const markerSettings = {
  title: props.title,
  draggable: false,
};

// Загрузка конфигурации карт
const loadMapConfig = async () => {
  try {
    const config = useRuntimeConfig();
    const response = await fetch(`${config.public.apiBase}/api/v1/maps/config`);
    const data = await response.json();
    
    if (data.success) {
      mapConfig.value = data.data;
      
      // Если OpenStreetMap, инициализируем его
      if (mapConfig.value.provider === 'openstreetmap') {
        await initOpenStreetMap();
      }
    }
  } catch (error) {
    console.error('Failed to load map config:', error);
    // Fallback to Yandex Maps
    mapConfig.value.provider = 'yandex';
  } finally {
    loading.value = false;
  }
};

// Инициализация OpenStreetMap (Leaflet)
const initOpenStreetMap = async () => {
  // Динамический импорт Leaflet только на клиенте
  if (process.client) {
    const L = await import('leaflet');
    await import('leaflet/dist/leaflet.css');
    
    // Ждем следующий тик, чтобы ref был доступен
    await new Promise(resolve => setTimeout(resolve, 100));
    
    if (!osmMapRef.value) {
      return;
    }

    try {
      // Исправляем проблему с иконками маркеров Leaflet
      delete (L.Icon.Default.prototype as any)._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
        iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
        shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
      });

      // Создаем карту
      osmMapInstance = L.map(osmMapRef.value).setView([props.latitude, props.longitude], props.zoom);

      // Добавляем тайлы OpenStreetMap
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 19,
      }).addTo(osmMapInstance);

      // Добавляем маркер
      const marker = L.marker([props.latitude, props.longitude]).addTo(osmMapInstance);
      
      if (props.title) {
        marker.bindPopup(`<b>${props.title}</b>${props.address ? '<br>' + props.address : ''}`).openPopup();
      }
    } catch (error) {
      console.error('Failed to initialize OpenStreetMap:', error);
    }
  }
};

onMounted(() => {
  loadMapConfig();
});

// Очистка при размонтировании
onBeforeUnmount(() => {
  if (osmMapInstance) {
    osmMapInstance.remove();
    osmMapInstance = null;
  }
});
</script>

<style scoped>
.map-container {
  position: relative;
  width: 100%;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
}

.map {
  width: 100%;
  height: v-bind(height);
  min-height: 300px;
}

.loading {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: v-bind(height);
  min-height: 300px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.spinner {
  width: 48px;
  height: 48px;
  border: 4px solid rgba(255, 255, 255, 0.3);
  border-top-color: white;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 16px;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.loading p {
  font-size: 16px;
  font-weight: 500;
  margin: 0;
}

.map-info {
  padding: 16px;
  background: white;
  border-top: 1px solid #e5e7eb;
}

.map-info h3 {
  margin: 0 0 8px 0;
  font-size: 18px;
  font-weight: 600;
  color: #111827;
}

.map-info p {
  margin: 0 0 12px 0;
  font-size: 14px;
  color: #6b7280;
}

.map-provider-badge {
  display: inline-flex;
  align-items: center;
  padding: 4px 12px;
  background: #f3f4f6;
  border-radius: 9999px;
  font-size: 12px;
  font-weight: 500;
  color: #6b7280;
}

/* Dark mode support */
@media (prefers-color-scheme: dark) {
  .map-info {
    background: #1f2937;
    border-top-color: #374151;
  }

  .map-info h3 {
    color: #f9fafb;
  }

  .map-info p {
    color: #9ca3af;
  }

  .map-provider-badge {
    background: #374151;
    color: #9ca3af;
  }
}

/* Responsive */
@media (max-width: 640px) {
  .map {
    height: 300px;
  }

  .loading {
    height: 300px;
  }

  .map-info {
    padding: 12px;
  }

  .map-info h3 {
    font-size: 16px;
  }

  .map-info p {
    font-size: 13px;
  }
}
</style>

