export function useApi() {
  const config = useRuntimeConfig()

  /**
   * GET запрос
   * @param endpoint
   */
  async function get<T = unknown>(endpoint: string): Promise<T> {
    return await $fetch(`${config.public.apiBase}${endpoint}`, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
      },
    })
  }

  /**
   * POST запрос
   * @param endpoint
   * @param data
   * @param isFormData
   */
  async function post<T = unknown>(
    endpoint: string,
    data?: unknown,
    isFormData: boolean = false
  ): Promise<T> {
    const headers: Record<string, string> = {
      Accept: 'application/json',
    }

    if (!isFormData && !(data instanceof FormData)) {
      headers['Content-Type'] = 'application/json'
    }

    return await $fetch(`${config.public.apiBase}${endpoint}`, {
      method: 'POST',
      body: data as any,
      headers,
    })
  }

  /**
   * PUT запрос
   * @param endpoint
   * @param data
   */
  async function put<T = unknown>(
    endpoint: string,
    data?: unknown
  ): Promise<T> {
    const headers: Record<string, string> = {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    }

    return await $fetch(`${config.public.apiBase}${endpoint}`, {
      method: 'PUT',
      body: data as any,
      headers,
    })
  }

  /**
   * DELETE запрос
   * @param endpoint
   */
  async function del<T = unknown>(endpoint: string): Promise<T> {
    return await $fetch(`${config.public.apiBase}${endpoint}`, {
      method: 'DELETE',
      headers: {
        Accept: 'application/json',
      },
    })
  }

  return { get, post, put, delete: del }
}

