'use client'

import { Canvas } from '@react-three/fiber'
import { OrbitControls, Box, Plane } from '@react-three/drei'
import { Suspense } from 'react'

// Простой компонент гриндера
function GrinderModel() {
  return (
    <group>
      {/* Основание */}
      <Box args={[2, 0.5, 1]} position={[0, -0.25, 0]}>
        <meshStandardMaterial color="#4a5568" />
      </Box>
      
      {/* Двигатель */}
      <Box args={[0.8, 1.2, 0.8]} position={[0, 0.6, 0]}>
        <meshStandardMaterial color="#2d3748" />
      </Box>
      
      {/* Шкив */}
      <Box args={[0.6, 0.6, 0.2]} position={[0.8, 0.6, 0]}>
        <meshStandardMaterial color="#e53e3e" />
      </Box>
      
      {/* Рабочий стол */}
      <Box args={[1.5, 0.1, 0.8]} position={[0, 1.2, 0.5]}>
        <meshStandardMaterial color="#718096" />
      </Box>
      
      {/* Защитный экран */}
      <Box args={[1.2, 0.8, 0.05]} position={[0, 1.6, 0.5]}>
        <meshStandardMaterial color="#4299e1" transparent opacity={0.7} />
      </Box>
    </group>
  )
}

interface SimpleGrinder3DProps {
  className?: string
}

export default function SimpleGrinder3D({ className = '' }: SimpleGrinder3DProps) {
  return (
    <div className={`w-full h-96 ${className}`}>
      <Canvas
        camera={{ position: [3, 2, 3], fov: 50 }}
        className="w-full h-full"
      >
        <Suspense fallback={null}>
          {/* Освещение */}
          <ambientLight intensity={0.5} />
          <directionalLight position={[10, 10, 5]} intensity={1} />
          <pointLight position={[-10, -10, -5]} intensity={0.5} />
          
          {/* 3D модель */}
          <GrinderModel />
          
          {/* Пол */}
          <Plane 
            args={[10, 10]} 
            rotation={[-Math.PI / 2, 0, 0]} 
            position={[0, -1, 0]}
          >
            <meshStandardMaterial color="#f7fafc" />
          </Plane>
          
          {/* Управление камерой */}
          <OrbitControls 
            enablePan={true}
            enableZoom={true}
            enableRotate={true}
            minDistance={2}
            maxDistance={10}
            autoRotate={true}
            autoRotateSpeed={1}
          />
        </Suspense>
      </Canvas>
    </div>
  )
}
