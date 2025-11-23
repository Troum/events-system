<template>
  <div class="map-container" :class="{ 'map-loading': loading }" :style="{ height: height }">
    <!-- Загрузка с анимацией -->
    <Transition name="fade">
      <div v-if="loading" class="loading">
        <div class="spinner-container">
          <div class="spinner"></div>
          <div class="spinner-ring"></div>
        </div>
        <p class="loading-text">Загрузка карты...</p>
        <div class="loading-progress">
          <div class="loading-progress-bar" :style="{ width: `${loadingProgress}%` }"></div>
        </div>
      </div>
    </Transition>
    
    <!-- Яндекс Карты через vue-yandex-maps -->
    <ClientOnly>
      <Transition name="map-fade">
        <YandexMap
          v-if="!loading && mapConfig.provider === 'yandex' && mapReady"
          v-model="yandexMapInstance"
          :settings="yandexMapSettings"
          :width="'100%'"
          :height="height"
          class="map yandex-map-container"
          @ready="onYandexMapReady"
        >
          <YandexMapDefaultSchemeLayer />
          <YandexMapDefaultFeaturesLayer />
          <YandexMapMarker
            v-if="yandexCoordinates && yandexCoordinates.length === 2"
            :settings="markerSettings"
          >
            <template #default>
              <div class="custom-marker">
                <svg class="marker-icon" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 0C7.31 0 3.5 3.81 3.5 8.5C3.5 14.88 12 24 12 24S20.5 14.88 20.5 8.5C20.5 3.81 16.69 0 12 0ZM12 11.5C10.62 11.5 9.5 10.38 9.5 9C9.5 7.62 10.62 6.5 12 6.5C13.38 6.5 14.5 7.62 14.5 9C14.5 10.38 13.38 11.5 12 11.5Z"/>
                </svg>
                <div class="marker-pulse"></div>
              </div>
            </template>
          </YandexMapMarker>
        </YandexMap>
      </Transition>
    </ClientOnly>
    
    <!-- OpenStreetMap (Leaflet) -->
    <ClientOnly>
      <Transition name="map-fade">
        <div
          v-if="!loading && mapConfig.provider === 'openstreetmap'"
          ref="osmMapRef"
          class="map osm-map-container"
        ></div>
      </Transition>
    </ClientOnly>
    
    <!-- Контролы карты -->
    <Transition name="slide-up">
      <div v-if="!loading && interactive" class="map-controls">
        <button 
          class="control-btn" 
          @click="zoomIn"
          :title="'Приблизить'"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
          </svg>
        </button>
        <button 
          class="control-btn" 
          @click="zoomOut"
          :title="'Отдалить'"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 12H4" />
          </svg>
        </button>
        <button 
          class="control-btn" 
          @click="resetView"
          :title="'Сбросить'"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
        </button>
        <button 
          v-if="fullscreenEnabled"
          class="control-btn" 
          @click="toggleFullscreen"
          :title="isFullscreen ? 'Выйти из полноэкранного режима' : 'Полноэкранный режим'"
        >
          <svg v-if="!isFullscreen" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
          </svg>
          <svg v-else viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 9V4.5M9 9H4.5M9 9L3.75 3.75M9 15v4.5M9 15H4.5M9 15l-5.25 5.25M15 9h4.5M15 9V4.5M15 9l5.25-5.25M15 15h4.5M15 15v4.5m0-4.5l5.25 5.25" />
          </svg>
        </button>
      </div>
    </Transition>
    
    <!-- Информация о месте -->
    <Transition name="slide-up">
      <div v-if="showInfo && !loading" class="map-info">
        <div class="info-content">
          <h3 class="info-title">{{ title }}</h3>
          <p v-if="address" class="info-address">
            <svg class="info-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            {{ address }}
          </p>
          <div class="info-footer">
            <div class="map-provider-badge">
              <svg v-if="mapConfig.provider === 'yandex'" class="provider-icon" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z"/>
              </svg>
              <svg v-else class="provider-icon" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z"/>
              </svg>
              <span v-if="mapConfig.provider === 'yandex'">Яндекс.Карты</span>
              <span v-else>OpenStreetMap</span>
            </div>
            <div v-if="mapConfig.country_name" class="location-badge">
              <svg class="location-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {{ mapConfig.country_name }}
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount, nextTick, shallowRef, watch } from 'vue';
import {
  YandexMap,
  YandexMapDefaultSchemeLayer,
  YandexMapDefaultFeaturesLayer,
  YandexMapMarker,
} from 'vue-yandex-maps';

