'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'

// Типы
interface Component2D {
  id: string
  name: string
  price: number
  svgUrl: string
}

interface AssemblyNode {
  id: string
  name: string
  nodeType: string
  isRequired: boolean
  sortOrder: number
  options: Component2D[]
}

// SVG заглушки для компонентов
const COMPONENT_SVGS: Record<string, string> = {
  'base-std': `<svg viewBox="0 0 200 150" xmlns="http://www.w3.org/2000/svg"><rect x="20" y="40" width="160" height="80" fill="#4a5568" rx="5"/><rect x="30" y="50" width="140" height="60" fill="#2d3748" rx="3"/><circle cx="50" cy="90" r="8" fill="#718096"/><circle cx="150" cy="90" r="8" fill="#718096"/></svg>`,
  'base-reinf': `<svg viewBox="0 0 200 150" xmlns="http://www.w3.org/2000/svg"><rect x="15" y="35" width="170" height="90" fill="#2d3748" rx="5"/><rect x="25" y="45" width="150" height="70" fill="#1a202c" rx="3"/><circle cx="45" cy="85" r="10" fill="#4a5568"/><circle cx="155" cy="85" r="10" fill="#4a5568"/><rect x="10" y="120" width="180" height="10" fill="#1a202c"/></svg>`,
  'motor-2kw': `<svg viewBox="0 0 150 200" xmlns="http://www.w3.org/2000/svg"><rect x="25" y="20" width="100" height="160" fill="#4a5568" rx="5"/><rect x="35" y="30" width="80" height="140" fill="#2d3748" rx="3"/><circle cx="75" cy="60" r="25" fill="#718096"/><circle cx="75" cy="60" r="15" fill="#4a5568"/><rect x="45" y="140" width="60" height="30" fill="#2d3748"/></svg>`,
  'motor-3kw': `<svg viewBox="0 0 150 200" xmlns="http://www.w3.org/2000/svg"><rect x="20" y="15" width="110" height="170" fill="#2d3748" rx="5"/><rect x="30" y="25" width="90" height="150" fill="#1a202c" rx="3"/><circle cx="75" cy="55" r="30" fill="#4a5568"/><circle cx="75" cy="55" r="18" fill="#2d3748"/><rect x="40" y="145" width="70" height="35" fill="#1a202c"/></svg>`,
  'frame-std': `<svg viewBox="0 0 200 250" xmlns="http://www.w3.org/2000/svg"><rect x="30" y="20" width="140" height="210" fill="#718096" rx="3"/><rect x="40" y="30" width="120" height="190" fill="#4a5568" rx="2"/><rect x="50" y="50" width="100" height="8" fill="#2d3748"/><rect x="50" y="100" width="100" height="8" fill="#2d3748"/><rect x="50" y="150" width="100" height="8" fill="#2d3748"/></svg>`,
}

const TEST_NODES: AssemblyNode[] = [
  {
    id: 'base',
    name: 'Основание',
    nodeType: 'BASE',
    isRequired: true,
    sortOrder: 1,
    options: [
      { id: 'base-std', name: 'Стандартное', price: 15000, svgUrl: COMPONENT_SVGS['base-std'] },
      { id: 'base-reinf', name: 'Усиленное', price: 22000, svgUrl: COMPONENT_SVGS['base-reinf'] },
    ],
  },
  {
    id: 'motor',
    name: 'Двигатель',
    nodeType: 'MOTOR',
    isRequired: true,
    sortOrder: 2,
    options: [
      { id: 'motor-2kw', name: '2 кВт', price: 35000, svgUrl: COMPONENT_SVGS['motor-2kw'] },
      { id: 'motor-3kw', name: '3 кВт', price: 48000, svgUrl: COMPONENT_SVGS['motor-3kw'] },
    ],
  },
  {
    id: 'frame',
    name: 'Рама',
    nodeType: 'FRAME',
    isRequired: true,
    sortOrder: 3,
    options: [
      { id: 'frame-std', name: 'Стандартная', price: 25000, svgUrl: COMPONENT_SVGS['frame-std'] },
    ],
  },
]

