import Head from 'next/head'

interface SeoHeadProps {
  title?: string
  description?: string
  keywords?: string
  ogImage?: string
  ogType?: string
  canonicalUrl?: string
  noindex?: boolean
  jsonLd?: Record<string, any>[]
}

export default function SeoHead({
  title = 'ГриндерМастер - Профессиональные гриндеры и услуги ремонта',
  description = 'Продажа и профессиональный ремонт гриндеров и ленточно-шлифовальных станков. Гарантия качества, сервисный центр, доставка по России.',
  keywords = 'гриндер, ленточно-шлифовальный станок, ремонт гриндера, купить гриндер, шлифовальный станок',
  ogImage,
  ogType = 'website',
  canonicalUrl,
  noindex = false,
  jsonLd = []
}: SeoHeadProps) {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://grindermaster.ru'
  const fullCanonicalUrl = canonicalUrl ? `${siteUrl}${canonicalUrl}` : siteUrl
  const fullOgImage = ogImage ? `${siteUrl}${ogImage}` : `${siteUrl}/images/og-default.jpg`

  return (
    <Head>
      {/* Базовые мета-теги */}
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <meta name="author" content="ГриндерМастер" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      
      {/* Canonical URL */}
      <link rel="canonical" href={fullCanonicalUrl} />
      
      {/* Robots */}
      {noindex && <meta name="robots" content="noindex, nofollow" />}
      
      {/* Open Graph */}
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content={ogType} />
      <meta property="og:url" content={fullCanonicalUrl} />
      <meta property="og:image" content={fullOgImage} />
      <meta property="og:site_name" content="ГриндерМастер" />
      <meta property="og:locale" content="ru_RU" />
      
      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={fullOgImage} />
      
      {/* JSON-LD структурированные данные */}
      {jsonLd.map((schema, index) => (
        <script
          key={index}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      ))}
      
      {/* Фавикон */}
      <link rel="icon" href="/favicon.ico" />
      <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
      <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
      <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
    </Head>
  )
}
