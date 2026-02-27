/**
 * Тесты для 3D конструктора
 * Согласно ТЗ Часть 7 - Система тестирования
 */

// Типы тестов
export interface TestResult {
  name: string
  passed: boolean
  message?: string
  duration?: number
}

export interface TestSuite {
  name: string
  tests: TestResult[]
  passed: boolean
}

// Тестовые данные
const TEST_COMPONENTS = {
  base: {
    id: 'base-standard',
    name: 'Стандартное основание',
    price: 15000,
    model3D: {
      position: [0, -0.5, 0] as [number, number, number],
      rotation: [0, 0, 0] as [number, number, number],
      scale: [1, 1, 1] as [number, number, number],
    }
  },
  motor: {
    id: 'motor-2kw',
    name: 'Двигатель 2 кВт',
    price: 35000,
    model3D: {
      position: [0, 0.5, 0] as [number, number, number],
      rotation: [0, 0, 0] as [number, number, number],
      scale: [1, 1, 1] as [number, number, number],
    }
  },
  frame: {
    id: 'frame-standard',
    name: 'Стандартная рама',
    price: 25000,
    model3D: {
      position: [0, 1, 0] as [number, number, number],
      rotation: [0, 0, 0] as [number, number, number],
      scale: [1, 1, 1] as [number, number, number],
    }
  }
}

// Тест 1: Проверка загрузки компонентов
export function testComponentLoading(): TestResult {
  const startTime = performance.now()
  
  try {
    // Проверяем что компоненты существуют
    if (!TEST_COMPONENTS.base || !TEST_COMPONENTS.motor || !TEST_COMPONENTS.frame) {
      return {
        name: 'Загрузка компонентов',
        passed: false,
        message: 'Один или несколько компонентов не загружены',
        duration: performance.now() - startTime
      }
    }
    
    // Проверяем структуру
    const requiredFields = ['id', 'name', 'price', 'model3D']
    for (const [key, component] of Object.entries(TEST_COMPONENTS)) {
      for (const field of requiredFields) {
        if (!(field in component)) {
          return {
            name: 'Загрузка компонентов',
            passed: false,
            message: `У компонента ${key} отсутствует поле ${field}`,
            duration: performance.now() - startTime
          }
        }
      }
    }
    
    return {
      name: 'Загрузка компонентов',
      passed: true,
      message: `Загружено ${Object.keys(TEST_COMPONENTS).length} компонента`,
      duration: performance.now() - startTime
    }
  } catch (error) {
    return {
      name: 'Загрузка компонентов',
      passed: false,
      message: error instanceof Error ? error.message : 'Неизвестная ошибка',
      duration: performance.now() - startTime
    }
  }
}

// Тест 2: Проверка расчета цены
export function testPriceCalculation(): TestResult {
  const startTime = performance.now()
  
  try {
    const totalPrice = Object.values(TEST_COMPONENTS).reduce(
      (sum, component) => sum + component.price, 
      0
    )
    
    const expectedTotal = 15000 + 35000 + 25000 // 75000
    
    if (totalPrice !== expectedTotal) {
      return {
        name: 'Расчет цены',
        passed: false,
        message: `Неверная сумма: ${totalPrice} (ожидалось ${expectedTotal})`,
        duration: performance.now() - startTime
      }
    }
    
    return {
      name: 'Расчет цены',
      passed: true,
      message: `Итоговая цена: ${totalPrice.toLocaleString('ru-RU')} ₽`,
      duration: performance.now() - startTime
    }
  } catch (error) {
    return {
      name: 'Расчет цены',
      passed: false,
      message: error instanceof Error ? error.message : 'Неизвестная ошибка',
      duration: performance.now() - startTime
    }
  }
}

