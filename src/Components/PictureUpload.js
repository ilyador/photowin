import React, { useState } from 'react'
import { API, graphqlOperation, Storage } from 'aws-amplify'
import uuid from 'uuid/v4'
import { createPicture } from '../graphql/mutations'
import config from '../aws-exports'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'


const {
  aws_user_files_s3_bucket_region: region,
  aws_user_files_s3_bucket: bucket
} = config


function PictureUpload () {
  const [file, setFile] = useState(null)
  const [fileUrl, setFileUrl] = useState(null)
  const [fileName, setFileName] = useState(null)

  const handleChange = event => {
    let _file = event.target.files[0]
    let _filename = uuid() + '.' + _file.name.split('.').pop()

    setFile(_file)
    setFileUrl(URL.createObjectURL(_file))
    setFileName(_filename)
  }

  const saveFile = async () => {
    const fileData = {
      file: {
        bucket,
        key: fileName,
        region,
      }
    }

    try {
      await Storage.put(fileName, file, { level: 'protected' })
      await API.graphql(graphqlOperation(createPicture, { input: fileData }))

      setFile(null)
      setFileUrl(null)
      setFileName(null)
    } catch (error) {
      console.log('error uploading file: ', error)
    }
  }


  return (
    <div>
      <input
        type='file'
        accept='.jpg,.jpeg,.png'
        onChange={handleChange}
      />
      <img src={fileUrl}/>
      <button onClick={saveFile}>Save File</button>
    </div>
  )
}


export default PictureUpload
