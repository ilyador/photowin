import React, { useEffect, useState } from 'react'
import { API, Storage, graphqlOperation } from 'aws-amplify'
import { getSet } from '../graphql/queries'


function Rate () {
  const [picture, setPicture] = useState('')

  useEffect(() => {
    // API.graphql(graphqlOperation(getSet, { id: 'cdfcebd9-967c-47fd-a0cc-64130dc85c45' }))
    //   .then(data => { console.log(data.data) })
    //   .catch(error => {console.log(error)})

    Storage.get('a5f1bf2a-f8cb-4461-9a3d-5101910630df.png', { level: 'public' })
      .then(result => {setPicture(result)})
      .catch(err => console.log(err))

  }, [])


  return (
    <h2>
      Show pictures for rating
      <img src={picture}/>
    </h2>
  )
}


export default Rate
