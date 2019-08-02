import React, { Component } from 'react'
import { API, graphqlOperation } from 'aws-amplify'
import uuid from 'uuid/v4'
import * as mutations from '../graphql/mutations'
import awsConfig from '../aws-exports'


class PictureUpload extends Component {

  state = { fileUrl: '', file: '', filename: '' }

  handleChange = e => {
    let file = e.target.files[0]
    let filext = file.name.split('.').pop()
    let filename = uuid() + '.' + filext

    this.setState({
      fileUrl: URL.createObjectURL(file),
      filename: filename
    })
  }

  saveFile = async () => {
    let visibility = 'public'

    let fileObj = {
      bucket: awsConfig.aws_user_files_s3_bucket,
      region: awsConfig.aws_user_files_s3_bucket_region,
      key: visibility + '/' + this.state.filename,
      mimeType:'image/jpeg',
      localUri: this.state.fileUrl,
      visibility: visibility
    }

    try {
      const picture = await API.graphql(
        graphqlOperation(mutations.createPicture, {
          input: {
            url: this.state.filename,
            file: fileObj
          }
        })
      )

      console.log(picture)

      // userId = this.props.user.sub

      this.setState({ fileUrl: '', filename: '' })
    } catch (error) {
      console.log('error saving file: ', error)
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
        <img width='100' src={this.state.fileUrl} alt=''/>
        <button disabled={!this.state.fileUrl} onClick={this.saveFile}>
          Save File
        </button>
      </div>
    )
  }
}


export default PictureUpload
