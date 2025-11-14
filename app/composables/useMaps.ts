export const useMaps = () => {
  const config = useRuntimeConfig();

  /**
   * Получить конфигурацию карт на основе геолокации пользователя
   */
  const getMapConfig = async () => {
    try {
      const response = await fetch(`${config.public.apiBase}/api/v1/maps/config`);
      const data = await response.json();
      
      if (data.success) {
        return data.data;
      }
      
      // Fallback на Яндекс Карты
      return {
        provider: 'yandex',
        api_key: config.public.yandexMapsApiKey,
        country_code: 'RU',
      };
    } catch (error) {
      console.error('Failed to fetch map config:', error);
      
      // Fallback на Яндекс Карты
      return {
        provider: 'yandex',
        api_key: config.public.yandexMapsApiKey,
        country_code: 'RU',
      };
    }
  };

  /**
   * Проверить, какой провайдер карт использовать
   */
  const getMapProvider = async (): Promise<'yandex' | 'openstreetmap'> => {
    try {
      const response = await fetch(`${config.public.apiBase}/api/v1/maps/provider`);
      const data = await response.json();
      
      if (data.success) {
        return data.data.provider;
      }
      
      return 'yandex';
    } catch (error) {
      console.error('Failed to fetch map provider:', error);
      return 'yandex';
    }
  };

  /**
   * Получить информацию о геолокации пользователя
   */
  const getGeoInfo = async () => {
    try {
      const response = await fetch(`${config.public.apiBase}/api/v1/maps/geo-info`);
      const data = await response.json();
      
      if (data.success) {
        return data.data;
      }
      
      return null;
    } catch (error) {
      console.error('Failed to fetch geo info:', error);
      return null;
    }
  };

  return {
    getMapConfig,
    getMapProvider,
    getGeoInfo,
  };
};

