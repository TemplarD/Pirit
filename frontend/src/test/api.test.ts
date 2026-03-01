import { describe, it, expect } from 'vitest'

describe('API Client', () => {
  it('должен экспортировать api объект', async () => {
    const { api } = await import('@/lib/api')
    expect(api).toBeDefined()
    expect(api.products).toBeDefined()
    expect(api.services).toBeDefined()
    expect(api.categories).toBeDefined()
    expect(api.requests).toBeDefined()
  })

  it('должен иметь правильные методы для products', async () => {
    const { api } = await import('@/lib/api')
    expect(api.products.getAll).toBeDefined()
    expect(api.products.getBySlug).toBeDefined()
    expect(api.products.getFeatured).toBeDefined()
  })
})
