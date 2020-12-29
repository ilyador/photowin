import React from 'react'
import { I18n } from 'aws-amplify'
import Fab from '@material-ui/core/Fab'
import Paper from '@material-ui/core/Paper'
import Typography from '@material-ui/core/Typography'
import Container from '@material-ui/core/Container'
import { makeStyles } from '@material-ui/core/styles'


const images = {}

function importAll (collection, imported) {
  imported.keys().forEach(img => {
    let key = img.substr(0, img.lastIndexOf('.')).replace('./', '')
    collection[key] = imported(img)
  })
}

importAll(images, require.context('../content/photo-editing', true, /\.(png|jpe?g|svg|webp)$/))

console.log(images)


const useStyles = makeStyles((theme) => ({
  heroContent: {
    backgroundColor: theme.palette.background.paper,
    padding: theme.spacing(8, 0, 6)
  },
  heroButtons: {
    marginTop: theme.spacing(4),
    textAlign: 'center'
  }
}))


export default function ({ gender }) {

  const c = useStyles()

  return (
    <Container maxWidth="xl">
      <Paper elevation={2} className={c.heroContent}>
        <Typography component='h1' variant='h2' align='center' color='textPrimary' gutterBottom>
          {I18n.get(`edit_page_section_1_title_${gender}`)}
        </Typography>
        <Typography variant='h5' align='center' color='textSecondary' paragraph>
          {I18n.get(`edit_page_section_1_subtitle_1_${gender}`)}
        </Typography>
        <Typography variant='h6' align='center' color='textSecondary' paragraph>
          {I18n.get(`edit_page_section_1_subtitle_2_${gender}`)}
        </Typography>
        <div className={c.heroButtons}>
          <Fab variant='extended' size='large' color='primary'>
            {I18n.get(`edit_page_action_${gender}`)}
          </Fab>
        </div>
        <Typography variant='caption' align='center' color='textSecondary' paragraph>
          {I18n.get(`edit_page_disclaimer`)}
        </Typography>
      </Paper>
    </Container>
  )
}