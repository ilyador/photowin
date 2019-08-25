import React, { useEffect, useState } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import {
  API,
  Storage,
  graphqlOperation as operation
} from 'aws-amplify'
import { getByAppeared } from '../graphql/queries'
import { updatePicture, updateSet } from '../graphql/mutations'
import Card from '@material-ui/core/Card'
import CardActions from '@material-ui/core/CardActions'
import CardMedia from '@material-ui/core/CardMedia'
import Grid from '@material-ui/core/Grid'
import FavoriteIcon from '@material-ui/icons/Favorite'
import Fab from '@material-ui/core/Fab'
import Typography from '@material-ui/core/Typography'


const useStyles = makeStyles(theme => ({
  media: {
    height: 0,
    paddingTop: '100%'
  },
  actions: {
    justifyContent: 'center'
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


function Rate ({ user }) {
  const [loading, setLoading] = useState(true)
  const [picturesSetData, setPicturesSetData] = useState(null)
  const [pictures, setPictures] = useState([])

  const c = useStyles()

  async function getPictureSet () {
    let data = await API.graphql(operation(getByAppeared, {
      type: getGender(user),
      sortDirection: 'DESC',
      limit: 20
    }))


    let { items } = data.data.getByAppeared
    let itemToRateIndex = random(items.length)
    let itemToRate = {
      id: items[itemToRateIndex].id,
      appearedForRanking: items[itemToRateIndex].appearedForRanking
    }

    let pics = items[itemToRateIndex].pictures.items
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
    let pictureInput = { id, rating: rating + 1 }
    let setInput = {
      id: picturesSetData.id,
      appearedForRanking: picturesSetData.appearedForRanking + 1
    }

    let pictureUpdate = API.graphql(operation(updatePicture, { input: pictureInput }))
    let setUpdate = API.graphql(operation(updateSet, { input: setInput }))

    Promise.all([pictureUpdate, setUpdate]).then(() => {
      setLoading(true)
      setPicturesSetData(null)
      setPictures([])
      getPictureSet()
    })
  }


  return (
    <>
      <Grid container spacing={4}>
        <Grid item xs={12}>
          <Typography variant="h4">
            Choose your favorite picture
          </Typography>
        </Grid>
        {!loading && pictures.map((picture, index) => (
          <Grid item key={index} xs={6}>
            <Card>
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
