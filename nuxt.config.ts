// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  modules: ['@nuxt/image', '@nuxt/scripts', '@nuxt/ui'],

  ui: {
    theme: {
      colors: ['primary']
    },
    experimental: {
      componentDetection: true
    }
  },

  css: [
    '~/assets/css/main.css'
  ],
  runtimeConfig: {
    public: {
      apiBase: process.env.NUXT_PUBLIC_API_BASE || 'https://api.camp.test/api/v1',
      siteUrl: process.env.NUXT_PUBLIC_SITE_URL || 'https://camp-events.ru'
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
      ]
    }
  },

  ssr: true,

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
