import React from 'react'
import {
  Router,
  Route,
  Redirect,
  Switch
} from 'react-router-dom'
import history from '../Helpers/history'

import Login from './Login'
import SetUpload from './SetUpload'
import Results from './Results'
import Page404 from './Page404'
import Rate from './Rate'
import Layout from './Layout'


const PrivateRoute = ({ component, user, updateUserState, ...rest }) => (
  <Route {...rest} render={(props) => (
    user
      ? <Layout
        component={component}
        updateUserState={updateUserState}
        user={user}
        {...props}
      />
      : <Redirect to={'/login'}/>
  )}/>
)

const Routes = ({ user, updateUserState }) => (
  <Router history={history}>
    <Switch>
      <Route
        exact path={'/'}
        render={() => <Redirect to={'/upload'}/>}
      />
      <Route
        path={'/login'}
        render={() => (
          user ? (
            <Redirect to={'/upload'}/>
          ) : (
            <Login updateUserState={updateUserState}/>
          )
        )}
      />
      <PrivateRoute
        path={'/upload'}
        user={user}
        updateUserState={updateUserState}
        component={SetUpload}
      />
      <PrivateRoute
        path={'/results'}
        user={user}
        updateUserState={updateUserState}
        component={Results}
      />
      <Route
        path='/rate'
        component={() => <Rate user={user} />}
      />
      <Route component={Page404}/>
    </Switch>
  </Router>
)


export default Routes
