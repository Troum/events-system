export interface Event {
  id: number
  title: string
  subtitle?: string
  slug: string
  description: string
  hero_description?: string
  image: string | null
  hero_images?: string[]
  date_start: string
  date_end: string
  location: string
  about?: string
  features?: any[]
  schedule?: any[]
  infrastructure?: any[]
  team_members?: TeamMember[]
  event_packages?: EventPackage[]
  not_included?: any[]
  venue_name?: string
  venue_description?: string
  venue_address?: string
  venue_latitude?: number
  venue_longitude?: number
  airport_distance?: string
  recommended_flights?: any
  faq?: any[]
  gallery?: string[]
  organizer_name?: string
  organizer_phone?: string
  organizer_email?: string
  organizer_telegram?: string
  organizer_whatsapp?: string
  show_booking_form?: boolean
  show_countdown?: boolean
  max_participants?: number
  current_participants?: number
  meta_description?: string
  meta_keywords?: string[]
  og_image?: string
  trips?: Trip[]
  created_at: string
  updated_at?: string
}

export interface Trip {
  id: number
  event_id: number
  event_slug?: string
  event?: Event
  city_from: string
  city_to?: string
  departure_time: string
  arrival_time?: string
  duration?: string
  price: number | string
  seats_total: number
  seats_taken: number
  available_seats?: number
  description?: any
  images?: string[]
  transport_type?: string
  route_description?: string
  stops?: any[]
  includes?: any[]
  not_includes?: any[]
  amenities?: any[]
  luggage_allowance?: string
  luggage_rules?: string
  pickup_points?: any[]
  dropoff_points?: any[]
  driver_name?: string
  driver_phone?: string
  guide_name?: string
  guide_phone?: string
  additional_services?: any[]
  cancellation_policy?: string
  terms_and_conditions?: string
  min_age?: number
  requirements?: string
  status?: string
  is_featured?: boolean
  allow_waitlist?: boolean
  available_payment_gateways?: string[]
  event?: Event
  created_at?: string
  updated_at?: string
}

export interface Booking {
  id: number
  trip_id: number
  user_name: string
  user_phone: string
  user_email: string
  seats: number
  payment_status: 'pending' | 'paid' | 'failed' | 'cancelled'
  payment_gateway?: 'yookassa' | 'stripe' | 'paypal' | 'webpay' | 'pay_on_arrival'
  created_at: string
  trip?: Trip
}

export interface Payment {
  id: number
  booking_id: number
  amount: number
  provider: 'yookassa' | 'stripe' | 'paypal' | 'webpay'
  status: 'pending' | 'success' | 'failed' | 'cancelled'
  transaction_id: string | null
  created_at: string
  booking?: Booking
}

export interface BookingCreateDto {
  trip_id: number
  user_name: string
  user_phone: string
  user_email: string
  seats: number
  payment_gateway?: string
}

export interface PaymentCreateDto {
  booking_id: number
  provider: 'yookassa' | 'stripe' | 'paypal' | 'webpay'
}

export interface ApiResponse<T> {
  data: T
  message?: string
}

export interface PaginatedResponse<T> {
  data: T[]
  current_page: number
  last_page: number
  per_page: number
  total: number
}

export interface TeamMember {
  id: number
  name: string
  role?: string
  bio?: string
  photo?: string
  email?: string
  phone?: string
  rating?: number
  social_links?: any
  is_active?: boolean
  pivot?: {
    role_in_event?: string
    order?: number
  }
}

export interface EventPackage {
  id: number
  event_id: number
  name: string
  icon?: string
  description?: string
  price: number | string
  price_note?: string
  max_participants?: number
  current_participants?: number
  includes?: any[]
  not_includes?: any[]
  is_active?: boolean
  is_featured?: boolean
  order?: number
}

