import { Create, SimpleForm, TextInput } from 'react-admin'

export const CategoryCreate = () => (
  <Create>
    <SimpleForm>
      <TextInput source="name" />
      <TextInput source="slug" />
      <TextInput source="description" multiline />
    </SimpleForm>
  </Create>
)
