import React, { useEffect, useState } from 'react'
import { makeStyles } from '@material-ui/core'
import { Auth, API, graphqlOperation as operation } from 'aws-amplify'
import { getUser } from '../graphql/queries'
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
  const [authenticating, setAuthenticating] = useState(true)
  const c = useStyles()

  useEffect(() => {
    _getUser()

    async function _getUser() {
      try {
        const userResponse = await Auth.currentAuthenticatedUser()
        let _user = userResponse.attributes

        if (_user.sub) {
          const query = { id: _user.sub }
          const response = await API.graphql(operation(getUser, query))
          _user.points = String(response.data.getUser.points)
        }

        setUser(_user)
      }

      catch (error) {
        console.log(error)
      }

      finally {
        setAuthenticating(false)
      }
    }

  }, [])

  function updateUserState(user) {
    setUser(user)
  }

  return (
    authenticating ?
      <div className={c.wrapper}>
        <div className={c.spinner}>
          <SyncIcon className={c.uploadingIcon}/>
        </div>
      </div>
    :
      <Routes
        user={user}
        updateUserState={updateUserState}
      />
  )
}
