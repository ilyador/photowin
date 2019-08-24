import React from 'react'
import ReactDOM from 'react-dom'
import App from './Components/App'
import * as serviceWorker from './Helpers/serviceWorker'
import Amplify from 'aws-amplify'
import config from './aws-exports'
import './App.css'


Amplify.configure(config)


ReactDOM.render(<App/>, document.getElementById('root'))
serviceWorker.unregister()
