import { useState, useEffect } from 'react'
import { Card, CardContent, Typography, Box, Button, Grid, useTheme } from '@mui/material'
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

// Кастомные компоненты для красивого UI
interface CustomCardProps {
  children: React.ReactNode;
  title: string;
  icon: React.ReactNode;
  color?: 'primary' | 'secondary' | 'info' | 'warning' | 'success' | 'error';
}

const CustomCard = ({ children, title, icon, color = 'primary' }: CustomCardProps) => {
  const theme = useTheme()
  
  return (
    <Card 
      sx={{ 
        mb: 2, 
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        borderRadius: 2,
        background: '#ffffff',
        border: '1px solid rgba(0, 0, 0, 0.06)',
        transition: 'all 0.2s ease-in-out',
        '&:hover': {
          boxShadow: '0 4px 16px rgba(0,0,0,0.12)',
          transform: 'translateY(-1px)',
        },
        height: '100%',
        display: 'flex',
        flexDirection: 'column'
      }}
    >
      <CardContent sx={{ pb: 2, flex: 1 }}>
        <Box display="flex" alignItems="center" mb={1.5}>
          <Box 
            sx={{ 
              bgcolor: `${color}.main`, 
              mr: 1.5, 
              width: 32, 
              height: 32, 
              borderRadius: '50%', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center', 
              color: 'white',
              fontSize: '16px'
            }}
          >
            {icon}
          </Box>
          <Typography 
            variant="h6" 
            component="div" 
            sx={{ 
              fontSize: { xs: '0.9rem', sm: '1rem' },
              fontWeight: 600,
              color: '#333333'
            }}
          >
            {title}
          </Typography>
        </Box>
        {children}
      </CardContent>
    </Card>
  )
}

