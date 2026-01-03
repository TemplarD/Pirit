import { useState, useEffect } from 'react'
import { Card, CardContent, Typography, Box, Button, Grid } from '@mui/material'
import { 
  Refresh as RefreshIcon,
  ShoppingCart as ShoppingCartIcon,
  Build as BuildIcon,
  Category as CategoryIcon,
  SupportAgent as SupportAgentIcon,
  Search as SearchIcon,
  Public as PublicIcon,
  Settings as SettingsIcon
} from '@mui/icons-material'
import { initAdminLogging } from './loggingMiddleware'

// Типы для TypeScript
interface Stats {
  products: number;
  services: number;
  categories: number;
  requests: number;
  seo: number;
  navigation: number;
}

interface TestResults {
  [key: string]: { status: string; error?: string };
}

// Компонент для карточки статистики
const StatsCard = ({ title, value, icon, color }: any) => {
  return (
    <Card sx={{ height: '100%', boxShadow: 2, '&:hover': { boxShadow: 4 } }}>
      <CardContent>
        <Box display="flex" alignItems="center" mb={2}>
          <Box sx={{ 
            bgcolor: `${color}.main`, 
            color: 'white', 
            p: 1, 
            borderRadius: 1, 
            mr: 2 
          }}>
            {icon}
          </Box>
          <Box>
            <Typography variant="h4" component="div" sx={{ fontWeight: 'bold' }}>
              {value}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {title}
            </Typography>
          </Box>
        </Box>
      </CardContent>
    </Card>
  )
}

