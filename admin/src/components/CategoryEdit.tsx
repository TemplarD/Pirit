import { Edit, SimpleForm, TextInput, ReferenceInput, SelectInput } from 'react-admin'

export const CategoryEdit = () => (
  <Edit>
    <SimpleForm>
      <TextInput source="name" />
      <TextInput source="slug" />
      <TextInput source="description" multiline />
    </SimpleForm>
  </Edit>
)
