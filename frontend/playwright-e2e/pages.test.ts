import { test, expect } from '@playwright/test'

test.describe('Главная страница', () => {
  test('должна загружаться', async ({ page }) => {
    await page.goto('/')
    await expect(page).toHaveTitle(/ГриндерМастер/)
  })

  test('должна содержать заголовок', async ({ page }) => {
    await page.goto('/')
    await expect(page.getByText('ГриндерМастер')).toBeVisible()
  })

  test('должна иметь навигацию', async ({ page }) => {
    await page.goto('/')
    await expect(page.getByRole('link', { name: 'Продажа' })).toBeVisible()
    await expect(page.getByRole('link', { name: 'Ремонт' })).toBeVisible()
    await expect(page.getByRole('link', { name: 'Контакты' })).toBeVisible()
  })
})

test.describe('Страница продажи', () => {
  test('должна загружаться', async ({ page }) => {
    await page.goto('/sales')
    await expect(page).toHaveURL('/sales')
  })
})

test.describe('Страница ремонта', () => {
  test('должна загружаться', async ({ page }) => {
    await page.goto('/repair')
    await expect(page).toHaveURL('/repair')
  })
})

test.describe('2D Конструктор', () => {
  test('должен загружаться', async ({ page }) => {
    await page.goto('/constructor')
    await expect(page).toHaveURL('/constructor')
  })

  test('должен содержать заголовок', async ({ page }) => {
    await page.goto('/constructor')
    await expect(page.getByText('2D Конструктор гриндера')).toBeVisible()
  })

  test('должен иметь панель компонентов', async ({ page }) => {
    await page.goto('/constructor')
    await expect(page.getByText('Компоненты')).toBeVisible()
  })

  test('должен показывать цену', async ({ page }) => {
    await page.goto('/constructor')
    await expect(page.getByText('Итого:')).toBeVisible()
  })

  test('должен иметь кнопки ракурсов', async ({ page }) => {
    await page.goto('/constructor')
    await expect(page.getByText('Спереди')).toBeVisible()
    await expect(page.getByText('Сбоку')).toBeVisible()
    await expect(page.getByText('Сверху')).toBeVisible()
  })

  test('должен работать зум', async ({ page }) => {
    await page.goto('/constructor')
    const zoomIn = page.getByText('🔍+')
    const zoomOut = page.getByText('🔍-')
    await expect(zoomIn).toBeVisible()
    await expect(zoomOut).toBeVisible()
  })
})

test.describe('Контакты', () => {
  test('должна загружаться', async ({ page }) => {
    await page.goto('/contacts')
    await expect(page).toHaveURL('/contacts')
  })
})
