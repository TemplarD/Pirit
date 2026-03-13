import { Create, SimpleForm, TextInput, NumberInput, BooleanInput, SelectInput, JsonInput } from 'react-admin'

export const ComponentCreate = () => (
  <Create>
    <SimpleForm>
      <TextInput source="name" label="Название (RU)" fullWidth />
      <TextInput source="nameEn" label="Название (EN)" fullWidth />
      <TextInput source="slug" label="URL (slug)" fullWidth />
      <SelectInput
        source="category"
        label="Категория"
        choices={[
          { id: 'BASE', name: 'Основание' },
          { id: 'MOTOR', name: 'Двигатель' },
          { id: 'FRAME', name: 'Рама' },
          { id: 'BELT', name: 'Лента' },
          { id: 'GUARD', name: 'Кожух' },
          { id: 'ACCESSORY', name: 'Аксессуар' },
        ]}
        fullWidth
      />
      <TextInput source="description" label="Описание (RU)" multiline rows={3} fullWidth />
      <TextInput source="descriptionEn" label="Описание (EN)" multiline rows={3} fullWidth />
      <TextInput source="model3DUrl" label="SVG URL" fullWidth />
      <JsonInput source="specifications" label="Характеристики" />
      <NumberInput source="price" label="Цена (₽)" />
      <NumberInput source="stock" label="На складе" />
      <BooleanInput source="active" label="Активен" />
      <BooleanInput source="isDefault" label="По умолчанию" />
    </SimpleForm>
  </Create>
)
