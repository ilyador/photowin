import React, { useState, useRef } from 'react'
import { Auth, I18n } from 'aws-amplify'
import { makeStyles } from '@material-ui/core/styles'
import MenuItem from '@material-ui/core/MenuItem'
import TextField from '@material-ui/core/TextField'
import OutlinedInput from '@material-ui/core/OutlinedInput'
import InputLabel from '@material-ui/core/InputLabel'
import FormControl from '@material-ui/core/FormControl'
import Select from '@material-ui/core/Select'
import Button from '@material-ui/core/Button'
import Link from '@material-ui/core/Link'
import Container from '@material-ui/core/Container'
import Typography from '@material-ui/core/Typography'
import SyncIcon from '@material-ui/icons/Sync'
import DateFnsUtils from '@date-io/date-fns'
import { DatePicker, MuiPickersUtilsProvider } from '@material-ui/pickers'



const useStyles = makeStyles(theme => ({
  uploadingIcon: {
    marginLeft: theme.spacing(1),
    animation: 'rotating 2s linear infinite'
  },
  loginForm: {
    marginTop: theme.spacing(3)
  },
  container: {
    paddingTop: theme.spacing(4)
  },
  formControl: {
    minWidth: theme.spacing(16),
  },
  select: {
    width: '100%'
  },
  link: {
    width: '100%'
  },
  button: {
    margin: [theme.spacing(3), 0, theme.spacing(2)]
  },
  error: {
    color: theme.palette.error.main,
    textAlign: 'center',
    direction: 'ltr'
  },
  ltr: {
    '& input': {
      direction: 'ltr'
    }
  },
  title: {
    textAlign: 'center'
  }
}))


