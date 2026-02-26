'use client'

import { createContext, useContext, useEffect, useState } from 'react'

type Language = 'ru' | 'en'

interface Translations {
  [key: string]: {
    [key in Language]: string
  }
}

const translations: Translations = {
  // Навигация
  'nav.sales': { ru: 'Продажа', en: 'Sales' },
  'nav.repair': { ru: 'Ремонт', en: 'Repair' },
  'nav.contacts': { ru: 'Контакты', en: 'Contacts' },
  
  // Главная страница
  'home.title': { ru: 'ГриндерМастер', en: 'GrinderMaster' },
  'home.subtitle': { ru: 'Профессиональные гриндеры и услуги ремонта', en: 'Professional grinders and repair services' },
  'home.buyGrinder': { ru: 'Купить гриндер', en: 'Buy Grinder' },
  'home.repairEquipment': { ru: 'Ремонт оборудования', en: 'Equipment Repair' },
  'home.whyChooseUs': { ru: 'Почему выбирают нас', en: 'Why Choose Us' },
  'home.qualityGuarantee': { ru: 'Гарантия качества', en: 'Quality Guarantee' },
  'home.qualityDesc': { ru: 'Все оборудование проходит строгий контроль качества перед продажей', en: 'All equipment undergoes strict quality control before sale' },
  'home.fastRepair': { ru: 'Быстрый ремонт', en: 'Fast Repair' },
  'home.repairDesc': { ru: 'Ремонт оборудования в кратчайшие сроки с гарантией', en: 'Equipment repair in the shortest time with warranty' },
  'home.experience': { ru: 'Опыт работы', en: 'Experience' },
  'home.experienceDesc': { ru: 'Более 10 лет на рынке оборудования для обработки металла', en: 'Over 10 years in metal processing equipment market' },
  'home.readyToStart': { ru: 'Готовы начать работу?', en: 'Ready to Start?' },
  'home.contactDesc': { ru: 'Свяжитесь с нами прямо сейчас и получите бесплатную консультацию', en: 'Contact us now and get a free consultation' },
  'home.call': { ru: 'Позвонить', en: 'Call' },
  'home.request': { ru: 'Оставить заявку', en: 'Leave Request' },
  
  // 3D секция
  '3d.title': { ru: '3D модель оборудования', en: '3D Equipment Model' },
  '3d.instruction': { ru: 'Вращайте модель мышкой для детального просмотра', en: 'Rotate the model with mouse for detailed view' },
  
  // Продажа
  'sales.title': { ru: 'Продажа гриндеров', en: 'Grinder Sales' },
  'sales.subtitle': { ru: 'Профессиональное оборудование для обработки металла с гарантией качества', en: 'Professional metal processing equipment with quality guarantee' },
  'sales.categories.all': { ru: 'Все товары', en: 'All Products' },
  'sales.categories.grinders': { ru: 'Гриндеры', en: 'Grinders' },
  'sales.categories.beltSanders': { ru: 'Ленточные шлифовальные станки', en: 'Belt Sanders' },
  'sales.categories.accessories': { ru: 'Аксессуары', en: 'Accessories' },
  'sales.buyButton': { ru: 'Купить', en: 'Buy' },
  'sales.orderFormTitle': { ru: 'Оформить заказ', en: 'Place Order' },
  'sales.form.name': { ru: 'Ваше имя', en: 'Your Name' },
  'sales.form.namePlaceholder': { ru: 'Иван Иванов', en: 'John Smith' },
  'sales.form.phone': { ru: 'Телефон', en: 'Phone' },
  'sales.form.phonePlaceholder': { ru: '+7 (999) 123-45-67', en: '+1 (555) 123-4567' },
  'sales.form.email': { ru: 'Email', en: 'Email' },
  'sales.form.emailPlaceholder': { ru: 'ivan@example.com', en: 'john@example.com' },
  'sales.form.product': { ru: 'Товар', en: 'Product' },
  'sales.form.selectProduct': { ru: 'Выберите товар', en: 'Select product' },
  'sales.form.message': { ru: 'Сообщение', en: 'Message' },
  'sales.form.messagePlaceholder': { ru: 'Дополнительная информация...', en: 'Additional information...' },
  'sales.form.submitButton': { ru: 'Отправить заказ', en: 'Send Order' },
  'sales.advantages.title': { ru: 'Наши преимущества', en: 'Our Advantages' },
  'sales.advantages.quality': { ru: 'Качество', en: 'Quality' },
  'sales.advantages.qualityDesc': { ru: 'Гарантия качества на все оборудование', en: 'Quality guarantee on all equipment' },
  'sales.advantages.delivery': { ru: 'Доставка', en: 'Delivery' },
  'sales.advantages.deliveryDesc': { ru: 'Быстрая доставка по всей России', en: 'Fast delivery across Russia' },
  'sales.advantages.warranty': { ru: 'Гарантия', en: 'Warranty' },
  'sales.advantages.warrantyDesc': { ru: 'Расширенная гарантия на все товары', en: 'Extended warranty on all products' },
  'sales.whyBuy': { ru: 'Почему покупают у нас', en: 'Why Buy From Us' },
  'sales.fastDelivery': { ru: 'Быстрая доставка', en: 'Fast Delivery' },
  'sales.deliveryDesc': { ru: 'Доставка по всей России за 3-7 дней', en: 'Delivery across Russia within 3-7 days' },
  'sales.warranty': { ru: 'Гарантия 2 года', en: '2 Year Warranty' },
  'sales.warrantyDesc': { ru: 'Полное гарантийное обслуживание', en: 'Full warranty service' },
  'sales.installment': { ru: 'Рассрочка', en: 'Installment Plan' },
  'sales.installmentDesc': { ru: 'Удобные условия оплаты', en: 'Convenient payment terms' },
  'sales.training': { ru: 'Обучение', en: 'Training' },
  'sales.trainingDesc': { ru: 'Бесплатное обучение работе', en: 'Free operation training' },
  'sales.calculate': { ru: 'Рассчитать стоимость', en: 'Calculate Cost' },
  'sales.products.grinder2000': { ru: 'Гриндер ГМ-2000 - базовая модель для небольших мастерских', en: 'Grinder GM-2000 - basic model for small workshops' },
  'sales.products.grinder3000': { ru: 'Гриндер ГМ-3000 - профессиональная модель', en: 'Grinder GM-3000 - professional model' },
  'sales.products.beltSander150': { ru: 'Ленточный шлифовальный станок ЛШС-150', en: 'Belt Sander LS-150' },
  'sales.products.accessories': { ru: 'Набор абразивных лент для гриндеров', en: 'Set of abrasive belts for grinders' },
  
  // Ремонт
  'repair.title': { ru: 'Ремонт оборудования', en: 'Equipment Repair' },
  'repair.subtitle': { ru: 'Профессиональный ремонт и обслуживание гриндеров с гарантией качества', en: 'Professional repair and maintenance of grinders with quality guarantee' },
  'repair.services': { ru: 'Наши услуги', en: 'Our Services' },
  'repair.services.all': { ru: 'Все услуги', en: 'All Services' },
  'repair.services.diagnostics': { ru: 'Диагностика', en: 'Diagnostics' },
  'repair.services.maintenance': { ru: 'Обслуживание', en: 'Maintenance' },
  'repair.services.emergency': { ru: 'Экстренный ремонт', en: 'Emergency Repair' },
  'repair.services.modernization': { ru: 'Модернизация', en: 'Modernization' },
  'repair.serviceList.diagnostics.name': { ru: 'Диагностика неисправностей', en: 'Diagnostics' },
  'repair.serviceList.diagnostics.desc': { ru: 'Полная диагностика оборудования с выявлением всех неисправностей', en: 'Complete equipment diagnostics with identification of all faults' },
  'repair.serviceList.maintenance.name': { ru: 'Техническое обслуживание', en: 'Maintenance Service' },
  'repair.serviceList.maintenance.desc': { ru: 'Регулярное обслуживание для продления срока службы', en: 'Regular maintenance to extend service life' },
  'repair.serviceList.emergency.name': { ru: 'Экстренный ремонт', en: 'Emergency Repair' },
  'repair.serviceList.emergency.desc': { ru: 'Срочный ремонт оборудования на вашем объекте', en: 'Urgent equipment repair at your facility' },
  'repair.serviceList.modernization.name': { ru: 'Модернизация', en: 'Modernization' },
  'repair.serviceList.modernization.desc': { ru: 'Обновление оборудования до современных стандартов', en: 'Equipment upgrade to modern standards' },
  'repair.diagnosticsDesc': { ru: 'Полная диагностика оборудования с выявлением всех неисправностей', en: 'Complete equipment diagnostics with identification of all faults' },
  'repair.motorReplacement': { ru: 'Замена двигателя', en: 'Motor Replacement' },
  'repair.motorDesc': { ru: 'Замена и настройка двигателей различной мощности', en: 'Replacement and adjustment of motors of various powers' },
  'repair.balancing': { ru: 'Балансировка', en: 'Balancing' },
  'repair.balancingDesc': { ru: 'Профессиональная балансировка валов и шкивов', en: 'Professional balancing of shafts and pulleys' },
  'repair.settings': { ru: 'Настройка', en: 'Settings' },
  'repair.settingsDesc': { ru: 'Полная настройка и калибровка оборудования', en: 'Complete setup and calibration of equipment' },
  'repair.oilChange': { ru: 'Замена масла', en: 'Oil Change' },
  'repair.oilDesc': { ru: 'Замена технических жидкостей и смазок', en: 'Replacement of technical fluids and lubricants' },
  'repair.warrantyRepair': { ru: 'Гарантийный ремонт', en: 'Warranty Repair' },
  'repair.warrantyRepairDesc': { ru: 'Ремонт оборудования в течение гарантийного периода', en: 'Equipment repair during warranty period' },
  'repair.orderButton': { ru: 'Заказать', en: 'Order' },
  'repair.formTitle': { ru: 'Оставить заявку на ремонт', en: 'Submit Repair Request' },
  'repair.form.name': { ru: 'Ваше имя', en: 'Your Name' },
  'repair.form.namePlaceholder': { ru: 'Иван Иванов', en: 'John Smith' },
  'repair.form.phone': { ru: 'Телефон', en: 'Phone' },
  'repair.form.phonePlaceholder': { ru: '+7 (999) 123-45-67', en: '+1 (555) 123-4567' },
  'repair.form.email': { ru: 'Email', en: 'Email' },
  'repair.form.emailPlaceholder': { ru: 'ivan@example.com', en: 'john@example.com' },
  'repair.form.equipment': { ru: 'Оборудование', en: 'Equipment' },
  'repair.form.equipmentPlaceholder': { ru: 'Модель гриндера...', en: 'Grinder model...' },
  'repair.form.problem': { ru: 'Описание проблемы', en: 'Problem Description' },
  'repair.form.problemPlaceholder': { ru: 'Опишите неисправность...', en: 'Describe the issue...' },
  'repair.form.message': { ru: 'Дополнительная информация', en: 'Additional Information' },
  'repair.form.messagePlaceholder': { ru: 'Комментарии...', en: 'Comments...' },
  'repair.form.submitButton': { ru: 'Отправить заявку', en: 'Send Request' },
  'repair.advantages.title': { ru: 'Наши преимущества', en: 'Our Advantages' },
  'repair.advantages.speed': { ru: 'Скорость', en: 'Speed' },
  'repair.advantages.speedDesc': { ru: 'Быстрое выполнение ремонтных работ', en: 'Fast completion of repair work' },
  'repair.advantages.quality': { ru: 'Качество', en: 'Quality' },
  'repair.advantages.qualityDesc': { ru: 'Гарантия качества на все виды ремонта', en: 'Quality guarantee on all types of repairs' },
  'repair.advantages.warranty': { ru: 'Гарантия', en: 'Warranty' },
  'repair.advantages.warrantyDesc': { ru: 'Гарантия на выполненные работы', en: 'Warranty on work performed' },
  'repair.free': { ru: 'Бесплатно', en: 'Free' },
  'repair.onlineDiagnostics': { ru: 'Онлайн-диагностика', en: 'Online Diagnostics' },
  'repair.equipmentType': { ru: 'Тип оборудования', en: 'Equipment Type' },
  'repair.symptoms': { ru: 'Симптомы неисправности', en: 'Fault Symptoms' },
  'repair.noise': { ru: 'Странный шум при работе', en: 'Strange noise during operation' },
  'repair.vibration': { ru: 'Вибрация', en: 'Vibration' },
  'repair.notStarting': { ru: 'Не включается', en: 'Not starting' },
  'repair.overheating': { ru: 'Перегрев', en: 'Overheating' },
  'repair.poorGrinding': { ru: 'Плохое качество шлифовки', en: 'Poor grinding quality' },
  'repair.yourName': { ru: 'Ваше имя', en: 'Your Name' },
  'repair.phone': { ru: 'Телефон', en: 'Phone' },
  'repair.additionalInfo': { ru: 'Дополнительная информация', en: 'Additional Information' },
  'repair.describeProblem': { ru: 'Опишите проблему подробнее...', en: 'Describe the problem in more detail...' },
  'repair.sendRequest': { ru: 'Отправить заявку', en: 'Send Request' },
  
  // Контакты
  'contacts.title': { ru: 'Контакты', en: 'Contacts' },
  'contacts.subtitle': { ru: 'Свяжитесь с нами для консультации или заказа оборудования', en: 'Contact us for consultation or equipment order' },
  'contacts.contactInfo': { ru: 'Контактная информация', en: 'Contact Information' },
  'contacts.address': { ru: 'Адрес', en: 'Address' },
  'contacts.addressText': { ru: '115088, Москва, Промышленная ул., 15', en: '115088, Moscow, Promyshlennaya St., 15' },
  'contacts.office': { ru: 'Бизнес-центр "Промышленный", офис 305', en: '"Promyshlenny" Business Center, Office 305' },
  'contacts.tel': { ru: 'Телефон', en: 'Phone' },
  'contacts.multiChannel': { ru: 'Многоканальный, с 9:00 до 18:00', en: 'Multi-channel, from 9:00 to 18:00' },
  'contacts.emailDesc': { ru: 'Для писем и коммерческих предложений', en: 'For letters and business proposals' },
  'contacts.hours': { ru: 'Часы работы', en: 'Working Hours' },
  'contacts.hoursText': { ru: 'Пн-Пт: 9:00 - 18:00, Сб: 10:00 - 16:00', en: 'Mon-Fri: 9:00 - 18:00, Sat: 10:00 - 16:00' },
  'contacts.formTitle': { ru: 'Отправить сообщение', en: 'Send Message' },
  'contacts.name': { ru: 'Ваше имя', en: 'Your Name' },
  'contacts.namePlaceholder': { ru: 'Иван Иванов', en: 'John Smith' },
  'contacts.phone': { ru: 'Телефон', en: 'Phone' },
  'contacts.phonePlaceholder': { ru: '+7 (999) 123-45-67', en: '+1 (555) 123-4567' },
  'contacts.email': { ru: 'Email', en: 'Email' },
  'contacts.emailPlaceholder': { ru: 'ivan@example.com', en: 'john@example.com' },
  'contacts.message': { ru: 'Сообщение', en: 'Message' },
  'contacts.messagePlaceholder': { ru: 'Ваше сообщение...', en: 'Your message...' },
  'contacts.sendButton': { ru: 'Отправить', en: 'Send' },
  'contacts.mapTitle': { ru: 'Как нас найти', en: 'How to Find Us' },
  'contacts.mapPlaceholder': { ru: 'Интерактивная карта', en: 'Interactive Map' },
  'contacts.directions': { ru: 'Проезд', en: 'Directions' },
  'contacts.metro': { ru: 'м. Текстильщики, 5 минут пешком', en: 'Tekstilshchiki metro, 5 minutes walk' },
  'contacts.parking': { ru: 'Парковка', en: 'Parking' },
  'contacts.freeParking': { ru: 'Бесплатная на территории бизнес-центра', en: 'Free on business center territory' },
  
  // Футер
  'footer.companyDesc': { ru: 'Профессиональные гриндеры и услуги ремонта. Гарантия качества, сервисный центр, доставка по всей России.', en: 'Professional grinders and repair services. Quality guarantee, service center, delivery across Russia.' },
  'footer.quickRequest': { ru: 'Быстрая заявка', en: 'Quick Request' },
  'footer.yourName': { ru: 'Ваше имя', en: 'Your Name' },
  'footer.phone': { ru: 'Телефон', en: 'Phone' },
  'footer.sendRequest': { ru: 'Отправить заявку', en: 'Send Request' },
  'footer.services': { ru: 'Услуги', en: 'Services' },
  'footer.grinderSales': { ru: 'Продажа гриндеров', en: 'Grinder Sales' },
  'footer.equipmentRepair': { ru: 'Ремонт оборудования', en: 'Equipment Repair' },
  'footer.diagnostics': { ru: 'Диагностика', en: 'Diagnostics' },
  'footer.maintenance': { ru: 'Обслуживание', en: 'Maintenance' },
  'footer.allRights': { ru: 'Все права защищены.', en: 'All rights reserved.' },
  
  // Общие
  'common.from': { ru: 'от', en: 'from' },
  'common.rub': { ru: '₽', en: '₽' },
  'common.loading': { ru: 'Загрузка', en: 'Loading' },
  'common.required': { ru: '*', en: '*' }
}

interface LanguageContextType {
  language: Language
  setLanguage: (lang: Language) => void
  t: (key: string) => string
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useState<Language>('ru')

  useEffect(() => {
    // Получаем язык из cookies или localStorage
    const savedLanguage = (document.cookie
      .split('; ')
      .find(row => row.startsWith('language='))
      ?.split('=')[1] || 
      localStorage.getItem('language') || 
      'ru') as 'ru' | 'en'

    // Устанавливаем язык в состояние через setTimeout для избежания синхронного setState
    const timer = setTimeout(() => {
      setLanguage(savedLanguage)
    }, 0)

    return () => clearTimeout(timer)
  }, [])

  const handleSetLanguage = (lang: Language) => {
    setLanguage(lang)
    
    // Сохраняем в cookies и localStorage
    document.cookie = `language=${lang}; path=/; max-age=31536000; SameSite=Lax`
    localStorage.setItem('language', lang)
  }

  const t = (key: string): string => {
    return translations[key]?.[language] || key
  }

  return (
    <LanguageContext.Provider value={{ language, setLanguage: handleSetLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider')
  }
  return context
}
