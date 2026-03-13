import { List, Datagrid, TextField, BooleanField, NumberField, Filter, TextInput, SelectInput, Pagination } from 'react-admin'

const NodeFilter = () => (
  <Filter>
    <TextInput label="Поиск" source="q" alwaysOn />
    <SelectInput
      label="Тип узла"
      source="nodeType"
      choices={[
        { id: 'BASE', name: 'Основание' },
        { id: 'MOTOR', name: 'Двигатель' },
        { id: 'FRAME', name: 'Рама' },
        { id: 'BELT', name: 'Лента' },
        { id: 'GUARD', name: 'Кожух' },
      ]}
    />
  </Filter>
)

export const AssemblyNodeList = () => (
  <List filters={<NodeFilter />} pagination={<Pagination />} perPage={25}>
    <Datagrid rowClick="edit">
      <TextField source="name" label="Название" />
      <TextField source="nodeType" label="Тип" />
      <BooleanField source="isRequired" label="Обязательный" />
      <NumberField source="sortOrder" label="Порядок" />
      <BooleanField source="active" label="Активен" />
    </Datagrid>
  </List>
)
