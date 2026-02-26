import { PrismaClient } from '@prisma/client'
import * as bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Начинаем заполнение базы данных...')

  // Создаем категории
  console.log('📂 Создание категорий...')
  const categories = await Promise.all([
    prisma.category.upsert({
      where: { slug: 'grinders' },
      update: {},
      create: {
        name: 'Гриндеры',
        slug: 'grinders',
        description: 'Промышленные гриндеры для металлообработки'
      }
    }),
    prisma.category.upsert({
      where: { slug: 'belt-sanders' },
      update: {},
      create: {
        name: 'Ленточные шлифовальные станки',
        slug: 'belt-sanders',
        description: 'Ленточные шлифовальные станки для обработки поверхностей'
      }
    }),
    prisma.category.upsert({
      where: { slug: 'accessories' },
      update: {},
      create: {
        name: 'Аксессуары',
        slug: 'accessories',
        description: 'Запасные части и аксессуары для оборудования'
      }
    })
  ])

  console.log('✅ Категории созданы:', categories.map(c => c.name))

  // Создаем товары (4 товара как требуется)
  console.log('🛍️ Создание товаров...')
  const products = await Promise.all([
    // Гриндер ГМ-2000
    prisma.product.upsert({
      where: { slug: 'grinder-gm-2000' },
      update: {},
      create: {
        name: 'Гриндер ГМ-2000',
        slug: 'grinder-gm-2000',
        description: 'Промышленный гриндер для тяжелых условий работы. Мощность 2 кВт, скорость вращения 2800 об/мин.',
        price: 149000,
        categoryId: categories[0].id,
        imageUrl: null,
        specifications: {
          power: '2 кВт',
          speed: '2800 об/мин',
          weight: '45 кг',
          dimensions: '600x400x500 мм'
        },
        featured: true,
        active: true,
        displayOnSite: true,
        sortOrder: 1
      }
    }),
    // Гриндер ГМ-3000
    prisma.product.upsert({
      where: { slug: 'grinder-gm-3000' },
      update: {},
      create: {
        name: 'Гриндер ГМ-3000',
        slug: 'grinder-gm-3000',
        description: 'Мощный промышленный гриндер для профессионального использования. Мощность 3 кВт, скорость вращения 3000 об/мин.',
        price: 199000,
        categoryId: categories[0].id,
        imageUrl: null,
        specifications: {
          power: '3 кВт',
          speed: '3000 об/мин',
          weight: '55 кг',
          dimensions: '700x450x550 мм'
        },
        featured: true,
        active: true,
        displayOnSite: true,
        sortOrder: 2
      }
    }),
    // Ленточный шлифовальный станок ЛШС-150
    prisma.product.upsert({
      where: { slug: 'belt-sander-lshs-150' },
      update: {},
      create: {
        name: 'Ленточный шлифовальный станок ЛШС-150',
        slug: 'belt-sander-lshs-150',
        description: 'Профессиональный ленточный шлифовальный станок для обработки больших поверхностей.',
        price: 249000,
        categoryId: categories[1].id,
        imageUrl: null,
        specifications: {
          power: '4 кВт',
          beltSize: '150x2000 мм',
          speed: '15 м/с',
          weight: '85 кг'
        },
        featured: false,
        active: true,
        displayOnSite: true,
        sortOrder: 3
      }
    }),
    // Набор абразивных лент
    prisma.product.upsert({
      where: { slug: 'abrasive-belts-set' },
      update: {},
      create: {
        name: 'Набор абразивных лент',
        slug: 'abrasive-belts-set',
        description: 'Комплект абразивных лент для шлифовальных станков. 50 штук различной зернистости.',
        price: 12000,
        categoryId: categories[2].id,
        imageUrl: null,
        specifications: {
          quantity: '50 шт',
          grits: 'P40, P60, P80, P120, P180',
          dimensions: '150x2000 мм',
          material: 'Алюминиевый оксид'
        },
        featured: false,
        active: true,
        displayOnSite: true,
        sortOrder: 4
      }
    })
  ])

  console.log('✅ Товары созданы:', products.map(p => p.name))

  // Создаем услуги (4 услуги как требуется)
  console.log('🔧 Создание услуг...')
  const services = await Promise.all([
    // Диагностика оборудования
    prisma.service.upsert({
      where: { slug: 'equipment-diagnostics' },
      update: {},
      create: {
        name: 'Диагностика оборудования',
        slug: 'equipment-diagnostics',
        description: 'Полная диагностика промышленного оборудования с выдачей заключения о состоянии и рекомендациями.',
        price: 'от 5000 руб.',
        category: 'diagnostics',
        icon: 'diagnostics',
        duration: '1-2 часа',
        warranty: false,
        featured: true,
        active: true,
        displayOnSite: true,
        sortOrder: 1
      }
    }),
    // Техническое обслуживание
    prisma.service.upsert({
      where: { slug: 'maintenance-service' },
      update: {},
      create: {
        name: 'Техническое обслуживание',
        slug: 'maintenance-service',
        description: 'Регулярное техническое обслуживание оборудования для prolongation срока службы.',
        price: 'от 8000 руб.',
        category: 'maintenance',
        icon: 'maintenance',
        duration: '2-4 часа',
        warranty: true,
        featured: false,
        active: true,
        displayOnSite: true,
        sortOrder: 2
      }
    }),
    // Экстренный выезд
    prisma.service.upsert({
      where: { slug: 'emergency' },
      update: {},
      create: {
        name: 'Экстренный выезд',
        slug: 'emergency',
        description: 'Экстренный выезд специалиста на объект для срочного ремонта оборудования.',
        price: 'от 15000 руб.',
        category: 'emergency',
        icon: 'emergency',
        duration: '2-6 часов',
        warranty: true,
        featured: false,
        active: true,
        displayOnSite: true,
        sortOrder: 3
      }
    }),
    // Модернизация оборудования
    prisma.service.upsert({
      where: { slug: 'modernization-service' },
      update: {},
      create: {
        name: 'Модернизация оборудования',
        slug: 'modernization-service',
        description: 'Модернизация и обновление промышленного оборудования с установкой современных компонентов.',
        price: 'от 20000 руб.',
        category: 'modernization',
        icon: 'upgrade',
        duration: '4-8 часов',
        warranty: true,
        featured: false,
        active: true,
        displayOnSite: true,
        sortOrder: 4
      }
    })
  ])

  console.log('✅ Услуги созданы:', services.map(s => s.name))

  // Создаем администратора
  console.log('👤 Создание администратора...')
  const hashedPassword = await bcrypt.hash('admin123', 12)
  
  const admin = await prisma.user.upsert({
    where: { email: 'admin@grindermaster.ru' },
    update: {},
    create: {
      email: 'admin@grindermaster.ru',
      name: 'Administrator',
      role: 'ADMIN',
      passwordHash: hashedPassword,
      telegramId: null // Пока не привязан
    }
  })

  console.log('✅ Администратор создан:', admin.email)

  // Создаем тестовые запросы
  console.log('📋 Создание тестовых запросов...')
  const requests = await Promise.all([
    prisma.request.upsert({
      where: { id: 'test-request-1' },
      update: {},
      create: {
        id: 'test-request-1',
        name: 'Иван Петров',
        phone: '+7 (999) 123-45-67',
        email: 'ivan.petrov@example.com',
        type: 'PRODUCT',
        productId: products[0].id,
        message: 'Интересует гриндер ГМ-2000, нужна консультация по доставке в Москву.',
        status: 'NEW'
      }
    }),
    prisma.request.upsert({
      where: { id: 'test-request-2' },
      update: {},
      create: {
        id: 'test-request-2',
        name: 'Мария Сидорова',
        phone: '+7 (999) 987-65-43',
        email: 'maria.sidorova@example.com',
        type: 'SERVICE',
        serviceId: services[0].id,
        message: 'Нужна диагностика ленточного станка. Находится в Санкт-Петербурге.',
        status: 'PROCESSING'
      }
    })
  ])

  console.log('✅ Тестовые запросы созданы:', requests.length)

  // Создаем настройки TwoFactorAuth для администратора
  console.log('🔐 Настройка двухфакторной аутентификации...')
  const crypto = require('crypto')
  const googleAuthSecret = crypto.randomBytes(16).toString('base64').replace(/[^a-zA-Z0-9]/g, '').substring(0, 16)
  const backupCodes = Array.from({ length: 10 }, () => Math.floor(10000000 + Math.random() * 90000000).toString())

  await prisma.twoFactorAuth.upsert({
    where: { userId: admin.id },
    update: {},
    create: {
      userId: admin.id,
      email: admin.email,
      secret: googleAuthSecret,
      backupCodes: backupCodes,
      isEnabled: false // По умолчанию выключено
    }
  })

  console.log('✅ Двухфакторная аутентификация настроена')
  console.log('🎉 База данных успешно заполнена!')
  console.log('')
  console.log('📊 Итоги:')
  console.log(`   - Категорий: ${categories.length}`)
  console.log(`   - Товаров: ${products.length}`)
  console.log(`   - Услуг: ${services.length}`)
  console.log(`   - Запросов: ${requests.length}`)
  console.log(`   - Администратор: ${admin.email}`)
  console.log('')
  console.log('🔑 Данные для входа:')
  console.log('   Email: admin@grindermaster.ru')
  console.log('   Пароль: admin123')
  console.log('')
  console.log('📱 Google Authenticator секрет (для настройки):', googleAuthSecret)
  console.log('📱 Backup коды:', backupCodes.join(', '))
}

main()
  .catch((e) => {
    console.error('❌ Ошибка при заполнении базы данных:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
