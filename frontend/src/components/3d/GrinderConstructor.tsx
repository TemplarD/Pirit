'use client'

import { useState, useEffect, Suspense, useRef } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { OrbitControls, Stage, PerspectiveCamera, Environment, Html } from '@react-three/drei'
import { motion, AnimatePresence } from 'framer-motion'
import * as THREE from 'three'
import { GrinderNodeType, AssemblyNode, AssemblyOption, GrinderConfiguration } from '@/types/constructor'
import { AnimationType } from '@/types/animations'
import { useComponentAnimation } from '@/hooks/useAnimation'

// Предустановленные узлы для конструктора
const DEFAULT_NODES: AssemblyNode[] = [
  {
    id: 'base',
    name: 'Основание',
    slug: 'base',
    nodeType: GrinderNodeType.BASE,
    isRequired: true,
    options: [
      {
        id: 'base-standard',
        componentId: 'base-std-001',
        name: 'Стандартное основание',
        price: 15000,
        priceDifference: 0,
        model3D: {
          url: '/models/base-standard.glb',
          position: [0, -0.5, 0] as [number, number, number],
          rotation: [0, 0, 0] as [number, number, number],
          scale: [1, 1, 1] as [number, number, number],
        },
        thumbnail: '/thumbnails/base-standard.png',
        specs: { material: 'Сталь', weight: '25 кг' },
        available: true,
      },
      {
        id: 'base-reinforced',
        componentId: 'base-reinf-001',
        name: 'Усиленное основание',
        price: 22000,
        priceDifference: 7000,
        model3D: {
          url: '/models/base-reinforced.glb',
          position: [0, -0.5, 0] as [number, number, number],
          rotation: [0, 0, 0] as [number, number, number],
          scale: [1.1, 1, 1.1] as [number, number, number],
        },
        thumbnail: '/thumbnails/base-reinforced.png',
        specs: { material: 'Сталь 3мм', weight: '35 кг' },
        available: true,
      },
    ],
    mountPoints: [
      {
        id: 'base-mount-1',
        position: [0, 0, 0] as [number, number, number],
        rotation: [0, 0, 0] as [number, number, number],
        nodeType: GrinderNodeType.BASE,
        compatibleWith: [GrinderNodeType.FRAME, GrinderNodeType.MOTOR],
      },
    ],
  },
  {
    id: 'motor',
    name: 'Двигатель',
    slug: 'motor',
    nodeType: GrinderNodeType.MOTOR,
    isRequired: true,
    options: [
      {
        id: 'motor-2kw',
        componentId: 'motor-2kw-001',
        name: 'Двигатель 2 кВт',
        price: 35000,
        priceDifference: 0,
        model3D: {
          url: '/models/motor-2kw.glb',
          position: [0, 0.5, 0] as [number, number, number],
          rotation: [0, 0, 0] as [number, number, number],
          scale: [1, 1, 1] as [number, number, number],
        },
        thumbnail: '/thumbnails/motor-2kw.png',
        specs: { power: '2 кВт', rpm: '2800 об/мин', voltage: '380В' },
        available: true,
      },
      {
        id: 'motor-3kw',
        componentId: 'motor-3kw-001',
        name: 'Двигатель 3 кВт',
        price: 48000,
        priceDifference: 13000,
        model3D: {
          url: '/models/motor-3kw.glb',
          position: [0, 0.6, 0] as [number, number, number],
          rotation: [0, 0, 0] as [number, number, number],
          scale: [1.1, 1.2, 1.1] as [number, number, number],
        },
        thumbnail: '/thumbnails/motor-3kw.png',
        specs: { power: '3 кВт', rpm: '3000 об/мин', voltage: '380В' },
        available: true,
      },
    ],
    mountPoints: [],
  },
  {
    id: 'frame',
    name: 'Рама',
    slug: 'frame',
    nodeType: GrinderNodeType.FRAME,
    isRequired: true,
    options: [
      {
        id: 'frame-standard',
        componentId: 'frame-std-001',
        name: 'Стандартная рама',
        price: 25000,
        priceDifference: 0,
        model3D: {
          url: '/models/frame-standard.glb',
          position: [0, 1, 0] as [number, number, number],
          rotation: [0, 0, 0] as [number, number, number],
          scale: [1, 1, 1] as [number, number, number],
        },
        thumbnail: '/thumbnails/frame-standard.png',
        specs: { material: 'Сталь', height: '800 мм' },
        available: true,
      },
    ],
    mountPoints: [],
  },
]