// Главная панель дашборда
const Dashboard = () => {
  const [stats, setStats] = useState<Stats>({
    products: 0,
    services: 0,
    categories: 0,
    requests: 0,
    seo: 0,
    navigation: 0
  })
  const [loading, setLoading] = useState(true)
  const [lastUpdate, setLastUpdate] = useState(new Date())
  const [testResults, setTestResults] = useState<TestResults>({})
  const [logs, setLogs] = useState<LogEntry[]>([])
  const [analytics, setAnalytics] = useState<Analytics | null>(null)
  const [currentTab, setCurrentTab] = useState(0)

  // Загрузка логов
  const fetchLogs = async () => {
    try {
      const response = await fetch('http://localhost:3004/api/logs?limit=10')
      if (response.ok) {
        const data = await response.json()
        setLogs(data.data || [])
        console.log('Logs loaded:', data.data?.length || 0)
      } else {
        console.error('Failed to fetch logs:', response.status)
      }
    } catch (error) {
      console.error('Error fetching logs:', error)
    }
  }

  // Загрузка аналитики
  const fetchAnalytics = async () => {
    try {
      const response = await fetch('http://localhost:3004/api/analytics?period=today')
      if (response.ok) {
        const data = await response.json()
        setAnalytics(data)
        console.log('Analytics loaded:', data)
      } else {
        console.error('Failed to fetch analytics:', response.status)
      }
    } catch (error) {
      console.error('Error fetching analytics:', error)
    }
  }

  // Загрузка статистики
  const fetchStats = async () => {
    try {
      // Загружаем все данные параллельно
      await Promise.all([
        fetchStatsData(),
        fetchLogs(),
        fetchAnalytics()
      ])
    } catch (error) {
      console.error('Dashboard fetch error:', error)
    } finally {
      setLoading(false)
    }
  }

  // Загрузка только статистики
  const fetchStatsData = async () => {
    try {
      const endpoints = [
        { key: 'products', url: '/products' },
        { key: 'services', url: '/services' },
        { key: 'categories', url: '/categories' },
        { key: 'requests', url: '/requests' },
        { key: 'seo', url: '/seo' },
        { key: 'navigation', url: '/navigation' }
      ]

      const newStats = { ...stats }
      const newTestResults = { ...testResults }

      for (const endpoint of endpoints) {
        try {
          const response = await fetch(`http://localhost:3004/api${endpoint.url}`)
          if (response.ok) {
            const data = await response.json()
            const count = data.pagination?.total || data.data?.length || 0
            newStats[endpoint.key as keyof Stats] = count
            newTestResults[endpoint.url] = { status: 'success' }
          } else {
            newTestResults[endpoint.url] = { status: 'error', error: `HTTP ${response.status}` }
          }
        } catch (err) {
          console.error(`Error fetching ${endpoint.url}:`, err)
          newTestResults[endpoint.url] = { status: 'error', error: 'Network error' }
        }
      }

      setStats(newStats)
      setTestResults(newTestResults)
      setLastUpdate(new Date())
    } catch (error) {
      console.error('Stats fetch error:', error)
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
      p: { xs: 2, sm: 3 },
      maxWidth: '100%',
      overflowX: 'hidden',
      overflowY: 'auto',
      height: 'calc(100vh - 64px)', // Вычитаем высоту хедера
      display: 'flex',
      flexDirection: 'column'
    }}>
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        mb: 3,
        flexWrap: 'wrap',
        gap: 2
      }}>
        <Typography variant="h4" component="h1" sx={{ 
          fontSize: { xs: '1.5rem', sm: '1.75rem', md: '2rem' },
          fontWeight: 600,
          color: '#1976d2'
        }}>
          Панель управления
        </Typography>
        <Button 
          variant="contained" 
          startIcon={<RefreshIcon />}
          onClick={fetchStats}
          size="small"
          sx={{ 
            minWidth: 'auto',
            px: 2
          }}
        >
          Обновить
        </Button>
      </Box>

      <Typography variant="caption" color="text.secondary" sx={{ mb: 3, display: 'block' }}>
        Последнее обновление: {lastUpdate.toLocaleString('ru-RU')}
      </Typography>
      
      <Grid container spacing={{ xs: 2, sm: 3 }}>
        <Grid item xs={12} sm={6} md={4} lg={2}>
          <CustomCard title="Товары" icon={<ShoppingCartIcon />} color="primary">
            <Typography variant="h3" sx={{ fontWeight: 'bold', color: 'primary.main', fontSize: { xs: '1.5rem', sm: '2rem', md: '2.5rem' } }}>
              {stats.products}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Всего товаров
            </Typography>
          </CustomCard>
        </Grid>
        
        <Grid item xs={12} sm={6} md={4} lg={2}>
          <CustomCard title="Услуги" icon={<BuildIcon />} color="secondary">
            <Typography variant="h3" sx={{ fontWeight: 'bold', color: 'secondary.main', fontSize: { xs: '1.5rem', sm: '2rem', md: '2.5rem' } }}>
              {stats.services}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Всего услуг
            </Typography>
          </CustomCard>
        </Grid>
        
        <Grid item xs={12} sm={6} md={4} lg={2}>
          <CustomCard title="Категории" icon={<CategoryIcon />} color="info">
            <Typography variant="h3" sx={{ fontWeight: 'bold', color: 'info.main', fontSize: { xs: '1.5rem', sm: '2rem', md: '2.5rem' } }}>
              {stats.categories}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Всего категорий
            </Typography>
          </CustomCard>
        </Grid>
        
        <Grid item xs={12} sm={6} md={4} lg={2}>
          <CustomCard title="Заявки" icon={<SupportAgentIcon />} color="warning">
            <Typography variant="h3" sx={{ fontWeight: 'bold', color: 'warning.main', fontSize: { xs: '1.5rem', sm: '2rem', md: '2.5rem' } }}>
              {stats.requests}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Всего заявок
            </Typography>
          </CustomCard>
        </Grid>
        
        <Grid item xs={12} sm={6} md={4} lg={2}>
          <CustomCard title="SEO" icon={<SearchIcon />} color="success">
            <Typography variant="h3" sx={{ fontWeight: 'bold', color: 'success.main', fontSize: { xs: '1.5rem', sm: '2rem', md: '2.5rem' } }}>
              {stats.seo}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              SEO настроек
            </Typography>
          </CustomCard>
        </Grid>
        
        <Grid item xs={12} sm={6} md={4} lg={2}>
          <CustomCard title="Навигация" icon={<PublicIcon />} color="error">
            <Typography variant="h3" sx={{ fontWeight: 'bold', color: 'error.main', fontSize: { xs: '1.5rem', sm: '2rem', md: '2.5rem' } }}>
              {stats.navigation}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Пунктов меню
            </Typography>
          </CustomCard>
        </Grid>
      </Grid>

      <Box sx={{ mt: 4 }}>
        <Typography variant="h5" gutterBottom={2}>
          Тестирование API
        </Typography>
        
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Автоматические результаты тестирования:
        </Typography>
        
        <Grid container spacing={{ xs: 1, sm: 2 }}>
          <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
            <CustomCard title="Health Check" icon={<SettingsIcon />} color="primary">
              <Typography variant="body2" sx={{ color: testResults['/health']?.status === 'success' ? 'success.main' : testResults['/health']?.status === 'error' ? 'error.main' : 'grey.500', fontWeight: 'bold' }}>
                {testResults['/health']?.status === 'success' ? '✅' : testResults['/health']?.status === 'error' ? '❌' : '⏸️'}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ fontSize: { xs: '0.7rem', sm: '0.75rem' } }}>
                {testResults['/health']?.status === 'success' ? 'Работает' : testResults['/health']?.status === 'error' ? 'Ошибка' : 'Тест...'}
              </Typography>
            </CustomCard>
          </Grid>
          
          <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
            <CustomCard title="Товары" icon={<ShoppingCartIcon />} color="primary">
              <Typography variant="body2" sx={{ color: testResults['/products']?.status === 'success' ? 'success.main' : testResults['/products']?.status === 'error' ? 'error.main' : 'grey.500', fontWeight: 'bold' }}>
                {testResults['/products']?.status === 'success' ? '✅' : testResults['/products']?.status === 'error' ? '❌' : '⏸️'}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ fontSize: { xs: '0.7rem', sm: '0.75rem' } }}>
                {testResults['/products']?.status === 'success' ? 'Работает' : testResults['/products']?.status === 'error' ? 'Ошибка' : 'Тест...'}
              </Typography>
            </CustomCard>
          </Grid>
          
          <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
            <CustomCard title="Услуги" icon={<BuildIcon />} color="primary">
              <Typography variant="body2" sx={{ color: testResults['/services']?.status === 'success' ? 'success.main' : testResults['/services']?.status === 'error' ? 'error.main' : 'grey.500', fontWeight: 'bold' }}>
                {testResults['/services']?.status === 'success' ? '✅' : testResults['/services']?.status === 'error' ? '❌' : '⏸️'}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ fontSize: { xs: '0.7rem', sm: '0.75rem' } }}>
                {testResults['/services']?.status === 'success' ? 'Работает' : testResults['/services']?.status === 'error' ? 'Ошибка' : 'Тест...'}
              </Typography>
            </CustomCard>
          </Grid>
          
          <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
            <CustomCard title="Категории" icon={<CategoryIcon />} color="primary">
              <Typography variant="body2" sx={{ color: testResults['/categories']?.status === 'success' ? 'success.main' : testResults['/categories']?.status === 'error' ? 'error.main' : 'grey.500', fontWeight: 'bold' }}>
                {testResults['/categories']?.status === 'success' ? '✅' : testResults['/categories']?.status === 'error' ? '❌' : '⏸️'}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ fontSize: { xs: '0.7rem', sm: '0.75rem' } }}>
                {testResults['/categories']?.status === 'success' ? 'Работает' : testResults['/categories']?.status === 'error' ? 'Ошибка' : 'Тест...'}
              </Typography>
            </CustomCard>
          </Grid>
          
          <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
            <CustomCard title="Заявки" icon={<SupportAgentIcon />} color="primary">
              <Typography variant="body2" sx={{ color: testResults['/requests']?.status === 'success' ? 'success.main' : testResults['/requests']?.status === 'error' ? 'error.main' : 'grey.500', fontWeight: 'bold' }}>
                {testResults['/requests']?.status === 'success' ? '✅' : testResults['/requests']?.status === 'error' ? '❌' : '⏸️'}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ fontSize: { xs: '0.7rem', sm: '0.75rem' } }}>
                {testResults['/requests']?.status === 'success' ? 'Работает' : testResults['/requests']?.status === 'error' ? 'Ошибка' : 'Тест...'}
              </Typography>
            </CustomCard>
          </Grid>
          
          <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
            <CustomCard title="SEO" icon={<SearchIcon />} color="primary">
              <Typography variant="body2" sx={{ color: testResults['/seo']?.status === 'success' ? 'success.main' : testResults['/seo']?.status === 'error' ? 'error.main' : 'grey.500', fontWeight: 'bold' }}>
                {testResults['/seo']?.status === 'success' ? '✅' : testResults['/seo']?.status === 'error' ? '❌' : '⏸️'}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ fontSize: { xs: '0.7rem', sm: '0.75rem' } }}>
                {testResults['/seo']?.status === 'success' ? 'Работает' : testResults['/seo']?.status === 'error' ? 'Ошибка' : 'Тест...'}
              </Typography>
            </CustomCard>
          </Grid>
          
          <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
            <CustomCard title="Навигация" icon={<PublicIcon />} color="primary">
              <Typography variant="body2" sx={{ color: testResults['/navigation']?.status === 'success' ? 'success.main' : testResults['/navigation']?.status === 'error' ? 'error.main' : 'grey.500', fontWeight: 'bold' }}>
                {testResults['/navigation']?.status === 'success' ? '✅' : testResults['/navigation']?.status === 'error' ? '❌' : '⏸️'}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ fontSize: { xs: '0.7rem', sm: '0.75rem' } }}>
                {testResults['/navigation']?.status === 'success' ? 'Работает' : testResults['/navigation']?.status === 'error' ? 'Ошибка' : 'Тестирует...'}
              </Typography>
            </CustomCard>
          </Grid>
        </Grid>
      </Box>

      {/* История действий и аналитика */}
      <Box sx={{ mt: 4 }}>
        <Typography variant="h5" gutterBottom={2}>
          📊 История действий и аналитика
        </Typography>
        
        <Tabs value={currentTab} onChange={(e, newValue) => setCurrentTab(newValue)} sx={{ mb: 3 }}>
          <Tab label="Последние действия" icon={<HistoryIcon />} iconPosition="start" />
          <Tab label="Аналитика" icon={<AnalyticsIcon />} iconPosition="start" />
          <Tab label="Статистика браузеров" icon={<TimelineIcon />} iconPosition="start" />
        </Tabs>

        {currentTab === 0 && (
          <Grid container spacing={2}>
            {logs.slice(0, 5).map((log) => (
              <Grid item xs={12} sm={6} md={4} key={log.id}>
                <CustomCard title={log.action} icon={<HistoryIcon />} color={log.type === 'error' ? 'error' : log.type === 'action' ? 'warning' : 'info'}>
                  <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.75rem' }}>
                    {log.userId} • {log.browser}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.7rem' }}>
                    {new Date(log.timestamp).toLocaleString('ru-RU')}
                  </Typography>
                  <Box sx={{ mt: 1 }}>
                    <Chip 
                      label={log.type} 
                      size="small" 
                      color={log.type === 'error' ? 'error' : log.type === 'action' ? 'warning' : 'info'}
                      sx={{ fontSize: '0.7rem', height: '20px' }}
                    />
                  </Box>
                </CustomCard>
              </Grid>
            ))}
          </Grid>
        )}

        {currentTab === 1 && analytics && (
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6} md={3}>
              <CustomCard title="Визиты сегодня" icon={<AnalyticsIcon />} color="primary">
                <Typography variant="h4" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
                  {analytics.visits.today}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Всего: {analytics.visits.total}
                </Typography>
              </CustomCard>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <CustomCard title="Действия сегодня" icon={<TimelineIcon />} color="secondary">
                <Typography variant="h4" sx={{ fontWeight: 'bold', color: 'secondary.main' }}>
                  {analytics.actions.today}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Всего: {analytics.actions.total}
                </Typography>
              </CustomCard>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <CustomCard title="Ошибки сегодня" icon={<SettingsIcon />} color="error">
                <Typography variant="h4" sx={{ fontWeight: 'bold', color: 'error.main' }}>
                  {analytics.errors.today}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Всего: {analytics.errors.total}
                </Typography>
              </CustomCard>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <CustomCard title="Уникальные пользователи" icon={<PublicIcon />} color="info">
                <Typography variant="h4" sx={{ fontWeight: 'bold', color: 'info.main' }}>
                  {analytics.visits.uniqueUsers}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Активные сегодня
                </Typography>
              </CustomCard>
            </Grid>
          </Grid>
        )}

        {currentTab === 2 && analytics && (
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <Typography variant="h6" gutterBottom>
                🌐 По браузерам
              </Typography>
              {Object.entries(analytics.browsers).map(([browser, data]: [string, any]) => (
                <Box key={browser} sx={{ mb: 2 }}>
                  <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                    {browser}: {data.visits} визитов
                  </Typography>
                  <Box sx={{ width: '100%', bgcolor: 'grey.200', borderRadius: 1, height: 8 }}>
                    <Box 
                      sx={{ 
                        width: `${(data.visits / analytics.visits.total) * 100}%`, 
                        bgcolor: 'primary.main', 
                        height: '100%', 
                        borderRadius: 1 
                      }} 
                    />
                  </Box>
                </Box>
              ))}
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography variant="h6" gutterBottom>
                💻 По операционным системам
              </Typography>
              {Object.entries(analytics.os).map(([os, data]: [string, any]) => (
                <Box key={os} sx={{ mb: 2 }}>
                  <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                    {os}: {data.visits} визитов
                  </Typography>
                  <Box sx={{ width: '100%', bgcolor: 'grey.200', borderRadius: 1, height: 8 }}>
                    <Box 
                      sx={{ 
                        width: `${(data.visits / analytics.visits.total) * 100}%`, 
                        bgcolor: 'secondary.main', 
                        height: '100%', 
                        borderRadius: 1 
                      }} 
                    />
                  </Box>
                </Box>
              ))}
            </Grid>
          </Grid>
        )}
      </Box>
    </Box>
  )
}

export default Dashboard
