import useMediaQuery from '@material-ui/core/useMediaQuery/useMediaQuery'
import React, { useEffect, useState } from 'react'
import { makeStyles, useTheme } from '@material-ui/core'
import { I18n, Storage } from 'aws-amplify'
import Fab from '@material-ui/core/Fab'
import Card from '@material-ui/core/Card'
import CardContent from '@material-ui/core/CardContent'
import CardMedia from '@material-ui/core/CardMedia'
import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography'



const useStyles = makeStyles(theme => ({
  pageTitle: {
    marginBottom: theme.spacing(2)
  },
  media: {
    height: 0,
    paddingTop: '120%'
  },
  buttonGridItem: {
    display: 'flex'
  },
  button: {
    margin: [theme.spacing(3), 'auto', 0],
    padding: [0, theme.spacing(6)],
  },
  ratingText: {
    textAlign: 'center'
  },
  smallText: {
    fontWeight: 300
  }
}))



function Results ({ user, userSet, clearSet }) {
  const [loading, setLoading] = useState(true)
  const [pictures, setPictures] = useState([])
  const c = useStyles()
  const theme = useTheme()
  const desktopDisplay = useMediaQuery(theme.breakpoints.up('sm'))

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
      <Grid container spacing={desktopDisplay ? 3 : 1}>
        <Grid item xs={12}>
          <Typography variant="h5" className={c.pageTitle}>
            {I18n.get(`user_results_title_${user.gender}`)}
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
                  <small className={c.smallText}>
                    {I18n.get('user_results_rating')}
                  </small> {picture.rating}
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
            {I18n.get('user_upload_new')}
          </Fab>
        </Grid>
      </Grid>
    </>
  )
}


export default Results
