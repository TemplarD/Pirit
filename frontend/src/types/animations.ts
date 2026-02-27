/**
 * Типы и интерфейсы для анимаций конструктора
 * Согласно ТЗ Часть 3, раздел 3.3
 */

// Типы анимаций
export enum AnimationType {
  UNSCREW = 'unscrew',           // Отвинчивание
  REMOVE = 'remove',             // Удаление
  ADD = 'add',                   // Добавление
  SCREW = 'screw',               // Привинчивание
  REPLACE = 'replace',           // Замена
  HOVER = 'hover',               // Наведение
  CLICK = 'click',               // Клик
  EXPLODE = 'explode',           // Взрыв-схема
}

// Базовая конфигурация анимации
export interface AnimationConfig {
  type: string
  duration: number        // мс
  easing: string
  delay?: number          // мс
}

// Анимация отвинчивания (Unscrew Animation)
export interface UnscrewAnimation {
  // Этап 1: Вибрация/подготовка
  preparation: {
    type: 'vibration'
    duration: number      // мс (200)
    amplitude: number     // мм (0.5)
    frequency: number     // Гц (30)
  }
  
  // Этап 2: Вращение крепёжного элемента
  rotation: {
    type: 'bolt_rotation'
    direction: 'counter-clockwise'
    rotations: number     // полных оборота (3)
    duration: number      // мс (600)
    easing: string
  }
  
  // Этап 3: Ослабление крепления
  loosening: {
    type: 'bolt_lift'
    distance: number      // мм подъёма (10)
    duration: number      // мс (300)
    easing: string
  }
  
  // Звуковые эффекты (опционально)
  sound?: {
    unscrew: string       // путь к звуку
    volume: number
  }
}

// Анимация удаления компонента (Remove Animation)
export interface RemoveAnimation {
  // Этап 1: Отсоединение от точки крепления
  detach: {
    type: 'separation'
    direction: 'normal_to_surface'  // перпендикулярно поверхности
    distance: number                // мм (20)
    duration: number                // мс (400)
    easing: string
  }
  
  // Этап 2: Перемещение за край экрана
  flyOut: {
    type: 'fly_to_edge'
    edge: 'top' | 'right' | 'bottom' | 'left'
    trajectory: 'arc' | 'straight'
    rotation: {
      enabled: boolean
      axis: 'x' | 'y' | 'z'
      degrees: number
    }
    scale: {
      start: number
      end: number
    }
    duration: number
    easing: string
  }
  
  // Этап 3: Исчезновение (fade out)
  fadeOut: {
    type: 'opacity'
    from: number
    to: number
    duration: number
  }
  
  // Следы крепления (опционально)
  mountMarks?: {
    show: boolean
    duration: number      // показывать следы (мс)
    fadeOut: boolean
  }
}

// Анимация добавления компонента (Add Animation)
export interface AddAnimation {
  // Этап 1: Появление из-за края экрана
  flyIn: {
    type: 'fly_from_edge'
    edge: 'top' | 'right' | 'bottom' | 'left'
    trajectory: 'arc' | 'straight'
    rotation: {
      enabled: boolean
      axis: 'x' | 'y' | 'z'
      degrees: number
    }
    scale: {
      start: number
      end: number
    }
    duration: number
    easing: string
  }
  
  // Этап 2: Позиционирование над точкой крепления
  position: {
    type: 'hover_above'
    offset: number        // мм над точкой
    duration: number
    easing: string
    alignment: {
      enabled: boolean
      snapThreshold: number  // мм
      visualGuide: boolean
    }
  }
  
  // Этап 3: Опускание на место
  descend: {
    type: 'lower_to_mount'
    distance: number
    duration: number
    easing: string
    rotation: {
      enabled: boolean
      maxDegrees: number
      direction: 'both' | 'clockwise' | 'counter-clockwise'
    }
  }
  
  // Этап 4: "Примагничивание" к позиции
  snap: {
    type: 'snap_to_place'
    distance: number      // мм финальное движение
    duration: number
    easing: string
    sound?: string        // щелчок
  }
}

// Анимация привинчивания (Screw Animation)
export interface ScrewAnimation {
  // Этап 1: Позиционирование крепёжного элемента
  positionBolt: {
    type: 'bolt_appear'
    method: 'fade_in' | 'fly_in'
    position: 'above_hole'
    offset: number        // мм
    duration: number
  }
  
  // Этап 2: Опускание в отверстие
  insert: {
    type: 'bolt_insert'
    distance: number
    duration: number
    easing: string
    alignment: {
      auto: boolean
      visual: boolean
    }
  }
  
  // Этап 3: Вращение при закручивании
  tightening: {
    type: 'bolt_rotation'
    direction: 'clockwise'
    rotations: number
    duration: number
    easing: string
    verticalMovement: {
      enabled: boolean
      distance: number
      synchronized: boolean
    }
  }
  
  // Этап 4: Финальная затяжка
  finalTighten: {
    type: 'final_torque'
    rotation: number      // градусов
    duration: number
    sound?: string
    vibration?: number    // мс
  }
}

// Анимация замены компонента (Replace Animation)
export interface ReplaceAnimation {
  // Двухэтапная анимация: удаление старого + добавление нового
  
  // Этап A: Удаление старого компонента
  removeOld: {
    unscrew: UnscrewAnimation
    remove: RemoveAnimation
    parallel: boolean
  }
  
