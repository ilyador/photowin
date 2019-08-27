import React, { useState, useEffect,useRef } from 'react'
import uuid from 'uuid/v4'
import { makeStyles } from '@material-ui/core/styles'
import Fab from '@material-ui/core/Fab'
import Card from '@material-ui/core/Card'
import CardActions from '@material-ui/core/CardActions'
import CardMedia from '@material-ui/core/CardMedia'
import Grid from '@material-ui/core/Grid'
import AddIcon from '@material-ui/icons/Add'


const useStyles = makeStyles(theme => ({
  button: {
    margin: theme.spacing(1),
  },
  rightIcon: {
    marginLeft: theme.spacing(1),
  },
  fileInput: {
    display: 'none'
  },
  card: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
  },
  media: {
    height: 0,
    paddingTop: '120%'
  },
  actions: {
    justifyContent: 'center',
    marginBottom: theme.spacing(1),
    [theme.breakpoints.up('sm')]: { marginBottom: theme.spacing(3) }

  },
  addPicture: {
    margin: 0,
    [theme.breakpoints.up('sm')]: { marginTop: -34 }
  }
}))


function PictureUpload ({ uploadFileData, file, index }) {
  const [fileUrl, setFileUrl] = useState(null)
  const c = useStyles()


  useEffect(() => {
    if (!file) setFileUrl(null)
  }, [file])


  const handleChange = event => {
    let _file = event.target.files[0]
    if (!_file) return

    let _fileName = uuid() + '.' + _file.name.split('.').pop()
    let _fileUrl = URL.createObjectURL(_file)

    setFileUrl(_fileUrl)

    uploadFileData({
      file: _file,
      fileName: _fileName,
      fileUrl: _fileUrl
    })
  }


  return (
    <Grid item xs={4}>
      <Card>
        <CardMedia
          className={c.media}
          image={fileUrl}
        />
        <CardActions className={c.actions}>
          <input
            id={`upload-file-${index}`}
            className={c.fileInput}
            type='file'
            accept='image/*'
            onChange={handleChange}
          />
          <Fab
            component='label'
            htmlFor={`upload-file-${index}`}
            color="default"
            className={c.addPicture}
          >
            <AddIcon/>
          </Fab>
        </CardActions>
      </Card>
    </Grid>
  )
}


export default PictureUpload