const Dashboard = () => {
  const [stats, setStats] = useState<Stats>({
    products: 0,
    services: 0,
    categories: 0,
    requests: 0,
    seo: 0,
    navigation: 0
  })
  const [testResults, setTestResults] = useState<TestResults>({})
  const [loading, setLoading] = useState(true)
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null)

  // Загрузка статистики
  const fetchStats = async () => {
    try {
      setLoading(true)
      
      // Загружаем данные с API
      const [
        productsResponse,
        servicesResponse,
        categoriesResponse,
        requestsResponse,
        seoResponse,
        navigationResponse
      ] = await Promise.all([
        fetch('http://localhost:3004/api/products'),
        fetch('http://localhost:3004/api/services'),
        fetch('http://localhost:3004/api/categories'),
        fetch('http://localhost:3004/api/requests'),
        fetch('http://localhost:3004/api/seo'),
        fetch('http://localhost:3004/api/navigation')
      ])

      const newStats: Stats = {
        products: productsResponse.ok ? (await productsResponse.json()).pagination?.total || 0 : 0,
        services: servicesResponse.ok ? (await servicesResponse.json()).pagination?.total || 0 : 0,
        categories: categoriesResponse.ok ? (await categoriesResponse.json()).pagination?.total || 0 : 0,
        requests: requestsResponse.ok ? (await requestsResponse.json()).pagination?.total || 0 : 0,
        seo: seoResponse.ok ? (await seoResponse.json()).pagination?.total || 0 : 0,
        navigation: navigationResponse.ok ? (await navigationResponse.json()).pagination?.total || 0 : 0
      }

      // Проверяем доступность эндпоинтов
      const newTestResults: TestResults = {
        products: { status: productsResponse.ok ? 'OK' : 'ERROR', error: productsResponse.ok ? undefined : 'API недоступен' },
        services: { status: servicesResponse.ok ? 'OK' : 'ERROR', error: servicesResponse.ok ? undefined : 'API недоступен' },
        categories: { status: categoriesResponse.ok ? 'OK' : 'ERROR', error: categoriesResponse.ok ? undefined : 'API недоступен' },
        requests: { status: requestsResponse.ok ? 'OK' : 'ERROR', error: requestsResponse.ok ? undefined : 'API недоступен' },
        seo: { status: seoResponse.ok ? 'OK' : 'ERROR', error: seoResponse.ok ? undefined : 'API недоступен' },
        navigation: { status: navigationResponse.ok ? 'OK' : 'ERROR', error: navigationResponse.ok ? undefined : 'API недоступен' }
      }

      setStats(newStats)
      setTestResults(newTestResults)
      setLastUpdate(new Date())
    } catch (error) {
      console.error('Stats fetch error:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    // Инициализация логирования при первом рендере
    initAdminLogging()
    
    fetchStats()
    const interval = setInterval(fetchStats, 30000) // Обновление каждые 30 секунд
    return () => clearInterval(interval)
  }, [])

  if (loading) {
    return (
      <Box sx={{ p: 3, textAlign: 'center' }}>
        <Typography variant="h6">Загрузка данных...</Typography>
      </Box>
    )
  }

  return (
    <Box sx={{ 
      p: 3, 
      height: 'calc(100vh - 64px)', 
      overflowY: 'auto',
      display: 'flex',
      flexDirection: 'column'
    }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" component="h1">
          🎛️ Панель управления
        </Typography>
        <Box display="flex" alignItems="center" gap={2}>
          <Typography variant="body2" color="text.secondary">
            Последнее обновление: {lastUpdate?.toLocaleTimeString('ru-RU')}
          </Typography>
          <Button 
            variant="contained" 
            startIcon={<RefreshIcon />}
            onClick={fetchStats}
            disabled={loading}
          >
            Обновить
          </Button>
        </Box>
      </Box>

      <Grid container spacing={3} sx={{ flexGrow: 1 }}>
        <Grid item xs={12} sm={6} md={4}>
          <StatsCard
            title="Товары"
            value={stats.products}
            icon={<ShoppingCartIcon />}
            color="primary"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <StatsCard
            title="Услуги"
            value={stats.services}
            icon={<BuildIcon />}
            color="secondary"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <StatsCard
            title="Категории"
            value={stats.categories}
            icon={<CategoryIcon />}
            color="info"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <StatsCard
            title="Запросы"
            value={stats.requests}
            icon={<SupportAgentIcon />}
            color="warning"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <StatsCard
            title="SEO"
            value={stats.seo}
            icon={<SearchIcon />}
            color="success"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <StatsCard
            title="Навигация"
            value={stats.navigation}
            icon={<PublicIcon />}
            color="error"
          />
        </Grid>
      </Grid>

      {/* Статус API */}
      <Box mt={3}>
        <Typography variant="h6" gutterBottom>
          📡 Статус API эндпоинтов
        </Typography>
        <Grid container spacing={2}>
          {Object.entries(testResults).map(([endpoint, result]) => (
            <Grid item xs={12} sm={6} md={4} key={endpoint}>
              <Card sx={{ 
                bgcolor: result.status === 'OK' ? 'success.light' : 'error.light',
                color: result.status === 'OK' ? 'success.contrastText' : 'error.contrastText'
              }}>
                <CardContent sx={{ py: 1 }}>
                  <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                    /api/{endpoint}
                  </Typography>
                  <Typography variant="caption">
                    {result.status}
                    {result.error && `: ${result.error}`}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* Быстрые ссылки */}
      <Box mt={3}>
        <Typography variant="h6" gutterBottom>
          ⚡ Быстрые действия
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6} md={3}>
            <Button 
              variant="outlined" 
              fullWidth 
              startIcon={<ShoppingCartIcon />}
              href="#/products"
            >
              Управление товарами
            </Button>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Button 
              variant="outlined" 
              fullWidth 
              startIcon={<BuildIcon />}
              href="#/services"
            >
              Управление услугами
            </Button>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Button 
              variant="outlined" 
              fullWidth 
              startIcon={<SupportAgentIcon />}
              href="#/requests"
            >
              Запросы клиентов
            </Button>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Button 
              variant="outlined" 
              fullWidth 
              startIcon={<SettingsIcon />}
              href="#/analytics"
            >
              📊 Аналитика
            </Button>
          </Grid>
        </Grid>
      </Box>
    </Box>
  )
}

export default Dashboard
