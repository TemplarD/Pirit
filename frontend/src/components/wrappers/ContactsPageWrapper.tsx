'use client'

import dynamic from 'next/dynamic'

const ContactsContent = dynamic(() => import('@/components/ContactsContent'), {
  ssr: false,
  loading: () => <div>Loading...</div>
})

export default function ContactsPageWrapper() {
  return <ContactsContent />
}
