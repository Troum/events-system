import type { Event, PaginatedResponse } from '~/types'

export function useEvents() {
  const api = useApi()

  const getEvents = async (params?: { page?: number; per_page?: number }) => {
    const queryParams = new URLSearchParams()
    if (params?.page) queryParams.append('page', params.page.toString())
    if (params?.per_page) queryParams.append('per_page', params.per_page.toString())
    
    const query = queryParams.toString()
    const endpoint = query ? `/events?${query}` : '/events'
    
    return api.get<{ data: Event[] }>(endpoint)
  }

  const getEvent = async (slug: string) => {
    return api.get<{ data: Event }>(`/events/${slug}`)
  }

  return {
    getEvents,
    getEvent,
  }
}

