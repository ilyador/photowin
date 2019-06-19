import React, { Component } from 'react'
import { Auth } from 'aws-amplify'
import Routes from './Router'


class App extends Component {

  state = {
    authenticating: true,
    user: false,
  }

  async componentDidMount () {
    try {
      let user = await Auth.currentAuthenticatedUser()
      console.log(user)
      this.setState({ user: !!user })
    } catch (error) {
      console.log(error)
    }

    this.setState({ authenticating: false })
  }

  updateUserState = async user => {
    this.setState({ user })
  }

  render () {
    return (
      this.state.authenticating ? (
        <h1>LOADING</h1>
      ) : (
        <Routes
          authenticated={this.state.user}
          updateUserState={this.updateUserState}
        />
      )
    )
  }
}


export default App
