import React from 'react'
import ReactDOM from 'react-dom'
import App from './Components/App'
import * as serviceWorker from './Helpers/serviceWorker'
import Amplify, { I18n } from 'aws-amplify'
import config from './aws-exports'
import CssBaseline from '@material-ui/core/CssBaseline'
import { StylesProvider, ThemeProvider } from '@material-ui/core'
import { createMuiTheme } from '@material-ui/core/styles'
import { jss } from 'react-jss'
import { dictionary } from './Helpers/dictionary'

I18n.putVocabularies(dictionary)
I18n.setLanguage('he')


const theme = createMuiTheme({
  direction: 'rtl',
  typography: {
    fontFamily: [
      '"Rubik"',
      '"Helvetica Neue"',
      'Arial',
      'sans-serif'
    ].join(','),
  },
  palette: {
    primary: {
      main: '#4a6adb',
    }
  }
})

Amplify.configure(config)


const Main = () => (
  <StylesProvider jss={jss}>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <App />
    </ThemeProvider>
  </StylesProvider>
)

ReactDOM.render(<Main />, document.getElementById('root'))
serviceWorker.unregister()
