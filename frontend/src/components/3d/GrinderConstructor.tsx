'use client'

import { useState, useEffect, Suspense } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, Stage, PerspectiveCamera, Environment, Html } from '@react-three/drei'
import { motion } from 'framer-motion'
import * as THREE from 'three'
import { AssemblyNode, GrinderConfiguration } from '@/types/constructor'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api'

function GrinderComponent({ option, isSelected }: { option: any; isSelected: boolean }) {
  const meshRef = useState<any>(null)[0]
  const [hovered, setHovered] = useState(false)
  const { position, rotation, scale } = option.model3D || { position: [0, 0, 0], rotation: [0, 0, 0], scale: [1, 1, 1] }

  useFrame((state, delta) => {
    if (!meshRef?.current) return
    const targetScale = hovered || isSelected ? 1.1 : 1
    meshRef.current.scale.lerp(new THREE.Vector3(scale[0] * targetScale, scale[1] * targetScale, scale[2] * targetScale), delta * 10)
    if (meshRef.current.children[0]) {
      const material = meshRef.current.children[0].material as THREE.MeshStandardMaterial
      if (material) {
        const targetColor = isSelected ? new THREE.Color('#3182ce') : hovered ? new THREE.Color('#63b3ed') : new THREE.Color('#4a5568')
        material.color.lerp(targetColor, delta * 10)
        material.emissiveIntensity = isSelected ? 0.3 : 0
      }
    }
  })

  return (
    <group ref={meshRef} position={position} rotation={rotation} scale={scale} onPointerOver={() => setHovered(true)} onPointerOut={() => setHovered(false)}>
      <mesh castShadow receiveShadow>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color={isSelected ? '#3182ce' : '#4a5568'} metalness={0.5} roughness={0.5} emissive={isSelected ? '#3182ce' : '#000000'} emissiveIntensity={isSelected ? 0.3 : 0} />
      </mesh>
      {isSelected && (
        <Html position={[0, 0.6, 0]} center>
          <div className="bg-blue-600 text-white text-xs px-2 py-1 rounded whitespace-nowrap">{option.name}</div>
        </Html>
      )}
    </group>
  )
}

function ConstructorScene({ configuration, nodes }: { configuration: GrinderConfiguration; nodes: AssemblyNode[] }) {
  return (
    <>
      <PerspectiveCamera makeDefault position={[3, 2, 3]} fov={50} />
      <Environment preset="studio" />
      <Stage environment="studio" intensity={0.5} shadows>
        {nodes.map((node) => {
          const selectedOptionId = configuration.selectedComponents[node.nodeType]
          if (!selectedOptionId) return null
          const option = node.options?.find((o: any) => o.id === selectedOptionId)
          if (!option) return null
          return <GrinderComponent key={node.id} option={option} isSelected={true} />
        })}
      </Stage>
      <OrbitControls enablePan enableZoom enableRotate minDistance={2} maxDistance={10} autoRotate={false} makeDefault />
    </>
  )
}

export default function GrinderConstructor() {
  const [configuration, setConfiguration] = useState<GrinderConfiguration>({
    id: 'default',
    name: 'Мой гриндер',
    selectedComponents: {},
    pricing: { basePrice: 0, componentsTotal: 0, discount: 0, total: 0 },
    scene3D: { camera: { position: [3, 2, 3], target: [0, 0, 0] }, lighting: {}, environment: 'studio' },
    createdAt: new Date(),
    updatedAt: new Date(),
    isPublic: false,
    isPreset: false,
  })

  const [selectedNode, setSelectedNode] = useState<string | null>(null)
  const [nodes, setNodes] = useState<AssemblyNode[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadData() {
      try {
        const response = await fetch(`${API_URL}/assembly-nodes`)
        const data = await response.json()
        if (data.data) setNodes(data.data)
      } catch (err) {
        console.error('Failed to load assembly nodes:', err)
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [])

  useEffect(() => {
    let total = 0
    nodes.forEach((node) => {
      const selectedOptionId = configuration.selectedComponents[node.nodeType]
      if (selectedOptionId) {
        const option = node.options?.find((o: any) => o.id === selectedOptionId)
        if (option) total += option.price || 0
      }
    })
    setConfiguration(prev => ({ ...prev, pricing: { ...prev.pricing, componentsTotal: total, total } }))
  }, [configuration.selectedComponents, nodes])

  const handleSelectOption = (nodeType: string, optionId: string) => {
    setConfiguration(prev => ({ ...prev, selectedComponents: { ...prev.selectedComponents, [nodeType]: optionId } }))
  }

  const formatPrice = (price: number) => new Intl.NumberFormat('ru-RU', { style: 'currency', currency: 'RUB', minimumFractionDigits: 0 }).format(price)

  if (loading) return <div className="h-screen flex items-center justify-center">Загрузка конструктора...</div>

  return (
    <div className="flex flex-col lg:flex-row h-screen bg-gray-50">
      <motion.aside initial={{ x: -300, opacity: 0 }} animate={{ x: 0, opacity: 1 }} className="w-full lg:w-80 bg-white border-r overflow-y-auto">
        <div className="p-6">
          <h2 className="text-2xl font-bold mb-6">Конструктор гриндера</h2>
          <div className="space-y-4">
            {nodes.map((node, index) => (
              <motion.div key={node.id} initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: index * 0.1 }} className="border rounded-lg overflow-hidden">
                <button onClick={() => setSelectedNode(selectedNode === node.id ? null : node.id)} className="w-full p-4 text-left bg-gray-50 hover:bg-gray-100">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold">{node.name}</h3>
                      {node.isRequired && <span className="text-xs text-red-500">* Обязательно</span>}
                    </div>
                    {configuration.selectedComponents[node.nodeType] && <span className="w-3 h-3 bg-green-500 rounded-full"></span>}
                  </div>
                </button>
                {selectedNode === node.id && (
                  <div className="p-4 space-y-2">
                    {node.options?.map((option: any) => (
                      <button key={option.id} onClick={() => handleSelectOption(node.nodeType, option.id)} className={`w-full p-3 border rounded-lg text-left ${configuration.selectedComponents[node.nodeType] === option.id ? 'border-blue-500 bg-blue-50' : ''}`}>
                        <div className="font-medium">{option.name}</div>
                        <div className="text-sm text-gray-600">{formatPrice(option.price || 0)}</div>
                      </button>
                    ))}
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </motion.aside>

      <main className="flex-1 relative">
        <Canvas shadows className="w-full h-full" dpr={[1, 2]}>
          <Suspense fallback={null}>
            <ConstructorScene configuration={configuration} nodes={nodes} />
          </Suspense>
        </Canvas>

        <motion.div initial={{ y: 100, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.5 }} className="absolute bottom-6 right-6 w-80 bg-white rounded-lg shadow-xl p-6">
          <div className="space-y-3">
            <div className="flex justify-between text-gray-600"><span>Компоненты:</span><span>{formatPrice(configuration.pricing.componentsTotal)}</span></div>
            <div className="border-t pt-3">
              <div className="flex justify-between text-xl font-bold"><span>Итого:</span><span className="text-blue-600">{formatPrice(configuration.pricing.total)}</span></div>
            </div>
          </div>
          <button className="w-full mt-4 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold">Сохранить конфигурацию</button>
        </motion.div>
      </main>
    </div>
  )
}
