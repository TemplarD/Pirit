'use client'

import dynamic from 'next/dynamic'

const HomePageContent = dynamic(() => import('@/components/HomePageContent'), {
  ssr: false,
  loading: () => <div>Loading...</div>
})

export default function HomePageWrapper() {
  return <HomePageContent />
}
