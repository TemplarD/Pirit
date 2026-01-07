import { Create, SimpleForm, TextInput, NumberInput, ReferenceInput, SelectInput, BooleanInput } from 'react-admin'

export const ProductCreate = () => (
  <Create>
    <SimpleForm>
      <TextInput source="name" />
      <TextInput source="slug" />
      <TextInput source="description" multiline />
      <NumberInput source="price" />
      <ReferenceInput source="categoryId" reference="categories">
        <SelectInput optionText="name" />
      </ReferenceInput>
      <BooleanInput source="featured" />
      <BooleanInput source="active" />
      <BooleanInput source="displayOnSite" />
    </SimpleForm>
  </Create>
)
