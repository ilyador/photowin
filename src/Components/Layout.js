import React from 'react'
import { Auth } from 'aws-amplify'
import { makeStyles } from '@material-ui/core/styles'
import { Link } from 'react-router-dom'
import AppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'
import Typography from '@material-ui/core/Typography'
import Button from '@material-ui/core/Button'
import CameraIcon from '@material-ui/icons/PhotoCamera';

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1,
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    flexGrow: 1,
  },
  icon: {
    marginRight: theme.spacing(2),
  }
}))


function Layout ({ updateUserState, component: Component, ...rest }) {
  const c = useStyles()

  const handleLogOut = async () => {
    await Auth.signOut().then(() => {updateUserState(null)})
  }

  return (
    <div>
      <AppBar position="static">
        <Toolbar>
          <CameraIcon className={c.icon} />
          <Typography variant="h6" className={c.title}>
            PhotoWin
          </Typography>
          <Button color='inherit' component={Link} to='/rate'>
            Rate Pictures
          </Button>
          <Button color='inherit' component={Link} to='/user'>
            My Picture Set
          </Button>
          <Button color="inherit" onClick={handleLogOut}>Logout</Button>
        </Toolbar>
      </AppBar>
      <Component {...rest} />
    </div>
  )
}


export default Layout
