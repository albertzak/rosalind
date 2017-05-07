import React from 'react'
import { Route, Switch } from 'react-router-dom'
import Blaze from 'meteor/gadicc:blaze-react-component'

const ListUsers = () => <Blaze template="users" />
const NewUser = () => <Blaze template="newUser" />
const EditUser = () => <Blaze template="editUser" />

export const Users = ({ match }) => (
  <div>
    <Switch>
      <Route exact path={`${match.url}/new`} component={NewUser} />
      <Route exact path={`${match.url}/:id/edit`} component={EditUser} />
      <Route path={`${match.url}`} component={ListUsers} />
    </Switch>
  </div>
)
