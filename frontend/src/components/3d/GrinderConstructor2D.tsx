'use client'

import { useState } from 'react'
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

const VIEW_ANGLES = [
  { id: 'front', name: 'Спереди', icon: '📷' },
  { id: 'side', name: 'Сбоку', icon: '📸' },
  { id: 'top', name: 'Сверху', icon: '👁️' },
]

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
    <div className="flex flex-col h-screen bg-gray-50 dark:bg-gray-900">
      {/* ОБЩАЯ ШАПКА САЙТА */}
      <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 flex-shrink-0">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Логотип */}
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">ГМ</span>
              </div>
              <span className="font-bold text-xl text-gray-900 dark:text-white">ГриндерМастер</span>
            </Link>

            {/* Навигация */}
            <nav className="hidden md:flex items-center space-x-8">
              <Link href="/sales" className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors font-medium">Продажа</Link>
              <Link href="/repair" className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors font-medium">Ремонт</Link>
              <Link href="/constructor" className="text-blue-600 dark:text-blue-400 font-medium">Конструктор</Link>
              <Link href="/contacts" className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors font-medium">Контакты</Link>
            </nav>

            {/* Мобильное меню */}
            <button onClick={() => setShowPanel(!showPanel)} className="md:hidden p-2 text-gray-600 dark:text-gray-400">
              {showPanel ? '❌' : '☰'}
            </button>
          </div>
        </div>
      </header>

      {/* Основной контент - Grid layout */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-[280px_1fr_256px] gap-0 overflow-hidden">
        
        {/* Левая панель - Компоненты */}
        <AnimatePresence>
          {showPanel && (
            <motion.aside
              initial={{ x: -280, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -280, opacity: 0 }}
              className="bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 overflow-y-auto"
            >
              <div className="p-4">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-bold text-gray-900 dark:text-white">Компоненты</h2>
                  <button onClick={() => setShowPanel(false)} className="lg:hidden text-gray-600 dark:text-gray-400">✕</button>
                </div>
                <div className="space-y-3">
                  {TEST_NODES.map((node) => (
                    <div key={node.id} className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
                      <button
                        onClick={() => setSelectedNode(selectedNode === node.id ? null : node.id)}
                        className="w-full p-3 text-left bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 flex justify-between items-center"
                      >
                        <div>
                          <span className="font-semibold text-gray-900 dark:text-white">{node.name}</span>
                          {node.isRequired && <span className="text-xs text-red-500 ml-2">*</span>}
                        </div>
                        {selectedComponents[node.nodeType] && <span className="w-2 h-2 bg-green-500 rounded-full"></span>}
                      </button>
                      <AnimatePresence>
                        {selectedNode === node.id && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="overflow-hidden"
                          >
                            <div className="p-2 space-y-2 bg-white dark:bg-gray-800">
                              {node.options.map((option) => (
                                <button
                                  key={option.id}
                                  onClick={() => handleSelectComponent(node.nodeType, option.id)}
                                  className={`w-full p-2 border border-gray-200 dark:border-gray-700 rounded-lg text-left transition-colors ${
                                    selectedComponents[node.nodeType] === option.id
                                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                                      : 'hover:bg-gray-50 dark:hover:bg-gray-700'
                                  }`}
                                >
                                  <div className="font-medium text-sm text-gray-900 dark:text-white">{option.name}</div>
                                  <div className="text-xs text-gray-600 dark:text-gray-400">{formatPrice(option.price)}</div>
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

        {/* Центральная часть - 2D сцена */}
        <main className="relative overflow-hidden bg-gradient-to-br from-gray-100 dark:from-gray-800 to-gray-200 dark:to-gray-700 flex flex-col">
          
          {/* Кнопка открытия панели на мобильных */}
          {!showPanel && (
            <button
              onClick={() => setShowPanel(true)}
              className="absolute top-4 left-4 z-20 px-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg lg:hidden"
            >
              ☰ Компоненты
            </button>
          )}

          {/* 2D сцена с SVG - занимает всё доступное место */}
          <div className="flex-1 relative flex items-center justify-center p-4">
            {/* Изображение с зумом */}
            <div
              className="relative transition-transform duration-300 ease-out"
              style={{ transform: `scale(${zoom})` }}
            >
              <div className="relative w-[400px] h-[500px]">
                {/* Послойное наложение SVG компонентов */}
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

          {/* Панель управления ПОД изображением */}
          <div className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 p-4 flex-shrink-0">
            <div className="flex items-center justify-between flex-wrap gap-4">
              {/* Ракурсы */}
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-sm text-gray-600 dark:text-gray-400">Ракурс:</span>
                <div className="flex gap-2">
                  {VIEW_ANGLES.map((angle) => (
                    <button
                      key={angle.id}
                      onClick={() => setCurrentAngle(angle.id)}
                      title={angle.name}
                      className={`px-4 py-2 rounded-lg transition-colors ${
                        currentAngle === angle.id
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300'
                      }`}
                    >
                      <span className="mr-2">{angle.icon}</span>
                      <span className="hidden sm:inline">{angle.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Слайдер зума */}
              <div className="flex items-center gap-3">
                <span className="text-sm text-gray-600 dark:text-gray-400">Зум:</span>
                <input
                  type="range"
                  min="0.5"
                  max="3"
                  step="0.1"
                  value={zoom}
                  onChange={(e) => setZoom(parseFloat(e.target.value))}
                  className="w-32 h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-blue-600"
                />
                <span className="text-sm font-semibold text-gray-900 dark:text-white min-w-[50px] text-center">
                  {Math.round(zoom * 100)}%
                </span>
              </div>
            </div>
          </div>
        </main>

        {/* Правая панель - Конфигурация */}
        <aside className="bg-white dark:bg-gray-800 border-l border-gray-200 dark:border-gray-700 overflow-y-auto">
          <div className="p-4 h-full flex flex-col">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Конфигурация</h2>
            <div className="space-y-3 flex-1">
              {TEST_NODES.map((node) => {
                const selectedId = selectedComponents[node.nodeType]
                const option = node.options.find(o => o.id === selectedId)
                return (
                  <div key={node.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-3">
                    <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">{node.name}</div>
                    {option ? (
                      <>
                        <div className="font-medium text-sm text-gray-900 dark:text-white">{option.name}</div>
                        <div className="text-blue-600 dark:text-blue-400 font-semibold">{formatPrice(option.price)}</div>
                      </>
                    ) : (
                      <div className="text-gray-400 text-sm">Не выбрано</div>
                    )}
                  </div>
                )
              })}
            </div>
            <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
              <div className="flex justify-between text-lg font-bold">
                <span className="text-gray-900 dark:text-white">Итого:</span>
                <span className="text-blue-600 dark:text-blue-400">{formatPrice(totalPrice)}</span>
              </div>
            </div>
            <button className="w-full mt-4 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-colors">
              Сохранить конфигурацию
            </button>
            <button onClick={handleReset} className="w-full mt-2 px-6 py-3 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg font-semibold transition-colors">
              Сбросить
            </button>
          </div>
        </aside>
      </div>
    </div>
  )
}
