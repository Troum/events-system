import { ref, computed } from 'vue';

export interface Coordinate {
  latitude: number;
  longitude: number;
}

export interface RoutePoint extends Coordinate {
  name?: string;
  description?: string;
  order?: number;
}

export interface Route {
  id: string;
  name: string;
  points: RoutePoint[];
  distance?: number; // в метрах
  duration?: number; // в секундах
  color?: string;
}

export interface RouteOptions {
  mode?: 'driving' | 'walking' | 'transit' | 'cycling';
  avoidTolls?: boolean;
  avoidHighways?: boolean;
  optimize?: boolean;
}

export function useMapRoutes() {
  const routes = ref<Route[]>([]);
  const activeRoute = ref<Route | null>(null);
  const loading = ref(false);
  const error = ref<string | null>(null);

  /**
   * Вычисляет расстояние между двумя точками (формула Haversine)
   */
  const calculateDistance = (point1: Coordinate, point2: Coordinate): number => {
    const R = 6371e3; // Радиус Земли в метрах
    const φ1 = (point1.latitude * Math.PI) / 180;
    const φ2 = (point2.latitude * Math.PI) / 180;
    const Δφ = ((point2.latitude - point1.latitude) * Math.PI) / 180;
    const Δλ = ((point2.longitude - point1.longitude) * Math.PI) / 180;

    const a =
      Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
      Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c; // Расстояние в метрах
  };

  /**
   * Вычисляет общую длину маршрута
   */
  const calculateRouteDistance = (points: RoutePoint[]): number => {
    if (points.length < 2) return 0;

    let totalDistance = 0;
    for (let i = 0; i < points.length - 1; i++) {
      totalDistance += calculateDistance(points[i], points[i + 1]);
    }

    return totalDistance;
  };

  /**
   * Форматирует расстояние для отображения
   */
  const formatDistance = (meters: number): string => {
    if (meters < 1000) {
      return `${Math.round(meters)} м`;
    }
    return `${(meters / 1000).toFixed(1)} км`;
  };

  /**
   * Форматирует время для отображения
   */
  const formatDuration = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);

    if (hours > 0) {
      return `${hours} ч ${minutes} мин`;
    }
    return `${minutes} мин`;
  };

  /**
   * Оценивает время в пути (упрощенная формула)
   */
  const estimateDuration = (distance: number, mode: RouteOptions['mode'] = 'driving'): number => {
    const speeds = {
      driving: 50, // км/ч
      walking: 5,
      transit: 40,
      cycling: 15,
    };

    const speed = speeds[mode] || speeds.driving;
    const hours = distance / 1000 / speed;
    return Math.round(hours * 3600); // в секундах
  };

  /**
   * Создает новый маршрут
   */
  const createRoute = (
    name: string,
    points: RoutePoint[],
    options: RouteOptions = {}
  ): Route => {
    const distance = calculateRouteDistance(points);
    const duration = estimateDuration(distance, options.mode);

    const route: Route = {
      id: `route-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      name,
      points: points.map((point, index) => ({
        ...point,
        order: point.order ?? index,
      })),
      distance,
      duration,
      color: options.mode === 'walking' ? '#10b981' : '#667eea',
    };

    routes.value.push(route);
    return route;
  };

  /**
   * Добавляет точку к маршруту
   */
  const addPointToRoute = (routeId: string, point: RoutePoint): void => {
    const route = routes.value.find((r) => r.id === routeId);
    if (!route) {
      error.value = 'Маршрут не найден';
      return;
    }

    route.points.push({
      ...point,
      order: route.points.length,
    });

    // Пересчитываем расстояние и время
    route.distance = calculateRouteDistance(route.points);
    route.duration = estimateDuration(route.distance);
  };

  /**
   * Удаляет точку из маршрута
   */
  const removePointFromRoute = (routeId: string, pointIndex: number): void => {
    const route = routes.value.find((r) => r.id === routeId);
    if (!route) {
      error.value = 'Маршрут не найден';
      return;
    }

    route.points.splice(pointIndex, 1);

    // Обновляем порядок точек
    route.points.forEach((point, index) => {
      point.order = index;
    });

    // Пересчитываем расстояние и время
    route.distance = calculateRouteDistance(route.points);
    route.duration = estimateDuration(route.distance);
  };

  /**
   * Оптимизирует порядок точек маршрута (алгоритм ближайшего соседа)
   */
  const optimizeRoute = (routeId: string): void => {
    const route = routes.value.find((r) => r.id === routeId);
    if (!route || route.points.length < 3) {
      error.value = 'Недостаточно точек для оптимизации';
      return;
    }

    const start = route.points[0];
    const end = route.points[route.points.length - 1];
    const middle = route.points.slice(1, -1);

    const optimized: RoutePoint[] = [start];
    const remaining = [...middle];

    let current = start;
    while (remaining.length > 0) {
      let nearestIndex = 0;
      let nearestDistance = calculateDistance(current, remaining[0]);

      for (let i = 1; i < remaining.length; i++) {
        const distance = calculateDistance(current, remaining[i]);
        if (distance < nearestDistance) {
          nearestDistance = distance;
          nearestIndex = i;
        }
      }

      current = remaining[nearestIndex];
      optimized.push(current);
      remaining.splice(nearestIndex, 1);
    }

    optimized.push(end);

    // Обновляем порядок
    route.points = optimized.map((point, index) => ({
      ...point,
      order: index,
    }));

    // Пересчитываем расстояние и время
    route.distance = calculateRouteDistance(route.points);
    route.duration = estimateDuration(route.distance);
  };

  /**
   * Получает границы маршрута (для центрирования карты)
   */
  const getRouteBounds = (routeId: string) => {
    const route = routes.value.find((r) => r.id === routeId);
    if (!route || route.points.length === 0) {
      return null;
    }

    const latitudes = route.points.map((p) => p.latitude);
    const longitudes = route.points.map((p) => p.longitude);

    return {
      north: Math.max(...latitudes),
      south: Math.min(...latitudes),
      east: Math.max(...longitudes),
      west: Math.min(...longitudes),
      center: {
        latitude: (Math.max(...latitudes) + Math.min(...latitudes)) / 2,
        longitude: (Math.max(...longitudes) + Math.min(...longitudes)) / 2,
      },
    };
  };

  /**
   * Получает центр маршрута
   */
  const getRouteCenter = (routeId: string): Coordinate | null => {
    const bounds = getRouteBounds(routeId);
    return bounds ? bounds.center : null;
  };

  /**
   * Удаляет маршрут
   */
  const deleteRoute = (routeId: string): void => {
    const index = routes.value.findIndex((r) => r.id === routeId);
    if (index !== -1) {
      routes.value.splice(index, 1);
      if (activeRoute.value?.id === routeId) {
        activeRoute.value = null;
      }
    }
  };

  /**
   * Очищает все маршруты
   */
  const clearRoutes = (): void => {
    routes.value = [];
    activeRoute.value = null;
  };

  /**
   * Устанавливает активный маршрут
   */
  const setActiveRoute = (routeId: string | null): void => {
    if (routeId === null) {
      activeRoute.value = null;
      return;
    }

    const route = routes.value.find((r) => r.id === routeId);
    if (route) {
      activeRoute.value = route;
    } else {
      error.value = 'Маршрут не найден';
    }
  };

  /**
   * Получает маршрут по ID
   */
  const getRoute = (routeId: string): Route | undefined => {
    return routes.value.find((r) => r.id === routeId);
  };

  /**
   * Экспортирует маршрут в GeoJSON
   */
  const exportToGeoJSON = (routeId: string): object | null => {
    const route = routes.value.find((r) => r.id === routeId);
    if (!route) {
      error.value = 'Маршрут не найден';
      return null;
    }

    return {
      type: 'FeatureCollection',
      features: [
        {
          type: 'Feature',
          properties: {
            name: route.name,
            distance: route.distance,
            duration: route.duration,
          },
          geometry: {
            type: 'LineString',
            coordinates: route.points.map((p) => [p.longitude, p.latitude]),
          },
        },
        ...route.points.map((point, index) => ({
          type: 'Feature',
          properties: {
            name: point.name || `Точка ${index + 1}`,
            description: point.description,
            order: point.order,
          },
          geometry: {
            type: 'Point',
            coordinates: [point.longitude, point.latitude],
          },
        })),
      ],
    };
  };

  // Computed properties
  const totalRoutes = computed(() => routes.value.length);
  const hasRoutes = computed(() => routes.value.length > 0);
  const totalDistance = computed(() => {
    return routes.value.reduce((sum, route) => sum + (route.distance || 0), 0);
  });

  return {
    // State
    routes,
    activeRoute,
    loading,
    error,

    // Computed
    totalRoutes,
    hasRoutes,
    totalDistance,

    // Methods
    createRoute,
    addPointToRoute,
    removePointFromRoute,
    optimizeRoute,
    deleteRoute,
    clearRoutes,
    setActiveRoute,
    getRoute,
    getRouteBounds,
    getRouteCenter,
    calculateDistance,
    calculateRouteDistance,
    formatDistance,
    formatDuration,
    estimateDuration,
    exportToGeoJSON,
  };
}

