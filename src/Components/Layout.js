import { Auth } from 'aws-amplify'
import React, { Component } from 'react'
import { Button } from 'react-bootstrap'
import withStyles from 'react-jss'


const styles = theme => ({
  page: {}
})


class Layout extends Component {

  handleLogOut = async () => {
    try {
      await Auth.signOut()
      this.props.updateUserState(null)
      console.log('sign out successful')
    } catch (error) {
      console.log(error)
    }
  }

  render () {
    const { classes: c, component: Component, ...rest } = this.props

    return (
      <div className={c.page}>
        <header className="App-header">
          <h1 className="App-title">Welcome to Photo Win</h1>
          <Button onClick={this.handleLogOut}>Sign Out</Button>
        </header>
        <Component {...rest} />
      </div>
    )
  }
}


export default withStyles(styles)(Layout)
