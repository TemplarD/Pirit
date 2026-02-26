export default function HomePage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          ГриндерМастер
        </h1>
        <p className="text-xl text-gray-700 mb-8">
          Профессиональные гриндеры и услуги ремонта
        </p>
        <div className="space-x-4">
          <a 
            href="/admin" 
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700"
          >
            Админ-панель
          </a>
          <a 
            href="/api/health" 
            className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700"
          >
            API Status
          </a>
        </div>
      </div>
    </div>
  )
}
