import React, { useEffect, useState } from 'react'
import { Storage } from 'aws-amplify'
import { makeStyles } from '@material-ui/core'
import Card from '@material-ui/core/Card'
import CardContent from '@material-ui/core/CardContent'
import CardMedia from '@material-ui/core/CardMedia'
import Container from '@material-ui/core/Container'
import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography'
import Button from '@material-ui/core/Button'



const useStyles = makeStyles(theme => ({
  cardGrid: {
    paddingTop: theme.spacing(8),
    paddingBottom: theme.spacing(8),
  },
  card: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
  },
  media: {
    height: 0,
    paddingTop: '100%'
  },
  button: {
    margin: [theme.spacing(8), 'auto', 0],
    display: 'inherit'
  },
  ratingText: {
    textAlign: 'center'
  },
  smallText: {
    fontWeight: 300
  }
}))



function Results ({ userSet, clearSet }) {
  const [loading, setLoading] = useState(true)
  const [pictures, setPictures] = useState([])
  const c = useStyles()


  useEffect(() => { getResults() }, [])


  async function getResults () {
    const pics = userSet.pictures.items

    pics.sort((a, b) => b.rating - a.rating)

    let setWithURLsPromise = pics.map(async (item, index) => {
      item.pictureURL = await Storage.get(pics[index].file.key)
      return item
    })

    let setWithURLs = await Promise.all(setWithURLsPromise)

    setPictures(setWithURLs)
    setLoading(false)
  }


  return (
    <Container className={c.cardGrid} maxWidth="md">
      <Grid container spacing={4}>
        <Grid item xs={12}>
          <Typography variant="h4">
            Your set rating
          </Typography>
        </Grid>
        {!loading && pictures.map((picture, index) => (
          <Grid item key={index} xs={4}>
            <Card className={c.card}>
              <CardMedia
                className={c.media}
                image={picture.pictureURL}
                title="Image title"
              />
              <CardContent>
                <Typography variant="h6" className={c.ratingText}>
                  <small className={c.smallText}>Rated:</small> {picture.rating}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
      <Button
        className={c.button}
        onClick={clearSet}
        variant="contained"
        color="secondary"
        size="large"
      >
        Want to try a new set?
      </Button>
    </Container>
  )
}


export default Results
