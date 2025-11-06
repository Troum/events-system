<template>
  <div class="space-y-6">
    <div v-if="loading" class="flex justify-center items-center py-12">
      <UIcon name="i-heroicons-arrow-path" class="w-8 h-8 animate-spin text-primary-500" />
    </div>

    <UAlert
      v-else-if="error"
      color="error"
      variant="soft"
      :title="error"
    />

    <div v-else-if="payment" class="space-y-6">
      <UCard class="glass-effect dark:glass-effect-dark border border-primary-100/50 dark:border-primary-900/50">
        <template #header>
          <h2 class="text-2xl font-bold gradient-text">Информация о платеже</h2>
        </template>

        <div class="space-y-4">
          <div class="flex justify-between">
            <span class="text-gray-600 dark:text-gray-400">Сумма:</span>
            <span class="font-bold text-lg gradient-text">{{ formatPrice(payment.amount) }}</span>
          </div>
          <div class="flex justify-between">
            <span class="text-gray-600 dark:text-gray-400">Статус:</span>
            <UBadge :color="getStatusColor(payment.status)">
              {{ getStatusLabel(payment.status) }}
            </UBadge>
          </div>
          <div class="flex justify-between">
            <span class="text-gray-600 dark:text-gray-400">Провайдер:</span>
            <span class="font-medium">{{ getProviderLabel(payment.provider) }}</span>
          </div>
        </div>
      </UCard>

      <div v-if="payment.status === 'pending' && paymentUrl" class="text-center">
        <UButton
          :to="paymentUrl"
          external
          color="primary"
          size="lg"
          class="gradient-primary hover:opacity-90 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
        >
          Перейти к оплате
        </UButton>
      </div>

      <UAlert
        v-else-if="payment.status === 'success'"
        color="green"
        variant="soft"
        title="Платеж успешно выполнен!"
        icon="i-heroicons-check-circle"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Payment } from '~/types'

interface Props {
  paymentId: number
  paymentUrl?: string | null
}

const props = defineProps<Props>()

const payments = usePayments()
const payment = ref<Payment | null>(null)
const paymentUrl = ref<string | null>(props.paymentUrl || null)
const loading = ref(true)
const error = ref<string | null>(null)

onMounted(async () => {
  try {
    loading.value = true
    const response = await payments.getPayment(props.paymentId)
    payment.value = response.data
  } catch (e: any) {
    error.value = e.message || 'Ошибка при загрузке платежа'
  } finally {
    loading.value = false
  }
})

watch(() => props.paymentUrl, (newUrl) => {
  paymentUrl.value = newUrl || null
})

const formatPrice = (price: number | string) => {
  const numPrice = typeof price === 'string' ? parseFloat(price) : price
  return new Intl.NumberFormat('ru-RU', {
    style: 'currency',
    currency: 'RUB',
  }).format(numPrice)
}

const getStatusColor = (status: Payment['status']) => {
  const colors = {
    pending: 'yellow',
    success: 'green',
    failed: 'red',
    cancelled: 'gray',
  }
  return colors[status] || 'gray'
}

const getStatusLabel = (status: Payment['status']) => {
  const labels = {
    pending: 'Ожидает оплаты',
    success: 'Оплачено',
    failed: 'Ошибка',
    cancelled: 'Отменено',
  }
  return labels[status] || status
}

const getProviderLabel = (provider: Payment['provider']) => {
  const labels = {
    yookassa: 'ЮKassa',
    stripe: 'Stripe',
    paypal: 'PayPal',
    webpay: 'WebPay',
  }
  return labels[provider] || provider
}
</script>
