/* eslint-disable react-hooks/exhaustive-deps */
import React from 'react'
import { I18n } from 'aws-amplify'
import { makeStyles, useTheme } from '@material-ui/core'
import useMediaQuery from '@material-ui/core/useMediaQuery/useMediaQuery'
import Button from '@material-ui/core/Button'
import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography'
import Card from '@material-ui/core/Card'
import CardMedia from '@material-ui/core/CardMedia'
import CardContent from '@material-ui/core/CardContent'
import CardActions from '@material-ui/core/CardActions'
import mensGuide1 from '../content/dates.png'
import mensGuide2 from '../content/photo_secrets.png'
import womensGuide1 from '../content/women_photo.jpg'


const useStyles = makeStyles(theme => ({
  pageTitle: {
    marginBottom: theme.spacing(2),
    textAlign: 'center'
  },
  cardMedia: {
    paddingTop: '100%', // 16:9
  },
  cardContent: {
    flexGrow: 1,
  },
}))


const gifts = {
  male: [
    {
      points: 50,
      url: mensGuide1
    },
    {
      points: 300,
      url: mensGuide2
    },
  ],
  female: [
    {
      points: 50,
      url: womensGuide1
    },
    {
      points: 200,
      url: womensGuide1
    }
  ]
}



function Results ({ user, points }) {
  const c = useStyles()
  const theme = useTheme()
  const desktopDisplay = useMediaQuery(theme.breakpoints.up('sm'))


  return (
    <Grid container spacing={desktopDisplay ? 4 : 2}>
      <Grid item xs={12}>
        <Typography variant="h5" className={c.pageTitle}>
          {I18n.get('gifts_title')}
        </Typography>
      </Grid>
      {gifts[user.gender].map((gift, index) => (
        <Grid item key={index} xs={6}>
          <Card className={c.card}>
            <CardMedia
              className={c.cardMedia}
              image={gift.url}
              title="Image title"
            />
            <CardContent className={c.cardContent}>
              <Typography gutterBottom variant={desktopDisplay ? 'h4' : 'h6'}>
                {I18n.get(`gifts_${user.gender}_${index}`)}
              </Typography>
              <Typography>
                {I18n.get('gifts_points')}&nbsp;{gift.points}
              </Typography>
            </CardContent>
            <CardActions>
              <Button
                fullWidth
                size="large"
                color="secondary"
                disabled={points < gift.points}
              >
                {I18n.get('gifts_get')}
              </Button>
            </CardActions>
          </Card>
        </Grid>
      ))}
    </Grid>
  )
}


export default Results
