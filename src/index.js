import React from 'react'
import ReactDOM from 'react-dom'
import App from './Components/App'
import * as serviceWorker from './Helpers/serviceWorker'
import Amplify from 'aws-amplify'
import config from './aws-exports'
import CssBaseline from '@material-ui/core/CssBaseline'


Amplify.configure(config)


const Main = () => (
  <>
    <CssBaseline/>
    <App/>
  </>
)

ReactDOM.render(<Main/>, document.getElementById('root'))
serviceWorker.unregister()
