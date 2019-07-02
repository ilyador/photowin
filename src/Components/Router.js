import React from 'react'
import {
  Router,
  Route,
  Redirect,
  Switch
} from 'react-router-dom'
import history from '../Helpers/history'

import Login from './Login'
import Inner from './Inner'
import PictureUpload from './PictureUpload'
import Page404 from './Page404'
import Rate from './Rate'
import Layout from './Layout'


const PrivateRoute = ({component, authenticated, updateUserState, ...rest }) => (
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
      <PrivateRoute
        path={'/upload-pictures'}
        authenticated={authenticated}
        updateUserState={updateUserState}
        component={PictureUpload}
      />
      <Route path="/rate" component={Rate} />
      <Route component={Page404} />
    </Switch>
  </Router>
)


export default Routes
