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

const photWinBlue = '#4a6adb'
const photWinYellow = '#fdb720'


const theme = createMuiTheme({
  palette: {
    primary: {
      light: '#494e51',
      main: '#313639',
      dark: '#000'
    },
    secondary: {
      light: '#d5001c',
      main: '#d5001c',
      dark: '#960014'
    }
  }
})

Amplify.configure(config)


const Main = () => (
  <StylesProvider jss={jss}>
    <ThemeProvider theme={theme}>
      <CssBaseline/>
      <App/>
    </ThemeProvider>
  </StylesProvider>
)

ReactDOM.render(<Main/>, document.getElementById('root'))
serviceWorker.unregister()
