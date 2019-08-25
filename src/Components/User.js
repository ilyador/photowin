import React, { useState, useEffect } from 'react'
import { API, graphqlOperation as operation, Storage } from 'aws-amplify'
import { deleteSet, deletePicture } from '../graphql/mutations'
import { getSet } from '../graphql/queries'
import SetUpload from './SetUpload'
import Results from './Results'


function User ({ user }) {
  const [loading, setLoading] = useState(true)
  const [userSet, setUserSet] = useState(null)

  useEffect(() => {
    API.graphql(operation(getSet, { id: user.sub }))
      .then(data => {
        setUserSet(data.data.getSet)
        setLoading(false)
      })
  }, [])


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

  if (loading) return null
  else {
    return userSet ?
      <Results userSet={userSet} clearSet={clearSet}/> :
      <SetUpload user={user}/>
  }
}


export default User
