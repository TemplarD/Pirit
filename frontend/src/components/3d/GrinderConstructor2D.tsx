'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

// Типы для 2D конструктора
interface Component2D {
  id: string
  name: string
  price: number
  imageUrl: string
  layer: number
  position: { x: number; y: number; scale: number }
}

interface AssemblyNode {
  id: string
  name: string
  nodeType: string
  isRequired: boolean
  options: Component2D[]
}

interface ViewAngle {
  id: string
  name: string
  icon: string
}

const VIEW_ANGLES: ViewAngle[] = [
  { id: 'front', name: 'Спереди', icon: '📷' },
  { id: 'side', name: 'Сбоку', icon: '📸' },
  { id: 'top', name: 'Сверху', icon: '👁️' },
]

// Заглушки для изображений (в реальности будут PNG с прозрачностью)
const PLACEHOLDER_IMAGES: Record<string, string> = {
  'base-standard': 'https://via.placeholder.com/400x300/4a5568/ffffff?text=Base+Standard',
  'base-reinforced': 'https://via.placeholder.com/400x300/2d3748/ffffff?text=Base+Reinforced',
  'motor-2kw': 'https://via.placeholder.com/300x300/4a5568/ffffff?text=Motor+2kW',
  'motor-3kw': 'https://via.placeholder.com/300x300/2d3748/ffffff?text=Motor+3kW',
  'frame-standard': 'https://via.placeholder.com/400x400/718096/ffffff?text=Frame',
}

