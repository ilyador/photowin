import React, { useEffect, useState } from 'react'
import { Auth } from 'aws-amplify'
import Routes from './Router'


function App () {

  const [user, setUser] = useState(null)
  const [authenticating, setAuthenticating] = useState(true)

  useEffect(() => {
    Auth.currentAuthenticatedUser()
      .then(user => setUser(user.attributes))
      .catch(error => { console.log(error) })
      .finally(() => {setAuthenticating(false)})
  }, [])

  const updateUserState = async user => {
    this.setState({ user })
  }

  return (
    authenticating ? (
      <h1>LOADING</h1>
    ) : (
      <Routes
        user={user}
        updateUserState={updateUserState}
      />
    )
  )
}


export default App
