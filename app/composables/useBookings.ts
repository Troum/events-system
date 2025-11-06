import type { Booking, BookingCreateDto } from '~/types'

export function useBookings() {
  const api = useApi()

  const createBooking = async (data: BookingCreateDto) => {
    return api.post<{ data: Booking }>('/bookings', data)
  }

  const getBooking = async (id: number) => {
    return api.get<{ data: Booking }>(`/bookings/${id}`)
  }

  return {
    createBooking,
    getBooking,
  }
}

