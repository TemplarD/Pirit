/**
 * 3D Конструктор гриндеров
 * Типы и интерфейсы для конструктора
 */

// Типы узлов гриндера
export enum GrinderNodeType {
  BASE = 'base',              // Основание
  FRAME = 'frame',            // Рама
  MOTOR = 'motor',            // Двигатель
  DRIVE_ROLLER = 'drive_roller',   // Ведущий ролик
  IDLER_ROLLER = 'idler_roller',   // Ведомый ролик
  TENSIONER = 'tensioner',    // Механизм натяжения
  BELT = 'belt',              // Лента
  GUARD = 'guard',            // Кожух
  ACCESSORY = 'accessory'     // Дополнительно
}

// 3D модель компонента
export interface ComponentModel3D {
  url: string;
  position: [number, number, number];
  rotation: [number, number, number];
  scale: [number, number, number];
  material?: string;
}

// Опция сборки для узла
export interface AssemblyOption {
  id: string;
  componentId: string;        // Ссылка на компонент
  name: string;
  price: number;
  priceDifference: number;    // Разница от базовой цены

  // 3D модель
  model3D: ComponentModel3D;

  // Изображение
  thumbnail: string;

  // Характеристики
  specs: Record<string, any>;

  // Доступность
  available: boolean;
  leadTime?: number;          // Срок поставки (дни)
}

// Узел сборки
export interface AssemblyNode {
  id: string;
  name: string;
  slug: string;
  nodeType: GrinderNodeType;
  options: AssemblyOption[];
  isRequired: boolean;
  dependencies?: {
    requires?: string[];
    incompatibleWith?: string[];
  };
  mountPoints: MountPoint[];
}

// Точка крепления
export interface MountPoint {
  id: string;
  position: [number, number, number];
  rotation: [number, number, number];
  nodeType: GrinderNodeType;
  compatibleWith: GrinderNodeType[];
}

// Конфигурация гриндера
export interface GrinderConfiguration {
  id: string;
  name: string;               // Пользовательское название

  // Выбранные компоненты
  selectedComponents: {
    [nodeType: string]: string;  // nodeType -> optionId
  };

  // Расчетная цена
  pricing: {
    basePrice: number;
    componentsTotal: number;
    discount: number;
    total: number;
  };

  // 3D сцена (сериализованная)
  scene3D: {
    camera: {
      position: [number, number, number];
      target: [number, number, number];
    };
    lighting: any;
    environment: string;
  };

  // Мета
  createdAt: Date;
  updatedAt: Date;

  // Для сохранения
  userId?: string;
  isPublic: boolean;
  isPreset: boolean;        // Предустановленная конфигурация
}

// Предустановленные конфигурации
export interface GrinderPreset {
  id: string;
  name: string;
  description: string;
  thumbnail: string;
  configuration: GrinderConfiguration;
  price: number;
  category: 'beginner' | 'professional' | 'industrial';
}

// События конструктора
export interface ConstructorEvent {
  type: 'node_select' | 'option_change' | 'price_update' | 'save' | 'load';
  payload: any;
  timestamp: Date;
}
