import { Admin, Resource, List, Datagrid, Edit, Create, SimpleForm, 
  DateField, TextField, ReferenceField, ReferenceInput, SelectInput, BooleanField, BooleanInput, NumberField, NumberInput,
  ImageInput, RichTextInput, FunctionField, useNotify, useRecordContext, 
  TextInput, ColorInput, ArrayInput, FormDataConsumer } from 'react-admin'
import { dataProvider } from './dataProvider'
import Dashboard from './Dashboard'
import { Card, CardContent, Typography, Box, Chip, IconButton, Tooltip, Avatar, 
  Alert, Snackbar, Button, Stack, Grid, Tabs, Tab, Paper, Switch, FormControlLabel, 
  Divider, Accordion, AccordionSummary, AccordionDetails, Slider, LinearProgress } from '@mui/material'
import { 
  Edit as EditIcon, 
  Delete as DeleteIcon, 
  Add as AddIcon, 
  Visibility as VisibilityIcon,
  Image as ImageIcon,
  Category as CategoryIcon,
  Build as BuildIcon,
  Settings as SettingsIcon,
  ShoppingCart as ShoppingCartIcon,
  SupportAgent as SupportAgentIcon,
  Assessment as AssessmentIcon,
  Refresh as RefreshIcon,
  ExpandMore as ExpandMoreIcon,
  Palette as PaletteIcon,
  TextFields as TextFieldsIcon,
  Brush as BrushIcon,
  Style as StyleIcon,
  Search as SearchIcon,
  Language as LanguageIcon,
  Public as PublicIcon,
  Description as DescriptionIcon
} from '@mui/icons-material'
import { useState, useEffect } from 'react'

// Кастомные компоненты для красивого UI
const CustomCard = ({ children, title, icon, color = 'primary' }) => (
  <Card sx={{ mb: 2, boxShadow: 2, borderRadius: 2 }}>
    <CardContent sx={{ pb: 2 }}>
      <Box display="flex" alignItems="center" mb={1.5}>
        <Avatar sx={{ bgcolor: `${color}.main`, mr: 1.5, width: 32, height: 32 }}>
          {icon}
        </Avatar>
        <Typography variant="h6" component="div" sx={{ fontSize: '1rem' }}>
          {title}
        </Typography>
      </Box>
      {children}
    </CardContent>
  </Card>
)