  // Пауза между удалением и добавлением
  pause: {
    duration: number      // мс (300)
  }
  
  // Этап B: Добавление нового компонента
  addNew: {
    add: AddAnimation
    screw: ScrewAnimation
    parallel: boolean
  }
  
  // Общая длительность
  totalDuration: number   // мс (~3000)
  
  // Плавность перехода
  transition: {
    type: 'crossfade' | 'morph'
    highlight: boolean
  }
}

// Требования к анимациям
export interface AnimationRequirements {
  // Производительность
  performance: {
    targetFPS: number     // 60
    maxDuration: number   // мс (5000)
    minDuration: number   // мс (100)
    interpolation: 'linear' | 'spline'
  }
  
  // Физическая точность
  physics: {
    accurateThreads: boolean      // точная резьба
    realisticMotion: boolean      // реалистичное движение
    collisionDetection: boolean   // обнаружение столкновений
    gravity: boolean              // гравитация
  }
  
  // Визуальные эффекты
  effects: {
    motionBlur: boolean
    depthOfField: boolean
    ambientOcclusion: boolean
    highlights: boolean
    shadows: boolean
  }
  
  // Доступность
  accessibility: {
    reducedMotion: boolean        // режим для prefers-reduced-motion
    skipAnimation: boolean        // возможность пропуска
    duration: 'short' | 'normal' | 'long'
  }
}

// Предустановленные конфигурации анимаций
export const PRESET_ANIMATIONS = {
  [AnimationType.UNSCREW]: {
    preparation: {
      type: 'vibration',
      duration: 200,
      amplitude: 0.5,
      frequency: 30,
    },
    rotation: {
      type: 'bolt_rotation',
      direction: 'counter-clockwise',
      rotations: 3,
      duration: 600,
      easing: 'ease-in-out',
    },
    loosening: {
      type: 'bolt_lift',
      distance: 10,
      duration: 300,
      easing: 'ease-out',
    },
  },
  [AnimationType.REMOVE]: {
    detach: {
      type: 'separation',
      direction: 'normal_to_surface',
      distance: 20,
      duration: 400,
      easing: 'ease-in',
    },
    flyOut: {
      type: 'fly_to_edge',
      edge: 'top' as const,
      trajectory: 'arc' as const,
      rotation: {
        enabled: true,
        axis: 'z' as const,
        degrees: 45,
      },
      scale: {
        start: 1.0,
        end: 0.3,
      },
      duration: 800,
      easing: 'ease-in-back',
    },
    fadeOut: {
      type: 'opacity',
      from: 1.0,
      to: 0.0,
      duration: 200,
    },
  },
  [AnimationType.ADD]: {
    flyIn: {
      type: 'fly_from_edge',
      edge: 'top' as const,
      trajectory: 'arc' as const,
      rotation: {
        enabled: true,
        axis: 'z' as const,
        degrees: -45,
      },
      scale: {
        start: 0.3,
        end: 1.0,
      },
      duration: 800,
      easing: 'ease-out-back',
    },
    position: {
      type: 'hover_above',
      offset: 20,
      duration: 300,
      easing: 'ease-out',
      alignment: {
        enabled: true,
        snapThreshold: 2,
        visualGuide: true,
      },
    },
    descend: {
      type: 'lower_to_mount',
      distance: 20,
      duration: 400,
      easing: 'ease-in',
      rotation: {
        enabled: true,
        maxDegrees: 15,
        direction: 'both' as const,
      },
    },
    snap: {
      type: 'snap_to_place',
      distance: 3,
      duration: 150,
      easing: 'ease-out',
    },
  },
  [AnimationType.SCREW]: {
    positionBolt: {
      type: 'bolt_appear',
      method: 'fade_in' as const,
      position: 'above_hole' as const,
      offset: 5,
      duration: 200,
    },
    insert: {
      type: 'bolt_insert',
      distance: 5,
      duration: 200,
      easing: 'ease-in',
      alignment: {
        auto: true,
        visual: true,
      },
    },
    tightening: {
      type: 'bolt_rotation',
      direction: 'clockwise',
      rotations: 3,
      duration: 600,
      easing: 'ease-in-out',
      verticalMovement: {
        enabled: true,
        distance: 8,
        synchronized: true,
      },
    },
    finalTighten: {
      type: 'final_torque',
      rotation: 30,
      duration: 150,
    },
  },
} as const

// Утилиты для анимаций
export const AnimationUtils = {
  // Получить длительность анимации
  getDuration: (animation: any): number => {
    if (!animation) return 0
    
    // Суммируем длительности всех этапов
    let total = 0
    for (const key in animation) {
      const stage = animation[key]
      if (stage && typeof stage === 'object') {
        if ('duration' in stage) {
          total += stage.duration as number
        }
      }
    }
    return total
  },
  
  // Создать последовательность анимаций
  createSequence: (...animations: any[]) => {
    return animations.reduce((acc, anim) => {
      const duration = AnimationUtils.getDuration(anim)
      return {
        ...acc,
        stages: [...(acc.stages || []), { animation: anim, delay: acc.totalDuration }],
        totalDuration: acc.totalDuration + duration,
      }
    }, { stages: [], totalDuration: 0 })
  },
  
  // Проверить поддержку reduced motion
  prefersReducedMotion: (): boolean => {
    if (typeof window === 'undefined') return false
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches
  },
}
