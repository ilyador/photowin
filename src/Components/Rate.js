import React, { Component } from 'react'
import { API } from 'aws-amplify'

class Rate extends Component {

  async componentDidMount() {
    try {
      const data = await API.get('picturesapi', '/userpictures')
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
