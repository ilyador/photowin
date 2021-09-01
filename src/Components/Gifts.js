import React from 'react'
import { I18n } from 'aws-amplify'
import { UserContext } from '../helpers/userContext'
import { CardActionArea, makeStyles } from '@material-ui/core'
import Card from '@material-ui/core/Card'
import Container from '@material-ui/core/Container'
import CardMedia from '@material-ui/core/CardMedia'
import Typography from '@material-ui/core/Typography'
import man from '../content/menBanner.jpg'
import woman from '../content/womenBanner.jpg'
import LockIcon from '@material-ui/icons/Lock'


const pictures = { man, woman }


const useStyles = makeStyles({
  media: {
    height: '100%',
    '&:after': {
      content: '""',
      display: 'block',
      paddingBottom: '100%'
    }
  },
  block: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(224, 224, 224, 0.85)',
    paddingTop: '26%',
    textAlign: 'center',
    zIndex: 5
  },
  lockedText: {
    width: '60%',
    margin: '0 auto'
  }
})


const links = {
  man: 'MEN',
  woman: 'WOMEN'
}


function Results () {
  const c = useStyles()
  const { user } = React.useContext(UserContext)


  return (
    <Container maxWidth="xs">
      <Card>
        <CardActionArea>
          {(user.points < 49) &&
          <div className={c.block}>
            <LockIcon fontSize="large"/>
            <Typography variant="h4" className={c.lockedText}>
              {I18n.get('gifts_locked')}
            </Typography>
          </div>
          }
          <CardMedia
            component='a'
            href={`https://pua.ravpage.co.il/PHOTOWIN_edit${links[user.gender]}`}
            className={c.media}
            image={pictures[user.gender]}
            title="Contemplative Reptile"
          />
        </CardActionArea>
      </Card>
    </Container>
  )
}


export default Results
