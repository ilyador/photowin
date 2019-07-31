import React, { Component } from 'react'
import { API, graphqlOperation } from 'aws-amplify'
import * as queries from '../graphql/queries'


class Rate extends Component {

  async componentDidMount () {
    try {
      // const data = await API.get('picturesapi', '/userpictures/user/', {
      //   'queryStringParameters': {
      //     'userid': '39e1f6cb-22af-4f8c-adf5-8ea4ce66ff90'
      //   }
      // })

      const data = await API.graphql(graphqlOperation(queries.listPictures))

      console.log(data)
    } catch (error) {
      console.log(error)
    }
  }

  render () {
    return (
      <h2>
        Show pictures for rating
      </h2>
    )
  }
}


export default Rate
