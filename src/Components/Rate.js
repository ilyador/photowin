import React, { useEffect } from 'react'
import { API, graphqlOperation } from 'aws-amplify'
import * as queries from '../graphql/queries'


function Rate () {

  useEffect(() => {
    API.graphql(graphqlOperation(queries.listPictures))
      .then(data => { console.log(data) })
      .catch(error => {console.log(error)})
  }, [])


  return (
    <h2>
      Show pictures for rating
    </h2>
  )
}


export default Rate
