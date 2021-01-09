/* eslint-disable react-hooks/exhaustive-deps */
import Container from '@material-ui/core/Container'
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
import menGuide1 from '../content/men1.jpg'
import menGuide2 from '../content/men2.jpg'
import womenGuide1 from '../content/women1.jpg'
import menPdf1 from '../content/photo-secrets.pdf'
import menPdf2 from '../content/date-in-3-moves.pdf'



const useStyles = makeStyles(theme => ({
  pageTitle: {
    marginBottom: theme.spacing(2),
    textAlign: 'center'
  },
  card: {
    display: 'flex',
    height: 225
  },
  details: {
    display: 'flex',
    flexDirection: 'column',
  },
  content: {
    flex: '1 0 auto',
  },
  cover: {
    width: 150,
    backgroundSize: [150, 'auto'],
    flex: [0, 0, '150px']
  },
  controls: {
    display: 'flex',
    alignItems: 'center',
    paddingLeft: theme.spacing(1),
    paddingBottom: theme.spacing(1),
  },
  playIcon: {
    height: 38,
    width: 38,
  },
}))



function Results ({ user, points }) {
  const c = useStyles()
  const theme = useTheme()
  const desktopDisplay = useMediaQuery(theme.breakpoints.up('sm'))


  const gifts = {
    male: [
      {
        title: I18n.get('gifts_male_1'),
        points: 50,
        image: menGuide1,
        url: menPdf1
      },
      {
        title: I18n.get('gifts_male_2'),
        points: 300,
        image: menGuide2,
        url: menPdf2
      },
    ],
    female: [
      {
        title: I18n.get('gifts_female_1'),
        points: 200,
        image: womenGuide1,
        url: 'https://pua.ravpage.co.il/BeautyBook'
      }
    ]
  }



  return (
    <Container maxWidth="md">
      <Grid container spacing={desktopDisplay ? 4 : 2}>
        <Grid item xs={12}>
          <Typography variant="h5" className={c.pageTitle}>
            {I18n.get('gifts_title')}
          </Typography>
        </Grid>
        {gifts[user.gender].map((gift, index) => (
          <Grid item key={index} xs={12} md={6}>
            <Card className={c.card}>
              <CardMedia
                className={c.cover}
                image={gift.image}
                title='gift'
              />
              <div className={c.details}>
                <CardContent className={c.content}>
                  <Typography gutterBottom variant={desktopDisplay ? 'h4' : 'h6'}>
                    {gift.title}
                  </Typography>
                  <Typography>
                    {I18n.get('gifts_points')}&nbsp;{gift.points}
                  </Typography>
                </CardContent>
                <div className={c.controls}>
                  <CardActions>
                    <Button
                      fullWidth
                      size="large"
                      color="secondary"
                      disabled={points < gift.points}
                      component={'a'}
                      href={gift.url}
                    >
                      {I18n.get('gifts_get')}
                    </Button>
                  </CardActions>
                </div>
              </div>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  )
}


export default Results
