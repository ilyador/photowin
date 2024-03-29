import React from 'react'
import { UserContext } from '../helpers/userContext'
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
import Edit from './EditPhotosOffer'
import OldResults from './OldResults'


const privatePages = [
  {
    path: '/user',
    component: <User/>
  }, {
    path: '/rate',
    component: <Rate/>
  }, {
    path: '/old-sets',
    component: <OldResults/>
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


export default function Routes () {
  const { userLoggedIn } = React.useContext(UserContext)

  return (
    <Router>
      <Switch>
        {privatePages.map((page, index) => (
          <Route key={index} path={page.path}>
            {userLoggedIn ?
              <Layout>
                {page.component}
              </Layout> :
              <Redirect to='/login'/>
            }
          </Route>
        ))}
        <Route path='/login'>
          {userLoggedIn ?
            <Redirect to='/user'/> :
            <AuthPage type='login'/>
          }
        </Route>
        <Route path='/signup'>
          {userLoggedIn ?
            <Redirect to='/user'/> :
            <AuthPage type='signup'/>
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