// API тестер для всех кнопок
const APITester = ({ endpoint, label, icon, onTest }) => {
  const [status, setStatus] = useState('idle')
  const [response, setResponse] = useState(null)
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)
  const notify = useNotify()

  const testAPI = async () => {
    setLoading(true)
    setStatus('testing')
    setError(null)
    setResponse(null)

    try {
      const response = await fetch(`http://localhost:3009/api${endpoint}`)
      const data = await response.json()
      
      if (response.ok) {
        setStatus('success')
        setResponse(data)
        notify(`${label}: ✅ API работает!`, { type: 'success' })
        if (onTest) onTest(data)
      } else {
        throw new Error(data.error || 'API ошибка')
      }
    } catch (err) {
      setStatus('error')
      setError(err.message)
      notify(`${label}: ❌ Ошибка API - ${err.message}`, { type: 'error' })
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = () => {
    switch (status) {
      case 'success': return 'success.main'
      case 'error': return 'error.main'
      case 'testing': return 'warning.main'
      default: return 'grey.500'
    }
  }

  const getStatusIcon = () => {
    switch (status) {
      case 'success': return '✅'
      case 'error': return '❌'
      case 'testing': return '🔄'
      default: return '⏸️'
    }
  }

  return (
    <CustomCard title={label} icon={icon} color="primary">
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="body2" sx={{ color: getStatusColor(), fontWeight: 'bold', mr: 1 }}>
          {getStatusIcon()}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {status === 'success' ? 'Работает' : status === 'error' ? 'Ошибка' : status === 'testing' ? 'Тест...' : 'Не тестировано'}
        </Typography>
      </Box>
      
      <Button 
        variant="contained" 
        size="small" 
        onClick={testAPI}
        disabled={loading}
        startIcon={loading ? <LinearProgress sx={{ width: 20 }} /> : null}
        sx={{ 
          borderRadius: '8px',
          boxShadow: 1,
          bgcolor: 'primary.main',
          '&:hover': { bgcolor: 'primary.dark' },
          minWidth: 'auto',
          px: 1.5,
          py: 0.5,
          fontSize: '0.75rem',
          textTransform: 'none',
          fontWeight: 'bold'
        }}
      >
        {loading ? 'Тест...' : 'Тест API'}
      </Button>
      
      {response && (
        <Alert severity="success" sx={{ mt: 1 }}>
          <Typography variant="caption">
            Статус: {response.status || 'OK'}
          </Typography>
          {response.timestamp && (
            <Typography variant="caption" sx={{ display: 'block' }}>
              Время: {new Date(response.timestamp).toLocaleString('ru-RU')}
            </Typography>
          )}
        </Alert>
      )}
      
      {error && (
        <Alert severity="error" sx={{ mt: 1 }}>
          <Typography variant="caption">
            {error}
          </Typography>
        </Alert>
      )}
    </CustomCard>
  )
}

// Главная панель дашборда
const Dashboard = () => {
  const [stats, setStats] = useState({
    products: 0,
    services: 0,
    categories: 0,
    requests: 0,
    seo: 0,
    navigation: 0
  })
  const [lastUpdate, setLastUpdate] = useState(new Date())
  const [apiResults, setApiResults] = useState({})
  const [testResults, setTestResults] = useState({})

  const loadStats = async () => {
    try {
      const endpoints = ['/products', '/services', '/categories', '/requests', '/seo', '/navigation']
      const results = {}
      
      for (const endpoint of endpoints) {
        try {
          const response = await fetch(`http://localhost:3009/api${endpoint}`)
          const data = await response.json()
          results[endpoint] = data
        } catch (err) {
          results[endpoint] = { error: err.message }
        }
      }
      
      setApiResults(results)
      setStats({
        products: results['/products']?.pagination?.total || results['/products']?.data?.length || 0,
        services: results['/services']?.pagination?.total || results['/services']?.data?.length || 0,
        categories: results['/categories']?.data?.length || 0,
        requests: results['/requests']?.pagination?.total || results['/requests']?.data?.length || 0,
        seo: results['/seo']?.data?.length || 0,
        navigation: results['/navigation']?.data?.length || 0
      })
      setLastUpdate(new Date())
    } catch (error) {
      console.error('Ошибка загрузки статистики:', error)
    }
  }

  // Автоматическое тестирование всех API при загрузке
  useEffect(() => {
    const testAllAPIs = async () => {
      const endpoints = [
        { endpoint: '/health', label: 'Health Check' },
        { endpoint: '/products', label: 'Товары' },
        { endpoint: '/services', label: 'Услуги' },
        { endpoint: '/categories', label: 'Категории' },
        { endpoint: '/requests', label: 'Заявки' },
        { endpoint: '/seo', label: 'SEO' },
        { endpoint: '/navigation', label: 'Навигация' }
      ]
      
      const results = {}
      
      for (const { endpoint, label } of endpoints) {
        try {
          const response = await fetch(`http://localhost:3009/api${endpoint}`)
          const data = await response.json()
          results[endpoint] = { status: 'success', data, label }
          console.log(`✅ ${label}: API работает`)
        } catch (err) {
          results[endpoint] = { status: 'error', error: err.message, label }
          console.log(`❌ ${label}: Ошибка - ${err.message}`)
        }
      }
      
      setTestResults(results)
    }
    
    testAllAPIs()
    loadStats()
    
    // Обновляем статистику каждые 30 секунд
    const interval = setInterval(() => {
      loadStats()
      testAllAPIs()
    }, 30000)
    
    return () => clearInterval(interval)
  }, [])

  return (
    <>
      <Box sx={{ p: 3, position: 'relative' }}>
      <Box sx={{ position: 'fixed', bottom: 12, left: 12, zIndex: 1000 }}>
        <Button 
          variant="contained" 
          startIcon={<RefreshIcon />}
          onClick={() => {
            loadStats()
            const testAllAPIs = async () => {
              const endpoints = [
                { endpoint: '/health', label: 'Health Check' },
                { endpoint: '/products', label: 'Товары' },
                { endpoint: '/services', label: 'Услуги' },
                { endpoint: '/categories', label: 'Категории' },
                { endpoint: '/requests', label: 'Заявки' },
                { endpoint: '/seo', label: 'SEO' },
                { endpoint: '/navigation', label: 'Навигация' }
              ]
              
              const results = {}
              
              for (const { endpoint, label } of endpoints) {
                try {
                  const response = await fetch(`http://localhost:3009/api${endpoint}`)
                  const data = await response.json()
                  results[endpoint] = { status: 'success', data, label }
                  console.log(`✅ ${label}: API работает`)
                } catch (err) {
                  results[endpoint] = { status: 'error', error: err.message, label }
                  console.log(`❌ ${label}: Ошибка - ${err.message}`)
                }
              }
              
              setTestResults(results)
            }}
          }}
          size="small"
          sx={{ 
            borderRadius: '8px',
            boxShadow: 1,
            bgcolor: 'primary.main',
            '&:hover': { bgcolor: 'primary.dark' },
            minWidth: 'auto',
            px: 1.5,
            py: 0.5,
            fontSize: '0.75rem',
            textTransform: 'none',
            fontWeight: 'bold'
          }}
        >
          Обновить
        </Button>
      </Box>

      <Typography variant="h4" gutterBottom={3}>
        📊 Панель управления
      </Typography>
      
      <Typography variant="caption" color="text.secondary" sx={{ mb: 3, display: 'block' }}>
        Последнее обновление: {lastUpdate.toLocaleString('ru-RU')}
      </Typography>
      
      <Grid container spacing={3}>
        <Grid item xs={12} sm={6} md={2}>
          <CustomCard title="Товары" icon={<ShoppingCartIcon />} color="primary">
            <Typography variant="h3" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
              {stats.products}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Всего товаров
            </Typography>
          </CustomCard>
        </Grid>
        
        <Grid item xs={12} sm={6} md={2}>
          <CustomCard title="Услуги" icon={<BuildIcon />} color="secondary">
            <Typography variant="h3" sx={{ fontWeight: 'bold', color: 'secondary.main' }}>
              {stats.services}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Всего услуг
            </Typography>
          </CustomCard>
        </Grid>
        
        <Grid item xs={12} sm={6} md={2}>
          <CustomCard title="Категории" icon={<CategoryIcon />} color="info">
            <Typography variant="h3" sx={{ fontWeight: 'bold', color: 'info.main' }}>
              {stats.categories}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Всего категорий
            </Typography>
          </CustomCard>
        </Grid>
        
        <Grid item xs={12} sm={6} md={2}>
          <CustomCard title="Заявки" icon={<SupportAgentIcon />} color="warning">
            <Typography variant="h3" sx={{ fontWeight: 'bold', color: 'warning.main' }}>
              {stats.requests}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Всего заявок
            </Typography>
          </CustomCard>
        </Grid>
        
        <Grid item xs={12} sm={6} md={2}>
          <CustomCard title="SEO" icon={<SearchIcon />} color="success">
            <Typography variant="h3" sx={{ fontWeight: 'bold', color: 'success.main' }}>
              {stats.seo}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              SEO настроек
            </Typography>
          </CustomCard>
        </Grid>
        
        <Grid item xs={12} sm={6} md={2}>
          <CustomCard title="Навигация" icon={<PublicIcon />} color="error">
            <Typography variant="h3" sx={{ fontWeight: 'bold', color: 'error.main' }}>
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
          🧪 Тестирование API
        </Typography>
        
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Автоматические результаты тестирования:
        </Typography>
        
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6} md={2}>
            <CustomCard title="Health Check" icon={<SettingsIcon />} color="primary">
              <Typography variant="body2" sx={{ color: testResults['/health']?.status === 'success' ? 'success.main' : testResults['/health']?.status === 'error' ? 'error.main' : 'grey.500', fontWeight: 'bold' }}>
                {testResults['/health']?.status === 'success' ? '✅' : testResults['/health']?.status === 'error' ? '❌' : '⏸️'}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {testResults['/health']?.status === 'success' ? 'Работает' : testResults['/health']?.status === 'error' ? 'Ошибка' : 'Тест...'}
              </Typography>
            </CustomCard>
          </Grid>
          
          <Grid item xs={12} sm={6} md={2}>
            <CustomCard title="Товары" icon={<ShoppingCartIcon />} color="primary">
              <Typography variant="body2" sx={{ color: testResults['/products']?.status === 'success' ? 'success.main' : testResults['/products']?.status === 'error' ? 'error.main' : 'grey.500', fontWeight: 'bold' }}>
                {testResults['/products']?.status === 'success' ? '✅' : testResults['/products']?.status === 'error' ? '❌' : '⏸️'}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {testResults['/products']?.status === 'success' ? 'Работает' : testResults['/products']?.status === 'error' ? 'Ошибка' : 'Тест...'}
              </Typography>
            </CustomCard>
          </Grid>
          
          <Grid item xs={12} sm={6} md={2}>
            <CustomCard title="Услуги" icon={<BuildIcon />} color="primary">
              <Typography variant="body2" sx={{ color: testResults['/services']?.status === 'success' ? 'success.main' : testResults['/services']?.status === 'error' ? 'error.main' : 'grey.500', fontWeight: 'bold' }}>
                {testResults['/services']?.status === 'success' ? '✅' : testResults['/services']?.status === 'error' ? '❌' : '⏸️'}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {testResults['/services']?.status === 'success' ? 'Работает' : testResults['/services']?.status === 'error' ? 'Ошибка' : 'Тест...'}
              </Typography>
            </CustomCard>
          </Grid>
          
          <Grid item xs={12} sm={6} md={2}>
            <CustomCard title="Категории" icon={<CategoryIcon />} color="primary">
              <Typography variant="body2" sx={{ color: testResults['/categories']?.status === 'success' ? 'success.main' : testResults['/categories']?.status === 'error' ? 'error.main' : 'grey.500', fontWeight: 'bold' }}>
                {testResults['/categories']?.status === 'success' ? '✅' : testResults['/categories']?.status === 'error' ? '❌' : '⏸️'}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {testResults['/categories']?.status === 'success' ? 'Работает' : testResults['/categories']?.status === 'error' ? 'Ошибка' : 'Тест...'}
              </Typography>
            </CustomCard>
          </Grid>
          
          <Grid item xs={12} sm={6} md={2}>
            <CustomCard title="Заявки" icon={<SupportAgentIcon />} color="primary">
              <Typography variant="body2" sx={{ color: testResults['/requests']?.status === 'success' ? 'success.main' : testResults['/requests']?.status === 'error' ? 'error.main' : 'grey.500', fontWeight: 'bold' }}>
                {testResults['/requests']?.status === 'success' ? '✅' : testResults['/requests']?.status === 'error' ? '❌' : '⏸️'}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {testResults['/requests']?.status === 'success' ? 'Работает' : testResults['/requests']?.status === 'error' ? 'Ошибка' : 'Тест...'}
              </Typography>
            </CustomCard>
          </Grid>
          
          <Grid item xs={12} sm={6} md={2}>
            <CustomCard title="SEO" icon={<SearchIcon />} color="primary">
              <Typography variant="body2" sx={{ color: testResults['/seo']?.status === 'success' ? 'success.main' : testResults['/seo']?.status === 'error' ? 'error.main' : 'grey.500', fontWeight: 'bold' }}>
                {testResults['/seo']?.status === 'success' ? '✅' : testResults['/seo']?.status === 'error' ? '❌' : '⏸️'}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {testResults['/seo']?.status === 'success' ? 'Работает' : testResults['/seo']?.status === 'error' ? 'Ошибка' : 'Тест...'}
              </Typography>
            </CustomCard>
          </Grid>
          
          <Grid item xs={12} sm={6} md={2}>
            <CustomCard title="Навигация" icon={<PublicIcon />} color="primary">
              <Typography variant="body2" sx={{ color: testResults['/navigation']?.status === 'success' ? 'success.main' : testResults['/navigation']?.status === 'error' ? 'error.main' : 'grey.500', fontWeight: 'bold' }}>
                {testResults['/navigation']?.status === 'success' ? '✅' : testResults['/navigation']?.status === 'error' ? '❌' : '⏸️'}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {testResults['/navigation']?.status === 'success' ? 'Работает' : testResults['/navigation']?.status === 'error' ? 'Ошибка' : 'Тестирует...'}
              </Typography>
            </CustomCard>
          </Grid>
        </Grid>
      </Box>
    </Box>
    </>
  )
}

