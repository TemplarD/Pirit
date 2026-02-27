'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion } from 'framer-motion'
import { useLanguage } from '@/contexts/LanguageContext'
import { api, Product, Category } from '@/lib/api'

export default function SalesContent() {
  const { t } = useLanguage()
  
  // Состояния
  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [totalProducts, setTotalProducts] = useState(0)
  
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    product: '',
    message: ''
  })

  // Загрузка данных
  const loadData = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      
      // Загружаем товары и категории параллельно
      const [productsResponse, categoriesResponse] = await Promise.all([
        api.products.getAll({
          page: currentPage,
          limit: 12,
          category: selectedCategory !== 'all' ? selectedCategory : undefined
        }),
        api.categories.getAll()
      ])
      
      setProducts(productsResponse.data)
      setCategories(categoriesResponse.data)
      setTotalPages(productsResponse.pagination.pages)
      setTotalProducts(productsResponse.pagination.total)
    } catch (err) {
      console.error('Failed to load products:', err)
      setError('Не удалось загрузить товары. Попробуйте позже.')
    } finally {
      setLoading(false)
    }
  }, [currentPage, selectedCategory])

  useEffect(() => {
    loadData()
  }, [loadData])

  // Категории для фильтра
  const filterCategories = [
    { id: 'all', name: 'Все товары' },
    ...categories.map(cat => ({ id: cat.slug, name: cat.name }))
  ]

  // Обработчики
  const handleCategoryChange = (categoryId: string) => {
    setSelectedCategory(categoryId)
    setCurrentPage(1) // Сброс на первую страницу
  }

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const [submitting, setSubmitting] = useState(false)
  const [submitResult, setSubmitResult] = useState<{ success?: boolean; error?: string } | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    setSubmitResult(null)

    try {
      // Находим товар по имени
      const selectedProduct = products.find(p => p.name === formData.product)
      
      await api.requests.create({
        name: formData.name,
        phone: formData.phone,
        email: formData.email || undefined,
        type: 'PRODUCT',
        productId: selectedProduct?.id,
        message: formData.message || undefined,
      })

      setSubmitResult({ success: true })
      setFormData({
        name: '',
        phone: '',
        email: '',
        product: '',
        message: ''
      })

      // Скрываем сообщение через 5 секунд
      setTimeout(() => setSubmitResult(null), 5000)
    } catch (error) {
      console.error('Failed to submit request:', error)
      setSubmitResult({ 
        error: error instanceof Error ? error.message : 'Ошибка при отправке заявки' 
      })
    } finally {
      setSubmitting(false)
    }
  }

  const handleBuyClick = (product: any) => {
    // Заполняем форму данными о товаре
    setFormData(prev => ({
      ...prev,
      product: product.name
    }))
    
    // Прокручиваем к форме заказа
    const formElement = document.getElementById('order-form')
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

  // Форматирование цены
  const formatPrice = (price: number | string) => {
    if (typeof price === 'number') {
      return new Intl.NumberFormat('ru-RU', {
        style: 'currency',
        currency: 'RUB',
        minimumFractionDigits: 0
      }).format(price)
    }
    return price
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
              {t('sales.title')}
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              {t('sales.subtitle')}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Каталог */}
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
              {filterCategories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => handleCategoryChange(category.id)}
                  className={`px-6 py-3 rounded-lg font-medium transition-colors ${
                    selectedCategory === category.id
                      ? 'bg-primary-600 text-white'
                      : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600'
                  }`}
                >
                  {category.name}
                </button>
              ))}
            </div>
          </motion.div>

          {/* Загрузка / Ошибка */}
          {loading && (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
              <p className="mt-4 text-gray-600 dark:text-gray-300">Загрузка товаров...</p>
            </div>
          )}

          {error && (
            <div className="text-center py-12">
              <div className="text-red-600 dark:text-red-400 text-lg">{error}</div>
            </div>
          )}

          {/* Товары */}
          {!loading && !error && (
            <>
              {products.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-gray-600 dark:text-gray-300 text-lg">
                    Товары в данной категории отсутствуют
                  </p>
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                    {products.map((product, index) => (
                      <motion.div
                        key={product.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.3 + index * 0.1 }}
                        className="bg-white dark:bg-gray-900 rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
                      >
                        <div className="aspect-w-16 aspect-h-12 bg-gray-200 dark:bg-gray-700">
                          <img
                            src={product.imageUrl || '/api/placeholder/300/200'}
                            alt={product.name}
                            className="w-full h-48 object-cover"
                          />
                        </div>
                        <div className="p-6">
                          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                            {product.name}
                          </h3>
                          <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-2">
                            {product.description}
                          </p>
                          <div className="flex items-center justify-between">
                            <span className="text-2xl font-bold text-primary-600 dark:text-primary-400">
                              {formatPrice(product.price)}
                            </span>
                            <button
                              onClick={() => handleBuyClick(product)}
                              className="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition-all transform hover:scale-105 active:scale-95"
                            >
                              {t('sales.buyButton')}
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>

                  {/* Пагинация */}
                  {totalPages > 1 && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: 0.5 }}
                      className="mt-12 flex justify-center items-center gap-2"
                    >
                      <button
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                        className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 dark:hover:bg-gray-700"
                      >
                        Назад
                      </button>
                      
                      <span className="px-4 py-2 text-gray-600 dark:text-gray-300">
                        Страница {currentPage} из {totalPages} ({totalProducts} товаров)
                      </span>
                      
                      <button
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 dark:hover:bg-gray-700"
                      >
                        Вперёд
                      </button>
                    </motion.div>
                  )}
                </>
              )}
            </>
          )}
        </div>
      </section>

      {/* Форма заказа */}
      <section className="py-16 bg-white dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="max-w-2xl mx-auto"
          >
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8 text-center">
              {t('sales.orderFormTitle')}
            </h2>
            
            <form onSubmit={handleSubmit} id="order-form" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    {t('sales.form.name')}
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    placeholder={t('sales.form.namePlaceholder')}
                  />
                </div>

                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    {t('sales.form.phone')}
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    placeholder={t('sales.form.phonePlaceholder')}
                  />
                </div>
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {t('sales.form.email')}
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder={t('sales.form.emailPlaceholder')}
                />
              </div>

              <div>
                <label htmlFor="product" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {t('sales.form.product')}
                </label>
                <select
                  id="product"
                  name="product"
                  value={formData.product}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                >
                  <option value="">{t('sales.form.selectProduct')}</option>
                  {products.map((product) => (
                    <option key={product.id} value={product.name}>
                      {product.name} - {product.price}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {t('sales.form.message')}
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder={t('sales.form.messagePlaceholder')}
                />
              </div>

              {/* Сообщение об успехе/ошибке */}
              {submitResult && (
                <div className={`p-4 rounded-lg ${
                  submitResult.success 
                    ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200' 
                    : 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200'
                }`}>
                  {submitResult.success 
                    ? '✅ Заказ успешно отправлен! Менеджер свяжется с вами в ближайшее время.' 
                    : `❌ ${submitResult.error}`
                  }
                </div>
              )}

              <button
                type="submit"
                disabled={submitting}
                className="w-full px-8 py-4 bg-primary-600 hover:bg-primary-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white rounded-lg transition-colors font-semibold flex items-center justify-center gap-2"
              >
                {submitting ? (
                  <>
                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Отправка...
                  </>
                ) : (
                  t('sales.form.submitButton')
                )}
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
              {t('sales.advantages.title')}
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-primary-100 dark:bg-primary-900 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-primary-600 dark:text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">
                  {t('sales.advantages.quality')}
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  {t('sales.advantages.qualityDesc')}
                </p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-primary-100 dark:bg-primary-900 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-primary-600 dark:text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">
                  {t('sales.advantages.delivery')}
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  {t('sales.advantages.deliveryDesc')}
                </p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-primary-100 dark:bg-primary-900 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-primary-600 dark:text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">
                  {t('sales.advantages.warranty')}
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  {t('sales.advantages.warrantyDesc')}
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </>
  )
}
