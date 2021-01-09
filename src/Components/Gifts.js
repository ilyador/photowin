import React from 'react'
import { Link } from 'react-router-dom'
import { CardActionArea, makeStyles } from '@material-ui/core'
import Card from '@material-ui/core/Card'
import Container from '@material-ui/core/Container'
import CardMedia from '@material-ui/core/CardMedia'
import man from '../content/menBanner.jpg'
import woman from '../content/womenBanner.jpg'

const pictures = { man,  woman }


const useStyles = makeStyles({
  media: {
    height: '100%',
    '&:after': {
      content: '""',
      display: 'block',
      paddingBottom: '100%'
    }
  }
})


function Results ({ user }) {
  const c = useStyles()

  return (
    <Container maxWidth="xs">
      {(user.points >= 1) && <Card>
        <CardActionArea>
          <CardMedia
            component={Link}
            to={`edit-${user.gender}`}
            className={c.media}
            image={pictures[user.gender]}
            title="Contemplative Reptile"
          />
        </CardActionArea>
      </Card>}
    </Container>
  )
}


export default Results
