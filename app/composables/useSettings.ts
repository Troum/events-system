export interface ContactData {
  phone: string | null
  email: string | null
  address: string | null
  telegram: string | null
  whatsapp: string | null
  instagram: string | null
  vk: string | null
  facebook: string | null
}

export interface SiteSettings {
  contact: ContactData
  general: {
    site_name?: string
    site_description?: string
  }
}

export function useSettings() {
  const { get } = useApi()
  const contacts = useState<ContactData | null>('contacts', () => null)
  const settings = useState<SiteSettings | null>('settings', () => null)

  /**
   * Получить контактные данные
   */
  const fetchContacts = async (): Promise<ContactData> => {
    try {
      const response = await get<{ success: boolean; data: ContactData }>('/settings/contacts')
      if (response.success && response.data) {
        contacts.value = response.data
        return response.data
      }
      return {
        phone: null,
        email: null,
        address: null,
        telegram: null,
        whatsapp: null,
        instagram: null,
        vk: null,
        facebook: null,
      }
    } catch (error) {
      console.error('Ошибка при загрузке контактных данных:', error)
      return {
        phone: null,
        email: null,
        address: null,
        telegram: null,
        whatsapp: null,
        instagram: null,
        vk: null,
        facebook: null,
      }
    }
  }

  /**
   * Получить все настройки
   */
  const fetchSettings = async (): Promise<SiteSettings | null> => {
    try {
      const response = await get<{ success: boolean; data: SiteSettings }>('/settings')
      if (response.success && response.data) {
        settings.value = response.data
        contacts.value = response.data.contact
        return response.data
      }
      return null
    } catch (error) {
      console.error('Ошибка при загрузке настроек:', error)
      return null
    }
  }

  /**
   * Получить контактные данные (из кеша или загрузить)
   */
  const getContacts = async (): Promise<ContactData> => {
    if (contacts.value) {
      return contacts.value
    }
    return await fetchContacts()
  }

  /**
   * Получить все настройки (из кеша или загрузить)
   */
  const getSettings = async (): Promise<SiteSettings | null> => {
    if (settings.value) {
      return settings.value
    }
    return await fetchSettings()
  }

  /**
   * Нормализовать Telegram URL
   */
  const getTelegramUrl = (): string | null => {
    const value = contacts.value?.telegram
    if (!value) return null
    
    // Если уже полный URL, вернуть как есть
    if (value.startsWith('http://') || value.startsWith('https://')) {
      return value
    }
    
    // Если начинается с @, создать URL для Telegram
    if (value.startsWith('@')) {
      const username = value.substring(1)
      return `https://t.me/${username}`
    }
    
    // Если просто username без @, добавить @ и создать URL
    return `https://t.me/${value.replace('@', '')}`
  }

  /**
   * Нормализовать Instagram URL
   */
  const getInstagramUrl = (): string | null => {
    const value = contacts.value?.instagram
    if (!value) return null
    
    // Если уже полный URL, вернуть как есть
    if (value.startsWith('http://') || value.startsWith('https://')) {
      return value
    }
    
    // Если начинается с @, создать URL для Instagram
    if (value.startsWith('@')) {
      const username = value.substring(1)
      return `https://instagram.com/${username}`
    }
    
    // Если просто username без @, добавить @ и создать URL
    return `https://instagram.com/${value.replace('@', '')}`
  }

  /**
   * Получить WhatsApp URL для клика
   */
  const getWhatsAppUrl = (): string | null => {
    if (!contacts.value?.whatsapp) return null
    const phone = contacts.value.whatsapp.replace(/\D/g, '')
    return `https://wa.me/${phone}`
  }

  return {
    contacts: readonly(contacts),
    settings: readonly(settings),
    fetchContacts,
    fetchSettings,
    getContacts,
    getSettings,
    getTelegramUrl,
    getInstagramUrl,
    getWhatsAppUrl,
  }
}

