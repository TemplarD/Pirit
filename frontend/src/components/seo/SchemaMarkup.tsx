interface SchemaMarkupProps {
  type: 'LocalBusiness' | 'Product' | 'Service' | 'Review' | 'BreadcrumbList'
  data: Record<string, any>
}

export default function SchemaMarkup({ type, data }: SchemaMarkupProps) {
  const schemas: Record<string, Record<string, any>> = {
    LocalBusiness: {
      '@context': 'https://schema.org',
      '@type': 'LocalBusiness',
      name: 'ГриндерМастер',
      description: 'Продажа и профессиональный ремонт гриндеров и ленточно-шлифовальных станков',
      url: 'https://grindermaster.ru',
      telephone: '+7-495-123-4567',
      email: 'info@grindermaster.ru',
      address: {
        '@type': 'PostalAddress',
        streetAddress: 'Промышленная ул., 15',
        addressLocality: 'Москва',
        addressRegion: 'Московская область',
        postalCode: '115088',
        addressCountry: 'RU'
      },
      geo: {
        '@type': 'GeoCoordinates',
        latitude: '55.7204',
        longitude: '37.6694'
      },
      openingHours: [
        'Mo-Fr 09:00-18:00',
        'Sa 10:00-16:00'
      ],
      priceRange: '₽₽₽',
      paymentAccepted: ['Наличные', 'Безналичный расчет', 'Перевод'],
      currenciesAccepted: 'RUB',
      ...data
    },
    
    Product: {
      '@context': 'https://schema.org',
      '@type': 'Product',
      brand: {
        '@type': 'Brand',
        name: 'ГриндерМастер'
      },
      ...data
    },
    
    Service: {
      '@context': 'https://schema.org',
      '@type': 'Service',
      provider: {
        '@type': 'Organization',
        name: 'ГриндерМастер'
      },
      ...data
    },
    
    Review: {
      '@context': 'https://schema.org',
      '@type': 'Review',
      itemReviewed: {
        '@type': 'Organization',
        name: 'ГриндерМастер'
      },
      ...data
    },
    
    BreadcrumbList: {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      ...data
    }
  }

  const schema = schemas[type]
  
  if (!schema) {
    return null
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}
