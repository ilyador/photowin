import React, { useEffect, useState } from 'react'
import {
  API,
  Storage,
  graphqlOperation,
  graphqlOperation as operation
} from 'aws-amplify'
import { getByAppeared } from '../graphql/queries'
import { updatePicture, updateSet } from '../graphql/mutations'
import Col from 'react-bootstrap/Col'
import Row from 'react-bootstrap/Row'


const random = (max) => Math.floor(Math.random() * Math.floor(max))

function Rate () {
  const [setData, setSetData] = useState(true)
  const [pictureSet, setPictureSet] = useState([])


  useEffect(() => {
    async function getPictureSet () {
      let data = await API.graphql(graphqlOperation(getByAppeared, {
        type: 'Set',
        sortDirection: 'DESC',
        limit: 20
      }))

      let { items } = data.data.getByAppeared
      let itemToRateIndex = random(items.length)
      let itemToRate = {
        id: items[itemToRateIndex].id,
        appearedForRanking: items[itemToRateIndex].appearedForRanking
      }

      setPictureSet(items[itemToRateIndex].pictures.items)
      setSetData(itemToRate)
    }

    getPictureSet()
  }, [])


  useEffect(() => {
    async function getPictureURLs () {
      let setWithURLsPromise = pictureSet.map(async item => {
        item.pictureURL = await Storage.get(pictureSet[0].file.key)
        return item
      })

      let setWithURLs = await Promise.all(setWithURLsPromise)
      setWithURLs.splice(random(3), 1)
      setPictureSet(setWithURLs)
    }

    getPictureURLs()
  }, [setData])


  const vote = (id, rating) => () => {
    let pictureInput = { id, rating: rating++ }
    let setInput = {
      id: setData.id,
      appearedForRanking: setData.appearedForRanking++
    }

    let pictureUpdate = API.graphql(operation(updatePicture, { input: pictureInput }))
    let setUpdate = API.graphql(operation(updateSet, { input: setInput }))

    Promise.all([pictureUpdate, setUpdate]).then(data => {console.log(data)})
  }


  return (
    <div>
      <h2>Show pictures for rating</h2>
      <Row>
        {setData && pictureSet.map((picture, index) => (
          <Col xs={4} key={index}>
            <img
              src={picture.pictureURL}
              onClick={vote(picture.id, picture.rating)}
            />
          </Col>
        ))}
      </Row>
    </div>
  )
}


export default Rate
