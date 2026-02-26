import SeoHead from '@/components/seo/SeoHead'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import RepairPageWrapper from '@/components/wrappers/RepairPageWrapper'

export default function RepairPage() {
  const jsonLd = [
    {
      '@context': 'https://schema.org',
      '@type': 'ServicePage',
      name: 'Ремонт оборудования | ГриндерМастер',
      description: 'Профессиональный ремонт гриндеров и ленточно-шлифовальных станков. Диагностика, обслуживание, модернизация.',
      url: 'https://grindermaster.ru/repair'
    },
    {
      '@context': 'https://schema.org',
      '@type': 'RepairService',
      name: 'Услуги ремонта ГриндерМастер',
      description: 'Ремонт и обслуживание промышленного оборудования'
    }
  ]

  return (
    <>
      <SeoHead
        title="Ремонт оборудования | ГриндерМастер"
        description="Профессиональный ремонт гриндеров и ленточно-шлифовальных станков. Диагностика, обслуживание, модернизация с гарантией."
        keywords="ремонт гриндера, сервисное обслуживание, диагностика, ремонт станков, ГриндерМастер"
        canonicalUrl="/repair"
        jsonLd={jsonLd}
      />
      
      <div className="min-h-screen">
        <Header />
        
        <main className="pt-16">
          <RepairPageWrapper />
        </main>
        
        <Footer />
      </div>
    </>
  )
}