// Компонент для списка товаров
const ProductList = () => {
  return (
    <List>
      <Datagrid>
        <TextField source="name" label="Название" />
        <TextField source="slug" label="URL" />
        <TextField source="category.name" label="Категория" />
        <NumberField source="price" label="Цена" />
        <BooleanField source="featured" label="Рекомендуемый" />
        <BooleanField source="active" label="Активен" />
        <DateField source="createdAt" label="Создан" />
      </Datagrid>
    </List>
  )
}

// Компонент для редактирования товара
const ProductEdit = () => {
  return (
    <Edit>
      <SimpleForm>
        <TextInput source="name" label="Название товара" fullWidth />
        <TextInput source="slug" label="URL (slug)" fullWidth />
        <ReferenceInput source="categoryId" reference="categories" label="Категория">
          <SelectInput optionText="name" optionValue="id" />
        </ReferenceInput>
        <RichTextInput source="description" label="Описание" fullWidth />
        <NumberInput source="price" label="Цена (₽)" />
        <BooleanInput source="featured" label="Рекомендуемый товар" />
        <BooleanInput source="active" label="Активен" />
        <BooleanInput source="displayOnSite" label="Отображать на сайте" />
        <NumberInput source="sortOrder" label="Порядок сортировки" />
      </SimpleForm>
    </Edit>
  )
}

