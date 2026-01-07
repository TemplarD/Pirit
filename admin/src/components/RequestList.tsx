import { List, Datagrid, TextField, EditButton, DateField } from 'react-admin'

export const RequestList = () => (
  <List>
    <Datagrid>
      <TextField source="id" />
      <TextField source="name" />
      <TextField source="phone" />
      <TextField source="email" />
      <TextField source="type" />
      <TextField source="status" />
      <DateField source="createdAt" />
      <EditButton />
    </Datagrid>
  </List>
)
