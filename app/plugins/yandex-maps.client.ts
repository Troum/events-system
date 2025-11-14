import { createYmaps } from 'vue-yandex-maps';

export default defineNuxtPlugin((nuxtApp) => {
  const config = useRuntimeConfig();
  
  const ymaps = createYmaps({
    apikey: config.public.yandexMapsApiKey,
    lang: 'ru_RU',
  });

  nuxtApp.vueApp.use(ymaps);
});

