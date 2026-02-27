'use client'

import React, { useState, useCallback, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { AnimationType, AnimationConfig, PRESET_ANIMATIONS, AnimationUtils } from '@/types/animations'

// Состояние анимации
interface AnimationState {
  isAnimating: boolean
  currentType: AnimationType | null
  progress: number
  stage: string
}

// Хук для управления анимациями компонентов
export function useComponentAnimation() {
  const [animationState, setAnimationState] = useState<AnimationState>({
    isAnimating: false,
    currentType: null,
    progress: 0,
    stage: '',
  })
  
  const animationRef = useRef<{
    startTime: number
    duration: number
    type: AnimationType
    onComplete?: () => void
  } | null>(null)
  
  // Обновление анимации каждый кадр
  useFrame((state, delta) => {
    if (!animationRef.current || !animationState.isAnimating) return
    
    const elapsed = state.clock.elapsedTime * 1000 - animationRef.current.startTime
    const progress = Math.min(elapsed / animationRef.current.duration, 1)
    
    setAnimationState(prev => ({
      ...prev,
      progress,
    }))
    
    if (progress >= 1) {
      // Анимация завершена
      animationRef.current.onComplete?.()
      animationRef.current = null
      setAnimationState(prev => ({
        ...prev,
        isAnimating: false,
        currentType: null,
        progress: 0,
      }))
    }
  })
  
  // Запуск анимации
  const startAnimation = useCallback((
    type: AnimationType,
    duration?: number,
    onComplete?: () => void
  ) => {
    if (animationState.isAnimating) return

    let preset: any
    if (type === 'add') preset = PRESET_ANIMATIONS.add
    else if (type === 'remove') preset = PRESET_ANIMATIONS.remove
    else if (type === 'screw') preset = PRESET_ANIMATIONS.screw
    else if (type === 'unscrew') preset = PRESET_ANIMATIONS.unscrew
    else preset = {}
    
    const animDuration = duration || AnimationUtils.getDuration(preset) || 1000

    animationRef.current = {
      startTime: performance.now(),
      duration: animDuration,
      type,
      onComplete,
    }

    setAnimationState({
      isAnimating: true,
      currentType: type,
      progress: 0,
      stage: 'started',
    })
  }, [animationState.isAnimating])
  
  // Прерывание анимации
  const stopAnimation = useCallback(() => {
    animationRef.current = null
    setAnimationState(prev => ({
      ...prev,
      isAnimating: false,
      currentType: null,
      progress: 0,
    }))
  }, [])
  
  return {
    animationState,
    startAnimation,
    stopAnimation,
    isAnimating: animationState.isAnimating,
  }
}

// Компонент для анимации 3D объекта
export interface AnimatedObjectProps {
  children: React.ReactNode
  animationType?: AnimationType
  onAnimationComplete?: () => void
  initialPosition?: [number, number, number]
  initialRotation?: [number, number, number]
  initialScale?: [number, number, number]
  targetPosition?: [number, number, number]
}

export function AnimatedObject({
  children,
  animationType,
  onAnimationComplete,
  initialPosition = [0, 0, 0],
  initialRotation = [0, 0, 0],
  initialScale = [1, 1, 1],
  targetPosition,
}: AnimatedObjectProps) {
  const meshRef = useRef<THREE.Group>(null)
  const { animationState, startAnimation } = useComponentAnimation()
  
  // Запуск анимации при изменении типа
  React.useEffect(() => {
    if (animationType) {
      startAnimation(animationType, undefined, onAnimationComplete)
    }
  }, [animationType, startAnimation, onAnimationComplete])
  
  // Применение трансформаций в зависимости от прогресса анимации
  useFrame((state, delta) => {
    if (!meshRef.current || !animationState.isAnimating) return
    
    const progress = animationState.progress
    const type = animationState.currentType
    
    if (type === AnimationType.ADD && targetPosition) {
      // Анимация добавления: полет к позиции
      const t = easeOutBack(progress)
      
      meshRef.current.position.x = THREE.MathUtils.lerp(initialPosition[0], targetPosition[0], t)
      meshRef.current.position.y = THREE.MathUtils.lerp(initialPosition[1], targetPosition[1], t)
      meshRef.current.position.z = THREE.MathUtils.lerp(initialPosition[2], targetPosition[2], t)
      
      // Вращение во время полета
      meshRef.current.rotation.z = THREE.MathUtils.lerp(-Math.PI / 4, 0, t)
      
      // Масштабирование
      const scale = THREE.MathUtils.lerp(0.3, 1, t)
      meshRef.current.scale.set(scale, scale, scale)
    }
    
    if (type === AnimationType.REMOVE) {
      // Анимация удаления: полет за экран
      const t = easeInBack(progress)
      
      meshRef.current.position.y = THREE.MathUtils.lerp(initialPosition[1], initialPosition[1] + 5, t)
      meshRef.current.position.x = THREE.MathUtils.lerp(initialPosition[0], initialPosition[0] + 2, t)
      
      // Вращение и уменьшение
      meshRef.current.rotation.z += delta
      const scale = THREE.MathUtils.lerp(1, 0.3, t)
      meshRef.current.scale.set(scale, scale, scale)
      
      // Прозрачность
      if (meshRef.current.children[0]) {
        const child = meshRef.current.children[0] as THREE.Mesh
        if (child.material) {
          (child.material as THREE.Material).opacity = THREE.MathUtils.lerp(1, 0, t)
        }
      }
    }
  })
  
  return (
    <group ref={meshRef} position={initialPosition} rotation={initialRotation} scale={initialScale}>
      {children}
    </group>
  )
}

// Функции плавности (easing functions)
function easeOutBack(x: number): number {
  const c1 = 1.70158
  const c3 = c1 + 1
  return 1 + c3 * Math.pow(x - 1, 3) + c1 * Math.pow(x - 1, 2)
}

function easeInBack(x: number): number {
  const c1 = 1.70158
  const c3 = c1 + 1
  return c3 * x * x * x - c1 * x * x
}

function easeInOutQuad(x: number): number {
  return x < 0.5 ? 2 * x * x : 1 - Math.pow(-2 * x + 2, 2) / 2
}

// Утилиты для анимаций
export const AnimationHelpers = {
  // Интерполяция позиции
  lerpPosition: (
    from: [number, number, number],
    to: [number, number, number],
    t: number
  ): [number, number, number] => {
    return [
      THREE.MathUtils.lerp(from[0], to[0], t),
      THREE.MathUtils.lerp(from[1], to[1], t),
      THREE.MathUtils.lerp(from[2], to[2], t),
    ]
  },
  
  // Интерполяция вращения
  lerpRotation: (
    from: [number, number, number],
    to: [number, number, number],
    t: number
  ): [number, number, number] => {
    return [
      THREE.MathUtils.lerp(from[0], to[0], t),
      THREE.MathUtils.lerp(from[1], to[1], t),
      THREE.MathUtils.lerp(from[2], to[2], t),
    ]
  },
  
  // Создание вибрации
  createVibration: (amplitude: number, frequency: number, time: number) => {
    return amplitude * Math.sin(frequency * time * Math.PI * 2)
  },
  
  // Проверка столкновений (упрощенная)
  checkCollision: (
    pos1: [number, number, number],
    pos2: [number, number, number],
    threshold: number = 0.1
  ): boolean => {
    const distance = Math.sqrt(
      Math.pow(pos1[0] - pos2[0], 2) +
      Math.pow(pos1[1] - pos2[1], 2) +
      Math.pow(pos1[2] - pos2[2], 2)
    )
    return distance < threshold
  },
}
