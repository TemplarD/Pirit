'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'

// Тестовые данные
const TEST_NODES = [
  {
    id: 'base',
    name: 'Основание',
    nodeType: 'BASE',
    isRequired: true,
    sortOrder: 1,
    options: [
      { id: 'base-std', name: 'Стандартное', price: 15000, imageUrl: 'https://via.placeholder.com/400x300/4a5568/fff?text=Base+Std' },
      { id: 'base-reinf', name: 'Усиленное', price: 22000, imageUrl: 'https://via.placeholder.com/400x300/2d3748/fff?text=Base+Reinf' },
    ],
  },
  {
    id: 'motor',
    name: 'Двигатель',
    nodeType: 'MOTOR',
    isRequired: true,
    sortOrder: 2,
    options: [
      { id: 'motor-2kw', name: '2 кВт', price: 35000, imageUrl: 'https://via.placeholder.com/300x300/4a5568/fff?text=Motor+2kW' },
      { id: 'motor-3kw', name: '3 кВт', price: 48000, imageUrl: 'https://via.placeholder.com/300x300/2d3748/fff?text=Motor+3kW' },
    ],
  },
  {
    id: 'frame',
    name: 'Рама',
    nodeType: 'FRAME',
    isRequired: true,
    sortOrder: 3,
    options: [
      { id: 'frame-std', name: 'Стандартная', price: 25000, imageUrl: 'https://via.placeholder.com/400x400/718096/fff?text=Frame' },
    ],
  },
]

const VIEW_ANGLES = [
  { id: 'front', name: 'Спереди', icon: '📷' },
  { id: 'side', name: 'Сбоку', icon: '📸' },
  { id: 'top', name: 'Сверху', icon: '👁️' },
]