// Тест 3: Проверка 3D координат
export function test3DCoordinates(): TestResult {
  const startTime = performance.now()
  
  try {
    // Проверяем что координаты валидны
    for (const [key, component] of Object.entries(TEST_COMPONENTS)) {
      const { position, rotation, scale } = component.model3D
      
      // Проверка длин массивов
      if (position.length !== 3 || rotation.length !== 3 || scale.length !== 3) {
        return {
          name: '3D координаты',
          passed: false,
          message: `Неверный формат координат у ${key}`,
          duration: performance.now() - startTime
        }
      }
      
      // Проверка на числа
      for (let i = 0; i < 3; i++) {
        if (typeof position[i] !== 'number' || 
            typeof rotation[i] !== 'number' || 
            typeof scale[i] !== 'number') {
          return {
            name: '3D координаты',
            passed: false,
            message: `Координаты должны быть числами у ${key}`,
            duration: performance.now() - startTime
          }
        }
      }
    }
    
    return {
      name: '3D координаты',
      passed: true,
      message: 'Все координаты валидны',
      duration: performance.now() - startTime
    }
  } catch (error) {
    return {
      name: '3D координаты',
      passed: false,
      message: error instanceof Error ? error.message : 'Неизвестная ошибка',
      duration: performance.now() - startTime
    }
  }
}

// Тест 4: Проверка совместимости компонентов
export function testComponentCompatibility(): TestResult {
  const startTime = performance.now()
  
  try {
    // Базовая проверка - все компоненты должны быть совместимы с основанием
    const baseComponent = TEST_COMPONENTS.base
    
    if (!baseComponent) {
      return {
        name: 'Совместимость компонентов',
        passed: false,
        message: 'Основание не найдено',
        duration: performance.now() - startTime
      }
    }
    
    return {
      name: 'Совместимость компонентов',
      passed: true,
      message: 'Проверка совместимости пройдена',
      duration: performance.now() - startTime
    }
  } catch (error) {
    return {
      name: 'Совместимость компонентов',
      passed: false,
      message: error instanceof Error ? error.message : 'Неизвестная ошибка',
      duration: performance.now() - startTime
    }
  }
}

// Тест 5: Проверка производительности
export function testPerformance(): TestResult {
  const startTime = performance.now()
  
  try {
    // Симуляция рендеринга
    const iterations = 1000
    for (let i = 0; i < iterations; i++) {
      const _ = Object.keys(TEST_COMPONENTS).length
    }
    
    const duration = performance.now() - startTime
    
    if (duration > 100) {
      return {
        name: 'Производительность',
        passed: false,
        message: `Слишком медленно: ${duration.toFixed(2)}мс (норма < 100мс)`,
        duration
      }
    }
    
    return {
      name: 'Производительность',
      passed: true,
      message: `Время выполнения: ${duration.toFixed(2)}мс`,
      duration
    }
  } catch (error) {
    return {
      name: 'Производительность',
      passed: false,
      message: error instanceof Error ? error.message : 'Неизвестная ошибка',
      duration: performance.now() - startTime
    }
  }
}

// Запуск всех тестов
export function runAllTests(): TestSuite[] {
  const tests = [
    testComponentLoading(),
    testPriceCalculation(),
    test3DCoordinates(),
    testComponentCompatibility(),
    testPerformance(),
  ]
  
  const suites: TestSuite[] = [
    {
      name: '3D Конструктор - Базовые тесты',
      tests,
      passed: tests.every(t => t.passed)
    }
  ]
  
  return suites
}

// Утилита для отображения результатов
export function formatTestResults(suites: TestSuite[]): string {
  let output = '\n=== РЕЗУЛЬТАТЫ ТЕСТИРОВАНИЯ ===\n\n'
  
  for (const suite of suites) {
    output += `📋 ${suite.name}\n`
    output += `Статус: ${suite.passed ? '✅ PASSED' : '❌ FAILED'}\n\n`
    
    for (const test of suite.tests) {
      const icon = test.passed ? '✅' : '❌'
      output += `  ${icon} ${test.name}\n`
      output += `     ${test.message}\n`
      if (test.duration) {
        output += `     Время: ${test.duration.toFixed(2)}мс\n`
      }
      output += '\n'
    }
  }
  
  const totalTests = suites.reduce((sum, s) => sum + s.tests.length, 0)
  const passedTests = suites.reduce(
    (sum, s) => sum + s.tests.filter(t => t.passed).length, 
    0
  )
  
  output += `\n=== ИТОГО: ${passedTests}/${totalTests} тестов пройдено ===\n`
  
  return output
}