interface Props {
  latitude: number;
  longitude: number;
  zoom?: number;
  title?: string;
  address?: string;
  showInfo?: boolean;
  height?: string;
  interactive?: boolean;
  fullscreenEnabled?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  zoom: 14,
  title: 'Место проведения',
  address: '',
  showInfo: true,
  height: '400px',
  interactive: true,
  fullscreenEnabled: true,
});

const loading = ref(true);
const loadingProgress = ref(0);
const config = useRuntimeConfig();
const mapConfig = ref({ provider: 'yandex', api_key: '', country_code: '', country_name: null });
const osmMapRef = ref<HTMLElement | null>(null);
const isFullscreen = ref(false);
const mapReady = ref(false);
let osmMapInstance: any = null;
let progressInterval: ReturnType<typeof setInterval> | null = null;

// Инстанс Яндекс карты
const yandexMapInstance = shallowRef<any>(null);

// Координаты для Яндекс карт: [долгота, широта]
const yandexCoordinates = computed<[number, number]>(() => [props.longitude, props.latitude]);

// Координаты для OpenStreetMap: [широта, долгота]
const osmCoordinates = computed<[number, number]>(() => [props.latitude, props.longitude]);

// Реактивное состояние для zoom (для обновления карты)
const currentZoom = ref(props.zoom);
const currentCenter = ref<[number, number]>(yandexCoordinates.value);

// Настройки Яндекс карты
const yandexMapSettings = computed(() => ({
  location: {
    center: currentCenter.value,
    zoom: currentZoom.value,
  },
}));

// Настройки маркера
const markerSettings = computed(() => ({
  coordinates: yandexCoordinates.value,
  mapFollowsOnDrag: false,
}));

// Загрузка конфигурации карт с бэкенда
const loadMapConfig = async () => {
  progressInterval = setInterval(() => {
    if (loadingProgress.value < 90) loadingProgress.value += 10;
  }, 200);

  try {
    const response = await fetch(`${config.public.apiBase}/maps/config`);
    const data = await response.json();

    if (data.success) {
      mapConfig.value = data.data;
      mapConfig.value.api_key = mapConfig.value.api_key || config.public.yandexMapsApiKey || '';
      
      if (mapConfig.value.provider === 'openstreetmap') {
        await initOpenStreetMap();
      } else {
        mapReady.value = true;
      }
    }
  } catch {
    mapConfig.value = {
      provider: 'yandex',
      api_key: config.public.yandexMapsApiKey || '',
      country_code: null,
      country_name: null,
    };
    mapReady.value = true;
  } finally {
    if (progressInterval) {
      clearInterval(progressInterval);
      progressInterval = null;
    }
    loadingProgress.value = 100;
    setTimeout(() => { loading.value = false; }, 300);
  }
};

// Обработчик готовности Яндекс карты
const onYandexMapReady = (map: any) => {
  console.log('[DynamicMap] Yandex Map ready', map);
  console.log('[DynamicMap] Map structure:', {
    hasCamera: !!map?.camera,
    hasLocation: !!map?.location,
    mapKeys: map ? Object.keys(map) : [],
  });
  yandexMapInstance.value = map;
  
  // Пробуем получить текущие значения из карты разными способами
  if (map?.camera) {
    try {
      currentZoom.value = map.camera.getZoom() || props.zoom;
      const center = map.camera.getPosition();
      if (center) {
        currentCenter.value = [center[0], center[1]];
      }
    } catch (error) {
      console.warn('[DynamicMap] Could not get camera values:', error);
    }
  } else if (map?.location) {
    // Альтернативный способ получения значений
    try {
      currentZoom.value = map.location.zoom || props.zoom;
      if (map.location.center) {
        currentCenter.value = [map.location.center[0], map.location.center[1]];
      }
    } catch (error) {
      console.warn('[DynamicMap] Could not get location values:', error);
    }
  }
};

