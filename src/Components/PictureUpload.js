import React, { Component } from 'react'
import { API, Storage } from 'aws-amplify'
import uuid from 'uuid/v4'


class PictureUpload extends Component {

  state = { fileUrl: '', file: '', filename: '' }

  handleChange = e => {
    let file = e.target.files[0]
    let filext = file.name.split('.').pop()
    let filename = uuid() + '.' + filext

    this.setState({
      fileUrl: URL.createObjectURL(file),
      file,
      filename: filename
    })
  }

  saveFile = async () => {
    try {
      let s3picture = await Storage.put(
        this.state.filename, this.state.file, { level: 'protected' }
      )

      let params = {
        body:
          {
            userid: this.props.user.sub,
            pictureurl: s3picture.key,
            rating: 0
          }
      }

      await API.put('picturesapi', '/userpictures', params)

      this.setState({ fileUrl: '', file: '', filename: '' })
    } catch (error) {
      console.log('error uploading file: ', error)
    }
  }


  render () {
    return (
      <div>
        <input
          type='file'
          accept='.jpg,.jpeg,.png'
          onChange={this.handleChange}
        />
        <img src={this.state.fileUrl} alt=''/>
        <button onClick={this.saveFile}>Save File</button>
      </div>
    )
  }
}


export default PictureUpload
