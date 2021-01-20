import React, { cloneElement } from 'react'
import { useLocation, useHistory } from 'react-router-dom'
import { Auth, I18n } from 'aws-amplify'
import { makeStyles } from '@material-ui/core/styles'
import { Link } from 'react-router-dom'
import AppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'
import Typography from '@material-ui/core/Typography'
import Button from '@material-ui/core/Button'
import CameraIcon from '@material-ui/icons/PhotoCamera'
import IconButton from '@material-ui/core/IconButton'
import MenuItem from '@material-ui/core/MenuItem'
import Menu from '@material-ui/core/Menu'
import Badge from '@material-ui/core/Badge'
import AccountCircle from '@material-ui/icons/AccountCircle'
import { UserContext } from '../helpers/userContext'



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
  homeLink: {
    display: "flex",
    color: "white",
    textDecoration: "none",
    alignItems: "center",
    width: 140
  },
  icon: {
    marginRight: theme.spacing(2),
  },
  logoutButton: {
    marginLeft: theme.spacing(4),
    fontWeight: 300
  },
  link: {
    marginTop: 4
  }
}))


function Layout({ children }) {
  const [anchorEl, setAnchorEl] = React.useState(null)
  const isMenuOpen = Boolean(anchorEl)
  let { pathname } = useLocation()
  const history = useHistory()
  const c = useStyles()
  const { user, setUser  } = React.useContext(UserContext)



  const handleLogOut = () => {
    Auth.signOut().then(() => { setUser(null) })
  }

  const handleMyPictures = () => {
    history.push('/user')
    handleMenuClose()
  }

  const handleOldPictures = () => {
    history.push('/old-sets')
    handleMenuClose()
  }

  const handleMyGifts = () => {
    history.push('/gifts')
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
        {I18n.get('my_points')}: {user.points}
      </MenuItem>
      <MenuItem onClick={handleMyPictures}>
        {I18n.get('layout_my_pictures')}
      </MenuItem>
      <MenuItem onClick={handleMyGifts}>
        {I18n.get('gifts_title')}
      </MenuItem>
      <MenuItem onClick={handleOldPictures}>
        {I18n.get('layout_old_pictures')}
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
          <div className={c.title}>
            <Link to='/rate' className={c.homeLink}>
              <CameraIcon className={c.icon} />
              <Typography variant="h6">
                PhotoWin
              </Typography>
            </Link>
          </div>
          <Button
            className={c.link}
            color='inherit'
            component={Link}
            to={(pathname !== '/user') ? '/user' : '/rate'}
          >
            {(pathname !== '/user') ?
              I18n.get('layout_my_pictures') :
              I18n.get('layout_rate_pictures')
            }
          </Button>
          <IconButton
            edge="end"
            onClick={handleProfileMenuOpen}
            color="inherit"
          >
            <Badge className={c.margin} badgeContent={user.points} color="secondary">
              <AccountCircle />
            </Badge>
          </IconButton>
        </Toolbar>
      </AppBar>
      {renderMenu}
      <div className={c.cardGrid}>
        {cloneElement(children, { user, setUser })}
      </div>
    </>
  )
}


export default Layout
