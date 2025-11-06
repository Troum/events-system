export function useSeo(options: {
  title?: string
  description?: string
  image?: string
  type?: string
  url?: string
}) {
  const config = useRuntimeConfig()
  const route = useRoute()
  
  const siteUrl = config.public.siteUrl || 'https://camp-events.ru'
  const fullUrl = options.url || `${siteUrl}${route.path}`
  
  useHead({
    title: options.title || 'Camp Events - Поездки на мероприятия',
    meta: [
      {
        name: 'description',
        content: options.description || 'Платформа для организации поездок на мероприятия'
      },
      {
        property: 'og:title',
        content: options.title || 'Camp Events - Поездки на мероприятия'
      },
      {
        property: 'og:description',
        content: options.description || 'Платформа для организации поездок на мероприятия'
      },
      {
        property: 'og:type',
        content: options.type || 'website'
      },
      {
        property: 'og:url',
        content: fullUrl
      },
      {
        property: 'og:image',
        content: options.image || `${siteUrl}/og-image.jpg`
      },
      {
        name: 'twitter:card',
        content: 'summary_large_image'
      },
      {
        name: 'twitter:title',
        content: options.title || 'Camp Events - Поездки на мероприятия'
      },
      {
        name: 'twitter:description',
        content: options.description || 'Платформа для организации поездок на мероприятия'
      },
      {
        name: 'twitter:image',
        content: options.image || `${siteUrl}/og-image.jpg`
      }
    ],
    link: [
      {
        rel: 'canonical',
        href: fullUrl
      }
    ]
  })
}

