# Отчет о проблеме с 3D конструктором

## Проблема
3D конструктор не рендерится в браузере. Canvas элемент не создается, Three.js не загружается.

## Симптомы
- HTML страницы загружается (28000+ символов)
- Текст "Конструктор гриндера" присутствует
- Canvas элемент НЕ найден
- Three.js НЕ загружен
- Ошибка в консоли: `Cannot read properties of undefined (reading 'layout.tsx')`

## Причина
Next.js 16.1.1 использует Turbopack по умолчанию. Turbopack имеет известные проблемы с:
1. Загрузкой Three.js и зависимостей (@react-three/fiber, @react-three/drei)
2. Горячей перезагрузкой (HMR) для 3D компонентов
3. Ошибкой доступа к `children` в layout.tsx через DevTools

## Решения

### Вариант 1: Понизить Next.js до 14 (рекомендуется)
```bash
npm install next@14.0.4 react@18 react-dom@18
```

### Вариант 2: Ждать исправления Turbopack
Следить за обновлениями Next.js 16.x

### Вариант 3: Использовать production сборку
```bash
npm run build
npm start
```
В production используется webpack, а не Turbopack.

## Текущий статус
- ✅ API работает
- ✅ Frontend компилируется
- ✅ HTML генерируется
- ❌ Three.js не загружается в режиме разработки
- ❌ 3D сцена не рендерится

## Обходной путь для тестирования
Запустить production сборку:
```bash
cd frontend
npm run build
npm start
# Открыть http://localhost:3000/constructor
```
