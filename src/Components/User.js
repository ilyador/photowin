import React, { useState, useEffect } from 'react'
import { API, graphqlOperation as operation, Storage } from 'aws-amplify'
import { deleteSet, deletePicture, updateSet } from '../graphql/mutations'
import { getSet, listSets } from '../graphql/queries'
import SetUpload from './SetUpload'
import Results from './Results'


function User ({ user }) {
  const [loading, setLoading] = useState(true)
  const [userSet, setUserSet] = useState(null)

  useEffect(() => {
    API.graphql(operation(listSets, {
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


  /* Delete set compketely
  async function clearSet () {
    const deletedSet = API.graphql(operation(deleteSet, { input: { id: userSet.id } }))
    const pictures = userSet.pictures.items

    let promises = pictures.flatMap(picture => {
      let deletePictureDB = API.graphql(operation(deletePicture, { input: { id: picture.id } }))
      let deletePictureStorage = Storage.remove(picture.file.key)

      return [deletePictureDB, deletePictureStorage]
    })
    promises.push(deletedSet)

    await Promise.all(promises)
    setUserSet(null)
  }
  */

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
