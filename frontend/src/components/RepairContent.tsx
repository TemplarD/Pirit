'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { useLanguage } from '@/contexts/LanguageContext'

export default function RepairContent() {
  const { t } = useLanguage()
  const [selectedService, setSelectedService] = useState('all')
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    equipment: '',
    problem: '',
    message: ''
  })

  const services = [
    { id: 'all', name: t('repair.services.all') },
    { id: 'diagnostics', name: t('repair.services.diagnostics') },
    { id: 'maintenance', name: t('repair.services.maintenance') },
    { id: 'emergency', name: t('repair.services.emergency') },
    { id: 'modernization', name: t('repair.services.modernization') }
  ]

  const serviceList = [
    {
      id: 'diagnostics',
      name: t('repair.serviceList.diagnostics.name'),
      description: t('repair.serviceList.diagnostics.desc'),
      price: 'от 5 000 ₽',
      icon: '🔍'
    },
    {
      id: 'maintenance',
      name: t('repair.serviceList.maintenance.name'),
      description: t('repair.serviceList.maintenance.desc'),
      price: 'от 8 000 ₽',
      icon: '🔧'
    },
    {
      id: 'emergency',
      name: t('repair.serviceList.emergency.name'),
      description: t('repair.serviceList.emergency.desc'),
      price: 'от 15 000 ₽',
      icon: '🚨'
    },
    {
      id: 'modernization',
      name: t('repair.serviceList.modernization.name'),
      description: t('repair.serviceList.modernization.desc'),
      price: 'от 20 000 ₽',
      icon: '⚡'
    }
  ]

  const filteredServices = selectedService === 'all' 
    ? serviceList 
    : serviceList.filter(s => s.id === selectedService)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log('Form submitted:', formData)
    // Логика отправки формы
  }

  const handleOrderClick = (service: any) => {
    // Заполняем форму данными об услуге
    setFormData(prev => ({
      ...prev,
      equipment: service.name
    }))
    
    // Прокручиваем к форме заказа
    const formElement = document.getElementById('repair-form')
    if (formElement) {
      formElement.scrollIntoView({ behavior: 'smooth' })
    }
    
    // Анимация кнопки
    const button = event?.target as HTMLElement
    if (button) {
      button.classList.add('scale-95')
      setTimeout(() => button.classList.remove('scale-95'), 150)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }

  return (
    <>
      {/* Заголовок страницы */}
      <section className="py-16 bg-white dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-4xl mx-auto"
          >
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
              {t('repair.title')}
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              {t('repair.subtitle')}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Услуги */}
      <section className="py-16 bg-gray-50 dark:bg-gray-800">
        <div className="container mx-auto px-4">
          {/* Фильтры */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mb-12"
          >
            <div className="flex flex-wrap gap-4 justify-center">
              {services.map((service) => (
                <button
                  key={service.id}
                  onClick={() => setSelectedService(service.id)}
                  className={`px-6 py-3 rounded-lg font-medium transition-colors ${
                    selectedService === service.id
                      ? 'bg-primary-600 text-white'
                      : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600'
                  }`}
                >
                  {service.name}
                </button>
              ))}
            </div>
          </motion.div>

          {/* Список услуг */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {filteredServices.map((service, index) => (
              <motion.div
                key={service.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 + index * 0.1 }}
                className="bg-white dark:bg-gray-900 rounded-lg shadow-lg p-8 hover:shadow-xl transition-shadow"
              >
                <div className="flex items-start space-x-4">
                  <div className="text-4xl mb-4">{service.icon}</div>
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                      {service.name}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300 mb-4">
                      {service.description}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-2xl font-bold text-primary-600 dark:text-primary-400">
                        {service.price}
                      </span>
                      <button 
                        onClick={() => handleOrderClick(service)}
                        className="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition-all transform hover:scale-105 active:scale-95"
                      >
                        {t('repair.orderButton')}
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Форма заявки */}
      <section className="py-16 bg-white dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="max-w-2xl mx-auto"
          >
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8 text-center">
              {t('repair.formTitle')}
            </h2>
            
            <form onSubmit={handleSubmit} id="repair-form" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    {t('repair.form.name')}
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    placeholder={t('repair.form.namePlaceholder')}
                  />
                </div>

                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    {t('repair.form.phone')}
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    placeholder={t('repair.form.phonePlaceholder')}
                  />
                </div>
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {t('repair.form.email')}
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder={t('repair.form.emailPlaceholder')}
                />
              </div>

              <div>
                <label htmlFor="equipment" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {t('repair.form.equipment')}
                </label>
                <input
                  type="text"
                  id="equipment"
                  name="equipment"
                  value={formData.equipment}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder={t('repair.form.equipmentPlaceholder')}
                />
              </div>

              <div>
                <label htmlFor="problem" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {t('repair.form.problem')}
                </label>
                <textarea
                  id="problem"
                  name="problem"
                  value={formData.problem}
                  onChange={handleChange}
                  required
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder={t('repair.form.problemPlaceholder')}
                />
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {t('repair.form.message')}
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder={t('repair.form.messagePlaceholder')}
                />
              </div>

              <button
                type="submit"
                className="w-full px-8 py-4 bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition-colors font-semibold"
              >
                {t('repair.form.submitButton')}
              </button>
            </form>
          </motion.div>
        </div>
      </section>

      {/* Преимущества */}
      <section className="py-16 bg-gray-50 dark:bg-gray-800">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1 }}
            className="text-center"
          >
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-12">
              {t('repair.advantages.title')}
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-primary-100 dark:bg-primary-900 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-primary-600 dark:text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">
                  {t('repair.advantages.speed')}
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  {t('repair.advantages.speedDesc')}
                </p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-primary-100 dark:bg-primary-900 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-primary-600 dark:text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">
                  {t('repair.advantages.quality')}
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  {t('repair.advantages.qualityDesc')}
                </p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-primary-100 dark:bg-primary-900 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-primary-600 dark:text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">
                  {t('repair.advantages.warranty')}
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  {t('repair.advantages.warrantyDesc')}
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </>
  )
}
