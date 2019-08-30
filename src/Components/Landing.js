import React from 'react'
import { I18n } from 'aws-amplify'
import { Link } from 'react-router-dom'
import { makeStyles } from '@material-ui/core'
import Container from '@material-ui/core/Container'
import Placeholder from '@material-ui/icons/Extension'
import Button from '@material-ui/core/Button'
import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography'
import CameraIcon from '@material-ui/icons/PhotoCamera'



const useStyles = makeStyles(theme => ({
  icon: {
    marginRight: theme.spacing(1),
  },
  logo: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
  },
  cardGrid: {
    paddingTop: theme.spacing(4),
    paddingBottom: theme.spacing(4),
  },
  background: {
    backgroundColor: '#edeef0',
    padding: [theme.spacing(2), 0]
  },
  title: {
    color: '#87898e',
    textAlign: 'center',
    lineHeight: 1.2,
    marginBottom: theme.spacing(4)
  },
  rightItem: {
    direction: 'ltr'
  },
  centerItem: {
    textAlign: 'center'
  },
  leftItem: {},
  action: {
    paddingTop: theme.spacing(1),
    fontSize: '1.1rem',
    lineHeight: 1
  },
  noMarginRight: {
    extend: 'action',
    transform: `translateX(${theme.spacing(3)}px)`
  },
  noMarginLeft: {
    extend: 'action',
    transform: `translateX(-${theme.spacing(3)}px)`
  },
  button: {
    marginTop: theme.spacing(6)
  }
}))


function Landing () {
  const c = useStyles()

  return (
    <Container className={c.cardGrid} maxWidth="xs">
      <Grid container spacing={3}>
        <Grid item xs={12} className={c.logo}>
          <Typography variant="h6" className={c.appName}>
            ProPhotoWin
          </Typography>
          <CameraIcon className={c.icon}/>
        </Grid>
        <Grid item xs={12}>
          <Typography variant='h6' className={c.title}>
            {I18n.get('landing_header')}
          </Typography>
        </Grid>
      </Grid>
      <Grid container spacing={3} className={c.background}>
        <Grid item xs={5} className={c.rightItem}>
          <Placeholder/>
        </Grid>
        <Grid item xs={2} className={c.centerItem}>
          <Typography variant='h3'>1</Typography>
        </Grid>
        <Grid item xs={5} className={c.leftItem}>
          <Typography variant='h6' className={c.noMarginRight}>
            {I18n.get('landing_upload')}
          </Typography>
        </Grid>
        <Grid item xs={5} className={c.rightItem}>
          <Typography variant='h6' className={c.noMarginLeft}>
            {I18n.get('landing_rate')}
          </Typography>
        </Grid>
        <Grid item xs={2} className={c.centerItem}>
          <Typography variant='h3'>2</Typography>
        </Grid>
        <Grid item xs={5} className={c.leftItem}>
          <Placeholder/>
        </Grid>
        <Grid item xs={5} className={c.rightItem}>
          <Placeholder/>
        </Grid>
        <Grid item xs={2} className={c.centerItem}>
          <Typography variant='h3'>3</Typography>
        </Grid>
        <Grid item xs={5} className={c.leftItem}>
          <Typography variant='h6' className={c.noMarginRight}>
            {I18n.get('landing_win')}
          </Typography>
        </Grid>
      </Grid>
      <Button
        fullWidth
        className={c.button}
        component={Link}
        to='/login?signup'
        variant="contained"
        color="primary"
        size="large"
      >
        {I18n.get('landing_register')}
      </Button>
    </Container>
  )
}


export default Landing