// Компонент для создания товара
const ProductCreate = () => {
  return (
    <Create>
      <SimpleForm>
        <TextInput source="name" label="Название товара" fullWidth />
        <TextInput source="slug" label="URL (slug)" fullWidth />
        <ReferenceInput source="categoryId" reference="categories" label="Категория">
          <SelectInput optionText="name" optionValue="id" />
        </ReferenceInput>
        <RichTextInput source="description" label="Описание" fullWidth />
        <NumberInput source="price" label="Цена (₽)" />
        <BooleanInput source="featured" label="Рекомендуемый товар" />
        <BooleanInput source="active" label="Активен" />
        <BooleanInput source="displayOnSite" label="Отображать на сайте" />
        <NumberInput source="sortOrder" label="Порядок сортировки" />
      </SimpleForm>
    </Create>
  )
}

// SEO компоненты
const SEOList = () => {
  return (
    <List>
      <Datagrid>
        <TextField source="page" label="Страница" />
        <TextField source="title" label="Заголовок" />
        <TextField source="description" label="Описание" />
        <TextField source="keywords" label="Ключевые слова" />
        <BooleanField source="active" label="Активен" />
        <DateField source="updatedAt" label="Обновлен" />
      </Datagrid>
    </List>
  )
}

const SEOEdit = () => {
  return (
    <Edit>
      <SimpleForm>
        <TextInput source="page" label="Страница" disabled />
        <TextInput source="title" label="Заголовок (title)" fullWidth />
        <TextInput source="description" label="Описание (description)" fullWidth multiline />
        <TextInput source="keywords" label="Ключевые слова" fullWidth />
        <TextInput source="canonical" label="Canonical URL" fullWidth />
        <BooleanInput source="active" label="Активен" />
        <TextInput source="ogTitle" label="OG Заголовок" fullWidth />
        <TextInput source="ogDescription" label="OG Описание" fullWidth />
        <TextInput source="ogImage" label="OG Изображение" fullWidth />
        <TextInput source="twitterCard" label="Twitter Card" />
        <TextInput source="twitterTitle" label="Twitter Заголовок" fullWidth />
        <TextInput source="twitterDescription" label="Twitter Описание" fullWidth />
        <TextInput source="twitterImage" label="Twitter Изображение" fullWidth />
      </SimpleForm>
    </Edit>
  )
}

