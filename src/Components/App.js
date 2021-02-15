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
  const [tempUser, setTempUser] = useState(null)
  const [user, setUser] = useState(null)
  const [userSet, setUserSet] = useState(null)
  const [newUserSet, setNewUserSet] = useState(false)
  const [authState, setAuthState] = useState('loading')
  const [userLoggedIn, setUserLoggedIn] = useState(false)
  const [pageReady, setPageReady] = useState(false)
  const c = useStyles()


  useEffect(() => {
    async function _determineAuth () {
      try {
        const userResponse = await Auth.currentAuthenticatedUser()
        let _user = userResponse.attributes
        setTempUser(_user)
        setAuthState('logged in')
      } catch (error) {
        setAuthState('not logged in')
      }
    }

    _determineAuth()
  }, [])


  useEffect(() => {
    async function _getUserData () {
      try {
        const query = { id: tempUser.sub }
        const response = await API.graphql(operation(getUser, query))
        const { points } = response.data.getUser

        setUser({ ...tempUser, points })
      } catch (error) {
        setAuthState('user data retrieved')
        console.log('could not retrieve user from DB', error)
      }
    }

    tempUser && _getUserData()
  }, [tempUser])


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
        setUserSet(sets[0])
        setNewUserSet(false)

      } catch (error) {
        console.log('Could not get active set', error)
      } finally {
        setAuthState('user data & sets retrieved')
      }
    }

    if (user || newUserSet) _getSets()
  }, [user, newUserSet])


  useEffect(() => {
    if (authState === 'user data & sets retrieved') {
      setPageReady(true)
      setUserLoggedIn(true)
    }

    if (authState === 'not logged in') {
      setPageReady(true)
    }
  }, [authState])


  useEffect(() => {
    if (!userLoggedIn && pageReady) {
      setAuthState('not logged in')
      setUser(null)
    }
  }, [userLoggedIn])


  return (
    !pageReady ?
      <div className={c.wrapper}>
        <div className={c.spinner}>
          <SyncIcon className={c.uploadingIcon}/>
        </div>
      </div>
      :
      <UserContext.Provider
        value={{
          user,
          setUser,
          userSet,
          setUserSet,
          userLoggedIn,
          setUserLoggedIn,
          setTempUser,
          setNewUserSet
        }}
      >
        <Routes/>
      </UserContext.Provider>
  )
}
