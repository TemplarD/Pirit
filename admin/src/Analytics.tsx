import { useState, useEffect } from 'react'
import { 
  Card, 
  CardContent, 
  Typography, 
  Box, 
  Grid, 
  Button, 
  Chip,
  LinearProgress,
  Tab,
  Tabs,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider
} from '@mui/material'
import { 
  BarChart as BarChartIcon,
  Timeline as TimelineIcon,
  Assessment as AssessmentIcon,
  People as PeopleIcon,
  ShoppingCart as ShoppingCartIcon,
  Error as ErrorIcon,
  Computer as ComputerIcon,
  Public as PublicIcon,
  Refresh as RefreshIcon
} from '@mui/icons-material'
import { logVisit, logAction } from './loggingMiddleware'

// Типы для TypeScript
interface Analytics {
  visits: any;
  actions: any;
  errors: any;
  browsers: any;
  os: any;
  hourly?: any[];
  daily?: any[];
}

interface LogEntry {
  id: number;
  type: string;
  action: string;
  userId: string;
  userAgent: string;
  ip: string;
  timestamp: string;
  details: any;
  browser: string;
  os: string;
}

// Компонент для карточки статистики
const StatsCard = ({ title, value, subtitle, icon, color }: any) => {
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
        <Typography variant="caption" color="text.secondary">
          {subtitle}
        </Typography>
      </CardContent>
    </Card>
  )
}

// Компонент для списка логов
const LogsList = ({ logs, title }: { logs: any[], title: string }) => {
  return (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          {title}
        </Typography>
        <List>
          {logs.length === 0 ? (
            <ListItem>
              <ListItemText 
                primary="Нет записей" 
                secondary="Данные отсутствуют"
              />
            </ListItem>
          ) : (
            logs.map((log, index) => (
              <Box key={log.id}>
                <ListItem>
                  <ListItemText
                    primary={
                      <Box display="flex" alignItems="center" gap={1}>
                        <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                          {log.action}
                        </Typography>
                        <Chip 
                          size="small" 
                          label={log.type}
                          color={log.type === 'error' ? 'error' : log.type === 'action' ? 'primary' : 'default'}
                        />
                      </Box>
                    }
                    secondary={
                      <Box>
                        <Typography variant="caption" display="block">
                          {new Date(log.timestamp).toLocaleString('ru-RU')}
                        </Typography>
                        {log.browser && (
                          <Typography variant="caption" display="block" color="text.secondary">
                            Браузер: {log.browser}
                          </Typography>
                        )}
                        {log.os && (
                          <Typography variant="caption" display="block" color="text.secondary">
                            ОС: {log.os}
                          </Typography>
                        )}
                        {log.userId && (
                          <Typography variant="caption" display="block" color="text.secondary">
                            Пользователь: {log.userId}
                          </Typography>
                        )}
                      </Box>
                    }
                  />
                </ListItem>
                {index < logs.length - 1 && <Divider />}
              </Box>
            ))
          )}
        </List>
      </CardContent>
    </Card>
  )
}

// Компонент для статистики браузеров
const BrowserStats = ({ browsers }: { browsers: any }) => {
  // Считаем реальные проценты
  const browserTotal = Object.values(browsers).reduce((sum: number, browser: any) => sum + browser.visits, 0)
  
  return (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          🌐 Статистика браузеров
        </Typography>
        {Object.entries(browsers).map(([browser, data]: [string, any]) => {
          const percentage = browserTotal > 0 ? (data.visits / browserTotal) * 100 : 0
          return (
            <Box key={browser} sx={{ mb: 2 }}>
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                  {browser}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {data.visits} визитов ({percentage.toFixed(1)}%)
                </Typography>
              </Box>
              <LinearProgress 
                variant="determinate" 
                value={percentage}
                sx={{ height: 8, borderRadius: 1 }}
              />
            </Box>
          )
        })}
      </CardContent>
    </Card>
  )
}

// Компонент для статистики ОС
const OSStats = ({ os }: { os: any }) => {
  // Считаем реальные проценты
  const osTotal = Object.values(os).reduce((sum: number, osData: any) => sum + osData.visits, 0)
  
  return (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          💻 Статистика операционных систем
        </Typography>
        {Object.entries(os).map(([osName, data]: [string, any]) => {
          const percentage = osTotal > 0 ? (data.visits / osTotal) * 100 : 0
          return (
            <Box key={osName} sx={{ mb: 2 }}>
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                  {osName}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {data.visits} визитов ({percentage.toFixed(1)}%)
                </Typography>
              </Box>
              <LinearProgress 
                variant="determinate" 
                value={percentage}
                sx={{ height: 8, borderRadius: 1 }}
                color="secondary"
              />
            </Box>
          )
        })}
      </CardContent>
    </Card>
  )
}

