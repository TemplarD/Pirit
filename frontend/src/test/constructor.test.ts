import { describe, it, expect } from 'vitest'

describe('2D Конструктор', () => {
  it('должен экспортировать компонент', async () => {
    const Component = await import('@/components/3d/GrinderConstructor2D')
    expect(Component.default).toBeDefined()
  })

  it('должен иметь правильную структуру', async () => {
    const { default: GrinderConstructor2D } = await import('@/components/3d/GrinderConstructor2D')
    expect(GrinderConstructor2D).toBeTypeOf('function')
  })
})

describe('Типы конструктора', () => {
  it('должен экспортировать типы', async () => {
    const types = await import('@/types/constructor')
    expect(types).toBeDefined()
  })
})
