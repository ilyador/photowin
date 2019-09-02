import React from 'react'
import { makeStyles } from '@material-ui/core'
import Card from '@material-ui/core/Card'
import CardContent from '@material-ui/core/CardContent'
import CardMedia from '@material-ui/core/CardMedia'
import Grid from '@material-ui/core/Grid'
import Avatar from '@material-ui/core/Avatar'


const useStyles = makeStyles(theme => ({
  media: {
    height: 0,
    paddingTop: '120%'
  },
  avatar: {
    margin: [-34, 'auto', 0],
    color: '#fff',
    backgroundColor: '#fdb720'
  },
  cardContent: {
    paddingBottom: theme.spacing(2)
  },
  gridItem: {
    marginBottom: theme.spacing(2)
  }
}))


export default function ResultsCard ({ picture }) {
  const c = useStyles()

  return (
    <Grid item xs={4} className={c.gridItem}>
      <Card>
        <CardMedia
          className={c.media}
          image={picture.pictureURL}
          title="Image title"
        />
        <CardContent className={c.cardContent}>
          <Avatar className={c.avatar}>{picture.rating}</Avatar>
        </CardContent>
      </Card>
    </Grid>
  )
}