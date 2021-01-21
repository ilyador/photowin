import React, { useEffect, useState } from 'react'
import { UserContext } from '../helpers/userContext'
import { makeStyles } from '@material-ui/core'
import { Auth, API, graphqlOperation as operation } from 'aws-amplify'
import { getUser, listSets } from '../graphql/queries'
import Routes from './Router'
import SyncIcon from '@material-ui/icons/Sync'


const useStyles = makeStyles({
  uploadingIcon: {
    animation: 'rotating 2s linear infinite',
    fontSize: 60
  },
  wrapper: {
    width: '100%',
    height: 300
  },
  spinner: {
    width: 60,
    margin: [260, 'auto', 0]
  }
})



export default function App () {
  const [user, setUser] = useState(null)
  const [userSet, setUserSet] = useState(null)
  const [userSetRetrieved, setUserSetRetrieved] = useState(false)
  const [authenticating, setAuthenticating] = useState(true)
  const [pageReady, setPageReady] = useState(false)
  const c = useStyles()


  useEffect(() => {
    async function _getUser () {
      try {
        const userResponse = await Auth.currentAuthenticatedUser()
        let _user = userResponse.attributes

        if (_user.sub) {
          const query = { id: _user.sub }
          const response = await API.graphql(operation(getUser, query))
          _user.points = response.data.getUser.points
        }

        setUser(_user)

      } catch (error) {
        console.log(error)
      }

      finally {
        setAuthenticating(false)
      }
    }

    _getUser()
  }, [])


  useEffect(() => {
    async function _getSets () {
      try {
        const _listSets = await API.graphql(operation(listSets, {
          limit: 30,
          filter: {
            user: { eq: user.sub },
            active: { eq: true }
          }
        }))

        const sets = _listSets.data.listSets.items
        const activeSet = sets.find(item => item.active)
        setUserSet(activeSet)

      } catch (error) {
        console.log(error)
      }

      finally {
        setUserSetRetrieved(true)
      }
    }

    user &&_getSets()
  }, [user])


  useEffect(() => {
    if (userSetRetrieved && !authenticating) {
      setPageReady(true)
    }
  }, [userSetRetrieved, authenticating])


  return (
    !pageReady ?
      <div className={c.wrapper}>
        <div className={c.spinner}>
          <SyncIcon className={c.uploadingIcon}/>
        </div>
      </div>
      :
      <UserContext.Provider value={{ user, setUser, userSet, setUserSet }}>
        <Routes/>
      </UserContext.Provider>
  )
}
