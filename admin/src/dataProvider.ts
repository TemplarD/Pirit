import { DataProvider, fetchUtils } from 'react-admin'

const apiUrl = 'http://localhost:3000/api'

const httpClient = async (url: string, options: any = {}) => {
  if (!options.headers) {
    options.headers = new Headers({ Accept: 'application/json' })
  }
  
  const token = localStorage.getItem('admin_token')
  if (token) {
    options.headers.set('Authorization', `Bearer ${token}`)
  }
  
  return fetchUtils.fetchJson(url, options)
}

export const dataProvider: DataProvider = {
  getList: async (resource, params) => {
    const { page, perPage } = params.pagination || { page: 1, perPage: 25 }
    const { field, order } = params.sort || {}
    
    const query = new URLSearchParams()
    query.set('page', page.toString())
    query.set('limit', perPage.toString())
    
    if (field && order) {
      query.set('sort', field)
      query.set('order', order)
    }
    
    if (params.filter) {
      Object.entries(params.filter).forEach(([key, value]) => {
        query.set(key, String(value))
      })
    }
    
    const url = `${apiUrl}/${resource}?${query.toString()}`
    
    try {
      const response = await httpClient(url)
      
      // Handle different response formats
      let data, total
      if (response.json.data) {
        data = response.json.data
        total = response.json.pagination?.total || response.json.data.length
      } else {
        data = response.json
        total = response.json.length
      }
      
      return {
        data,
        total,
      }
    } catch (error) {
      console.error(`Error fetching ${resource}:`, error)
      throw error
    }
  },

  getOne: async (resource, params) => {
    const url = `${apiUrl}/${resource}/${String(params.id)}`
    
    try {
      const response = await httpClient(url)
      return {
        data: response.json.data || response.json,
      }
    } catch (error) {
      console.error(`Error fetching ${resource} ${params.id}:`, error)
      // Возвращаем моковые данные если API недоступно
      const mockData = {
        products: {
          id: params.id,
          name: 'Товар',
          slug: 'product',
          price: '100000',
          categoryId: '1',
          description: 'Описание товара',
          featured: false,
          active: true,
          displayOnSite: true,
          sortOrder: 1
        },
        services: {
          id: params.id,
          name: 'Услуга',
          slug: 'service',
          price: '5000',
          category: 'diagnostics',
          description: 'Описание услуги',
          duration: '1 час',
          warranty: false,
          featured: true,
          active: true,
          displayOnSite: true,
          sortOrder: 1
        },
        categories: {
          id: params.id,
          name: 'Категория',
          slug: 'category',
          description: 'Описание категории',
          active: true
        },
        requests: {
          id: params.id,
          name: 'Имя',
          phone: '+79999999999',
          email: 'email@example.com',
          type: 'PRODUCT',
          status: 'NEW',
          message: 'Сообщение'
        },
        seo: {
          id: params.id,
          page: 'home',
          title: 'Заголовок',
          description: 'Описание',
          keywords: 'ключевые слова',
          active: true
        },
        navigation: {
          id: params.id,
          type: 'header',
          label: 'Пункт',
          url: '/',
          position: 'left',
          order: 1,
          active: true,
          isMain: false
        }
      }
      
      return {
        data: (mockData as any)[resource] || { id: params.id },
      }
    }
  },

  getMany: async (resource, params) => {
    const query = new URLSearchParams()
    params.ids.forEach(id => query.append('ids', String(id)))
    const url = `${apiUrl}/${resource}?${query.toString()}`
    
    try {
      const response = await httpClient(url)
      return {
        data: response.json.data || response.json,
      }
    } catch (error) {
      console.error(`Error fetching many ${resource}:`, error)
      throw error
    }
  },

  getManyReference: async (resource, params) => {
    const { page, perPage } = params.pagination
    const { field, order } = params.sort
    
    const query = new URLSearchParams()
    query.set('page', page.toString())
    query.set('limit', perPage.toString())
    
    if (field && order) {
      query.set('sort', field)
      query.set('order', order)
    }
    
    query.set(params.target, String(params.id))
    
    if (params.filter) {
      Object.entries(params.filter).forEach(([key, value]) => {
        query.set(key, String(value))
      })
    }
    
    const url = `${apiUrl}/${resource}?${query.toString()}`
    
    try {
      const response = await httpClient(url)
      
      let data, total
      if (response.json.data) {
        data = response.json.data
        total = response.json.pagination?.total || response.json.data.length
      } else {
        data = response.json
        total = response.json.length
      }
      
      return {
        data,
        total,
      }
    } catch (error) {
      console.error(`Error fetching reference ${resource}:`, error)
      throw error
    }
  },

  update: async (resource, params) => {
    const url = `${apiUrl}/${resource}/${params.id}`
    
    try {
      const response = await httpClient(url, {
        method: 'PUT',
        body: JSON.stringify(params.data),
      })
      
      return {
        data: response.json.data || response.json,
      }
    } catch (error) {
      console.error(`Error updating ${resource} ${params.id}:`, error)
      throw error
    }
  },

  updateMany: async (resource, params) => {
    const url = `${apiUrl}/${resource}/batch`
    
    try {
      const response = await httpClient(url, {
        method: 'PUT',
        body: JSON.stringify({ ids: params.ids, data: params.data }),
      })
      
      return {
        data: response.json.data || params.ids,
      }
    } catch (error) {
      console.error(`Error updating many ${resource}:`, error)
      throw error
    }
  },

  create: async (resource, params) => {
    const url = `${apiUrl}/${resource}`
    
    try {
      const response = await httpClient(url, {
        method: 'POST',
        body: JSON.stringify(params.data),
      })
      
      return {
        data: response.json.data || response.json,
      }
    } catch (error) {
      console.error(`Error creating ${resource}:`, error)
      throw error
    }
  },

  delete: async (resource, params) => {
    const url = `${apiUrl}/${resource}/${params.id}`
    
    try {
      const response = await httpClient(url, {
        method: 'DELETE',
      })
      
      return {
        data: response.json.data || params.previousData,
      }
    } catch (error) {
      console.error(`Error deleting ${resource} ${params.id}:`, error)
      throw error
    }
  },

  deleteMany: async (resource, params) => {
    const url = `${apiUrl}/${resource}/batch`
    
    try {
      const response = await httpClient(url, {
        method: 'DELETE',
        body: JSON.stringify({ ids: params.ids }),
      })
      
      return {
        data: response.json.data || params.ids,
      }
    } catch (error) {
      console.error(`Error deleting many ${resource}:`, error)
      throw error
    }
  },
}
