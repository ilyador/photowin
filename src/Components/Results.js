import React, { useEffect, useState } from 'react'
import { Storage } from 'aws-amplify'


function Results ({ userSet, clearSet }) {
  const [loading, setLoading] = useState(true)
  const [pictures, setPictures] = useState([])


  useEffect(() => { getResults() }, [])


  async function getResults () {
    const pics = userSet.pictures.items

    pics.sort((a, b) => b.rating - a.rating)

    let setWithURLsPromise = pics.map(async (item, index) => {
      item.pictureURL = await Storage.get(pics[index].file.key)
      return item
    })

    let setWithURLs = await Promise.all(setWithURLsPromise)

    setPictures(setWithURLs)
    setLoading(false)
  }


  return (
    <div>
      <h2>Show Results</h2>
      {!loading && pictures.map((picture, index) => (
        <div key={index}>
          <img
            className='rating-img'
            src={picture.pictureURL}
          />
          <h2>Rated: {picture.rating}</h2>
        </div>
      ))}
      <button onClick={clearSet}>Retry a new set?</button>
    </div>
  )
}


export default Results
