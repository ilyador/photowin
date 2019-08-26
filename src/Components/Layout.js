import React from 'react'
import { Auth } from 'aws-amplify'
import { makeStyles } from '@material-ui/core/styles'
import { Link } from 'react-router-dom'
import AppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'
import Typography from '@material-ui/core/Typography'
import Button from '@material-ui/core/Button'
import CameraIcon from '@material-ui/icons/PhotoCamera'
import Container from '@material-ui/core/Container'


const useStyles = makeStyles(theme => ({
  cardGrid: {
    paddingTop: theme.spacing(8),
    paddingBottom: theme.spacing(8),
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    flexGrow: 1,
  },
  icon: {
    marginRight: theme.spacing(2),
  },
  logoutButton: {
    marginLeft: theme.spacing(4),
    fontWeight: 300
  }
}))


function Layout ({ updateUserState, component: Component, ...rest }) {
  const c = useStyles()

  const handleLogOut = async () => {
    await Auth.signOut().then(() => {updateUserState(null)})
  }

  return (
    <>
      <AppBar position="static">
        <Toolbar>
          <CameraIcon className={c.icon}/>
          <Typography variant="h6" className={c.title}>
            PhotoWin
          </Typography>
          <Button color='inherit' component={Link} to='/rate'>
            Rate Pictures
          </Button>
          <Button color='inherit' component={Link} to='/user'>
            My Picture Set
          </Button>
          <Button
            color="inherit"
            onClick={handleLogOut}
            className={c.logoutButton}
          >
            Logout
          </Button>
        </Toolbar>
      </AppBar>
      <Container className={c.cardGrid} maxWidth="md">
        <Component {...rest} />
      </Container>
    </>
  )
}


export default Layout
