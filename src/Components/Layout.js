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
import IconButton from '@material-ui/core/IconButton'
import MenuItem from '@material-ui/core/MenuItem'
import Menu from '@material-ui/core/Menu'
import AccountCircle from '@material-ui/icons/AccountCircle'
import history from '../Helpers/history'



const useStyles = makeStyles(theme => ({
  cardGrid: {
    paddingTop: theme.spacing(4),
    paddingBottom: theme.spacing(4),
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


function Layout ({ updateUserState, component: Component, match, ...rest }) {
  const c = useStyles()
  const [anchorEl, setAnchorEl] = React.useState(null)
  const isMenuOpen = Boolean(anchorEl)

  const handleLogOut = async () => {
    await Auth.signOut().then(() => {updateUserState(null)})
  }

  function handleProfileMenuOpen (event) {
    setAnchorEl(event.currentTarget)
  }

  function handleMenuClose () {
    setAnchorEl(null)
  }


  const menuId = 'primary-search-account-menu'
  const renderMenu = (
    <Menu
      anchorEl={anchorEl}
      anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      id={menuId}
      keepMounted
      transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      open={isMenuOpen}
      onClose={handleMenuClose}
    >
      <MenuItem onClick={() => {history.push('/user')}}>My Pictures</MenuItem>
      <MenuItem onClick={handleLogOut}>Log Out</MenuItem>
    </Menu>
  )


  return (
    <>
      <AppBar position="static">
        <Toolbar>
          <CameraIcon className={c.icon}/>
          <Typography variant="h6" className={c.title}>
            PhotoWin
          </Typography>
          {(match.path !== '/rate') &&
          <Button color='inherit' component={Link} to='/rate'>
            Rate Pictures
          </Button>
          }
          <div className={c.sectionDesktop}>
            <IconButton
              edge="end"
              onClick={handleProfileMenuOpen}
              color="inherit"
            >
              <AccountCircle />
            </IconButton>
          </div>
        </Toolbar>
      </AppBar>
      {renderMenu}
      <Container className={c.cardGrid} maxWidth="md">
        <Component {...rest} />
      </Container>
    </>
  )
}


export default Layout
