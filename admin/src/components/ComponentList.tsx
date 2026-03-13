import { List, Datagrid, TextField, NumberField, BooleanField, Filter, TextInput, SelectInput, Pagination } from 'react-admin'

const ComponentFilter = () => (
  <Filter>
    <TextInput label="Поиск" source="q" alwaysOn />
    <SelectInput
      label="Категория"
      source="category"
      choices={[
        { id: 'BASE', name: 'Основание' },
        { id: 'MOTOR', name: 'Двигатель' },
        { id: 'FRAME', name: 'Рама' },
      ]}
    />
  </Filter>
)

export const ComponentList = () => (
  <List filters={<ComponentFilter />} pagination={<Pagination />} perPage={25}>
    <Datagrid rowClick="edit">
      <TextField source="name" label="Название" />
      <TextField source="category" label="Категория" />
      <NumberField source="price" label="Цена (₽)" options={{ style: 'currency', currency: 'RUB' }} />
      <BooleanField source="active" label="Активен" />
    </Datagrid>
  </List>
)
