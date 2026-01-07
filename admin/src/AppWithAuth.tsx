import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { Admin, Resource } from 'react-admin'
import { dataProvider } from './dataProvider'
import { useAuth } from './authMiddleware'
import Login from './Login'
import Dashboard from './Dashboard'
import Analytics from './Analytics'

// Импортируем все компоненты
import { CategoryList } from './components/CategoryList'
import { CategoryEdit } from './components/CategoryEdit'
import { CategoryCreate } from './components/CategoryCreate'
import { ProductList } from './components/ProductList'
import { ProductEdit } from './components/ProductEdit'
import { ProductCreate } from './components/ProductCreate'
import { ProductShow } from './components/ProductShow'
import { ServiceList } from './components/ServiceList'
import { ServiceEdit } from './components/ServiceEdit'
import { ServiceCreate } from './components/ServiceCreate'
import { RequestList } from './components/RequestList'
import { RequestEdit } from './components/RequestEdit'

function ProtectedAdmin() {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        fontSize: '18px'
      }}>
        <div>🔄 Загрузка админ-панели...</div>
      </div>
    )
  }

  if (!user) {
    return <Navigate to="/login" replace />
  }

  return (
    <Admin 
      dataProvider={dataProvider}
      dashboard={Dashboard}
      title="🏭 GrinderMaster - Панель управления"
    >
      {/* Категории */}
      <Resource 
        name="categories" 
        list={CategoryList}
        edit={CategoryEdit}
        create={CategoryCreate}
        options={{ label: '📂 Категории' }}
      />

      {/* Товары */}
      <Resource 
        name="products" 
        list={ProductList}
        edit={ProductEdit}
        create={ProductCreate}
        show={ProductShow}
        options={{ label: '🛍️ Товары' }}
      />

      {/* Услуги */}
      <Resource 
        name="services" 
        list={ServiceList}
        edit={ServiceEdit}
        create={ServiceCreate}
        options={{ label: '🔧 Услуги' }}
      />

      {/* Запросы */}
      <Resource 
        name="requests" 
        list={RequestList}
        edit={RequestEdit}
        options={{ label: '📋 Запросы клиентов' }}
      />

      {/* Аналитика */}
      <Resource 
        name="analytics" 
        list={() => <Analytics />}
        options={{ label: '📊 Аналитика и логи' }}
      />
    </Admin>
  )
}

export default function AppWithAuth() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/*" element={<ProtectedAdmin />} />
      </Routes>
    </Router>
  )
}