// Инициализация OpenStreetMap (Leaflet)
const initOpenStreetMap = async () => {
  if (!import.meta.client || !osmMapRef.value) return;

  try {
    const L = await import('leaflet');
    await import('leaflet/dist/leaflet.css');
    await nextTick();
    if (!osmMapRef.value) return;

    delete (L.Icon.Default.prototype as any)._getIconUrl;
    L.Icon.Default.mergeOptions({
      iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
      iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
      shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
    });

    const coords: [number, number] = [props.latitude, props.longitude];
    osmMapInstance = L.map(osmMapRef.value).setView(coords, props.zoom);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      maxZoom: 19,
    }).addTo(osmMapInstance);

    const marker = L.marker(coords).addTo(osmMapInstance);
    if (props.title) {
      marker.bindPopup(`<b>${props.title}</b>${props.address ? '<br>' + props.address : ''}`).openPopup();
    }
  } catch {
    // Игнорируем ошибки
  }
};

// Контролы карты
const zoomIn = () => {
  if (osmMapInstance) {
    osmMapInstance.zoomIn();
  } else if (yandexMapInstance.value) {
    // Обновляем через реактивные свойства - карта автоматически обновится
    const newZoom = Math.min(currentZoom.value + 1, 20);
    currentZoom.value = newZoom;
    
    // Пробуем через camera API, если доступен
    if (yandexMapInstance.value?.camera) {
      try {
        yandexMapInstance.value.camera.setZoom(newZoom, { duration: 300 });
      } catch (error) {
        console.warn('[DynamicMap] Camera API error:', error);
      }
    }
  }
};

const zoomOut = () => {
  if (osmMapInstance) {
    osmMapInstance.zoomOut();
  } else if (yandexMapInstance.value) {
    // Обновляем через реактивные свойства - карта автоматически обновится
    const newZoom = Math.max(currentZoom.value - 1, 1);
    currentZoom.value = newZoom;
    
    // Пробуем через camera API, если доступен
    if (yandexMapInstance.value?.camera) {
      try {
        yandexMapInstance.value.camera.setZoom(newZoom, { duration: 300 });
      } catch (error) {
        console.warn('[DynamicMap] Camera API error:', error);
      }
    }
  }
};

const resetView = () => {
  if (osmMapInstance) {
    osmMapInstance.setView(osmCoordinates.value, props.zoom);
  } else if (yandexMapInstance.value) {
    // Обновляем через реактивные свойства - карта автоматически обновится
    currentZoom.value = props.zoom;
    currentCenter.value = yandexCoordinates.value;
    
    // Пробуем через camera API, если доступен
    if (yandexMapInstance.value?.camera) {
      try {
        yandexMapInstance.value.camera.setPosition({
          center: yandexCoordinates.value,
          zoom: props.zoom,
        }, { duration: 500 });
      } catch (error) {
        console.warn('[DynamicMap] Camera API error:', error);
      }
    }
  }
};

const toggleFullscreen = () => {
  const container = document.querySelector('.map-container') as HTMLElement;
  if (!container) return;
  
  if (!isFullscreen.value) {
    if (container.requestFullscreen) {
      container.requestFullscreen();
    }
  } else {
    if (document.exitFullscreen) {
      document.exitFullscreen();
    }
  }
  isFullscreen.value = !isFullscreen.value;
};

// Обработчик изменения полноэкранного режима
if (import.meta.client) {
  document.addEventListener('fullscreenchange', () => {
    isFullscreen.value = !!document.fullscreenElement;
  });
}

// Отслеживание изменений координат и zoom
watch(() => [props.latitude, props.longitude, props.zoom], () => {
  if (osmMapInstance) {
    osmMapInstance.setView(osmCoordinates.value, props.zoom);
  } else if (yandexMapInstance.value) {
    currentZoom.value = props.zoom;
    currentCenter.value = yandexCoordinates.value;
  }
}, { deep: true });

onMounted(() => {
  loadMapConfig();
});

