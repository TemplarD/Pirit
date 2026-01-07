import React from 'react'
import { Admin, Resource, ListGuesser } from 'react-admin'

const TestAdmin = () => {
  return (
    <Admin>
      <Resource name="users" list={ListGuesser} />
    </Admin>
  )
}

export default TestAdmin