// Компонент 3D модели с анимацией
function GrinderComponent({ 
  option, 
  isSelected,
  isAnimating,
  animationType 
}: { 
  option: AssemblyOption
  isSelected: boolean
  isAnimating: boolean
  animationType: AnimationType | null
}) {
  const meshRef = useRef<THREE.Group>(null)
  const [hovered, setHovered] = useState(false)
  const { position, rotation, scale } = option.model3D
  
  // Анимация вращения для выделения
  useFrame((state, delta) => {
    if (!meshRef.current) return
    
    // Плавное изменение масштаба при наведении
    const targetScale = hovered || isSelected ? 1.1 : 1
    meshRef.current.scale.lerp(new THREE.Vector3(
      scale[0] * targetScale,
      scale[1] * targetScale,
      scale[2] * targetScale
    ), delta * 10)
    
    // Подсветка выбранных компонентов
    if (meshRef.current.children[0]) {
      const child = meshRef.current.children[0] as THREE.Mesh
      const material = child.material as THREE.MeshStandardMaterial
      if (material) {
        const targetColor = isSelected 
          ? new THREE.Color('#3182ce') 
          : hovered 
            ? new THREE.Color('#63b3ed') 
            : new THREE.Color('#4a5568')
        material.color.lerp(targetColor, delta * 10)
      }
    }
  })
  
  return (
    <group 
      ref={meshRef} 
      position={position} 
      rotation={rotation} 
      scale={scale}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
    >
      {/* Упрощенная модель для демонстрации с анимацией */}
      <mesh castShadow receiveShadow>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial 
          color={isSelected ? '#3182ce' : '#4a5568'}
          metalness={0.5}
          roughness={0.5}
          emissive={isSelected ? '#3182ce' : '#000000'}
          emissiveIntensity={isSelected ? 0.3 : 0}
        />
      </mesh>
      
      {/* Визуальные направляющие для точек крепления */}
      {isSelected && (
        <Html position={[0, 0.6, 0]} center>
          <div className="bg-blue-600 text-white text-xs px-2 py-1 rounded whitespace-nowrap">
            {option.name}
          </div>
        </Html>
      )}
    </group>
  )
}

// Сцена конструктора с анимациями
function ConstructorScene({ 
  configuration, 
  nodes,
  onComponentSelect,
}: { 
  configuration: GrinderConfiguration
  nodes: AssemblyNode[]
  onComponentSelect: (nodeType: string, optionId: string) => void
}) {
  const [selectedComponent, setSelectedComponent] = useState<{nodeType: string, optionId: string} | null>(null)
  const [animationType, setAnimationType] = useState<AnimationType | null>(null)
  
  return (
    <>
      <PerspectiveCamera makeDefault position={[3, 2, 3]} fov={50} />
      
      <Environment preset="studio" />
      
      <Stage 
        environment="studio" 
        intensity={0.5}
        shadows
      >
        {nodes.map((node) => {
          const selectedOptionId = configuration.selectedComponents[node.nodeType]
          if (!selectedOptionId) return null
          
          const option = node.options.find(o => o.id === selectedOptionId)
          if (!option) return null
          
          return (
            <GrinderComponent
              key={node.id} 
              option={option} 
              isSelected={true}
              isAnimating={false}
              animationType={null}
            />
          )
        })}
      </Stage>

      <OrbitControls 
        enablePan={true}
        enableZoom={true}
        enableRotate={true}
        minDistance={2}
        maxDistance={10}
        autoRotate={false}
        makeDefault
      />
    </>
  )
}

