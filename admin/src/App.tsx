import { useEffect } from 'react'
import { 
  Admin, 
  Resource, 
  List, 
  Edit, 
  Create, 
  Datagrid, 
  TextField, 
  NumberField, 
  BooleanField, 
  DateField,
  EditButton,
  DeleteButton,
  ShowButton,
  useRecordContext,
  TextInput,
  NumberInput,
  BooleanInput,
  SelectInput,
  SimpleForm,
  FilterList,
  FilterListItem,
  SearchInput,
  FunctionField,
  Pagination,
  TopToolbar,
  CreateButton,
  ExportButton,
  RefreshButton,
  ListButton,
  useTranslate,
  ReferenceInput,
  Menu
} from 'react-admin'
import { dataProvider } from './dataProvider'
import Dashboard from './Dashboard'
import AnalyticsPage from './Analytics'
import { 
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as ViewIcon
} from '@mui/icons-material'
import { Tooltip } from '@mui/material'
import { 
  BarChart as BarChartIcon,
  Timeline as TimelineIcon,
  Assessment as AssessmentIcon
} from '@mui/icons-material'

import { RichTextInput } from 'ra-input-rich-text'
import { logCRUD, logAction } from './loggingMiddleware'

// Кастомное поле с подсказкой для обрезанного текста
const TooltipTextField = ({ source, label, ...props }: any) => {
  const record = useRecordContext()
  if (!record) return null
  
  const value = record[source]
  const isOverflowed = value && value.length > 50 // Проверяем, обрезается ли текст
  
  return (
    <Tooltip title={isOverflowed ? value : ''} arrow>
      <TextField 
        source={source} 
        label={label} 
        {...props}
        sx={{
          '& .MuiTableCell-root': {
            maxWidth: '100px',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
            cursor: isOverflowed ? 'help' : 'default'
          }
        }}
      />
    </Tooltip>
  )
}

// Кастомные кнопки с иконками и подсказками
const CustomEditButton = () => {
  const record = useRecordContext()
  const handleClick = () => {
    logCRUD('edit', 'resource', record?.id, { resource: record })
  }
  
  return (
    <EditButton 
      label="" 
      title="Редактировать"
      icon={<EditIcon sx={{ fontSize: '16px !important' }} />}
      sx={{ 
        padding: '4px !important',
        minWidth: '32px !important',
        width: '32px !important',
        height: '32px !important',
        marginRight: '4px',
        flexShrink: 0
      }}
      onClick={handleClick}
    />
  )
}

const CustomDeleteButton = () => {
  const record = useRecordContext()
  const handleClick = () => {
    logCRUD('delete', 'resource', record?.id, { resource: record })
  }
  
  return (
    <DeleteButton 
      label="" 
      title="Удалить"
      icon={<DeleteIcon sx={{ fontSize: '16px !important' }} />}
      sx={{ 
        padding: '4px !important',
        minWidth: '32px !important',
        width: '32px !important',
        height: '32px !important',
        flexShrink: 0
      }}
      onClick={handleClick}
    />
  )
}

const CustomViewButton = () => {
  const record = useRecordContext()
  const handleClick = () => {
    logAction('view_resource', { resourceId: record?.id, resource: record })
  }
  
  return (
    <ShowButton 
      label="" 
      title="Просмотреть"
      icon={<ViewIcon sx={{ fontSize: '16px !important' }} />}
      sx={{ 
        padding: '4px !important',
        minWidth: '32px !important',
        width: '32px !important',
        height: '32px !important',
        marginRight: '4px',
        flexShrink: 0
      }}
      onClick={handleClick}
    />
  )
}

