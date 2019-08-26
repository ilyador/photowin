import { makeStyles } from '@material-ui/core'
import React, { useEffect, useState } from 'react'
import { Auth } from 'aws-amplify'
import Routes from './Router'
import SyncIcon from '@material-ui/icons/Sync'



const useStyles = makeStyles({
  '@keyframes rotating': {
    from: { transform: 'rotate(0deg)' },
    to: { transform: 'rotate(360deg)' }
  },
  uploadingIcon: {
    animation: '$rotating 2s linear infinite',
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



function App () {
  const [user, setUser] = useState(null)
  const [authenticating, setAuthenticating] = useState(true)
  const c = useStyles()


  useEffect(() => {
    Auth.currentAuthenticatedUser()
      .then(data => { setUser(data.attributes) })
      .catch(error => { console.log(error) })
      .finally(() => { setAuthenticating(false) })
  }, [])

  const updateUserState = async user => {
    setUser(user)
  }

  return (
    authenticating ? (
      <div className={c.wrapper}>
        <div className={c.spinner}>
          <SyncIcon className={c.uploadingIcon}/>
        </div>
      </div>
    ) : (
      <Routes
        user={user}
        updateUserState={updateUserState}
      />
    )
  )
}


export default App
