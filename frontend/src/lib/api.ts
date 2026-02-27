/**
 * API клиент для взаимодействия с backend
 */

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api'

export interface Product {
  id: string
  slug: string
  name: string
  description: string
  price: number | string
  categoryId: string | null
  category?: {
    id: string
    name: string
    slug: string
  } | null
  imageUrl: string | null
  specifications: any
  featured: boolean
  active: boolean
  displayOnSite: boolean
  sortOrder: number
  createdAt: string
  updatedAt: string
}

export interface Service {
  id: string
  slug: string
  name: string
  description: string
  price: string
  category: string
  icon: string | null
  duration: string | null
  warranty: boolean
  featured: boolean
  active: boolean
  displayOnSite: boolean
  sortOrder: number
  createdAt: string
  updatedAt: string
}

export interface Category {
  id: string
  slug: string
  name: string
  description: string | null
  createdAt: string
  updatedAt: string
}

export interface Request {
  id: string
  name: string
  phone: string
  email: string | null
  type: 'PRODUCT' | 'SERVICE'
  productId: string | null
  serviceId: string | null
  message: string | null
  status: 'NEW' | 'PROCESSING' | 'COMPLETED' | 'CANCELLED'
  createdAt: string
  updatedAt: string
}

interface PaginatedResponse<T> {
  data: T[]
  pagination: {
    page: number
    limit: number
    total: number
    pages: number
  }
}

interface ApiError {
  error: string
  details?: string
}

/**
 * Универсальная функция для fetch запросов с обработкой ошибок
 */
async function fetchApi<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${API_URL}${endpoint}`
  
  const defaultHeaders: HeadersInit = {
    'Content-Type': 'application/json',
  }

  const config: RequestInit = {
    ...options,
    headers: {
      ...defaultHeaders,
      ...(options.headers || {}),
    },
  }

  try {
    const response = await fetch(url, config)
    const data = await response.json()

    if (!response.ok) {
      const errorData = data as ApiError
      throw new Error(errorData.details || errorData.error || 'Network response was not ok')
    }

    return data as T
  } catch (error) {
    console.error(`API Error (${endpoint}):`, error)
    throw error
  }
}

/**
 * Товары
 */
export const productsApi = {
  /**
   * Получить список товаров с пагинацией и фильтрами
   */
  async getAll(params?: {
    category?: string
    featured?: boolean
    page?: number
    limit?: number
  }): Promise<PaginatedResponse<Product>> {
    const searchParams = new URLSearchParams()
    
    if (params?.category) searchParams.set('category', params.category)
    if (params?.featured) searchParams.set('featured', 'true')
    if (params?.page) searchParams.set('page', params.page.toString())
    if (params?.limit) searchParams.set('limit', params.limit.toString())

    const queryString = searchParams.toString()
    return fetchApi<PaginatedResponse<Product>>(`/products${queryString ? `?${queryString}` : ''}`)
  },

  /**
   * Получить товар по slug
   */
  async getBySlug(slug: string): Promise<{ data: Product }> {
    return fetchApi<{ data: Product }>(`/products/${slug}`)
  },

  /**
   * Получить рекомендуемые товары
   */
  async getFeatured(limit = 4): Promise<PaginatedResponse<Product>> {
    return this.getAll({ featured: true, limit })
  }
}

/**
 * Услуги
 */
export const servicesApi = {
  /**
   * Получить список услуг
   */
  async getAll(params?: {
    category?: string
    featured?: boolean
  }): Promise<{ data: Service[] }> {
    const searchParams = new URLSearchParams()
    
    if (params?.category) searchParams.set('category', params.category)
    if (params?.featured) searchParams.set('featured', 'true')

    const queryString = searchParams.toString()
    return fetchApi<{ data: Service[] }>(`/services${queryString ? `?${queryString}` : ''}`)
  },

  /**
   * Получить услугу по slug
   */
  async getBySlug(slug: string): Promise<{ data: Service }> {
    return fetchApi<{ data: Service }>(`/services/${slug}`)
  }
}

/**
 * Категории
 */
export const categoriesApi = {
  /**
   * Получить все категории
   */
  async getAll(): Promise<{ data: Category[] }> {
    return fetchApi<{ data: Category[] }>('/categories')
  }
}

/**
 * Заявки
 */
export const requestsApi = {
  /**
   * Создать новую заявку
   */
  async create(data: {
    name: string
    phone: string
    email?: string
    type: 'PRODUCT' | 'SERVICE'
    productId?: string
    serviceId?: string
    message?: string
  }): Promise<{ data: Request }> {
    return fetchApi<{ data: Request }>('/requests', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }
}

/**
 * Экспорт для удобного импорта
 */
export const api = {
  products: productsApi,
  services: servicesApi,
  categories: categoriesApi,
  requests: requestsApi,
}

export default api
