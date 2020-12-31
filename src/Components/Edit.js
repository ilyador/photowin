import Grid from '@material-ui/core/Grid'
import React from 'react'
import { I18n } from 'aws-amplify'
import useMediaQuery from '@material-ui/core/useMediaQuery'
import { makeStyles, useTheme } from '@material-ui/core/styles'
import clsx from 'clsx'
import Fab from '@material-ui/core/Fab'
import Paper from '@material-ui/core/Paper'
import Typography from '@material-ui/core/Typography'
import Container from '@material-ui/core/Container'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemText from '@material-ui/core/ListItemText'
import Avatar from '@material-ui/core/Avatar'
import ListItemAvatar from '@material-ui/core/ListItemAvatar'
import TelegramIcon from '@material-ui/icons/Telegram'
import markIcon from '../content/mark.png'


const images = {}

function importAll (collection, imported) {
  imported.keys().forEach(img => {
    let key = img.substr(0, img.lastIndexOf('.')).replace('./', '')
    collection[key] = imported(img)
  })
}

importAll(images, require.context('../content/compare', true, /\.(png|jpe?g)$/))


const useStyles = makeStyles(theme => ({
  container: {
    margin: theme.spacing(6, 'auto'),
    [theme.breakpoints.down('xs')]: {
      margin: theme.spacing(3, 'auto')
    }
  },
  heroUnit: {
    [theme.breakpoints.up('sm')]: {
      padding: 0
    },
    [theme.breakpoints.down('xs')]: {
      marginTop: 0
    }
  },
  heroButton: {
    marginTop: theme.spacing(4),
    textAlign: 'center',
    fontSize: '2em'
  },
  callToAction: {
    height: 'auto',
    padding: theme.spacing(1, 4),
    fontSize: '1.1rem',
    lineHeight: 1.5,
    borderRadius: 36
  },
  telegramIcon: {
    marginRight: theme.spacing(1)
  },
  photoComparisonGrid: {
    marginBottom: theme.spacing(2)
  },
  beforeAfter: {
    fontWeight: 600
  },
  compareImage: {
    width: '100%',
    display: 'block',
    borderRadius: theme.shape.borderRadius
  },
  listItems: {
    textAlign: 'right'
  },
  benefitsItems: {
    height: '100%',
    padding: theme.spacing(3)
  },
  benefitsTitle: {
    marginBottom: theme.spacing(3)
  },
  avatarImg: {
    height: 'auto'
  },
  benefitsText: {
    marginTop: theme.spacing(1),
    [theme.breakpoints.up('lg')]: {
      fontSize: '1.35em',
      marginTop: theme.spacing(2)
    }
  },
  benefitsListText: {
    [theme.breakpoints.down('xs')]: {
      fontSize: '1em'
    },
    [theme.breakpoints.up('sm')]: {
      fontSize: '1.35em'
    },
    [theme.breakpoints.up('lg')]: {
      fontSize: '1.65em'
    }
  },
  disclaimer: {
    marginTop: theme.spacing(1)
  },
  bottomFeature: {
    marginBottom: theme.spacing(6)
  }
}))


export default function Edit ({ gender }) {

  const theme = useTheme()
  const breakpointUpLg = useMediaQuery(theme.breakpoints.up('lg'))
  const breakpointDownSm = useMediaQuery(theme.breakpoints.down('xs'))
  const c = useStyles()


  let headerSizes = {
    main: 'h2',
    subheader: 'h5',
    secondary: 'h4',
    benefits: 'h3'
  }

  if (breakpointUpLg) {
    headerSizes = {
      main: 'h1',
      subheader: 'h3',
      secondary: 'h4',
      benefits: 'h2'
    }
  }

  if (breakpointDownSm) {
    headerSizes = {
      main: 'h4',
      subheader: 'h5',
      secondary: 'h6',
      benefits: 'h4'
    }
  }


  const callToAction = (
    <>
      <div className={c.heroButton}>
        <Fab
          className={c.callToAction}
          variant='extended'
          size='large'
          color={(gender === 'men') ? 'primary' : 'secondary'}
        >
          {I18n.get(`edit_page_action_${gender}`)}
          <TelegramIcon className={c.telegramIcon} fontSize='large'/>
        </Fab>
      </div>
      <Typography
        className={c.disclaimer}
        variant='caption'
        align='center'
        color='textSecondary'
        paragraph
      >
        {I18n.get(`edit_page_disclaimer`)}
      </Typography>
    </>
  )


  return (
    <>
      <Container maxWidth={breakpointUpLg ? 'md' : 'xs'} className={clsx(c.container, c.heroUnit)}>
        <Typography variant={headerSizes.main} align='center' color='textPrimary' gutterBottom>
          {I18n.get(`edit_page_section_1_title_${gender}`)}
        </Typography>
        <Typography variant={headerSizes.subheader} align='center' color='textSecondary' paragraph>
          {I18n.get(`edit_page_section_1_subtitle_1_${gender}`)}
        </Typography>
        <Typography variant={headerSizes.secondary} align='center' color='textSecondary' paragraph>
          {I18n.get(`edit_page_section_1_subtitle_2_${gender}`)}
        </Typography>
        {callToAction}
      </Container>


      <Container maxWidth='md' className={c.container}>
        <Typography variant={headerSizes.secondary} align='center' className={c.benefitsTitle}>
          {I18n.get(`edit_page_section_2_title_${gender}`)}
        </Typography>
        {[0, 1, 2, 3].map((item) => (
          <Grid
            container
            spacing={breakpointDownSm ? 1 : 3}
            className={c.photoComparisonGrid}
            key={item}
          >
            {['before', 'after'].map((edited) => (
              <Grid item xs={6} key={edited}>
                {(item === 0) ? (
                  <Typography variant='h5' align='center' className={c.beforeAfter}>
                    {I18n.get(edited)}
                  </Typography>
                ) : (
                  <Paper elevation={1}>
                    <img
                      className={c.compareImage}
                      src={images[`${gender}/${edited}/${item}`].default}
                      alt={`compare ${gender} ${item}`}
                    />
                  </Paper>
                )}
              </Grid>
            ))}
          </Grid>
        ))}
      </Container>


      <Container maxWidth='sm' className={c.container}>
        <List>
          {[1, 2, 3].map((item) => (
            <ListItem className={c.listItems} key={item}>
              <ListItemAvatar>
                <Avatar classes={{img: c.avatarImg}} variant='square' alt={'item ' + item} src={markIcon} />
              </ListItemAvatar>
              <ListItemText
                classes={{ primary: c.benefitsListText }}
                primary={I18n.get(`edit_page_section_2_list_${item}_${gender}`)}
              />
            </ListItem>
          ))}
        </List>
      </Container>


      <Container maxWidth='md' className={c.container}>
        <Typography variant={headerSizes.benefits} align='center' className={c.benefitsTitle}>
          {I18n.get(`edit_page_section_3_title_${gender}`)}
        </Typography>
        <Grid container spacing={3} className={c.bottomFeature}>
          {[1, 2].map((item) => (
            <Grid key={item} item xs={12} sm={6}>
              <Paper elevation={1} className={c.benefitsItems}>
                <Typography variant={breakpointUpLg ? 'h4' : 'h5'} align='center'>
                  {I18n.get(`edit_page_section_3_list_${item}_title_${gender}`)}
                </Typography>
                <Typography variant='body1' className={c.benefitsText} align='center'>
                  {I18n.get(`edit_page_section_3_list_${item}_subtitle_${gender}`)}
                </Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>
        {callToAction}
      </Container>
    </>
  )
}
