/**
 * Seed данные для компонентов конструктора
 * Запуск: npx tsx prisma/seed-constructor.ts
 */

import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding constructor data...')

  // Создаем узлы сборки
  const baseNode = await prisma.assemblyNode.upsert({
    where: { slug: 'base' },
    update: {},
    create: {
      name: 'Основание',
      slug: 'base',
      nodeType: 'BASE',
      description: 'Основание гриндера - базовый элемент конструкции',
      isRequired: true,
      sortOrder: 1,
      mountPoints: [
        {
          id: 'base-mount-1',
          position: [0, 0, 0],
          rotation: [0, 0, 0],
          nodeType: 'BASE',
          compatibleWith: ['FRAME', 'MOTOR']
        }
      ]
    }
  })

  const motorNode = await prisma.assemblyNode.upsert({
    where: { slug: 'motor' },
    update: {},
    create: {
      name: 'Двигатель',
      slug: 'motor',
      nodeType: 'MOTOR',
      description: 'Электродвигатель для привода гриндера',
      isRequired: true,
      sortOrder: 2,
      mountPoints: []
    }
  })

  const frameNode = await prisma.assemblyNode.upsert({
    where: { slug: 'frame' },
    update: {},
    create: {
      name: 'Рама',
      slug: 'frame',
      nodeType: 'FRAME',
      description: 'Рама для крепления компонентов гриндера',
      isRequired: true,
      sortOrder: 3,
      mountPoints: []
    }
  })

  // Создаем компоненты для основания
  const baseStandard = await prisma.component.create({
    data: {
      name: 'Стандартное основание',
      slug: 'base-standard',
      category: 'BASE',
      description: 'Стандартное стальное основание для гриндера',
      model3DUrl: '/models/base-standard.glb',
      thumbnailUrl: '/thumbnails/base-standard.png',
      position: [0, -0.5, 0],
      rotation: [0, 0, 0],
      scale: [1, 1, 1],
      specifications: {
        material: 'Сталь Ст3',
        weight: '25 кг',
        dimensions: '500x400x50 мм'
      },
      price: 15000,
      stock: 50,
      compatibleWith: [],
      active: true,
      isDefault: true,
      sortOrder: 1,
      assemblyNodes: {
        connect: { id: baseNode.id }
      }
    }
  })

  const baseReinforced = await prisma.component.create({
    data: {
      name: 'Усиленное основание',
      slug: 'base-reinforced',
      category: 'BASE',
      description: 'Усиленное основание для тяжелых условий работы',
      model3DUrl: '/models/base-reinforced.glb',
      thumbnailUrl: '/thumbnails/base-reinforced.png',
      position: [0, -0.5, 0],
      rotation: [0, 0, 0],
      scale: [1.1, 1, 1.1],
      specifications: {
        material: 'Сталь 3мм',
        weight: '35 кг',
        dimensions: '550x450x60 мм'
      },
      price: 22000,
      stock: 30,
      compatibleWith: [],
      active: true,
      isDefault: false,
      sortOrder: 2,
      assemblyNodes: {
        connect: { id: baseNode.id }
      }
    }
  })

  // Создаем компоненты для двигателя
  const motor2kw = await prisma.component.create({
    data: {
      name: 'Двигатель 2 кВт',
      slug: 'motor-2kw',
      category: 'MOTOR',
      description: 'Асинхронный двигатель 2 кВт 2800 об/мин',
      model3DUrl: '/models/motor-2kw.glb',
      thumbnailUrl: '/thumbnails/motor-2kw.png',
      position: [0, 0.5, 0],
      rotation: [0, 0, 0],
      scale: [1, 1, 1],
      specifications: {
        power: '2 кВт',
        rpm: '2800 об/мин',
        voltage: '380В',
        weight: '12 кг'
      },
      price: 35000,
      stock: 20,
      compatibleWith: [],
      active: true,
      isDefault: true,
      sortOrder: 1,
      assemblyNodes: {
        connect: { id: motorNode.id }
      }
    }
  })

  const motor3kw = await prisma.component.create({
    data: {
      name: 'Двигатель 3 кВт',
      slug: 'motor-3kw',
      category: 'MOTOR',
      description: 'Асинхронный двигатель 3 кВт 3000 об/мин',
      model3DUrl: '/models/motor-3kw.glb',
      thumbnailUrl: '/thumbnails/motor-3kw.png',
      position: [0, 0.6, 0],
      rotation: [0, 0, 0],
      scale: [1.1, 1.2, 1.1],
      specifications: {
        power: '3 кВт',
        rpm: '3000 об/мин',
        voltage: '380В',
        weight: '15 кг'
      },
      price: 48000,
      stock: 15,
      compatibleWith: [],
      active: true,
      isDefault: false,
      sortOrder: 2,
      assemblyNodes: {
        connect: { id: motorNode.id }
      }
    }
  })

  // Создаем компоненты для рамы
  const frameStandard = await prisma.component.create({
    data: {
      name: 'Стандартная рама',
      slug: 'frame-standard',
      category: 'FRAME',
      description: 'Стандартная рама для гриндера',
      model3DUrl: '/models/frame-standard.glb',
      thumbnailUrl: '/thumbnails/frame-standard.png',
      position: [0, 1, 0],
      rotation: [0, 0, 0],
      scale: [1, 1, 1],
      specifications: {
        material: 'Сталь',
        height: '800 мм',
        weight: '18 кг'
      },
      price: 25000,
      stock: 25,
      compatibleWith: [],
      active: true,
      isDefault: true,
      sortOrder: 1,
      assemblyNodes: {
        connect: { id: frameNode.id }
      }
    }
  })

  console.log('✅ Seed data created successfully!')
  console.log(`  - Assembly Nodes: 3 (base, motor, frame)`)
  console.log(`  - Components: 5 (${baseStandard.name}, ${baseReinforced.name}, ${motor2kw.name}, ${motor3kw.name}, ${frameStandard.name})`)
}

main()
  .catch((e) => {
    console.error('❌ Seed error:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
