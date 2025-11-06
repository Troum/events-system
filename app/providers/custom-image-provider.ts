import { joinURL } from 'ufo'
import type { ProviderGetImage } from '@nuxt/image'

export const getImage: ProviderGetImage = (
  src,
  { modifiers = {}, baseURL = 'https://api.camp.test' } = {}
) => {
  // Если это уже полный URL, возвращаем его как есть
  if (src.startsWith('http://') || src.startsWith('https://')) {
    return {
      url: src
    }
  }

  // Иначе объединяем с baseURL
  const url = joinURL(baseURL, src)

  return {
    url
  }
}

