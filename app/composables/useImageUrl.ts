export const useImageUrl = () => {
  const config = useRuntimeConfig()
  const apiBase = config.public.apiBase.replace('/api/v1', '')

  const getImageUrl = (path: string | null): string => {
    if (!path) return ''
    
    // Если это уже полный URL, возвращаем как есть
    if (path.startsWith('http://') || path.startsWith('https://')) {
      return path
    }
    
    // Если путь начинается с /, убираем его
    const cleanPath = path.startsWith('/') ? path.substring(1) : path
    
    // Формируем полный URL к Laravel storage
    return `${apiBase}/storage/${cleanPath}`
  }

  return {
    getImageUrl
  }
}

