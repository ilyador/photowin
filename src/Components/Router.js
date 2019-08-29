import React, { useEffect, useState } from 'react'
import {
  Router,
  Route,
  Redirect,
  Switch
} from 'react-router-dom'
import history from '../Helpers/history'
import { API, Auth, graphqlOperation as operation } from 'aws-amplify'
import { getUser } from '../graphql/queries'


import Login from './Login'
import User from './User'
import Page404 from './Page404'
import Rate from './Rate'
import Layout from './Layout'


const PrivateRoute = ({ component, user, updateUserState, ...rest }) => {
  const [points, setPoints] = useState(0)

  useEffect(() => {
    async function loadUser () {
      try {
        let userDb = await API.graphql(operation(getUser, {
          id: user.sub
        }))

        setPoints(userDb.data.getUser.points)
      } catch (error) { console.log(error) }
    }

    loadUser()
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
        : <Redirect to={'/login'}/>
    )}/>
  )
}

const Routes = ({ user, updateUserState }) => (
  <Router history={history}>
    <Switch>
      <Route
        exact path={'/'}
        render={() => <Redirect to={'/user'}/>}
      />
      <Route
        path={'/login'}
        render={() => (
          user ? (
            <Redirect to={'/user'}/>
          ) : (
            <Login updateUserState={updateUserState}/>
          )
        )}
      />
      <PrivateRoute
        path={'/user'}
        user={user}
        updateUserState={updateUserState}
        component={User}
      />
      <PrivateRoute
        path={'/rate'}
        user={user}
        updateUserState={updateUserState}
        component={Rate}
      />
      <Route component={Page404}/>
    </Switch>
  </Router>
)


export default Routes
