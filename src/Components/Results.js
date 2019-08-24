import React, { useEffect, useState } from 'react'
import {
  API,
  Storage,
  graphqlOperation as operation
} from 'aws-amplify'
import { listSets } from '../graphql/queries'
import Col from 'react-bootstrap/Col'
import Row from 'react-bootstrap/Row'


function Rate () {
  const [loading, setLoading] = useState(true)
  const [pictures, setPictures] = useState([])


  async function getPictureSet () {
    let data = await API.graphql(operation(listSets, {
      filter:{user: {eq: "39e1f6cb-22af-4f8c-adf5-8ea4ce66ff90"}}
    }))

    let pics = data.data.listSets.items[0].pictures.items

    pics.sort((a, b) =>  b.rating - a.rating)

    let setWithURLsPromise = pics.map(async (item, index) => {
      item.pictureURL = await Storage.get(pics[index].file.key)
      return item
    })

    let setWithURLs = await Promise.all(setWithURLsPromise)

    setPictures(setWithURLs)
    setLoading(false)
  }


  useEffect(() => {
    getPictureSet()
  }, [])

  return (
    <div>
      <h2>Show Results</h2>
      <Row>
        {!loading && pictures.map((picture, index) => (
          <Col xs={4} key={index}>
            <img
              className='rating-img'
              src={picture.pictureURL}
            />
            <h2>Rated: {picture.rating}</h2>
          </Col>
        ))}
      </Row>
    </div>
  )
}


export default Rate