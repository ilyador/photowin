import { Auth } from 'aws-amplify'
import React from 'react'


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
        <button onClick={handleLogOut}>Sign Out</button>
      </header>
      <Component {...rest} />
    </div>
  )
}


export default Layout
