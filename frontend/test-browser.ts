/**
 * Скрипт для проверки ошибок в браузере через Puppeteer
 * Запуск: npx tsx scripts/test-browser.ts
 */

import puppeteer from 'puppeteer'

async function testPage() {
  console.log('🚀 Запуск браузера...')
  
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  })
  
  const page = await browser.newPage()
  
  // Перехват ошибок консоли
  const errors: string[] = []
  page.on('console', msg => {
    if (msg.type() === 'error') {
      const text = msg.text()
      errors.push(text)
      console.log('❌ ОШИБКА:', text)
    }
  })
  
  // Перехват ошибок страницы
  page.on('pageerror', (error: unknown) => {
    const message = error instanceof Error ? error.message : String(error)
    errors.push(message)
    console.log('❌ ОШИБКА СТРАНИЦЫ:', message)
  })
  
  console.log('📖 Загрузка http://localhost:3002/constructor...')
  
  try {
    await page.goto('http://localhost:3002/constructor', {
      waitUntil: 'networkidle0',
      timeout: 30000
    })
    
    // Ждем дополнительно 5 секунд для рендеринга 3D
    console.log('⏳ Ждем рендеринг 3D...')
    await new Promise(r => setTimeout(r, 5000))
    
    console.log('✅ Страница загружена')
    
    // Проверка контента
    const title = await page.title()
    console.log('📋 Заголовок:', title)
    
    const content = await page.content()
    console.log('📏 Длина HTML:', content.length, 'символов')
    
    // Проверка canvas
    const canvasExists = await page.$('canvas')
    console.log(canvasExists ? '✅ Canvas найден' : '❌ Canvas НЕ найден')
    
    // Проверка текста "Конструктор"
    const hasConstructor = await page.evaluate(() => {
      return document.body.textContent?.includes('Конструктор') ?? false
    })
    console.log(hasConstructor ? '✅ Текст "Конструктор" найден' : '❌ Текст "Конструктор" НЕ найден')
    
    // Проверка 3D сцены
    const hasThreeJS = await page.evaluate(() => {
      return typeof (window as any).THREE !== 'undefined'
    })
    console.log(hasThreeJS ? '✅ Three.js загружен' : '❌ Three.js НЕ загружен')
    
  } catch (error) {
    console.log('❌ Ошибка загрузки:', error)
  }
  
  await browser.close()
  
  console.log('\n=== ИТОГИ ===')
  if (errors.length === 0) {
    console.log('✅ Ошибок НЕ найдено')
  } else {
    console.log(`❌ Найдено ошибок: ${errors.length}`)
    errors.forEach((e, i) => console.log(`  ${i + 1}. ${e}`))
  }
  
  return errors.length === 0
}

testPage().then(success => {
  process.exit(success ? 0 : 1)
}).catch(err => {
  console.error('Критическая ошибка:', err)
  process.exit(1)
})