// Главная страница аналитики
const AnalyticsPage = () => {
  const [analytics, setAnalytics] = useState<Analytics | null>(null)
  const [logs, setLogs] = useState<LogEntry[]>([])
  const [loading, setLoading] = useState(true)
  const [currentTab, setCurrentTab] = useState(0)

  // Логируем посещение страницы аналитики
  useEffect(() => {
    logVisit('analytics')
    logAction('analytics_page_view', { page: '/analytics' })
  }, [])

  const fetchData = async () => {
    try {
      setLoading(true)
      const [analyticsResponse, logsResponse] = await Promise.all([
        fetch('http://localhost:3004/api/analytics?period=today'),
        fetch('http://localhost:3004/api/logs?limit=20')
      ])

      if (analyticsResponse.ok) {
        const analyticsData = await analyticsResponse.json()
        setAnalytics(analyticsData)
      }

      if (logsResponse.ok) {
        const logsData = await logsResponse.json()
        setLogs(logsData.data || [])
      }
    } catch (error) {
      console.error('Error fetching analytics:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
    const interval = setInterval(fetchData, 30000) // Обновление каждые 30 секунд
    return () => clearInterval(interval)
  }, [])

  if (loading) {
    return (
      <Box sx={{ p: 3, textAlign: 'center' }}>
        <Typography variant="h6">Загрузка аналитики...</Typography>
        <LinearProgress sx={{ mt: 2 }} />
      </Box>
    )
  }

  if (!analytics) {
    return (
      <Box sx={{ p: 3, textAlign: 'center' }}>
        <Typography variant="h6" color="error">
          Не удалось загрузить аналитику
        </Typography>
        <Button onClick={fetchData} sx={{ mt: 2 }}>
          Попробовать снова
        </Button>
      </Box>
    )
  }

  return (
    <Box sx={{ p: 3 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" component="h1">
          📊 Аналитика и статистика
        </Typography>
        <Button 
          variant="contained" 
          startIcon={<RefreshIcon />}
          onClick={fetchData}
        >
          Обновить
        </Button>
      </Box>

      <Tabs value={currentTab} onChange={(e, newValue) => setCurrentTab(newValue)} sx={{ mb: 3 }}>
        <Tab label="Общая статистика" icon={<AssessmentIcon />} />
        <Tab label="Посещения" icon={<PeopleIcon />} />
        <Tab label="Действия" icon={<ShoppingCartIcon />} />
        <Tab label="Ошибки" icon={<ErrorIcon />} />
        <Tab label="Технологии" icon={<ComputerIcon />} />
      </Tabs>

      {currentTab === 0 && (
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6} md={3}>
            <StatsCard
              title="Визиты сегодня"
              value={analytics.visits.today}
              subtitle={`Всего: ${analytics.visits.total}`}
              icon={<PeopleIcon />}
              color="primary"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatsCard
              title="Действия сегодня"
              value={analytics.actions.today}
              subtitle={`Всего: ${analytics.actions.total}`}
              icon={<ShoppingCartIcon />}
              color="secondary"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatsCard
              title="Ошибки сегодня"
              value={analytics.errors.today}
              subtitle={`Всего: ${analytics.errors.total}`}
              icon={<ErrorIcon />}
              color="error"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatsCard
              title="Уникальные пользователи"
              value={analytics.visits.uniqueUsers}
              subtitle="Активные сегодня"
              icon={<PublicIcon />}
              color="info"
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <BrowserStats browsers={analytics.browsers} />
          </Grid>
          <Grid item xs={12} md={6}>
            <OSStats os={analytics.os} />
          </Grid>
        </Grid>
      )}

      {currentTab === 1 && (
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <StatsCard
              title="Визиты сегодня"
              value={analytics.visits.today}
              subtitle={`Всего: ${analytics.visits.total}`}
              icon={<PeopleIcon />}
              color="primary"
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  📈 Детализация посещений
                </Typography>
                <Typography variant="body2">
                  Средняя длительность сессии: {analytics.visits.averageSessionDuration}с
                </Typography>
                <Typography variant="body2">
                  Уникальные пользователи: {analytics.visits.uniqueUsers}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12}>
            <LogsList 
              logs={logs.filter(log => log.type === 'visit')} 
              title="📍 Последние посещения" 
            />
          </Grid>
        </Grid>
      )}

      {currentTab === 2 && (
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <StatsCard
              title="Действия сегодня"
              value={analytics.actions.today}
              subtitle={`Всего: ${analytics.actions.total}`}
              icon={<ShoppingCartIcon />}
              color="secondary"
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  📊 Детализация действий
                </Typography>
                {Object.entries(analytics.actions.byType).map(([type, count]: [string, any]) => (
                  <Typography key={type} variant="body2">
                    {type}: {count}
                  </Typography>
                ))}
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12}>
            <LogsList 
              logs={logs.filter(log => log.type === 'action')} 
              title="🔄 Последние действия" 
            />
          </Grid>
        </Grid>
      )}

      {currentTab === 3 && (
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <StatsCard
              title="Ошибки сегодня"
              value={analytics.errors.today}
              subtitle={`Всего: ${analytics.errors.total}`}
              icon={<ErrorIcon />}
              color="error"
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  ⚠️ Детализация ошибок
                </Typography>
                {Object.entries(analytics.errors.byType).map(([type, count]: [string, any]) => (
                  <Typography key={type} variant="body2">
                    {type}: {count}
                  </Typography>
                ))}
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12}>
            <LogsList 
              logs={logs.filter(log => log.type === 'error')} 
              title="❌ Последние ошибки" 
            />
          </Grid>
        </Grid>
      )}

      {currentTab === 4 && (
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <BrowserStats browsers={analytics.browsers} />
          </Grid>
          <Grid item xs={12} md={6}>
            <OSStats os={analytics.os} />
          </Grid>
        </Grid>
      )}
    </Box>
  )
}

export default AnalyticsPage
