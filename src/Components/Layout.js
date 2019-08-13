import { Auth } from 'aws-amplify'
import React from 'react'
import Button from 'react-bootstrap/Button'


function Layout({ updateUserState, component: Component, ...rest }) {

  const handleLogOut = async () => {
    try {
      await Auth.signOut()
      updateUserState(null)
      console.log('sign out successful')
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <div>
      <header className="App-header">
        <h1 className="App-title">Welcome to Photo Win</h1>
        <Button onClick={handleLogOut}>Sign Out</Button>
      </header>
      <Component {...rest} />
    </div>
  )
}


export default Layout