const SEOCreate = () => {
  return (
    <Create>
      <SimpleForm>
        <SelectInput source="page" label="Страница" choices={[
          { id: 'home', name: 'Главная' },
          { id: 'products', name: 'Товары' },
          { id: 'services', name: 'Услуги' },
          { id: 'about', name: 'О нас' },
          { id: 'contacts', name: 'Контакты' }
        ]} />
        <TextInput source="title" label="Заголовок (title)" fullWidth />
        <TextInput source="description" label="Описание (description)" fullWidth multiline />
        <TextInput source="keywords" label="Ключевые слова" fullWidth />
        <TextInput source="canonical" label="Canonical URL" fullWidth />
        <BooleanInput source="active" label="Активен" />
        <TextInput source="ogTitle" label="OG Заголовок" fullWidth />
        <TextInput source="ogDescription" label="OG Описание" fullWidth />
        <TextInput source="ogImage" label="OG Изображение" fullWidth />
        <TextInput source="twitterCard" label="Twitter Card" />
        <TextInput source="twitterTitle" label="Twitter Заголовок" fullWidth />
        <TextInput source="twitterDescription" label="Twitter Описание" fullWidth />
        <TextInput source="twitterImage" label="Twitter Изображение" fullWidth />
      </SimpleForm>
    </Create>
  )
}

