import useMediaQuery from '@material-ui/core/useMediaQuery/useMediaQuery'
import React, { useEffect, useState } from 'react'
import { makeStyles, useTheme } from '@material-ui/core/styles'
import {
  API,
  Storage,
  graphqlOperation as operation, I18n
} from 'aws-amplify'
import { getByAppeared, getUser } from '../graphql/queries'
import { updatePicture, updateSet, updateUser } from '../graphql/mutations'
import Card from '@material-ui/core/Card'
import CardActions from '@material-ui/core/CardActions'
import CardMedia from '@material-ui/core/CardMedia'
import Grid from '@material-ui/core/Grid'
import FavoriteIcon from '@material-ui/icons/Favorite'
import Fab from '@material-ui/core/Fab'
import Typography from '@material-ui/core/Typography'


const useStyles = makeStyles(theme => ({
  pageTitle: {
    marginBottom: theme.spacing(2),
    textAlign: 'center'
  },
  card: {
    cursor: 'pointer'
  },
  media: {
    height: 0,
    paddingTop: '120%'
  },
  actions: {
    justifyContent: 'center',
    marginBottom: theme.spacing(2)
  },
  like: {
    marginTop: -34
  }
}))


const random = max => Math.floor(Math.random() * Math.floor(max))

const getGender = user => {
  const genders = ['male', 'female']

  if (user) {
    let gender = genders.indexOf(user.gender)
    gender = 1 - gender
    return genders[gender]
  } else { return genders[random(2)] }
}


function Rate ({ user, points, updatePoints }) {
  const [loading, setLoading] = useState(true)
  const [picturesSetData, setPicturesSetData] = useState(null)
  const [pictures, setPictures] = useState([])
  const c = useStyles()
  const theme = useTheme()
  const desktopDisplay = useMediaQuery(theme.breakpoints.up('sm'))


  async function getPictureSet () {
    let data = await API.graphql(operation(getByAppeared, {
      type: getGender(user),
      sortDirection: 'DESC',
      limit: 20
    }))


    let userSets = data.data.getByAppeared.items
    let itemToRateIndex = random(userSets.length)
    let itemToRate = {
      id: userSets[itemToRateIndex].id,
      appearedForRanking: userSets[itemToRateIndex].appearedForRanking
    }

    let displayedUser = await API.graphql(operation(getUser, {
      id: itemToRate.id
    }))


    let pics = userSets[itemToRateIndex].pictures.items
    pics.splice(random(3), 1)

    let setWithURLsPromise = pics.map(async (item, index) => {
      item.pictureURL = await Storage.get(pics[index].file.key)
      return item
    })

    let setWithURLs = await Promise.all(setWithURLsPromise)

    setPictures(setWithURLs)
    setPicturesSetData(itemToRate)
    setLoading(false)
  }


  useEffect(() => { getPictureSet() }, [])


  const vote = (id, rating) => () => {

    let pictureUpdate = API.graphql(operation(updatePicture, {
      input: {
        id,
        rating: rating + 1
      }
    }))

    let setUpdate = API.graphql(operation(updateSet, {
      input: {
        id: picturesSetData.id,
        appearedForRanking: picturesSetData.appearedForRanking + 1
      }
    }))

    let userUpdate = API.graphql(operation(updateUser, {
      input: {
        id: user.sub,
        points: points + 1
      }
    }))


    Promise.all([pictureUpdate, setUpdate, userUpdate]).then(() => {
      setLoading(true)
      setPicturesSetData(null)
      setPictures([])
      updatePoints(points + 1)
      getPictureSet()
    })
  }


  return (
    <>
      <Grid container spacing={desktopDisplay ? 3 : 1}>
        <Grid item xs={12}>
          <Typography variant="h5" className={c.pageTitle}>
            {I18n.get(`rate_title_${user.gender}`)}
          </Typography>
        </Grid>
        {!loading && pictures.map((picture, index) => (
          <Grid item key={index} xs={6}>
            <Card
              className={c.card}
              onClick={vote(picture.id, picture.rating)}
            >
              <CardMedia
                className={c.media}
                image={picture.pictureURL}
                title="Image title"
              />
              <CardActions className={c.actions}>
                <Fab
                  color="secondary"
                  className={c.like}
                  onClick={vote(picture.id, picture.rating)}
                >
                  <FavoriteIcon/>
                </Fab>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
    </>
  )
}


export default Rate
