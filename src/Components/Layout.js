import React from 'react'
import { Auth, I18n } from 'aws-amplify'
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
import Badge from '@material-ui/core/Badge'
import AccountCircle from '@material-ui/icons/AccountCircle'
import history from '../Helpers/history'



const useStyles = makeStyles(theme => ({
  ltr: {
    direction: 'ltr'
  },
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
  },
  linkToRate: {
    marginTop: 4
  }
}))


function Layout ({ updateUserState, points, component: Component, match, ...rest }) {
  const [anchorEl, setAnchorEl] = React.useState(null)
  const isMenuOpen = Boolean(anchorEl)
  const c = useStyles()

  const handleLogOut = () => {
    Auth.signOut().then(() => { updateUserState(null) })
  }

  const handleMyPictures = () => {
    history.push('/user')
    handleMenuClose()
  }

  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget)
  }

  const handleMenuClose = () => {
    setAnchorEl(null)
  }


  const renderMenu = (
    <Menu
      anchorEl={anchorEl}
      anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      keepMounted
      transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      open={isMenuOpen}
      onClose={handleMenuClose}
    >
      <MenuItem onClick={handleMenuClose}>
        {I18n.get('my_points')}: {points}
      </MenuItem>
      <MenuItem onClick={handleMyPictures}>
        {I18n.get('layout_my_pictures')}
      </MenuItem>
      <MenuItem onClick={handleLogOut}>
        {I18n.get('layout_logout')}
      </MenuItem>
    </Menu>
  )


  return (
    <>
      <AppBar position="static">
        <Toolbar className={c.ltr}>
          <CameraIcon className={c.icon}/>
          <Typography variant="h6" className={c.title}>
            ProPhotoWin
          </Typography>
          {(match.path !== '/rate') &&
          <Button
            className={c.linkToRate}
            color='inherit'
            component={Link}
            to='/rate'
          >
            {I18n.get('layout_rate_pictures')}
          </Button>
          }
          <IconButton
            edge="end"
            onClick={handleProfileMenuOpen}
            color="inherit"
          >
            <Badge className={c.margin} badgeContent={points} color="secondary">
              <AccountCircle/>
            </Badge>
          </IconButton>
        </Toolbar>
      </AppBar>
      {renderMenu}
      <Container className={c.cardGrid} maxWidth="md">
        <Component points={points} {...rest} />
      </Container>
    </>
  )
}


export default Layout