// Навигация компоненты
const NavigationList = () => {
  return (
    <List>
      <Datagrid>
        <TextField source="type" label="Тип" />
        <TextField source="label" label="Название" />
        <TextField source="url" label="URL" />
        <TextField source="position" label="Позиция" />
        <BooleanField source="active" label="Активна" />
        <BooleanField source="isMain" label="Главная" />
        <DateField source="createdAt" label="Создана" />
      </Datagrid>
    </List>
  )
}

const NavigationEdit = () => {
  return (
    <Edit>
      <SimpleForm>
        <SelectInput source="type" label="Тип" choices={[
          { id: 'header', name: 'Верхняя навигация' },
          { id: 'footer', name: 'Нижняя навигация' },
          { id: 'sidebar', name: 'Боковая навигация' }
        ]} />
        <TextInput source="label" label="Название пункта" fullWidth />
        <TextInput source="url" label="URL" fullWidth />
        <SelectInput source="position" label="Позиция" choices={[
          { id: 'left', name: 'Слева' },
          { id: 'center', name: 'По центру' },
          { id: 'right', name: 'Справа' }
        ]} />
        <NumberInput source="order" label="Порядок" />
        <BooleanInput source="active" label="Активна" />
        <BooleanInput source="isMain" label="Главная страница" />
        <TextInput source="icon" label="Иконка (emoji)" />
        <TextInput source="description" label="Описание" />
        <BooleanInput source="external" label="Внешняя ссылка" />
        <TextInput source="target" label="Цель (_blank, _self)" />
      </SimpleForm>
    </Edit>
  )
}

const NavigationCreate = () => {
  return (
    <Create>
      <SimpleForm>
        <SelectInput source="type" label="Тип" choices={[
          { id: 'header', name: 'Верхняя навигация' },
          { id: 'footer', name: 'Нижняя навигация' },
          { id: 'sidebar', name: 'Боковая навигация' }
        ]} />
        <TextInput source="label" label="Название пункта" fullWidth />
        <TextInput source="url" label="URL" fullWidth />
        <SelectInput source="position" label="Позиция" choices={[
          { id: 'left', name: 'Слева' },
          { id: 'center', name: 'По центру' },
          { id: 'right', name: 'Справа' }
        ]} />
        <NumberInput source="order" label="Порядок" />
        <BooleanInput source="active" label="Активна" />
        <BooleanInput source="isMain" label="Главная страница" />
        <TextInput source="icon" label="Иконка (emoji)" />
        <TextInput source="description" label="Описание" />
        <BooleanInput source="external" label="Внешняя ссылка" />
        <TextInput source="target" label="Цель (_blank, _self)" />
      </SimpleForm>
    </Create>
  )
}

