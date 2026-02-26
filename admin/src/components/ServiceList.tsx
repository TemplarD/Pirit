import { List, Datagrid, TextField, EditButton, DeleteButton } from 'react-admin'

export const ServiceList = () => (
  <List>
    <Datagrid>
      <TextField source="id" />
      <TextField source="name" />
      <TextField source="slug" />
      <TextField source="price" />
      <TextField source="category" />
      <EditButton />
      <DeleteButton />
    </Datagrid>
  </List>
)
