import { Create, SimpleForm, TextInput, SelectInput, BooleanInput } from 'react-admin'

export const ServiceCreate = () => (
  <Create>
    <SimpleForm>
      <TextInput source="name" />
      <TextInput source="slug" />
      <TextInput source="description" multiline />
      <TextInput source="price" />
      <SelectInput source="category" choices={[
        { id: 'diagnostics', name: 'Диагностика' },
        { id: 'maintenance', name: 'Обслуживание' },
        { id: 'emergency', name: 'Экстренный выезд' },
        { id: 'modernization', name: 'Модернизация' }
      ]} />
      <BooleanInput source="featured" />
      <BooleanInput source="active" />
      <BooleanInput source="displayOnSite" />
    </SimpleForm>
  </Create>
)