export default function App() {
  return (
    <Admin
      title="🔧 GrinderMaster Админка"
      dashboard={Dashboard}
      dataProvider={dataProvider}
      theme={{
        palette: {
          mode: 'light',
          primary: {
            main: '#1976d2',
            light: '#42a5f5',
            dark: '#1565c0',
          },
          secondary: {
            main: '#dc004e',
            light: '#ffab40',
            dark: '#ba000a',
          },
          background: {
            default: '#f5f5f5',
            paper: '#ffffff',
          },
          text: {
            primary: 'rgba(0, 0, 0, 0.87)',
            secondary: 'rgba(0, 0, 0, 0.6)',
          },
        },
        components: {
          MuiCard: {
            styleOverrides: {
              root: {
                boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
                borderRadius: 16,
                background: '#ffffff',
                border: '1px solid rgba(0, 0, 0, 0.08)',
                transition: 'all 0.3s ease-in-out',
                '&:hover': {
                  boxShadow: '0 12px 40px rgba(0,0,0,0.16)',
                  transform: 'translateY(-2px)',
                },
              },
            },
          },
          MuiButton: {
            styleOverrides: {
              root: {
                borderRadius: 12,
                textTransform: 'none',
                fontWeight: 600,
                padding: '8px 24px',
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                transition: 'all 0.3s ease-in-out',
                '&:hover': {
                  boxShadow: '0 6px 20px rgba(0,0,0,0.15)',
                  transform: 'translateY(-1px)',
                },
                '&:active': {
                  transform: 'translateY(0)',
                },
              },
            },
          },
          MuiAppBar: {
            styleOverrides: {
              root: {
                width: '100%',
                maxWidth: '100%',
                boxSizing: 'border-box',
                background: 'linear-gradient(135deg, #1976d2 0%, #42a5f5 100%)',
                boxShadow: '0 4px 20px rgba(0,0,0,0.12)',
              },
            },
          },
          MuiTypography: {
            styleOverrides: {
              h4: {
                fontWeight: 700,
                color: '#1976d2',
                marginBottom: '24px',
              },
              h6: {
                fontWeight: 600,
                color: '#333333',
              },
            },
          },
          MuiAvatar: {
            styleOverrides: {
              root: {
                boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                transition: 'all 0.3s ease-in-out',
                '&:hover': {
                  transform: 'scale(1.05)',
                },
              },
            },
          },
          MuiPaper: {
            styleOverrides: {
              root: {
                boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                borderRadius: 12,
                background: '#ffffff',
                border: '1px solid rgba(0, 0, 0, 0.06)',
              },
            },
          },
          MuiGrid: {
            styleOverrides: {
              root: {
                '& .MuiGrid-item': {
                  transition: 'all 0.3s ease-in-out',
                },
              },
            },
          },
          MuiChip: {
            styleOverrides: {
              root: {
                fontWeight: 600,
                borderRadius: 8,
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
              },
            },
          },
          MuiTextField: {
            styleOverrides: {
              root: {
                '& .MuiOutlinedInput-root': {
                  borderRadius: 12,
                  transition: 'all 0.3s ease-in-out',
                  '&:hover .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#1976d2',
                  },
                  '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#1976d2',
                    borderWidth: 2,
                  },
                },
              },
            },
          },
          MuiSelect: {
            styleOverrides: {
              root: {
                '& .MuiOutlinedInput-root': {
                  borderRadius: 12,
                },
              },
            },
          },
          MuiSwitch: {
            styleOverrides: {
              root: {
                '& .MuiSwitch-thumb': {
                  boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
                },
              },
            },
          },
          MuiSlider: {
            styleOverrides: {
              root: {
                '& .MuiSlider-thumb': {
                  boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
                },
              },
            },
          },
          MuiDivider: {
            styleOverrides: {
              root: {
                borderColor: 'rgba(0, 0, 0, 0.08)',
              },
            },
          },
          MuiAccordion: {
            styleOverrides: {
              root: {
                boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                '&:before': {
                  display: 'none',
                },
              },
            },
          },
          MuiTab: {
            styleOverrides: {
              root: {
                fontWeight: 600,
                textTransform: 'none',
                transition: 'all 0.3s ease-in-out',
              },
            },
          },
          RaLayout: {
            styleOverrides: {
              root: {
                '& .RaLayout-content': {
                  width: 'calc(100% - 240px)',
                  marginLeft: '240px',
                  transition: 'margin-left 0.2s ease-in-out',
                  background: '#f5f5f5',
                },
                '& .RaLayout-contentWithSidebar': {
                  marginLeft: '0',
                  width: '100%',
                },
              },
            },
          },
        },
      }}
    >
      <Resource 
        name="products" 
        list={ProductList} 
        edit={ProductEdit} 
        create={ProductCreate}
        options={{ label: '📦 Товары' }}
      />
      <Resource 
        name="services" 
        list={ProductList} 
        edit={ProductEdit} 
        create={ProductCreate}
        options={{ label: '🔧 Услуги' }}
      />
      <Resource 
        name="categories" 
        list={ProductList} 
        edit={ProductEdit} 
        create={ProductCreate}
        options={{ label: '📂 Категории' }}
      />
      <Resource 
        name="requests" 
        list={ProductList} 
        edit={ProductEdit} 
        create={ProductCreate}
        options={{ label: '📋 Заявки' }}
      />
      <Resource 
        name="seo" 
        list={SEOList} 
        edit={SEOEdit} 
        create={SEOCreate}
        options={{ label: '🔍 SEO' }}
      />
      <Resource 
        name="navigation" 
        list={NavigationList} 
        edit={NavigationEdit} 
        create={NavigationCreate}
        options={{ label: '🧭 Навигация' }}
      />
    </Admin>
  )
}
