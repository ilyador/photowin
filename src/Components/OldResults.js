import React, { useEffect, useState } from 'react'
import { makeStyles, useTheme } from '@material-ui/core'
import { API, graphqlOperation as operation, I18n, Storage } from 'aws-amplify'
import useMediaQuery from '@material-ui/core/useMediaQuery/useMediaQuery'
import { listSets } from '../graphql/queries'
import { deleteSet, deletePicture } from '../graphql/mutations'
import ResultsCard from './ResultsCard'
import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography'
import DeleteIcon from '@material-ui/icons/Delete'
import Fab from '@material-ui/core/Fab'


const useStyles = makeStyles(theme => ({
  pageTitle: {
    textAlign: 'center',
    marginBottom: theme.spacing(3)
  },
  buttonGridItem: {
    display: 'flex'
  },
  button: {
    margin: [theme.spacing(3), 'auto', 0],
    padding: [0, theme.spacing(6)],
  },
  deleteButton: {
    margin: [-theme.spacing(1), 'auto', theme.spacing(8)],
  },
  deleteDialog: {
    width: 254
  },
  icon: {
    marginRight: theme.spacing(1),
  }
}))



function Results ({ user }) {
  const [loading, setLoading] = useState(true)
  const [oldSets, setOldSets] = useState([])
  const c = useStyles()
  const theme = useTheme()
  const desktopDisplay = useMediaQuery(theme.breakpoints.up('sm'))


  useEffect(() => { getResults() }, [])


  async function getResults () {
    const data = await API.graphql(operation(listSets, {
      filter: {
        user: { eq: user.sub },
        active: { eq: false }
      }
    }))

    let oldSets = data.data.listSets.items

    for (let i = 0; i < oldSets.length; i++) {
      let pics = oldSets[i].pictures.items

      pics.sort((a, b) => a.rating - b.rating)

      let setWithURLsPromise = pics.map(async (pic, index) => {
        pic.pictureURL = await Storage.get(pics[index].file.key)
        return pic
      })

      oldSets[i].pictures = await Promise.all(setWithURLsPromise)
      delete oldSets[i].pictures.items
    }

    setOldSets(oldSets)
    setLoading(false)
  }


  const handleDeleteSet = (set ,index) => async () => {
    const deletedSet = API.graphql(operation(deleteSet, { input: { id: set.id } }))

    let promises = set.pictures.flatMap(picture => {
      let deletePictureDB = API.graphql(operation(deletePicture, { input: { id: picture.id } }))
      let deletePictureStorage = Storage.remove(picture.file.key)

      return [deletePictureDB, deletePictureStorage]
    })
    promises.push(deletedSet)

    await Promise.all(promises)

    let sets = [...oldSets]
    sets.splice(index, 1)
    setOldSets(sets)
  }


  return (
    <div>
      <Typography variant="h5" className={c.pageTitle}>
        {I18n.get('user_results_old')}
      </Typography>
      {!loading && oldSets.map((set, index1) => (
        <Grid
          container spacing={desktopDisplay ? 3 : 1}
          key={index1}
        >
          {set.pictures.map((picture, index2) => (
            <ResultsCard key={index2} picture={picture}/>
          ))}
          <Fab
            variant="extended"
            color="default"
            onClick={handleDeleteSet(set, index1)}
            className={c.deleteButton}
          >
            {I18n.get(`user_delete_set_${user.gender}`)}
            <DeleteIcon className={c.icon}/>
          </Fab>
        </Grid>
      ))}
    </div>
  )
}


export default Results
