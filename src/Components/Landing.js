import React from 'react'
import { I18n } from 'aws-amplify'
import { Link } from 'react-router-dom'
import { makeStyles } from '@material-ui/core'
import Container from '@material-ui/core/Container'
import Placeholder from '@material-ui/icons/Extension'
import Button from '@material-ui/core/Button'
import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography'


const useStyles = makeStyles(theme => ({
  cardGrid: {
    paddingTop: theme.spacing(4),
    paddingBottom: theme.spacing(4),
  },
}))


function Landing () {
  const c = useStyles()

  return (
    <Container className={c.cardGrid} maxWidth="sm">
      <Grid container spacing={1}>
        <Grid item xs={12}>
          LOGO
        </Grid>
        <Grid item xs={12}>
          <Typography variant='h6'>
            {I18n.get('landing_header')}
          </Typography>
        </Grid>
        <Grid item xs={5}>
          <Placeholder/>
        </Grid>
        <Grid item xs={2}>
          <Typography variant='h3'>1</Typography>
        </Grid>
        <Grid item xs={5}>
          {I18n.get('landing_upload')}
        </Grid>
        <Grid item xs={5}>
          {I18n.get('landing_rate')}
        </Grid>
        <Grid item xs={2}>
          <Typography variant='h3'>2</Typography>
        </Grid>
        <Grid item xs={5}>
          <Placeholder/>
        </Grid>
        <Grid item xs={5}>
          <Placeholder/>
        </Grid>
        <Grid item xs={2}>
          <Typography variant='h3'>3</Typography>
        </Grid>
        <Grid item xs={5}>
          {I18n.get('landing_win')}
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
