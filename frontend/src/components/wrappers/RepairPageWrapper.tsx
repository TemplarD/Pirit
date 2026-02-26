'use client'

import dynamic from 'next/dynamic'

const RepairContent = dynamic(() => import('@/components/RepairContent'), {
  ssr: false,
  loading: () => <div>Loading...</div>
})

export default function RepairPageWrapper() {
  return <RepairContent />
}
