import React, { useEffect, useState } from 'react'
import {
  API,
  Storage,
  graphqlOperation as operation
} from 'aws-amplify'
import { getByAppeared } from '../graphql/queries'
import { updatePicture, updateSet } from '../graphql/mutations'


const random = max => Math.floor(Math.random() * Math.floor(max))

const getGender = user => {
  const genders = ['male', 'female']

  if (user) {
    let gender = genders.indexOf(user.gender)
    gender = 1 - gender
    return genders[gender]
  } else { return genders[random(2)] }
}


function Rate ({ user }) {
  const [loading, setLoading] = useState(true)
  const [picturesSetData, setPicturesSetData] = useState(null)
  const [pictures, setPictures] = useState([])


  async function getPictureSet () {
    let data = await API.graphql(operation(getByAppeared, {
      type: getGender(user),
      sortDirection: 'DESC',
      limit: 20
    }))


    let { items } = data.data.getByAppeared
    let itemToRateIndex = random(items.length)
    let itemToRate = {
      id: items[itemToRateIndex].id,
      appearedForRanking: items[itemToRateIndex].appearedForRanking
    }

    let pics = items[itemToRateIndex].pictures.items
    pics.splice(random(3), 1)

    let setWithURLsPromise = pics.map(async (item, index) => {
      item.pictureURL = await Storage.get(pics[index].file.key)
      return item
    })

    let setWithURLs = await Promise.all(setWithURLsPromise)

    setPictures(setWithURLs)
    setPicturesSetData(itemToRate)
    setLoading(false)
  }


  useEffect(() => { getPictureSet() }, [])


  const vote = (id, rating) => () => {
    let pictureInput = { id, rating: rating + 1 }
    let setInput = {
      id: picturesSetData.id,
      appearedForRanking: picturesSetData.appearedForRanking + 1
    }

    let pictureUpdate = API.graphql(operation(updatePicture, { input: pictureInput }))
    let setUpdate = API.graphql(operation(updateSet, { input: setInput }))

    Promise.all([pictureUpdate, setUpdate]).then(() => {
      setLoading(true)
      setPicturesSetData(null)
      setPictures([])
      getPictureSet()
    })
  }


  return (
    <div>
      <h2>Show pictures for rating</h2>
      {!loading && pictures.map((picture, index) => (
        <div key={index}>
          <img
            className='rating-img click'
            src={picture.pictureURL}
            onClick={vote(picture.id, picture.rating)}
          />
        </div>
      ))}
    </div>
  )
}


export default Rate