export default function GrinderConstructor2D() {
  const [selectedComponents, setSelectedComponents] = useState<Record<string, string>>({})
  const [currentAngle, setCurrentAngle] = useState<string>('front')
  const [zoom, setZoom] = useState(1)
  const [nodes, setNodes] = useState<AssemblyNode[]>([])
  const [selectedNode, setSelectedNode] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [totalPrice, setTotalPrice] = useState(0)

  // Загрузка данных из API
  useEffect(() => {
    async function loadData() {
      try {
        const response = await fetch('http://localhost:3000/api/assembly-nodes')
        const data = await response.json()
        if (data.data) {
          // Преобразуем данные для 2D конструктора
          const nodes2D = data.data.map((node: any) => ({
            ...node,
            options: node.components?.map((c: any) => ({
              id: c.id,
              name: c.name,
              price: Number(c.price),
              imageUrl: PLACEHOLDER_IMAGES[c.slug] || `https://via.placeholder.com/300x300?text=${c.name}`,
              layer: node.sortOrder,
              position: { x: 0, y: 0, scale: 1 },
            })) || [],
          }))
          setNodes(nodes2D)
          
          // Установить базовую конфигурацию
          const baseConfig: Record<string, string> = {}
          nodes2D.forEach((n: AssemblyNode) => {
            if (n.isRequired && n.options[0]) {
              baseConfig[n.nodeType] = n.options[0].id
            }
          })
          setSelectedComponents(baseConfig)
        }
      } catch (err) {
        console.error('Failed to load nodes:', err)
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [])

  // Расчет общей цены
  useEffect(() => {
    let total = 0
    nodes.forEach(node => {
      const selectedId = selectedComponents[node.nodeType]
      const option = node.options.find(o => o.id === selectedId)
      if (option) total += option.price
    })
    setTotalPrice(total)
  }, [selectedComponents, nodes])

  const handleSelectComponent = (nodeType: string, componentId: string) => {
    setSelectedComponents(prev => ({ ...prev, [nodeType]: componentId }))
  }

  const handleReset = () => {
    const baseConfig: Record<string, string> = {}
    nodes.forEach(node => {
      if (node.isRequired && node.options[0]) {
        baseConfig[node.nodeType] = node.options[0].id
      }
    })
    setSelectedComponents(baseConfig)
    setZoom(1)
    setCurrentAngle('front')
  }

  const handleZoomIn = () => setZoom(prev => Math.min(prev + 0.2, 3))
  const handleZoomOut = () => setZoom(prev => Math.max(prev - 0.2, 0.5))

  const formatPrice = (price: number) => 
    new Intl.NumberFormat('ru-RU', { style: 'currency', currency: 'RUB', minimumFractionDigits: 0 }).format(price)

  // Получение выбранного компонента для узла
  const getSelectedComponent = (nodeType: string) => {
    const node = nodes.find(n => n.nodeType === nodeType)
    const selectedId = selectedComponents[nodeType]
    return node?.options.find(o => o.id === selectedId)
  }

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Загрузка конструктора...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b px-6 py-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">2D Конструктор гриндера</h1>
          <div className="flex items-center gap-4">
            <div className="text-lg font-semibold text-blue-600">
              Итого: {formatPrice(totalPrice)}
            </div>
            <button
              onClick={handleReset}
              className="px-4 py-2 text-gray-600 hover:text-gray-900 border rounded-lg"
            >
              Сбросить
            </button>
          </div>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden">
        {/* Левая панель - Выбор узлов */}
        <aside className="w-80 bg-white border-r overflow-y-auto">
          <div className="p-4">
            <h2 className="text-lg font-bold mb-4">Компоненты</h2>
            <div className="space-y-3">
              {nodes.map((node) => (
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
        </aside>

        {/* Центральная часть - 2D визуализация */}
        <main className="flex-1 flex flex-col overflow-hidden">
          {/* Панель ракурсов */}
          <div className="bg-white border-b px-4 py-2">
            <div className="flex items-center justify-between">
              <div className="flex gap-2">
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
                    {angle.name}
                  </button>
                ))}
              </div>
              <div className="flex gap-2">
                <button
                  onClick={handleZoomOut}
                  className="px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg"
                  title="Уменьшить"
                >
                  🔍-
                </button>
                <button
                  onClick={handleZoomIn}
                  className="px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg"
                  title="Увеличить"
                >
                  🔍+
                </button>
                <span className="px-3 py-2 text-gray-600">
                  {Math.round(zoom * 100)}%
                </span>
              </div>
            </div>
          </div>

          {/* 2D сцена */}
          <div className="flex-1 relative overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200">
            <div
              className="absolute inset-0 flex items-center justify-center transition-transform duration-300"
              style={{ transform: `scale(${zoom})` }}
            >
              {/* Послойное наложение изображений */}
              <div className="relative w-[600px] h-[600px]">
                {nodes.map((node) => {
                  const component = getSelectedComponent(node.nodeType)
                  if (!component) return null
                  return (
                    <motion.img
                      key={node.id}
                      src={component.imageUrl}
                      alt={component.name}
                      className="absolute inset-0 w-full h-full object-contain"
                      style={{ zIndex: node.sortOrder }}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.3 }}
                    />
                  )
                })}
              </div>
            </div>

            {/* Подсказка */}
            <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur px-4 py-2 rounded-lg shadow">
              <p className="text-sm text-gray-600">
                🖱️ Используйте зум для детального просмотра
              </p>
            </div>
          </div>
        </main>

        {/* Правая панель - Выбранные компоненты */}
        <aside className="w-72 bg-white border-l overflow-y-auto">
          <div className="p-4">
            <h2 className="text-lg font-bold mb-4">Конфигурация</h2>
            <div className="space-y-3">
              {nodes.map((node) => {
                const component = getSelectedComponent(node.nodeType)
                return (
                  <div key={node.id} className="border rounded-lg p-3">
                    <div className="text-xs text-gray-500 mb-1">{node.name}</div>
                    {component ? (
                      <>
                        <div className="font-medium text-sm">{component.name}</div>
                        <div className="text-blue-600 font-semibold">{formatPrice(component.price)}</div>
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

            <button className="w-full mt-4 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-colors">
              Сохранить конфигурацию
            </button>

            <button className="w-full mt-2 px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-semibold transition-colors">
              Скачать спецификацию
            </button>
          </div>
        </aside>
      </div>
    </div>
  )
}
