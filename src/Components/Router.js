import React from 'react'
import {
  BrowserRouter as Router,
  Route,
  Redirect,
  Switch
} from 'react-router-dom'
import Landing from './Landing'
import AuthPage from './AuthPage'
import User from './User'
import Page404 from './Page404'
import Rate from './Rate'
import Layout from './Layout'
import Gifts from './Gifts'
import Edit from './Edit'


const privatePages = [
  {
    path: '/user',
    component: <User/>
  }, {
    path: '/rate',
    component: <Rate/>
  }, {
    path: '/gifts',
    component: <Gifts/>
  }, {
    path: '/edit-man',
    component: <Edit gender='men'/>
  }, {
    path: '/edit-woman',
    component: <Edit gender='women'/>
  }
]


export default function Routes ({ user, updateUserState }) {

  return (
    <Router>
      <Switch>
        {privatePages.map((page, index) => (
          <Route key={index} path={page.path}>
            {user ?
              <Layout user={user} updateUserState={updateUserState}>
                {page.component}
              </Layout> :
              <Redirect to='/login'/>
            }
          </Route>
        ))}
        <Route path='/login'>
          {user ?
            <Redirect to='/user'/> :
            <AuthPage updateUserState={updateUserState} type='login'/>
          }
        </Route>
        <Route path='/signup'>
          {user ?
            <Redirect to='/user'/> :
            <AuthPage updateUserState={updateUserState} type='signup'/>
          }
        </Route>
        <Route path='/landing'>
          <Landing/>
        </Route>
        <Route path='/'>
          <Redirect to='/user'/>
        </Route>
        <Route>
          <Page404/>
        </Route>
      </Switch>
    </Router>
  )
}
