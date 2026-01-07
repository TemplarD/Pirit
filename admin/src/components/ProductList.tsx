import { List, Datagrid, TextField, NumberField, BooleanField, EditButton, DeleteButton, ShowButton } from 'react-admin'

export const ProductList = () => (
  <List>
    <Datagrid>
      <TextField source="id" />
      <TextField source="name" />
      <TextField source="slug" />
      <NumberField source="price" />
      <TextField source="categoryId" />
      <BooleanField source="featured" />
      <BooleanField source="active" />
      <ShowButton />
      <EditButton />
      <DeleteButton />
    </Datagrid>
  </List>
)
