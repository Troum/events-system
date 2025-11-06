import type { Payment, PaymentCreateDto } from '~/types'

export function usePayments() {
  const api = useApi()

  const createPayment = async (data: PaymentCreateDto) => {
    return api.post<{ data: Payment; payment_url: string }>('/payments', data)
  }

  const getPayment = async (id: number) => {
    return api.get<{ data: Payment }>(`/payments/${id}`)
  }

  const handleCallback = async (provider: 'yookassa' | 'stripe' | 'paypal' | 'webpay', data: any) => {
    return api.post<{ data: Payment }>(`/payments/${provider}/callback`, data)
  }

  return {
    createPayment,
    getPayment,
    handleCallback,
  }
}

