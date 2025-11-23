import Echo from 'laravel-echo';
import Pusher from 'pusher-js';

export default defineNuxtPlugin((nuxtApp) => {
  const config = useRuntimeConfig();

  // Проверяем наличие необходимых переменных окружения
  if (!config.public.reverbAppKey) {
    console.warn('[Echo Plugin] Reverb App Key is missing. WebSocket will not be available.');
    return;
  }

  // Настройка Pusher для Laravel Echo
  if (import.meta.client) {
    (window as any).Pusher = Pusher;

    // Определяем настройки для локальной разработки или production
    const isLocal = import.meta.dev || 
                    window.location.hostname === 'localhost' || 
                    window.location.hostname === '127.0.0.1' ||
                    window.location.hostname.includes('.test') ||
                    window.location.hostname.includes('.local');

    // Для локальной разработки через Herd используем api.camp.test
    // Для production используем настройки из конфига
    const wsHost = isLocal 
      ? (config.public.wsUrl?.includes('.test') || config.public.wsUrl?.includes('localhost') || config.public.wsUrl?.includes('127.0.0.1')
          ? config.public.wsUrl 
          : 'api.camp.test') // Herd использует .test домены
      : config.public.wsUrl || 'api.events-system.online';

    const wsPort = config.public.wsPort || 6002;
    const wssPort = config.public.wssPort || 6002;
    // Для локальной разработки через Herd может быть как http, так и https (в зависимости от настроек Herd)
    const forceTLS = config.public.reverbScheme === 'https';

    console.log('[Echo Plugin] Initializing with:', {
      isLocal,
      wsHost,
      wsPort,
      wssPort,
      forceTLS,
      scheme: config.public.reverbScheme,
    });

    const echo = new Echo({
      broadcaster: 'reverb',
      key: config.public.reverbAppKey,
      wsHost,
      wsPort,
      wssPort,
      enableTransports: isLocal ? ['ws'] : ['ws', 'wss'],
      forceTLS,
      withCredentials: false,
      enabledTransports: isLocal ? ['ws'] : ['ws', 'wss'],
    });

    // Предоставляем Echo через provide для использования в компонентах
    nuxtApp.provide('echo', echo);

    // Также добавляем в глобальный объект для совместимости
    if (import.meta.client) {
      (window as any).Echo = echo;
    }

    console.log('[Echo Plugin] Laravel Echo initialized successfully');
  }
});

