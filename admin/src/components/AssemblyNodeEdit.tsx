import { Edit, SimpleForm, TextInput, BooleanInput, NumberInput, SelectInput } from 'react-admin'

export const AssemblyNodeEdit = () => (
  <Edit>
    <SimpleForm>
      <TextInput source="name" label="Название" fullWidth />
      <TextInput source="slug" label="URL (slug)" fullWidth />
      <SelectInput
        source="nodeType"
        label="Тип узла"
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
      <TextInput source="description" label="Описание" multiline rows={3} fullWidth />
      <BooleanInput source="isRequired" label="Обязательный" />
      <NumberInput source="sortOrder" label="Порядок отображения" />
      <BooleanInput source="active" label="Активен" />
    </SimpleForm>
  </Edit>
)
