import React from 'react'
import ReactDOM from 'react-dom'
import App from './App'
import { ThemeProvider } from 'react-jss'
import * as serviceWorker from './serviceWorker'
import Amplify from 'aws-amplify'
import config from './aws-exports'

Amplify.configure(config)

const theme = {
  baseFontSize: 16,
  colorDark: '#272727',

  get init () {
    return {
      fontSize: this.baseFontSize,
      margin: this.baseFontSize * 0.625,
      lineHeight: this.baseFontSize * 1.2,
      colorDark: this.colorDark
    }
  }
}


const Main = () => (
  <ThemeProvider theme={theme.init}>
    <App/>
  </ThemeProvider>
)

ReactDOM.render(<Main/>, document.getElementById('root'))
serviceWorker.unregister()
