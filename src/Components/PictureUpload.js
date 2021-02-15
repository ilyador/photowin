import React, { useState, useEffect } from 'react'
import { v4 as uuid } from 'uuid'
import loadImage from 'blueimp-load-image'
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
    marginLeft: '0 !important',
    [theme.breakpoints.up('sm')]: { marginTop: -34 }
  }
}))


export default function PictureUpload ({ uploadFileData, file, index }) {
  const [fileUrl, setFileUrl] = useState(null)
  const c = useStyles()


  useEffect(() => {
    if (!file) setFileUrl(null)
  }, [file])


  const handleChange = event => {
    const _file = event.target.files[0]
    if (!_file) return

    const fileExt = _file.name.split('.').pop()
    const fileName = uuid() + '.' + fileExt

    loadImage(_file, {
      meta: true,
      canvas: true,
      maxWidth: 600,
      orientation: 1
    })
      .then((data) => {
        if (!data.imageHead) throw new Error('Could not parse image metadata')

        return new Promise(resolve => {
          data.image.toBlob(blob => {
            data.blob = blob
            resolve(data)
          }, 'image/jpeg')
        })
      })
      .then(data => {
        return loadImage.replaceHead(data.blob, data.imageHead)
      })
      .then(blob => {
        const _fileUrl = URL.createObjectURL(blob)
        setFileUrl(_fileUrl)
        const file = new File([blob], fileName, { type: blob.type })
        uploadFileData({ file, fileName, fileUrl })
      })
      .catch((error) => {
        console.error(error)
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
