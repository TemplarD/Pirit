import { Show, SimpleShowLayout, TextField, NumberField, BooleanField } from 'react-admin'

export const ProductShow = () => (
  <Show>
    <SimpleShowLayout>
      <TextField source="id" />
      <TextField source="name" />
      <TextField source="slug" />
      <TextField source="description" />
      <NumberField source="price" />
      <TextField source="categoryId" />
      <BooleanField source="featured" />
      <BooleanField source="active" />
      <BooleanField source="displayOnSite" />
    </SimpleShowLayout>
  </Show>
)
