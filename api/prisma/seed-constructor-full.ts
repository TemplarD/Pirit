/**
 * Seed данные для 3D конструктора
 */

import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🔧 Создание узлов для конструктора...')

  const baseNode = await prisma.assemblyNode.upsert({
    where: { slug: 'base' },
    update: {},
    create: {
      name: 'Основание',
      slug: 'base',
      nodeType: 'BASE',
      description: 'Основание гриндера',
      isRequired: true,
      sortOrder: 1,
      mountPoints: [{ id: 'base-mount-1', position: [0, 0, 0], rotation: [0, 0, 0], nodeType: 'BASE', compatibleWith: ['FRAME', 'MOTOR'] }],
    },
  })

  const motorNode = await prisma.assemblyNode.upsert({
    where: { slug: 'motor' },
    update: {},
    create: {
      name: 'Двигатель',
      slug: 'motor',
      nodeType: 'MOTOR',
      description: 'Электродвигатель',
      isRequired: true,
      sortOrder: 2,
      mountPoints: [],
    },
  })

  const frameNode = await prisma.assemblyNode.upsert({
    where: { slug: 'frame' },
    update: {},
    create: {
      name: 'Рама',
      slug: 'frame',
      nodeType: 'FRAME',
      description: 'Рама гриндера',
      isRequired: true,
      sortOrder: 3,
      mountPoints: [],
    },
  })

  console.log('✅ Узлы созданы')

  console.log('\n🔧 Создание компонентов...')

  await prisma.component.create({
    data: {
      name: 'Стандартное основание',
      slug: 'base-standard',
      category: 'BASE',
      description: 'Стандартное стальное основание',
      model3DUrl: '/models/base-standard.glb',
      thumbnailUrl: '/thumbnails/base-standard.png',
      position: [0, -0.5, 0],
      rotation: [0, 0, 0],
      scale: [1, 1, 1],
      specifications: { material: 'Сталь', weight: '25 кг' },
      price: 15000,
      stock: 50,
      active: true,
      isDefault: true,
      sortOrder: 1,
      assemblyNodes: { connect: { id: baseNode.id } },
    },
  })

  await prisma.component.create({
    data: {
      name: 'Усиленное основание',
      slug: 'base-reinforced',
      category: 'BASE',
      description: 'Усиленное основание',
      model3DUrl: '/models/base-reinforced.glb',
      thumbnailUrl: '/thumbnails/base-reinforced.png',
      position: [0, -0.5, 0],
      rotation: [0, 0, 0],
      scale: [1.1, 1, 1.1],
      specifications: { material: 'Сталь 3мм', weight: '35 кг' },
      price: 22000,
      stock: 30,
      active: true,
      isDefault: false,
      sortOrder: 2,
      assemblyNodes: { connect: { id: baseNode.id } },
    },
  })

  await prisma.component.create({
    data: {
      name: 'Двигатель 2 кВт',
      slug: 'motor-2kw',
      category: 'MOTOR',
      description: 'Асинхронный двигатель 2 кВт',
      model3DUrl: '/models/motor-2kw.glb',
      thumbnailUrl: '/thumbnails/motor-2kw.png',
      position: [0, 0.5, 0],
      rotation: [0, 0, 0],
      scale: [1, 1, 1],
      specifications: { power: '2 кВт', rpm: '2800 об/мин', voltage: '380В' },
      price: 35000,
      stock: 20,
      active: true,
      isDefault: true,
      sortOrder: 1,
      assemblyNodes: { connect: { id: motorNode.id } },
    },
  })

  await prisma.component.create({
    data: {
      name: 'Двигатель 3 кВт',
      slug: 'motor-3kw',
      category: 'MOTOR',
      description: 'Асинхронный двигатель 3 кВт',
      model3DUrl: '/models/motor-3kw.glb',
      thumbnailUrl: '/thumbnails/motor-3kw.png',
      position: [0, 0.6, 0],
      rotation: [0, 0, 0],
      scale: [1.1, 1.2, 1.1],
      specifications: { power: '3 кВт', rpm: '3000 об/мин', voltage: '380В' },
      price: 48000,
      stock: 15,
      active: true,
      isDefault: false,
      sortOrder: 2,
      assemblyNodes: { connect: { id: motorNode.id } },
    },
  })

  await prisma.component.create({
    data: {
      name: 'Стандартная рама',
      slug: 'frame-standard',
      category: 'FRAME',
      description: 'Стандартная рама',
      model3DUrl: '/models/frame-standard.glb',
      thumbnailUrl: '/thumbnails/frame-standard.png',
      position: [0, 1, 0],
      rotation: [0, 0, 0],
      scale: [1, 1, 1],
      specifications: { material: 'Сталь', height: '800 мм' },
      price: 25000,
      stock: 25,
      active: true,
      isDefault: true,
      sortOrder: 1,
      assemblyNodes: { connect: { id: frameNode.id } },
    },
  })

  console.log('✅ Компоненты созданы')

  await prisma.grinderConfig.create({
    data: {
      name: 'Базовая конфигурация',
      description: 'Стандартный гриндер',
      configuration: { BASE: 'base-standard', MOTOR: 'motor-2kw', FRAME: 'frame-standard' },
      basePrice: 0,
      componentsTotal: 75000,
      discount: 0,
      totalPrice: 75000,
      isPublic: true,
      isPreset: true,
      isActive: true,
    },
  })

  console.log('✅ Конфигурация создана')
}

main()
  .catch((e) => console.error('❌ Ошибка:', e))
  .finally(async () => prisma.$disconnect())
