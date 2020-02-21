import React from 'react'
import ReactDOM from 'react-dom'
import App from './Components/App'
import * as serviceWorker from './Helpers/serviceWorker'
import Amplify from 'aws-amplify'
import config from './aws-exports'
import CssBaseline from '@material-ui/core/CssBaseline'
import { StylesProvider, ThemeProvider } from '@material-ui/styles'
import { createMuiTheme } from '@material-ui/core/styles'
import { jss } from 'react-jss'
import { I18n } from 'aws-amplify'
import { dictionary } from './Helpers/dictionary'

I18n.putVocabularies(dictionary)
I18n.setLanguage('he')


const photWinBlue = '#4a6adb'
const photWinYellow = '#fdb720'


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
      main: photWinBlue,
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
