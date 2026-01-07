import { Edit, SimpleForm, TextInput, SelectInput } from 'react-admin'

export const RequestEdit = () => (
  <Edit>
    <SimpleForm>
      <TextInput source="name" disabled />
      <TextInput source="phone" disabled />
      <TextInput source="email" disabled />
      <SelectInput source="status" choices={[
        { id: 'NEW', name: 'Новый' },
        { id: 'PROCESSING', name: 'В обработке' },
        { id: 'COMPLETED', name: 'Завершен' },
        { id: 'CANCELLED', name: 'Отменен' }
      ]} />
      <TextInput source="message" multiline disabled />
    </SimpleForm>
  </Edit>
)
