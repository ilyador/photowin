import React, { Component } from 'react'
import { Storage } from 'aws-amplify'

class PictureUpload extends Component {

  state = { fileUrl: '', file: '', filename: ''}

  handleChange = e => {
    const file = e.target.files[0]
    this.setState({
      fileUrl: URL.createObjectURL(file),
      file,
      filename: file.name
    })
  }

  saveFile = async () => {
    try {
      let data = await Storage.put(
        this.state.filename, this.state.file, {level: 'protected'}
      )
      console.log('successfully uploading file!', data)
      this.setState({ fileUrl: '', file: '', filename: ''})
    } catch (error) {
      console.log('error uploading file!', error)
    }
  }

  getFile = async () => {
    try {
      let data = await Storage.get('victory1.jpg')
      console.log('Got file successfully', data)
    } catch (error) {
      console.log(error)
    }
  }


  render () {
    return (
      <div>
        <input type='file' onChange={this.handleChange} />
        <img src={this.state.fileUrl} alt="" />
        <button onClick={this.saveFile}>Save File</button>
        <button onClick={this.getFile}>Get File</button>
      </div>
    )
  }
}

export default PictureUpload
