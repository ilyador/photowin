import React, { useState, useEffect, useReducer } from 'react'
import { API, graphqlOperation as operation, Storage } from 'aws-amplify'
import { createPicture, createSet } from '../graphql/mutations'
import config from '../aws-exports'
import PictureUpload from './PictureUpload'
import history from '../Helpers/history'


const {
  aws_user_files_s3_bucket_region: region,
  aws_user_files_s3_bucket: bucket
} = config

const initialState = {
  files: [null, null, null]
}


function reducer (state, action) {
  switch (action.type) {
    case 'SET_FILE':
      let newFiles = [...state.files]
      newFiles[action.index] = action.data
      return { ...state, files: newFiles }
    case 'CLEAR_FILES':
      return initialState
    default:
      return state
  }
}



function SetUpload ({ user }) {
  const [state, dispatch] = useReducer(reducer, initialState)
  const [uploadReady, setUploadReady] = useState(false)

  useEffect(() => {
    setUploadReady(state.files.every(file => file))
  }, [state])

  const uploadFileData = fileIndex => fileData => {
    dispatch({
      type: 'SET_FILE',
      index: fileIndex,
      data: fileData
    })
  }


  const saveFile = (file, fileName, setId) => {
    return new Promise((resolve, reject) => {

      const input = {
        rating: 0,
        file: {
          bucket,
          key: fileName,
          region,
        },
        setPicturesId: setId
      }

      let storageCall = Storage.put(fileName, file, { level: 'public' })
      let gqlCall = API.graphql(operation(createPicture, { input }))

      Promise.all([storageCall, gqlCall])
        .then(data => resolve(data))
        .catch(error => reject(error))
    })
  }


  async function createPictureSet () {
    let input = {
      id: user.sub,
      user: 'TO REMOVE',
      type:user.gender,
      appearedForRanking: 0
    }

    const pictureSet = await API.graphql(operation(createSet, { input }))
    const setId = pictureSet.data.createSet.id

    let allFileUploadPromises = state.files.map(file =>
      saveFile(file.file, file.fileName, setId)
    )

    await Promise.all(allFileUploadPromises)
    dispatch({ type: 'CLEAR_FILES' })
    history.push('/rate')
  }


  return (
    <div>
      <button
        disabled={!uploadReady}
        onClick={createPictureSet}>
        Save File
      </button>
      {state.files.map((file, index) => (
        <PictureUpload
          file={file}
          uploadFileData={uploadFileData(index)}
        />
      ))}
    </div>
  )
}


export default SetUpload
