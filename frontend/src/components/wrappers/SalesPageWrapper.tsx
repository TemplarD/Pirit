'use client'

import dynamic from 'next/dynamic'

const SalesContent = dynamic(() => import('@/components/SalesContent'), {
  ssr: false,
  loading: () => <div>Loading...</div>
})

export default function SalesPageWrapper() {
  return <SalesContent />
}