export default function GrinderConstructor2D() {
  const [selectedComponents, setSelectedComponents] = useState<Record<string, string>>({
    BASE: 'base-std',
    MOTOR: 'motor-2kw',
    FRAME: 'frame-std',
  })
  const [currentAngle, setCurrentAngle] = useState('front')
  const [zoom, setZoom] = useState(1)
  const [selectedNode, setSelectedNode] = useState<string | null>(null)
  const [showPanel, setShowPanel] = useState(true)

  const totalPrice = TEST_NODES.reduce((sum, node) => {
    const selectedId = selectedComponents[node.nodeType]
    const option = node.options.find(o => o.id === selectedId)
    return sum + (option?.price || 0)
  }, 0)

  const handleSelectComponent = (nodeType: string, componentId: string) => {
    setSelectedComponents(prev => ({ ...prev, [nodeType]: componentId }))
  }

  const handleReset = () => {
    setSelectedComponents({ BASE: 'base-std', MOTOR: 'motor-2kw', FRAME: 'frame-std' })
    setZoom(1)
    setCurrentAngle('front')
  }

  const formatPrice = (price: number) => 
    new Intl.NumberFormat('ru-RU', { style: 'currency', currency: 'RUB', minimumFractionDigits: 0 }).format(price)

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Шапка сайта */}
      <header className="bg-white border-b sticky top-0 z-50">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Логотип */}
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-primary-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">ГМ</span>
              </div>
              <span className="font-bold text-xl text-gray-900">ГриндерМастер</span>
            </Link>

            {/* Навигация Desktop */}
            <nav className="hidden md:flex items-center space-x-8">
              <Link href="/sales" className="text-gray-700 hover:text-primary-600 transition-colors font-medium">Продажа</Link>
              <Link href="/repair" className="text-gray-700 hover:text-primary-600 transition-colors font-medium">Ремонт</Link>
              <Link href="/constructor" className="text-primary-600 font-medium">Конструктор</Link>
              <Link href="/contacts" className="text-gray-700 hover:text-primary-600 transition-colors font-medium">Контакты</Link>
            </nav>

            {/* Кнопки */}
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setShowPanel(!showPanel)}
                className="md:hidden p-2 text-gray-600 hover:text-gray-900"
              >
                {showPanel ? '❌' : '☰'}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Основной контент */}
      <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
        {/* Левая панель - Выбор узлов */}
        <AnimatePresence>
          {showPanel && (
            <motion.aside
              initial={{ x: -300, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -300, opacity: 0 }}
              className="w-full md:w-80 bg-white border-r overflow-y-auto max-h-[calc(100vh-4rem)]"
            >
              <div className="p-4">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-bold">Компоненты</h2>
                  <button onClick={() => setShowPanel(false)} className="md:hidden text-gray-600">✕</button>
                </div>
                <div className="space-y-3">
                  {TEST_NODES.map((node) => (
                    <div key={node.id} className="border rounded-lg overflow-hidden">
                      <button
                        onClick={() => setSelectedNode(selectedNode === node.id ? null : node.id)}
                        className="w-full p-3 text-left bg-gray-50 hover:bg-gray-100 flex justify-between items-center"
                      >
                        <div>
                          <span className="font-semibold">{node.name}</span>
                          {node.isRequired && <span className="text-xs text-red-500 ml-2">*</span>}
                        </div>
                        {selectedComponents[node.nodeType] && (
                          <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                        )}
                      </button>
                      <AnimatePresence>
                        {selectedNode === node.id && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="overflow-hidden"
                          >
                            <div className="p-2 space-y-2">
                              {node.options.map((option) => (
                                <button
                                  key={option.id}
                                  onClick={() => handleSelectComponent(node.nodeType, option.id)}
                                  className={`w-full p-2 border rounded-lg text-left transition-colors ${
                                    selectedComponents[node.nodeType] === option.id
                                      ? 'border-blue-500 bg-blue-50'
                                      : 'hover:bg-gray-50'
                                  }`}
                                >
                                  <div className="font-medium text-sm">{option.name}</div>
                                  <div className="text-xs text-gray-600">{formatPrice(option.price)}</div>
                                </button>
                              ))}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  ))}
                </div>
              </div>
            </motion.aside>
          )}
        </AnimatePresence>

        {/* Центральная часть - 2D визуализация */}
        <main className="flex-1 flex flex-col overflow-hidden">
          {/* Панель ракурсов */}
          <div className="bg-white border-b px-4 py-2">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div className="flex gap-2 flex-wrap">
                {VIEW_ANGLES.map((angle) => (
                  <button
                    key={angle.id}
                    onClick={() => setCurrentAngle(angle.id)}
                    className={`px-4 py-2 rounded-lg transition-colors ${
                      currentAngle === angle.id
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 hover:bg-gray-200'
                    }`}
                  >
                    <span className="mr-2">{angle.icon}</span>
                    <span className="hidden sm:inline">{angle.name}</span>
                  </button>
                ))}
              </div>
              <div className="flex gap-2 items-center">
                <button onClick={() => setZoom(prev => Math.max(prev - 0.2, 0.5))} className="px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg">
                  🔍-
                </button>
                <button onClick={() => setZoom(prev => Math.min(prev + 0.2, 3))} className="px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg">
                  🔍+
                </button>
                <span className="px-3 py-2 text-gray-600 text-sm">{Math.round(zoom * 100)}%</span>
              </div>
            </div>
          </div>

          {/* 2D сцена */}
          <div className="flex-1 relative overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200">
            <div
              className="absolute inset-0 flex items-center justify-center transition-transform duration-300"
              style={{ transform: `scale(${zoom})` }}
            >
              <div className="relative w-[600px] h-[600px] max-w-full max-h-full">
                {TEST_NODES.map((node) => {
                  const selectedId = selectedComponents[node.nodeType]
                  const option = node.options.find(o => o.id === selectedId)
                  if (!option) return null
                  return (
                    <motion.img
                      key={node.id}
                      src={option.imageUrl}
                      alt={option.name}
                      className="absolute inset-0 w-full h-full object-contain"
                      style={{ zIndex: node.sortOrder }}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.3 }}
                    />
                  )
                })}
              </div>
            </div>
            <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur px-4 py-2 rounded-lg shadow">
              <p className="text-sm text-gray-600">🖱️ Используйте зум для детального просмотра</p>
            </div>
          </div>
        </main>

        {/* Правая панель - Конфигурация */}
        <aside className="w-full md:w-72 bg-white border-l overflow-y-auto max-h-[calc(100vh-4rem)]">
          <div className="p-4">
            <h2 className="text-lg font-bold mb-4">Конфигурация</h2>
            <div className="space-y-3">
              {TEST_NODES.map((node) => {
                const selectedId = selectedComponents[node.nodeType]
                const option = node.options.find(o => o.id === selectedId)
                return (
                  <div key={node.id} className="border rounded-lg p-3">
                    <div className="text-xs text-gray-500 mb-1">{node.name}</div>
                    {option ? (
                      <>
                        <div className="font-medium text-sm">{option.name}</div>
                        <div className="text-blue-600 font-semibold">{formatPrice(option.price)}</div>
                      </>
                    ) : (
                      <div className="text-gray-400 text-sm">Не выбрано</div>
                    )}
                  </div>
                )
              })}
            </div>
            <div className="mt-6 pt-6 border-t">
              <div className="flex justify-between text-lg font-bold">
                <span>Итого:</span>
                <span className="text-blue-600">{formatPrice(totalPrice)}</span>
              </div>
            </div>
            <button className="w-full mt-4 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold">
              Сохранить конфигурацию
            </button>
            <button onClick={handleReset} className="w-full mt-2 px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-semibold">
              Сбросить
            </button>
          </div>
        </aside>
      </div>
    </div>
  )
}