// Компонент для списка товаров
const ProductList = () => {
  useEffect(() => {
    logAction('view_list', { resource: 'products' })
  }, [])
  
  return (
    <List>
      <Datagrid>
        <TextField source="name" label="Название" />
        <TextField source="slug" label="URL" />
        <TextField source="price" label="Цена" />
        <TextField source="category" label="Категория" />
        <BooleanField source="active" label="Активен" />
        <BooleanField source="featured" label="Рекомендуемый" />
        <DateField source="createdAt" label="Создан" />
        <CustomEditButton />
        <CustomDeleteButton />
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

// Компонент для списка услуг
const ServiceList = () => {
  return (
    <List>
      <Datagrid>
        <TooltipTextField source="name" label="Название" />
        <TooltipTextField source="slug" label="URL" />
        <TooltipTextField source="category" label="Категория" />
        <TooltipTextField source="price" label="Цена" />
        <TooltipTextField source="duration" label="Длительность" />
        <BooleanField source="featured" label="Рекомендуемая" />
        <BooleanField source="active" label="Активна" />
        <DateField source="createdAt" label="Создана" />
        <CustomEditButton />
        <CustomDeleteButton />
      </Datagrid>
    </List>
  )
}

// Компонент для редактирования услуги
const ServiceEdit = () => {
  return (
    <Edit>
      <SimpleForm>
        <TextInput source="name" label="Название услуги" fullWidth />
        <TextInput source="slug" label="URL (slug)" fullWidth />
        <SelectInput source="category" label="Категория" choices={[
          { id: 'diagnostics', name: 'Диагностика' },
          { id: 'repair', name: 'Ремонт' },
          { id: 'maintenance', name: 'Обслуживание' },
          { id: 'consultation', name: 'Консультация' }
        ]} />
        <RichTextInput source="description" label="Описание" fullWidth />
        <TextInput source="price" label="Цена (₽)" />
        <TextInput source="duration" label="Длительность" />
        <BooleanInput source="warranty" label="Гарантия" />
        <BooleanInput source="featured" label="Рекомендуемая услуга" />
        <BooleanInput source="active" label="Активна" />
        <BooleanInput source="displayOnSite" label="Отображать на сайте" />
        <NumberInput source="sortOrder" label="Порядок сортировки" />
      </SimpleForm>
    </Edit>
  )
}

// Компонент для создания услуги
const ServiceCreate = () => {
  return (
    <Create>
      <SimpleForm>
        <TextInput source="name" label="Название услуги" fullWidth />
        <TextInput source="slug" label="URL (slug)" fullWidth />
        <SelectInput source="category" label="Категория" choices={[
          { id: 'diagnostics', name: 'Диагностика' },
          { id: 'repair', name: 'Ремонт' },
          { id: 'maintenance', name: 'Обслуживание' },
          { id: 'consultation', name: 'Консультация' }
        ]} />
        <RichTextInput source="description" label="Описание" fullWidth />
        <TextInput source="price" label="Цена (₽)" />
        <TextInput source="duration" label="Длительность" />
        <BooleanInput source="warranty" label="Гарантия" />
        <BooleanInput source="featured" label="Рекомендуемая услуга" />
        <BooleanInput source="active" label="Активна" />
        <BooleanInput source="displayOnSite" label="Отображать на сайте" />
        <NumberInput source="sortOrder" label="Порядок сортировки" />
      </SimpleForm>
    </Create>
  )
}

// Компонент для списка категорий
const CategoryList = () => {
  return (
    <List>
      <Datagrid>
        <TextField source="name" label="Название" />
        <TextField source="slug" label="URL" />
        <TextField source="description" label="Описание" />
        <BooleanField source="active" label="Активна" />
        <CustomEditButton />
        <CustomDeleteButton />
      </Datagrid>
    </List>
  )
}

// Компонент для редактирования категории
const CategoryEdit = () => {
  return (
    <Edit>
      <SimpleForm>
        <TextInput source="name" label="Название категории" fullWidth />
        <TextInput source="slug" label="URL (slug)" fullWidth />
        <RichTextInput source="description" label="Описание" fullWidth />
        <BooleanInput source="active" label="Активна" />
      </SimpleForm>
    </Edit>
  )
}

// Компонент для создания категории
const CategoryCreate = () => {
  return (
    <Create>
      <SimpleForm>
        <TextInput source="name" label="Название категории" fullWidth />
        <TextInput source="slug" label="URL (slug)" fullWidth />
        <RichTextInput source="description" label="Описание" fullWidth />
        <BooleanInput source="active" label="Активна" />
      </SimpleForm>
    </Create>
  )
}

// Компонент для списка заявок
const RequestList = () => {
  return (
    <List>
      <Datagrid>
        <TextField source="name" label="Имя" />
        <TextField source="phone" label="Телефон" />
        <TextField source="email" label="Email" />
        <TextField source="type" label="Тип" />
        <TextField source="status" label="Статус" />
        <DateField source="createdAt" label="Создана" />
        <CustomEditButton />
        <CustomDeleteButton />
      </Datagrid>
    </List>
  )
}

// Компонент для редактирования заявки
const RequestEdit = () => {
  return (
    <Edit>
      <SimpleForm>
        <TextInput source="name" label="Имя" fullWidth />
        <TextInput source="phone" label="Телефон" fullWidth />
        <TextInput source="email" label="Email" fullWidth />
        <SelectInput source="type" label="Тип" choices={[
          { id: 'PRODUCT', name: 'Товар' },
          { id: 'SERVICE', name: 'Услуга' }
        ]} />
        <ReferenceInput source="productId" reference="products" label="Товар">
          <SelectInput optionText="name" optionValue="id" />
        </ReferenceInput>
        <ReferenceInput source="serviceId" reference="services" label="Услуга">
          <SelectInput optionText="name" optionValue="id" />
        </ReferenceInput>
        <SelectInput source="status" label="Статус" choices={[
          { id: 'NEW', name: 'Новая' },
          { id: 'PROCESSING', name: 'В обработке' },
          { id: 'COMPLETED', name: 'Завершена' },
          { id: 'CANCELLED', name: 'Отменена' }
        ]} />
        <RichTextInput source="message" label="Сообщение" fullWidth />
      </SimpleForm>
    </Edit>
  )
}

// SEO компоненты
const SEOList = () => {
  return (
    <List>
      <Datagrid>
        <TextField source="page" label="Страница" />
        <TextField source="title" label="Title" />
        <TextField source="description" label="Description" />
        <TextField source="keywords" label="Keywords" />
        <BooleanField source="active" label="Активна" />
        <DateField source="updatedAt" label="Обновлена" />
        <CustomEditButton />
        <CustomDeleteButton />
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
        <NumberField source="order" label="Порядок" />
        <BooleanField source="active" label="Активна" />
        <BooleanField source="isMain" label="Основная" />
        <CustomEditButton />
        <CustomDeleteButton />
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
            default: '#fafafa',
            paper: '#ffffff',
          },
          text: {
            primary: 'rgba(0, 0, 0, 0.87)',
            secondary: 'rgba(0, 0, 0, 0.6)',
          },
        },
        typography: {
          fontFamily: [
            '-apple-system',
            'BlinkMacSystemFont',
            '"Segoe UI"',
            'Roboto',
            '"Helvetica Neue"',
            'Arial',
            'sans-serif',
          ].join(','),
          h4: {
            fontWeight: 600,
            color: '#1976d2',
            marginBottom: '16px',
            fontSize: '1.5rem',
          },
          h6: {
            fontWeight: 600,
            color: '#333333',
            fontSize: '1rem',
          },
        },
        components: {
          MuiCssBaseline: {
            styleOverrides: {
              body: {
                scrollbarWidth: 'thin',
                '&::-webkit-scrollbar': {
                  width: '8px',
                },
                '&::-webkit-scrollbar-track': {
                  background: '#f1f1f1',
                },
                '&::-webkit-scrollbar-thumb': {
                  background: '#c1c1c1',
                  borderRadius: '4px',
                },
                '&::-webkit-scrollbar-thumb:hover': {
                  background: '#a8a8a8',
                },
              },
            },
          },
          MuiCard: {
            styleOverrides: {
              root: {
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                borderRadius: 8,
                background: '#ffffff',
                border: '1px solid rgba(0, 0, 0, 0.06)',
                transition: 'all 0.2s ease-in-out',
                width: '100%',
                maxWidth: '100%',
                overflow: 'hidden',
                '&:hover': {
                  boxShadow: '0 4px 16px rgba(0,0,0,0.12)',
                  transform: 'translateY(-1px)',
                },
              },
            },
          },
          MuiButton: {
            styleOverrides: {
              root: {
                borderRadius: 6,
                textTransform: 'none',
                fontWeight: 500,
                padding: '6px 16px',
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                transition: 'all 0.2s ease-in-out',
                '&:hover': {
                  boxShadow: '0 4px 8px rgba(0,0,0,0.15)',
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
                background: 'linear-gradient(135deg, #1976d2 0%, #42a5f5 100%)',
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                width: '100%',
                maxWidth: '100vw',
              },
            },
          },
          MuiTableCell: {
            styleOverrides: {
              root: {
                padding: '8px 12px',
                borderBottom: '1px solid rgba(224, 224, 224, 1)',
                '&:last-child': {
                  paddingRight: '12px',
                },
                fontSize: '0.875rem',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                maxWidth: '100px',
                minWidth: '80px',
                '@media (max-width: 1200px)': {
                  maxWidth: '80px',
                  minWidth: '60px',
                  padding: '6px 8px',
                  fontSize: '0.8rem',
                },
                '@media (max-width: 960px)': {
                  maxWidth: '60px',
                  minWidth: '50px',
                  padding: '4px 6px',
                  fontSize: '0.75rem',
                },
                '@media (max-width: 768px)': {
                  maxWidth: '50px',
                  minWidth: '40px',
                  padding: '4px 6px',
                  fontSize: '0.75rem',
                },
                '@media (max-width: 600px)': {
                  maxWidth: '40px',
                  minWidth: '30px',
                  padding: '2px 4px',
                  fontSize: '0.7rem',
                },
                '@media (max-width: 480px)': {
                  maxWidth: '30px',
                  minWidth: '25px',
                  padding: '2px 4px',
                  fontSize: '0.7rem',
                },
              },
            },
          },
          MuiTableHead: {
            styleOverrides: {
              root: {
                '& .MuiTableCell-head': {
                  fontWeight: 600,
                  backgroundColor: '#f5f5f5',
                  borderBottom: '2px solid rgba(224, 224, 224, 1)',
                  padding: '8px 12px',
                  fontSize: '0.875rem',
                  whiteSpace: 'nowrap',
                  '@media (max-width: 768px)': {
                    padding: '6px 8px',
                    fontSize: '0.8rem',
                  },
                  '@media (max-width: 480px)': {
                    padding: '4px 6px',
                    fontSize: '0.75rem',
                  },
                },
              },
            },
          },
          MuiTableRow: {
            styleOverrides: {
              root: {
                '&:hover': {
                  backgroundColor: 'rgba(25, 118, 210, 0.04)',
                },
              },
            },
          },
          MuiDatagrid: {
            styleOverrides: {
              root: {
                '& .MuiTableCell-root': {
                  padding: '8px 12px',
                  '&:last-child': {
                    padding: '8px 12px',
                  },
                },
                '@media (max-width: 768px)': {
                  '& .MuiTableCell-root': {
                    padding: '6px 8px',
                    '&:last-child': {
                      padding: '6px 8px',
                    },
                  },
                },
                '@media (max-width: 480px)': {
                  '& .MuiTableCell-root': {
                    padding: '4px 6px',
                    '&:last-child': {
                      padding: '4px 6px',
                    },
                  },
                },
              },
            },
          },
          MuiTextField: {
            styleOverrides: {
              root: {
                '& .MuiOutlinedInput-root': {
                  borderRadius: 6,
                  transition: 'all 0.2s ease-in-out',
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
                  borderRadius: 6,
                },
              },
            },
          },
          MuiPaper: {
            styleOverrides: {
              root: {
                boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                borderRadius: 8,
                background: '#ffffff',
                border: '1px solid rgba(0, 0, 0, 0.06)',
                width: '100%',
                maxWidth: '100%',
              },
            },
          },
          MuiChip: {
            styleOverrides: {
              root: {
                fontWeight: 500,
                borderRadius: 4,
                fontSize: '0.75rem',
              },
            },
          },
        },
        breakpoints: {
          values: {
            xs: 0,
            sm: 600,
            md: 960,
            lg: 1280,
            xl: 1920,
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
        list={ServiceList} 
        edit={ServiceEdit} 
        create={ServiceCreate}
        options={{ label: '🔧 Услуги' }}
      />
      <Resource 
        name="categories" 
        list={CategoryList} 
        edit={CategoryEdit} 
        create={CategoryCreate}
        options={{ label: '📂 Категории' }}
      />
      <Resource 
        name="requests" 
        list={RequestList} 
        edit={RequestEdit}
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
      />
      
      {/* Страница аналитики */}
      <Resource 
        name="analytics" 
        list={() => <AnalyticsPage />}
        options={{ label: '📊 Аналитика' }}
      />
    </Admin>
  )
}
