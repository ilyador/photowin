import useMediaQuery from '@material-ui/core/useMediaQuery/useMediaQuery'
import React, { useEffect, useState } from 'react'
import { makeStyles, useTheme } from '@material-ui/core'
import { API, graphqlOperation as operation, I18n, Storage } from 'aws-amplify'
import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography'
import { listSets } from '../graphql/queries'
import ResultsCard from './ResultsCard'


const useStyles = makeStyles(theme => ({
  pageTitle: {
    textAlign: 'center'
  },
  buttonGridItem: {
    display: 'flex'
  },
  button: {
    margin: [theme.spacing(3), 'auto', 0],
    padding: [0, theme.spacing(6)],
  },
  deleteDialog: {
    width: 254
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


  return (
    <>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Typography variant="h5" className={c.pageTitle}>
            {I18n.get('user_results_old')}
          </Typography>
        </Grid>
        {!loading && oldSets.map((set, index1) => (
          <Grid
            container
            item
            xs={12}
            spacing={desktopDisplay ? 3 : 1}
            key={index1}
          >
          {set.pictures.map((picture, index2) => (
            <ResultsCard key={index2} picture={picture}/>
          ))}
          </Grid>
        ))}
      </Grid>
    </>
  )
}


export default Results
