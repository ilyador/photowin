import React, { useEffect, useState } from 'react'
import { I18n, Storage } from 'aws-amplify'
import { makeStyles, useTheme } from '@material-ui/core'
import useMediaQuery from '@material-ui/core/useMediaQuery/useMediaQuery'
import Fab from '@material-ui/core/Fab'
import Button from '@material-ui/core/Button'
import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogTitle from '@material-ui/core/DialogTitle'
import ResultsCard from './ResultsCard'


const useStyles = makeStyles(theme => ({
  pageTitle: {
    marginBottom: theme.spacing(2),
    textAlign: 'center'
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
  avatar: {
    margin: [-34, 'auto', 0],
    color: '#fff',
    backgroundColor: '#fdb720'
  },
  cardContent: {
    paddingBottom: theme.spacing(2)
  },
  deleteDialog: {
    width: 254
  }
}))



function Results ({ user, userSet, changeActiveSet }) {
  const [loading, setLoading] = useState(true)
  const [pictures, setPictures] = useState([])
  const c = useStyles()
  const theme = useTheme()
  const desktopDisplay = useMediaQuery(theme.breakpoints.up('sm'))
  const [open, setOpen] = React.useState(false)


  useEffect(() => { getResults() }, [])


  async function getResults () {
    const pics = userSet.pictures.items

    pics.sort((a, b) => a.rating - b.rating)

    let setWithURLsPromise = pics.map(async (item, index) => {
      item.pictureURL = await Storage.get(pics[index].file.key)
      return item
    })

    let setWithURLs = await Promise.all(setWithURLsPromise)

    setPictures(setWithURLs)
    setLoading(false)
  }


  function handleClickOpen () { setOpen(true) }
  function handleClose () { setOpen(false) }


  const deleteDialog = (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle className={c.deleteDialog}>
        {I18n.get(`user_upload_new_confirm_${user.gender}`)}
      </DialogTitle>
      <DialogActions>
        <Button onClick={handleClose} color="default">
          {I18n.get('no')}
        </Button>
        <Button onClick={changeActiveSet} color="secondary" autoFocus>
          {I18n.get('yes')}
        </Button>
      </DialogActions>
    </Dialog>
  )


  return (
    <>
      {deleteDialog}
      <Grid container spacing={desktopDisplay ? 3 : 1}>
        <Grid item xs={12}>
          <Typography variant="h5" className={c.pageTitle}>
            {I18n.get(`user_results_title_${user.gender}`)}
          </Typography>
        </Grid>
        {!loading && pictures.map((picture, index) => (
          <ResultsCard key={index} picture={picture}/>
        ))}
        <Grid item xs={12} className={c.buttonGridItem}>
          <Fab
            variant="extended"
            color="secondary"
            className={c.button}
            onClick={handleClickOpen}
          >
            {I18n.get('user_upload_new')}
          </Fab>
        </Grid>
      </Grid>
    </>
  )
}


export default Results