export default function GrinderConstructor2D() {
  const [selectedComponents, setSelectedComponents] = useState<Record<string, string>>({
    BASE: 'base-std',
    MOTOR: 'motor-2kw',
    FRAME: 'frame-std',
  })
  const [zoom, setZoom] = useState(1)
  const [selectedNode, setSelectedNode] = useState<string | null>(null)
  const [showConfig, setShowConfig] = useState(false)

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
  }

  const handleZoomIn = () => setZoom(prev => Math.min(prev + 0.2, 3))
  const handleZoomOut = () => setZoom(prev => Math.max(prev - 0.2, 0.5))

  // Зум колесиком мыши
  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      if (e.ctrlKey || e.metaKey) {
        e.preventDefault()
        if (e.deltaY < 0) {
          handleZoomIn()
        } else {
          handleZoomOut()
        }
      }
    }
    window.addEventListener('wheel', handleWheel, { passive: false })
    return () => window.removeEventListener('wheel', handleWheel)
  }, [])

  const formatPrice = (price: number) => 
    new Intl.NumberFormat('ru-RU', { style: 'currency', currency: 'RUB', minimumFractionDigits: 0 }).format(price)

  return (
    <div className="flex flex-col h-screen bg-gray-50 dark:bg-gray-900">
      {/* ОБЩАЯ ШАПКА САЙТА */}
      <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 flex-shrink-0">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">ГМ</span>
              </div>
              <span className="font-bold text-xl text-gray-900 dark:text-white">ГриндерМастер</span>
            </Link>

            <nav className="flex items-center space-x-8">
              <Link href="/sales" className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors font-medium">Продажа</Link>
              <Link href="/repair" className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors font-medium">Ремонт</Link>
              <Link href="/constructor" className="text-blue-600 dark:text-blue-400 font-medium">Конструктор</Link>
              <Link href="/contacts" className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors font-medium">Контакты</Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Основной контент */}
      <div className="flex-1 flex flex-col overflow-hidden">
        
        {/* Центральная область - Изображение */}
        <main className="flex-1 relative overflow-hidden bg-gray-100 dark:bg-gray-800">
          
          {/* Изображение */}
          <div className="absolute inset-0 flex items-center justify-center p-6">
            <div
              className="relative transition-transform duration-300 ease-out"
              style={{ transform: `scale(${zoom})` }}
            >
              <div className="relative w-[400px] h-[500px] bg-white dark:bg-gray-700 rounded-lg shadow-xl">
                {TEST_NODES.map((node) => {
                  const selectedId = selectedComponents[node.nodeType]
                  const option = node.options.find(o => o.id === selectedId)
                  if (!option) return null
                  return (
                    <motion.div
                      key={node.id}
                      className="absolute inset-0 w-full h-full"
                      style={{ zIndex: node.sortOrder }}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.3 }}
                      dangerouslySetInnerHTML={{ __html: option.svgUrl }}
                    />
                  )
                })}
              </div>
            </div>
          </div>

          {/* Конфигурация - полупрозрачная, справа вверху, раскрывающаяся */}
          <div className="absolute top-6 right-6 z-10">
            <button
              onClick={() => setShowConfig(!showConfig)}
              className="bg-white/90 dark:bg-gray-800/90 backdrop-blur border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg px-4 py-2 hover:bg-white dark:hover:bg-gray-800 transition-all"
            >
              <span className="font-semibold text-gray-900 dark:text-white">
                {showConfig ? '▼' : '⚙️'} {formatPrice(totalPrice)}
              </span>
            </button>

            <AnimatePresence>
              {showConfig && (
                <motion.div
                  initial={{ opacity: 0, y: -10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -10, scale: 0.95 }}
                  className="absolute top-14 right-0 w-72 bg-white/95 dark:bg-gray-800/95 backdrop-blur border border-gray-200 dark:border-gray-700 rounded-lg shadow-xl p-4"
                >
                  <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-3">Конфигурация</h3>
                  <div className="space-y-2 max-h-64 overflow-y-auto">
                    {TEST_NODES.map((node) => {
                      const selectedId = selectedComponents[node.nodeType]
                      const option = node.options.find(o => o.id === selectedId)
                      return (
                        <div key={node.id} className="border-b border-gray-200 dark:border-gray-700 pb-2 last:border-0">
                          <div className="text-xs text-gray-500 dark:text-gray-400">{node.name}</div>
                          {option ? (
                            <div className="flex justify-between items-center">
                              <span className="text-sm text-gray-900 dark:text-white">{option.name}</span>
                              <span className="text-sm font-semibold text-blue-600 dark:text-blue-400">{formatPrice(option.price)}</span>
                            </div>
                          ) : (
                            <span className="text-sm text-gray-400">Не выбрано</span>
                          )}
                        </div>
                      )
                    })}
                  </div>
                  <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
                    <div className="flex justify-between text-base font-bold">
                      <span className="text-gray-900 dark:text-white">Итого:</span>
                      <span className="text-blue-600 dark:text-blue-400">{formatPrice(totalPrice)}</span>
                    </div>
                  </div>
                  <button className="w-full mt-3 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold text-sm transition-colors">
                    Сохранить
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Кнопки зума - справа внизу */}
          <div className="absolute bottom-6 right-6 z-10 flex flex-col gap-2">
            <button
              onClick={handleZoomIn}
              className="w-12 h-12 rounded-full bg-white/80 dark:bg-gray-800/80 backdrop-blur border border-gray-200 dark:border-gray-700 shadow-lg hover:bg-white dark:hover:bg-gray-800 transition-all text-xl flex items-center justify-center text-gray-700 dark:text-gray-300"
              title="Увеличить (Ctrl + Scroll)"
            >
              +
            </button>
            <div className="text-center text-sm font-semibold text-gray-900 dark:text-white bg-white/80 dark:bg-gray-800/80 backdrop-blur rounded-lg px-2 py-1">
              {Math.round(zoom * 100)}%
            </div>
            <button
              onClick={handleZoomOut}
              className="w-12 h-12 rounded-full bg-white/80 dark:bg-gray-800/80 backdrop-blur border border-gray-200 dark:border-gray-700 shadow-lg hover:bg-white dark:hover:bg-gray-800 transition-all text-xl flex items-center justify-center text-gray-700 dark:text-gray-300"
              title="Уменьшить (Ctrl + Scroll)"
            >
              −
            </button>
          </div>
        </main>

        {/* Нижняя панель - Компоненты и Галерея */}
        <div className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 flex-shrink-0">
          <div className="p-4">
            <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-3">Компоненты</h3>
            <div className="flex gap-4 overflow-x-auto">
              {TEST_NODES.map((node) => (
                <div key={node.id} className="flex-shrink-0">
                  <div className="text-xs text-gray-500 dark:text-gray-400 mb-2">{node.name}</div>
                  <div className="flex gap-2">
                    {node.options.map((option) => (
                      <button
                        key={option.id}
                        onClick={() => handleSelectComponent(node.nodeType, option.id)}
                        className={`p-2 border rounded-lg transition-all ${
                          selectedComponents[node.nodeType] === option.id
                            ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                            : 'border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700'
                        }`}
                      >
                        <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded flex items-center justify-center">
                          <div className="w-12 h-12" dangerouslySetInnerHTML={{ __html: option.svgUrl }} />
                        </div>
                        <div className="text-xs text-center mt-1 text-gray-700 dark:text-gray-300">{option.name}</div>
                        <div className="text-xs text-center text-blue-600 dark:text-blue-400 font-semibold">{formatPrice(option.price)}</div>
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
