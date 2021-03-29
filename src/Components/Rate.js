import React, { useEffect, useState } from 'react'
import { UserContext } from '../helpers/userContext'
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
import Container from '@material-ui/core/Container'
import useMediaQuery from '@material-ui/core/useMediaQuery/useMediaQuery'
import trapPicture from '../content/trap.jpg'

const TRAP_RATE = 0.95


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
  },
  ratedUser: {
    textAlign: 'center',
    marginBottom: theme.spacing(1)
  },
  ratedUserName: {
    fontWeight: 700
  },
  ratedUserAge: {
    fontWeight: 400
  }
}))


const random = max => Math.floor(Math.random() * Math.floor(max))

const getGender = (gender) => {
  const genders = ['man', 'woman']

  let _gender = genders.indexOf(gender)
  _gender = 1 - _gender
  return genders[_gender]
}



function Rate () {
  const [loading, setLoading] = useState(true)
  const [picturesSetData, setPicturesSetData] = useState(null)
  const [ratedUser, setRatedUser] = useState(null)
  const [pictures, setPictures] = useState([])
  const c = useStyles()
  const theme = useTheme()
  const desktopDisplay = useMediaQuery(theme.breakpoints.up('sm'))
  const { user: activeUser, userSet, setUser } = React.useContext(UserContext)


  useEffect(() => {
    loading && getPictureSet()

    async function getPictureSet () {

      let genderToRate = getGender(activeUser.gender)

      if (userSet) {
        genderToRate = userSet?.genderToRate
        if (genderToRate === 'both') {
          const sex = ['man', 'woman']
          genderToRate = sex[Math.floor(Math.random() * 2)]
        }
      }

      try {
        const data = await API.graphql(operation(getByAppeared, {
          type: genderToRate,
          sortDirection: 'DESC',
          limit: 100,
          filter: {
            active: { eq: true },
            user: { ne: activeUser.sub }
          }
        }))

        const userSets = data.data.getByAppeared.items
        const itemToRateIndex = random(userSets.length)
        const { id, user, appearedForRanking } = userSets[itemToRateIndex]
        const itemToRate = { id, user, appearedForRanking }

        const displayedUser = await API.graphql(operation(getUser, {
          id: itemToRate.user
        }))

        const userInfo = displayedUser.data.getUser

        if (!userInfo) getPictureSet ()

        const pics = userSets[itemToRateIndex].pictures.items

        if (Math.random() > TRAP_RATE) {
          if (pics.length > 2) pics.splice(random(3), 1)

          const setWithURLsPromise = pics.map(async (item, index) => {
            item.pictureURL = await Storage.get(pics[index].file.key)
            return item
          })

          const setWithURLs = await Promise.all(setWithURLsPromise)

          console.log(setWithURLs)

          setPictures(setWithURLs)
        }

        else {
          const realPicture = pics[random(pics.length)]
          realPicture.pictureURL = await Storage.get(realPicture.file.key)

          const trap = {
            id: 'xxx',
            pictureURL: trapPicture
          }

          setPictures([realPicture, trap])
        }

        setPicturesSetData(itemToRate)
        setRatedUser(userInfo)
        setLoading(false)
      } catch (error) {
        console.log(error)
      }
    }
  }, [loading])


  const vote = (trap, id, rating) => () => {
    if (!trap) {
      const points = Number(activeUser.points)

      const pictureUpdate = API.graphql(operation(updatePicture, {
        input: {
          id,
          rating: rating + 1
        }
      }))

      const setUpdate = API.graphql(operation(updateSet, {
        input: {
          id: picturesSetData.id,
          appearedForRanking: picturesSetData.appearedForRanking + 1
        }
      }))

      const userUpdate = API.graphql(operation(updateUser, {
        input: {
          id: activeUser.sub,
          points: points + 1
        }
      }))


      Promise.all([pictureUpdate, setUpdate, userUpdate]).then(() => {
        setLoading(true)
        setPicturesSetData(null)
        setPictures([])
        setUser({ ...activeUser, points: points + 1 })
      })
    }

    else { //trap

    }
  }


  return (
    <Container maxWidth="md">
      {(!loading && ratedUser) && <Grid container spacing={desktopDisplay ? 3 : 1}>
        <Grid item xs={12}>
          <Typography variant="h5" className={c.pageTitle}>
            {I18n.get(`rate_title_${activeUser.gender}`)}
          </Typography>
          <Typography variant="h6" className={c.ratedUser}>
            <span className={c.ratedUserName}>{ratedUser.name}</span>&nbsp;
            <span className={c.ratedUserAge}>{ratedUser.age}</span>
          </Typography>
        </Grid>
        {pictures.map((picture, index) => (
          <Grid item key={index} xs={6}>
            <Card
              className={c.card}
              onClick={vote(picture.trap, picture.id, picture.rating)}
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
                  onClick={vote(picture.trap, picture.id, picture.rating)}
                >
                  <FavoriteIcon/>
                </Fab>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>}
    </Container>
  )
}


export default Rate
