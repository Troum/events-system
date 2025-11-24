/**
 * Плагин для инициализации настроек сайта при загрузке приложения
 */
export default defineNuxtPlugin(async () => {
  if (!import.meta.client) {
    return
  }

  const { fetchContacts } = useSettings()

  try {
    // Загружаем контактные данные при инициализации приложения
    await fetchContacts()
  } catch (error) {
    console.error('Ошибка при инициализации настроек:', error)
  }
})

