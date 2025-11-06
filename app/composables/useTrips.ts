import type { Trip, PaginatedResponse } from '~/types'

export function useTrips() {
  const api = useApi()

  const getTrips = async (params?: { event_id?: number; page?: number; per_page?: number }) => {
    const queryParams = new URLSearchParams()
    if (params?.event_id) queryParams.append('event_id', params.event_id.toString())
    if (params?.page) queryParams.append('page', params.page.toString())
    if (params?.per_page) queryParams.append('per_page', params.per_page.toString())
    
    const query = queryParams.toString()
    const endpoint = query ? `/trips?${query}` : '/trips'
    
    return api.get<PaginatedResponse<Trip>>(endpoint)
  }

  const getTrip = async (id: number) => {
    return api.get<{ data: Trip }>(`/trips/${id}`)
  }

  return {
    getTrips,
    getTrip,
  }
}

