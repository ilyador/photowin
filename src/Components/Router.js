/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react'
import {
  BrowserRouter as Router,
  Route,
  Redirect,
  Switch
} from 'react-router-dom'
import { API, graphqlOperation as operation } from 'aws-amplify'
import { getUser } from '../graphql/queries'

import Landing from './Landing'
import Login from './Login'
import User from './User'
import OldResults from './OldResults'
import Page404 from './Page404'
import Rate from './Rate'
import Layout from './Layout'
import Gifts from './Gifts'


const PrivateRoute = ({ component, user, updateUserState, ...rest }) => {
  const [points, setPoints] = useState(0)

  useEffect(() => {
    async function loadUser() {
      try {
        let userDb = await API.graphql(operation(getUser, {
          id: user.sub
        }))

        setPoints(userDb.data.getUser.points)
      } catch (error) { console.log(error) }
    }

    if (user) loadUser()
  }, [])


  return (
    <Route {...rest} render={(props) => (
      user
        ? <Layout
          component={component}
          updateUserState={updateUserState}
          user={user}
          points={points}
          updatePoints={setPoints}
          {...props}
        />
        : <Redirect to={'/login'} />
    )} />
  )
}



const Routes = ({ user, updateUserState }) => (
  <Router>
    <Switch>
      <Route
        exact path={'/'}
        render={() => <Redirect to={'/user'} />}
      />
      <Route
        path={'/login'}
        render={routeProps => (
          user ?
            <Redirect to={'/user'} /> :
            <Login updateUserState={updateUserState} {...routeProps} />
        )}
      />
      <Route path={'/landing'} component={Landing} />
      <PrivateRoute
        path={'/user'}
        user={user}
        updateUserState={updateUserState}
        component={User}
      />
      <PrivateRoute
        path={'/old-sets'}
        user={user}
        updateUserState={updateUserState}
        component={OldResults}
      />
      <PrivateRoute
        path={'/rate'}
        user={user}
        updateUserState={updateUserState}
        component={Rate}
      />
      <PrivateRoute
        path={'/gifts'}
        user={user}
        updateUserState={updateUserState}
        component={Gifts}
      />
      <Route component={Page404} />
    </Switch>
  </Router>
)


export default Routes
