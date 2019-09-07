/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react'
import { API, graphqlOperation as operation } from 'aws-amplify'
import { updateSet } from '../graphql/mutations'
import { listSets } from '../graphql/queries'
import SetUpload from './SetUpload'
import Results from './Results'


function User ({ user }) {
  const [loading, setLoading] = useState(true)
  const [userSet, setUserSet] = useState(null)

  useEffect(() => {
    API.graphql(operation(listSets, {
      limit: 1000,
      filter: {
        user: { eq: user.sub },
        active: { eq: true }
      }
    }))
      .then(data => {
        let activeSet = data.data.listSets.items[0]
        setUserSet(activeSet)
        setLoading(false)
      })
  }, [])


  function changeActiveSet () {
    API.graphql(operation(updateSet, {
      input: {
        id: userSet.id,
        active: false
      }
    })).then(() => setUserSet(null))
  }


  if (loading) return null
  else {
    return userSet ?
      <Results
        user={user}
        userSet={userSet}
        changeActiveSet={changeActiveSet}
      /> :
      <SetUpload user={user} userSet={userSet} f/>
  }
}


export default User