// Основной компонент конструктора
export default function GrinderConstructor() {
  const [configuration, setConfiguration] = useState<GrinderConfiguration>({
    id: 'default',
    name: 'Мой гриндер',
    selectedComponents: {},
    pricing: {
      basePrice: 0,
      componentsTotal: 0,
      discount: 0,
      total: 0,
    },
    scene3D: {
      camera: {
        position: [3, 2, 3],
        target: [0, 0, 0],
      },
      lighting: {},
      environment: 'studio',
    },
    createdAt: new Date(),
    updatedAt: new Date(),
    isPublic: false,
    isPreset: false,
  })

  const [selectedNode, setSelectedNode] = useState<string | null>(null)

  // Обновление цены при изменении конфигурации
  useEffect(() => {
    const nodes = DEFAULT_NODES
    let total = 0
    
    nodes.forEach((node) => {
      const selectedOptionId = configuration.selectedComponents[node.nodeType]
      if (selectedOptionId) {
        const option = node.options.find(o => o.id === selectedOptionId)
        if (option) {
          total += option.price
        }
      }
    })

    setConfiguration(prev => ({
      ...prev,
      pricing: {
        basePrice: 0,
        componentsTotal: total,
        discount: 0,
        total: total,
      },
      updatedAt: new Date(),
    }))
  }, [configuration.selectedComponents])

  // Выбор опции для узла
  const handleSelectOption = (nodeType: string, optionId: string) => {
    setConfiguration(prev => ({
      ...prev,
      selectedComponents: {
        ...prev.selectedComponents,
        [nodeType]: optionId,
      },
    }))
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('ru-RU', {
      style: 'currency',
      currency: 'RUB',
      minimumFractionDigits: 0,
    }).format(price)
  }

  return (
    <div className="flex flex-col lg:flex-row h-screen bg-gray-50 dark:bg-gray-900">
      {/* Левая панель - Список узлов */}
      <motion.aside 
        initial={{ x: -300, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full lg:w-80 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 overflow-y-auto"
      >
        <div className="p-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
            Конструктор гриндера
          </h2>

          <div className="space-y-4">
            {DEFAULT_NODES.map((node, index) => {
              const isSelected = selectedNode === node.id
              const hasSelection = !!configuration.selectedComponents[node.nodeType]

              return (
                <motion.div
                  key={node.id}
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: index * 0.1 }}
                  className={`border rounded-lg overflow-hidden transition-all ${
                    isSelected 
                      ? 'border-blue-500 ring-2 ring-blue-200 dark:ring-blue-800' 
                      : 'border-gray-200 dark:border-gray-700'
                  }`}
                >
                  <button
                    onClick={() => setSelectedNode(isSelected ? null : node.id)}
                    className="w-full p-4 text-left bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-semibold text-gray-900 dark:text-white">
                          {node.name}
                        </h3>
                        {node.isRequired && (
                          <span className="text-xs text-red-500">* Обязательно</span>
                        )}
                      </div>
                      {hasSelection && (
                        <span className="w-3 h-3 bg-green-500 rounded-full"></span>
                      )}
                    </div>
                  </button>

                  <AnimatePresence>
                    {isSelected && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="overflow-hidden"
                      >
                        <div className="p-4 space-y-3">
                          {node.options.map((option) => (
                            <button
                              key={option.id}
                              onClick={() => handleSelectOption(node.nodeType, option.id)}
                              disabled={!option.available}
                              className={`w-full p-3 border rounded-lg transition-all text-left ${
                                configuration.selectedComponents[node.nodeType] === option.id
                                  ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                                  : 'border-gray-200 dark:border-gray-700 hover:border-gray-300'
                              } ${!option.available ? 'opacity-50 cursor-not-allowed' : ''}`}
                            >
                              <div className="flex items-center justify-between mb-2">
                                <span className="font-medium text-gray-900 dark:text-white">
                                  {option.name}
                                </span>
                              </div>
                              <div className="text-sm text-gray-600 dark:text-gray-400">
                                {formatPrice(option.price)}
                              </div>
                              {option.specs && (
                                <div className="mt-2 text-xs text-gray-500 dark:text-gray-500">
                                  {Object.entries(option.specs)
                                    .map(([key, value]) => `${key}: ${value}`)
                                    .join(', ')}
                                </div>
                              )}
                            </button>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              )
            })}
          </div>
        </div>
      </motion.aside>

      {/* Центральная панель - 3D сцена */}
      <main className="flex-1 relative">
        <Canvas
          shadows
          className="w-full h-full"
          dpr={[1, 2]}
        >
          <Suspense fallback={null}>
            <ConstructorScene
              configuration={configuration}
              nodes={DEFAULT_NODES}
              onComponentSelect={(nodeType, optionId) => {
                handleSelectOption(nodeType, optionId)
              }}
            />
          </Suspense>
        </Canvas>

        {/* Панель управления анимациями */}
        <motion.div
          initial={{ x: 100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="absolute top-6 right-6 w-64 bg-white dark:bg-gray-800 rounded-lg shadow-xl p-4 border border-gray-200 dark:border-gray-700"
        >
          <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">
            Тест анимаций
          </h3>
          
          <div className="space-y-2">
            <button
              onClick={() => console.log('Animation: ADD')}
              className="w-full px-3 py-2 bg-green-600 hover:bg-green-700 text-white text-sm rounded transition-colors"
            >
              ➕ Добавить
            </button>
            <button
              onClick={() => console.log('Animation: REMOVE')}
              className="w-full px-3 py-2 bg-red-600 hover:bg-red-700 text-white text-sm rounded transition-colors"
            >
              ➖ Удалить
            </button>
            <button
              onClick={() => console.log('Animation: UNSCREW')}
              className="w-full px-3 py-2 bg-yellow-600 hover:bg-yellow-700 text-white text-sm rounded transition-colors"
            >
              🔓 Отвинтить
            </button>
            <button
              onClick={() => console.log('Animation: SCREW')}
              className="w-full px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded transition-colors"
            >
              🔐 Привинтить
            </button>
          </div>
          
          <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
            <div className="text-xs text-gray-500 dark:text-gray-400">
              <p>🎯 Наведите на компонент для подсветки</p>
              <p>🖱️ Кликните для выбора</p>
              <p>🔄 Вращайте камеру мышкой</p>
            </div>
          </div>
        </motion.div>

        {/* Итоговая цена */}
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="absolute bottom-6 left-6 right-6 lg:left-auto lg:right-6 lg:w-80"
        >
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 border border-gray-200 dark:border-gray-700">
            <div className="space-y-3">
              <div className="flex justify-between text-gray-600 dark:text-gray-400">
                <span>Компоненты:</span>
                <span>{formatPrice(configuration.pricing.componentsTotal)}</span>
              </div>
              {configuration.pricing.discount > 0 && (
                <div className="flex justify-between text-green-600 dark:text-green-400">
                  <span>Скидка:</span>
                  <span>-{formatPrice(configuration.pricing.discount)}</span>
                </div>
              )}
              <div className="border-t border-gray-200 dark:border-gray-700 pt-3">
                <div className="flex justify-between text-xl font-bold text-gray-900 dark:text-white">
                  <span>Итого:</span>
                  <span className="text-blue-600 dark:text-blue-400">
                    {formatPrice(configuration.pricing.total)}
                  </span>
                </div>
              </div>
            </div>

            <button
              className="w-full mt-4 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-colors"
              onClick={() => {
                console.log('Configuration:', configuration)
                alert('Конфигурация сохранена в консоль!')
              }}
            >
              Сохранить конфигурацию
            </button>
          </div>
        </motion.div>
      </main>
    </div>
  )
}
