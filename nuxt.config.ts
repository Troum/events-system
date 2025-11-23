// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  modules: ['@nuxt/image', '@nuxt/scripts', '@nuxt/ui', 'vue-yandex-maps/nuxt'],
  ui: {
    theme: {
      colors: ['primary']
    },
    experimental: {
      componentDetection: true
    }
  },

  colorMode: {
    preference: 'system', // 'system', 'light', 'dark'
    fallback: 'light',
    classSuffix: '',
    storageKey: 'nuxt-color-mode'
  },

  css: [
    '~/assets/css/main.css'
  ],
  runtimeConfig: {
    public: {
      apiBase: import.meta.env.NUXT_PUBLIC_API_BASE || 'https://api.camp.test/api/v1',
      siteUrl: import.meta.env.NUXT_PUBLIC_SITE_URL || 'https://camp-events.ru',
      yandexMapsApiKey: import.meta.env.NUXT_PUBLIC_YANDEX_MAPS_API_KEY || '593670a6-8e5e-4895-9fe5-dbd37dde463a',
      // Laravel Reverb (WebSocket)
      reverbAppKey: import.meta.env.NUXT_PUBLIC_REVERB_APP_KEY || '96e535e407b504b429fe4849799d2e796cc6d501',
      wsUrl: import.meta.env.NUXT_PUBLIC_WS_URL || (import.meta.dev ? 'api.camp.test' : 'api.events-system.online'),
      wsPort: import.meta.env.NUXT_PUBLIC_WS_PORT || 6002,
      wssPort: import.meta.env.NUXT_PUBLIC_WSS_PORT || 6002,
      reverbScheme: import.meta.env.NUXT_PUBLIC_REVERB_SCHEME || (import.meta.dev ? 'https' : 'https'),
    }
  },

  app: {
    head: {
      htmlAttrs: {
        lang: 'ru'
      },
      charset: 'utf-8',
      viewport: 'width=device-width, initial-scale=1',
      titleTemplate: '%s - Camp Events',
      meta: [
        { name: 'description', content: 'Платформа для организации поездок на мероприятия' }
      ],
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
      ],
      script: []
    }
  },

  ssr: true,

  yandexMaps: {
    apikey: import.meta.env.NUXT_PUBLIC_YANDEX_MAPS_API_KEY || '593670a6-8e5e-4895-9fe5-dbd37dde463a',
    lang: 'ru_RU',
  },

  image: {
    domains: ['api.camp.test', 'localhost', '127.0.0.1'],
    provider: 'ipx',
    ipx: {
      maxAge: 60 * 60 * 24 * 365, // 1 year
      modifiers: {
        format: 'webp',
        quality: 80,
        fit: 'cover'
      }
    },
    quality: 80,
    format: ['webp', 'jpeg', 'png'],
    screens: {
      xs: 320,
      sm: 640,
      md: 768,
      lg: 1024,
      xl: 1280,
      xxl: 1536,
    },
    densities: [1, 2],
    presets: {
      hero: {
        modifiers: {
          format: 'webp',
          quality: 85,
          fit: 'cover',
        }
      },
      card: {
        modifiers: {
          format: 'webp',
          quality: 75,
          fit: 'cover',
        }
      },
      thumbnail: {
        modifiers: {
          format: 'webp',
          quality: 70,
          fit: 'cover',
        }
      },
      avatar: {
        modifiers: {
          format: 'webp',
          quality: 75,
          fit: 'cover',
        }
      }
    }
  }
})
