import dynamic from 'next/dynamic'

const GrinderConstructor2D = dynamic(
  () => import('@/components/3d/GrinderConstructor2D'),
  { ssr: false, loading: () => <div className="h-screen flex items-center justify-center">Загрузка 2D конструктора...</div> }
)

export default function ConstructorPage() {
  return <GrinderConstructor2D />
}
