import React from 'react'
import {
  Router,
  Route,
  Redirect,
  Switch
} from 'react-router-dom'
import Login from './Login'
import Inner from './Inner'
import Layout from './Layout'
import history from './history'


const PrivateRoute = ({ component, authenticated, updateUserState, ...rest }) => (
  <Route {...rest} render={(props) => (
    authenticated
      ? <Layout
          component={component}
          updateUserState={updateUserState}
          {...props}
      />
      : <Redirect to={'/login'}/>
  )}/>
)

const Routes = ({ authenticated, updateUserState }) => (
  <Router history={history}>
    <Switch>
      <Route
        exact path={'/'}
        render={() => <Redirect to={'/inner'}/>}
      />
      <Route
        path={'/login'}
        render={() => (
          authenticated ? (
            <Redirect to={'/inner'}/>
          ) : (
            <Login updateUserState={updateUserState}/>
          )
        )}
      />
      <PrivateRoute
        path={'/inner'}
        authenticated={authenticated}
        updateUserState={updateUserState}
        component={Inner}
      />
    </Switch>
  </Router>
)


export default Routes
