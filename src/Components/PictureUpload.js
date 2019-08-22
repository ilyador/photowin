import React, { useState, useEffect } from 'react'
import uuid from 'uuid/v4'


function PictureUpload ({ uploadFileData, file }) {
  const [fileUrl, setFileUrl] = useState(null)

  useEffect(() => {
    if (!file) setFileUrl(null)
  }, [file])


  const handleChange = event => {
    let _file = event.target.files[0]
    if (!_file) return

    let _fileName = uuid() + '.' + _file.name.split('.').pop()
    let _fileUrl = URL.createObjectURL(_file)

    setFileUrl(_fileUrl)

    uploadFileData({
      file: _file,
      fileName: _fileName,
      fileUrl: _fileUrl
    })
  }


  return (
    <div className="custom-file">
      <input
        type="file"
        className="custom-file-input"
        accept='.jpg,.jpeg,.png'
        onChange={handleChange}/>
      <label className="custom-file-label">
        Choose file
      </label>
      <img src={fileUrl}/>
    </div>
  )
}


export default PictureUpload
