import React, { useEffect, useState } from 'react'
import { makeStyles } from '@material-ui/core'
import { Storage } from 'aws-amplify'
import Fab from '@material-ui/core/Fab'
import Card from '@material-ui/core/Card'
import CardContent from '@material-ui/core/CardContent'
import CardMedia from '@material-ui/core/CardMedia'
import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography'



const useStyles = makeStyles(theme => ({
  media: {
    height: 0,
    paddingTop: '100%'
  },
  buttonGridItem: {
    display: 'flex'
  },
  button: {
    margin: [theme.spacing(2), 'auto', 0],
    padding: [0, theme.spacing(6)],
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
    <>
      <Grid container spacing={4}>
        <Grid item xs={12}>
          <Typography variant="h4">
            Your set rating
          </Typography>
        </Grid>
        {!loading && pictures.map((picture, index) => (
          <Grid item key={index} xs={4}>
            <Card>
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
        <Grid item xs={12} className={c.buttonGridItem}>
          <Fab
            variant="extended"
            color="secondary"
            className={c.button}
            onClick={clearSet}
          >
            Want to try a new set?
          </Fab>
        </Grid>
      </Grid>
    </>
  )
}


export default Results