onBeforeUnmount(() => {
  if (progressInterval) {
    clearInterval(progressInterval);
    progressInterval = null;
  }
  if (osmMapInstance) {
    osmMapInstance.remove();
    osmMapInstance = null;
  }
  if (yandexMapInstance.value) {
    yandexMapInstance.value.destroy();
    yandexMapInstance.value = null;
  }
});
</script>

<style scoped>
/* Transitions */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.map-fade-enter-active {
  transition: all 0.5s ease-out;
}

.map-fade-enter-from {
  opacity: 0;
  transform: scale(0.95);
}

.slide-up-enter-active {
  transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.slide-up-enter-from {
  opacity: 0;
  transform: translateY(20px);
}

/* Container */
.map-container {
  position: relative;
  width: 100%;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 10px 40px -10px rgba(0, 0, 0, 0.15), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
  isolation: isolate;
}

.map-container:hover {
  box-shadow: 0 20px 60px -15px rgba(0, 0, 0, 0.2), 0 8px 12px -4px rgba(0, 0, 0, 0.08);
}

.map-container.map-loading {
  pointer-events: none;
}

/* Map */
.map {
  position: relative;
  width: 100%;
  height: v-bind(height);
  min-height: 300px;
  background: #f3f4f6;
  z-index: 1;
}

.yandex-map-container,
.osm-map-container {
  position: relative !important;
  z-index: 1 !important;
}

.osm-map-container .leaflet-container {
  width: 100% !important;
  height: 100% !important;
  position: absolute !important;
  top: 0 !important;
  left: 0 !important;
  z-index: 1 !important;
  background: #f3f4f6;
}

.osm-map-container .leaflet-pane {
  z-index: 1 !important;
}

.osm-map-container .leaflet-tile-pane {
  z-index: 1 !important;
}

.osm-map-container .leaflet-overlay-pane {
  z-index: 2 !important;
}

.osm-map-container .leaflet-marker-pane {
  z-index: 3 !important;
}

.osm-map-container .leaflet-tooltip-pane {
  z-index: 4 !important;
}

.osm-map-container .leaflet-popup-pane {
  z-index: 5 !important;
}

.osm-map-container .leaflet-control-container {
  z-index: 6 !important;
}

/* Loading State */
.loading {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: v-bind(height);
  min-height: 300px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  z-index: 10;
}

.spinner-container {
  position: relative;
  width: 64px;
  height: 64px;
  margin-bottom: 24px;
}

.spinner {
  position: absolute;
  width: 64px;
  height: 64px;
  border: 4px solid rgba(255, 255, 255, 0.2);
  border-top-color: white;
  border-radius: 50%;
  animation: spin 1s cubic-bezier(0.68, -0.55, 0.27, 1.55) infinite;
}

.spinner-ring {
  position: absolute;
  width: 64px;
  height: 64px;
  border: 4px solid transparent;
  border-top-color: rgba(255, 255, 255, 0.5);
  border-radius: 50%;
  animation: spin 1.5s linear infinite reverse;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.loading-text {
  font-size: 18px;
  font-weight: 600;
  margin: 0 0 16px 0;
  animation: pulse 2s ease-in-out infinite;
}

@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.7;
  }
}

.loading-progress {
  width: 200px;
  height: 4px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 2px;
  overflow: hidden;
}

.loading-progress-bar {
  height: 100%;
  background: white;
  border-radius: 2px;
  transition: width 0.3s ease;
  box-shadow: 0 0 10px rgba(255, 255, 255, 0.5);
}

/* Custom Marker */
.custom-marker {
  position: relative;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.marker-icon {
  width: 40px;
  height: 40px;
  color: #667eea;
  filter: drop-shadow(0 4px 6px rgba(0, 0, 0, 0.3));
  animation: marker-bounce 2s ease-in-out infinite;
}

@keyframes marker-bounce {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-10px);
  }
}

.marker-pulse {
  position: absolute;
  width: 40px;
  height: 40px;
  background: rgba(102, 126, 234, 0.4);
  border-radius: 50%;
  animation: pulse-ring 2s ease-out infinite;
}

@keyframes pulse-ring {
  0% {
    transform: scale(0.8);
    opacity: 1;
  }
  100% {
    transform: scale(2);
    opacity: 0;
  }
}

