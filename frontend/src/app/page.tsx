import SeoHead from '@/components/seo/SeoHead'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import Preloader from '@/components/ui/Preloader'
import HomePageWrapper from '@/components/wrappers/HomePageWrapper'

export default function HomePage() {
  const jsonLd = [
    {
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
      }
    }
  ]

  return (
    <>
      <Preloader />
      <SeoHead
        title="ГриндерМастер - Профессиональные гриндеры и услуги ремонта"
        description="Продажа и профессиональный ремонт гриндеров и ленточно-шлифовальных станков. Гарантия качества, сервисный центр, доставка по России."
        keywords="гриндер, ленточно-шлифовальный станок, ремонт гриндера, купить гриндер, шлифовальный станок"
        jsonLd={jsonLd}
      />
      
      <div className="min-h-screen bg-white dark:bg-gray-900">
        <Header />
        
        <main className="pt-16">
          <HomePageWrapper />
        </main>
        
        <Footer />
      </div>
    </>
  )
}
