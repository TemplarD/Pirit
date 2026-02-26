import SeoHead from '@/components/seo/SeoHead'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import SalesPageWrapper from '@/components/wrappers/SalesPageWrapper'

export default function SalesPage() {
  const jsonLd = [
    {
      '@context': 'https://schema.org',
      '@type': 'CollectionPage',
      name: 'Продажа гриндеров | ГриндерМастер',
      description: 'Каталог гриндеров и ленточно-шлифовальных станков. Профессиональное оборудование для обработки металла.',
      url: 'https://grindermaster.ru/sales'
    },
    {
      '@context': 'https://schema.org',
      '@type': 'ProductCatalog',
      name: 'Каталог оборудования ГриндерМастер',
      description: 'Профессиональные гриндеры и ленточно-шлифовальные станки'
    }
  ]

  return (
    <>
      <SeoHead
        title="Продажа гриндеров | ГриндерМастер"
        description="Каталог гриндеров и ленточно-шлифовальных станков. Профессиональное оборудование для обработки металла с доставкой по России."
        keywords="купить гриндер, продажа гриндеров, ленточно-шлифовальный станок, оборудование для металла"
        canonicalUrl="/sales"
        jsonLd={jsonLd}
      />
      
      <div className="min-h-screen">
        <Header />
        
        <main className="pt-16">
          <SalesPageWrapper />
        </main>
        
        <Footer />
      </div>
    </>
  )
}