function Login ({ updateUserState }) {
  const c = useStyles()
  const [signUpStep, setSignUpStep] = useState(0)
  const [loginError, setLoginError] = useState(null)
  const [notVerified, setNotVerified] = useState(null)
  const [submitting, setSubmitting] = useState(false)
  const [birthdate, setBirthdate] = useState(new Date('2000-01-01'))
  const [form, setForm] = useState({
    email: '',
    password: '',
    given_name: '',
    gender: 'none',
    authenticationCode: '',
  })
  const inputLabel = useRef(null)


  const handleChange = event => {
    const name = event.target.name
    const value = event.target.value
    setForm(oldForm => ({ ...oldForm, [name]: value }))
  }


  const handleSignUp = async event => {
    event.preventDefault()
    setLoginError(null)
    setSubmitting(true)

    const {
      given_name,
      password,
      email: username,
      gender,
    } = form

    Auth.signUp({
      username,
      password,
      attributes: { given_name, gender, birthdate }
    })
      .then(() => {
        setLoginError(null)
        setSubmitting(false)
        setSignUpStep(2)
      })
      .catch(error => {
        setSubmitting(false)
        setLoginError(error.message)
      })
  }


  const handleSignIn = async event => {
    event.preventDefault()
    setLoginError(null)
    setSubmitting(true)

    try {
      const user = await Auth.signIn(form.email, form.password)
      updateUserState(user.attributes)
    } catch (error) {
      setSubmitting(false)
      setLoginError(error.message)

      if (error.code === 'UserNotConfirmedException') {
        setNotVerified(true)
        Auth.resendSignUp(form.email)
      }
    }
  }


  const handleVerification = async event => {
    event.preventDefault()
    setLoginError(null)
    setSubmitting(true)

    const {
      password,
      email,
      authenticationCode: code
    } = form

    try {
      await Auth.confirmSignUp(email, code)
      const user = await Auth.signIn(email, password)
      updateUserState(user.attributes)
    } catch (error) {
      setSubmitting(false)
      setLoginError(error.message)
    }
  }


  const handleAuthentication = async event => {
    event.preventDefault()
    setLoginError(null)
    setSubmitting(true)

    const { email: username, authenticationCode, password } = form
    try {
      await Auth.confirmSignUp(username, authenticationCode)
      const user = await Auth.signIn(username, password)
      updateUserState(user.attributes)
    } catch (error) {
      setSubmitting(false)
      setLoginError(error.message)
    }
  }


  const gotToSignup = () => {setSignUpStep(1)}
  const gotToLogin = () => {setSignUpStep(0)}
  const gotToVerify = () => {
    setLoginError(null)
    setSignUpStep(3)
  }


  const signUpForm = (
    <>
      <Typography variant="h3" className={c.title}>
        {I18n.get('signup_title')}
      </Typography>
      <form
        className={c.loginForm}
        onSubmit={handleSignUp}>

        <TextField
          required
          fullWidth
          label={I18n.get('form_email')}
          name="email"
          value={form.email}
          onChange={handleChange}
          margin="normal"
          variant="outlined"
          className={c.ltr}
        />
        <TextField
          required
          fullWidth
          label={I18n.get('form_name')}
          name="given_name"
          value={form.given_name}
          onChange={handleChange}
          margin="normal"
          variant="outlined"
          className={c.ltr}
        />


        <MuiPickersUtilsProvider utils={DateFnsUtils}>
          <DatePicker
            required
            fullWidth
            label={I18n.get('form_age')}
            margin="normal"
            variant="outlined"
            format="dd/MM/yyyy"
            openTo="year"
            value={birthdate}
            onChange={setBirthdate}
            className={c.ltr}
          />
        </MuiPickersUtilsProvider>

        <FormControl
          required
          variant="outlined"
          margin="normal"
          className={c.select}
        >
          <InputLabel ref={inputLabel} htmlFor="gender">
            {I18n.get('form_sex')}
          </InputLabel>
          <Select
            required
            value={form.gender}
            onChange={handleChange}
            input={
              <OutlinedInput
                labelWidth={30}
                name="gender"
                id='gender'
              />
            }
          >
            <MenuItem value={'male'}>{I18n.get('form_male')}</MenuItem>
            <MenuItem value={'female'}>{I18n.get('form_female')}</MenuItem>
          </Select>
        </FormControl>

        <TextField
          required
          fullWidth
          label={I18n.get('form_password')}
          type="password"
          name="password"
          value={form.password}
          onChange={handleChange}
          margin="normal"
          variant="outlined"
          className={c.ltr}
        />
        {loginError && (
          <Typography variant="body1" className={c.error}>
            {loginError}
          </Typography>
        )}

        <Button
          disabled={submitting}
          fullWidth
          className={c.button}
          type="submit"
          variant="contained"
          color="primary"
          size="large"
        >
          {submitting && <SyncIcon className={c.uploadingIcon}/>}
          {I18n.get('signup_title')}
        </Button>
      </form>
      <Link
        className={c.link}
        component="button"
        variant="body2"
        onClick={gotToLogin}
      >
        {I18n.get('form_already_registered')}
      </Link>
    </>
  )


  const resendCodeForm = (
    <>
      <Typography variant="h3" className={c.title}>
        {I18n.get('signup_confirm')}
      </Typography>
      <form
        className={c.loginForm}
        onSubmit={handleVerification}>

        <TextField
          required
          fullWidth
          label={I18n.get('form_code')}
          name="authenticationCode"
          value={form.authenticationCode}
          onChange={handleChange}
          margin="normal"
          variant="outlined"
          className={c.ltr}
          helperText={I18n.get('form_check_mail_for_code')}
        />
        {loginError && (
          <Typography variant="body1" className={c.error}>
            {loginError}
          </Typography>
        )}

        <Button
          disabled={submitting}
          fullWidth
          className={c.button}
          type="submit"
          variant="contained"
          color="primary"
          size="large"
        >
          {submitting && <SyncIcon className={c.uploadingIcon}/>}
          {I18n.get('signup_confirm')}
        </Button>
      </form>
    </>
  )


  const confirmForm = (
    <>
      <Typography variant="h3" className={c.title}>
        {I18n.get('signup_confirm')}
      </Typography>
      <form
        className={c.loginForm}
        onSubmit={handleAuthentication}>

        <TextField
          required
          fullWidth
          label={I18n.get('form_email')}
          name="email"
          value={form.email}
          onChange={handleChange}
          margin="normal"
          variant="outlined"
          className={c.ltr}
        />
        <TextField
          required
          fullWidth
          label={I18n.get('form_code')}
          name="authenticationCode"
          value={form.authenticationCode}
          onChange={handleChange}
          margin="normal"
          variant="outlined"
          className={c.ltr}
          helperText={I18n.get('form_check_mail_for_code')}
        />
        {loginError && (
          <Typography variant="body1" className={c.error}>
            {loginError}
          </Typography>
        )}

        <Button
          disabled={submitting}
          fullWidth
          className={c.button}
          type="submit"
          variant="contained"
          color="primary"
          size="large"
        >
          {submitting && <SyncIcon className={c.uploadingIcon}/>}
          {I18n.get('signup_confirm')}
        </Button>
      </form>
    </>
  )


  const loginForm = (
    <>
      <Typography variant="h3" className={c.title}>
        {I18n.get('login_title')}
      </Typography>
      <form
        className={c.loginForm}
        onSubmit={handleSignIn}>

        <TextField
          required
          fullWidth
          label={I18n.get('form_email')}
          name="email"
          value={form.email}
          onChange={handleChange}
          margin="normal"
          variant="outlined"
          className={c.ltr}
        />
        <TextField
          required
          fullWidth
          label={I18n.get('form_password')}
          type="password"
          name="password"
          value={form.password}
          onChange={handleChange}
          margin="normal"
          variant="outlined"
          className={c.ltr}
        />
        {loginError && (
          <Typography variant="body1" className={c.error}>
            {loginError}
          </Typography>
        )}

        {notVerified && (<Link
          className={c.link}
          component="button"
          variant="body2"
          onClick={gotToVerify}
        >
          {I18n.get('form_get_new_code')}
        </Link>)}

        <Button
          disabled={submitting}
          fullWidth
          className={c.button}
          type="submit"
          variant="contained"
          color="primary"
          size="large"
        >
          {submitting && <SyncIcon className={c.uploadingIcon}/>}
          {I18n.get('login_title')}
        </Button>
      </form>
      <Link
        className={c.link}
        component="button"
        variant="body2"
        onClick={gotToSignup}
      >
        {I18n.get('form_not_signed')}
      </Link>
    </>
  )


  return (
    <Container maxWidth="xs" className={c.container}>
      {signUpStep === 0 && loginForm}
      {signUpStep === 1 && signUpForm}
      {signUpStep === 2 && confirmForm}
      {signUpStep === 3 && resendCodeForm}
    </Container>
  )
}


export default Login