/* Map Controls */
.map-controls {
  position: absolute;
  top: 16px;
  right: 16px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  z-index: 10;
  pointer-events: none;
}

.map-controls .control-btn {
  pointer-events: auto;
}

.control-btn {
  width: 44px;
  height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: white;
  border: none;
  border-radius: 10px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  cursor: pointer;
  transition: all 0.2s ease;
}

.control-btn:hover {
  background: #f9fafb;
  transform: scale(1.05);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
}

.control-btn:active {
  transform: scale(0.95);
}

.control-btn svg {
  width: 20px;
  height: 20px;
  color: #374151;
}

/* Map Info */
.map-info {
  position: relative;
  padding: 20px;
  background: white;
  border-top: 1px solid #e5e7eb;
  backdrop-filter: blur(10px);
  z-index: 2;
  pointer-events: auto;
}

.info-content {
  max-width: 100%;
}

.info-title {
  margin: 0 0 8px 0;
  font-size: 20px;
  font-weight: 700;
  color: #111827;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.info-address {
  display: flex;
  align-items: flex-start;
  gap: 8px;
  margin: 0 0 16px 0;
  font-size: 14px;
  color: #6b7280;
  line-height: 1.5;
}

.info-icon {
  width: 18px;
  height: 18px;
  color: #667eea;
  flex-shrink: 0;
  margin-top: 2px;
}

.info-footer {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
}

.map-provider-badge,
.location-badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 14px;
  background: linear-gradient(135deg, #f3f4f6 0%, #e5e7eb 100%);
  border-radius: 9999px;
  font-size: 12px;
  font-weight: 600;
  color: #374151;
  transition: all 0.2s ease;
}

.map-provider-badge:hover,
.location-badge:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.provider-icon,
.location-icon {
  width: 14px;
  height: 14px;
  color: #667eea;
}

/* Dark mode */
@media (prefers-color-scheme: dark) {
  .map-container {
    box-shadow: 0 10px 40px -10px rgba(0, 0, 0, 0.5), 0 4px 6px -2px rgba(0, 0, 0, 0.3);
  }

  .map {
    background: #1f2937;
  }

  .control-btn {
    background: #374151;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.4);
  }

  .control-btn:hover {
    background: #4b5563;
  }

  .control-btn svg {
    color: #f9fafb;
  }

  .map-info {
    background: rgba(31, 41, 55, 0.95);
    border-top-color: #374151;
  }

  .info-title {
    color: #f9fafb;
  }

  .info-address {
    color: #9ca3af;
  }

  .map-provider-badge,
  .location-badge {
    background: linear-gradient(135deg, #374151 0%, #4b5563 100%);
    color: #d1d5db;
  }
}

/* Responsive */
@media (max-width: 768px) {
  .map-container {
    border-radius: 12px;
  }

  .map {
    height: 350px;
  }

  .loading {
    height: 350px;
  }

  .map-controls {
    top: 12px;
    right: 12px;
    gap: 6px;
  }

  .control-btn {
    width: 38px;
    height: 38px;
  }

  .control-btn svg {
    width: 18px;
    height: 18px;
  }

  .map-info {
    padding: 16px;
  }

  .info-title {
    font-size: 18px;
  }

  .info-address {
    font-size: 13px;
  }

  .info-footer {
    gap: 8px;
  }

  .map-provider-badge,
  .location-badge {
    padding: 5px 12px;
    font-size: 11px;
  }
}

@media (max-width: 640px) {
  .map {
    height: 300px;
  }

  .loading {
    height: 300px;
  }

  .spinner-container {
    width: 48px;
    height: 48px;
  }

  .spinner,
  .spinner-ring {
    width: 48px;
    height: 48px;
  }

  .loading-text {
    font-size: 16px;
  }

  .loading-progress {
    width: 150px;
  }

  .info-title {
    font-size: 16px;
  }

  .info-address {
    font-size: 12px;
  }
}

/* Fullscreen mode */
.map-container:fullscreen {
  border-radius: 0;
}

.map-container:fullscreen .map {
  height: 100vh;
}
</style>
