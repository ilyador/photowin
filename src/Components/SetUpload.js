import React, { useState, useEffect, useReducer } from 'react'
import { API, graphqlOperation as operation, Storage, I18n } from 'aws-amplify'
import { useHistory } from 'react-router-dom'
import { createPicture, createSet } from '../graphql/mutations'
import { makeStyles } from '@material-ui/core'
import config from '../aws-exports'
import useMediaQuery from '@material-ui/core/useMediaQuery'
import { useTheme } from '@material-ui/core/styles'
import PictureUpload from './PictureUpload'
import Fab from '@material-ui/core/Fab'
import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography'
import CloudUploadIcon from '@material-ui/icons/CloudUpload'
import SyncIcon from '@material-ui/icons/Sync'



const {
  aws_user_files_s3_bucket_region: region,
  aws_user_files_s3_bucket: bucket
} = config

const initialState = {
  files: [null, null, null]
}


function reducer(state, action) {
  switch (action.type) {
    case 'SET_FILE':
      let newFiles = [...state.files]
      newFiles[action.index] = action.data
      return { ...state, files: newFiles }
    case 'CLEAR_FILES':
      return initialState
    default:
      return state
  }
}


const useStyles = makeStyles(theme => ({
  pageTitle: {
    marginBottom: theme.spacing(2),
    textAlign: 'center'
  },
  uploadingIcon: {
    marginRight: theme.spacing(1),
    animation: 'rotating 2s linear infinite'
  },
  buttonGridItem: {
    display: 'flex'
  },
  button: {
    margin: [theme.spacing(3), 'auto', 0],
  },
  icon: {
    marginRight: theme.spacing(1),
  }
}))



function SetUpload({ user }) {
  const [state, dispatch] = useReducer(reducer, initialState)
  const [uploadReady, setUploadReady] = useState(false)
  const [uploading, setUploading] = useState(false)
  const c = useStyles()
  const theme = useTheme()
  const desktopDisplay = useMediaQuery(theme.breakpoints.up('sm'))
  const history = useHistory()


  useEffect(() => {
    const files = state.files.reduce((sum, file) => file ? ++sum : sum, 0)

    setUploadReady(files > 1)
  }, [state])

  const uploadFileData = fileIndex => fileData => {
    dispatch({
      type: 'SET_FILE',
      index: fileIndex,
      data: fileData
    })
  }


  const saveFile = (file, fileName, setId) => {
    return new Promise((resolve, reject) => {

      const input = {
        rating: 0,
        file: {
          bucket,
          key: fileName,
          region,
        },
        setPicturesId: setId
      }

      let storageCall = Storage.put(fileName, file, { level: 'public' })
      let gqlCall = API.graphql(operation(createPicture, { input }))

      Promise.all([storageCall, gqlCall])
        .then(resolve)
        .catch(reject)
    })
  }


  async function createPictureSet() {
    setUploadReady(false)
    setUploading(true)

    const input = {
      user: user.sub,
      type: user.gender,
      appearedForRanking: 0,
      active: true
    }

    const pictureSet = await API.graphql(operation(createSet, { input }))
    const setId = pictureSet.data.createSet.id

    const allFileUploadPromises = state.files.map(file =>
      file && saveFile(file.file, file.fileName, setId)
    )

    await Promise.all(allFileUploadPromises)
    dispatch({ type: 'CLEAR_FILES' })
    history.push('/rate')
  }


  return (
    <Grid container spacing={desktopDisplay ? 3 : 1}>
      <Grid item xs={12}>
        <Typography variant="h5" className={c.pageTitle}>
          {I18n.get(`user_upload_title_${user.gender}`)}
        </Typography>
      </Grid>
      {state.files.map((file, index) => (
        <PictureUpload
          index={index}
          key={index}
          file={file}
          uploadFileData={uploadFileData(index)}
        />
      ))}
      <Grid item xs={12} className={c.buttonGridItem}>
        <Fab
          variant="extended"
          color="secondary"
          className={c.button}
          disabled={!uploadReady}
          onClick={createPictureSet}
        >
          {I18n.get('user_upload_button')}
          {uploading ?
            (<SyncIcon className={c.uploadingIcon} />) :
            (<CloudUploadIcon className={c.icon} />)
          }
        </Fab>
      </Grid>
    </Grid>
  )
}


export default SetUpload
