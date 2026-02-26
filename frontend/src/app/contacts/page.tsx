import SeoHead from '@/components/seo/SeoHead'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import ContactsPageWrapper from '@/components/wrappers/ContactsPageWrapper'

export default function ContactsPage() {
  const jsonLd = [
    {
      '@context': 'https://schema.org',
      '@type': 'ContactPage',
      name: 'Контакты ГриндерМастер',
      description: 'Контактная информация компании ГриндерМастер',
      url: 'https://grindermaster.ru/contacts'
    },
    {
      '@context': 'https://schema.org',
      '@type': 'LocalBusiness',
      name: 'ГриндерМастер',
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
      ]
    }
  ]

  return (
    <>
      <SeoHead
        title="Контакты | ГриндерМастер"
        description="Контактная информация компании ГриндерМастер. Телефон, адрес, email, часы работы. Свяжитесь с нами для консультации."
        keywords="контакты, телефон, адрес, email, часы работы, ГриндерМастер"
        canonicalUrl="/contacts"
        jsonLd={jsonLd}
      />
      
      <div className="min-h-screen">
        <Header />
        
        <main className="pt-16">
          <ContactsPageWrapper />
        </main>
        
        <Footer />
      </div>
    </>
  )
}
