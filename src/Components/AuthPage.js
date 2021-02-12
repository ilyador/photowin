import React, { useState, useEffect, useRef } from 'react'
import { API, Auth, graphqlOperation as operation, I18n } from 'aws-amplify'
import { createUser } from '../graphql/mutations'
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
import { UserContext } from '../helpers/userContext'


const useStyles = makeStyles(theme => ({
  uploadingIcon: {
    marginRight: theme.spacing(1),
    animation: 'rotating 2s linear infinite'
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
  buttons: {
    display: 'flex'
  },
  spacer: {
    flex: '0 0 20px'
  },
  button: {
    margin: theme.spacing(2, 0, 1)
  },
  signupLinkButton: {
    margin: theme.spacing(0, 0, 10)
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
    marginBottom: theme.spacing(2),
    textAlign: 'center'
  }
}))


export default function AuthPage ({ type }) {
  const c = useStyles()
  const [signUpStep, setSignUpStep] = useState(0)
  const [loginError, setLoginError] = useState(null)
  const [notVerified, setNotVerified] = useState(null)
  const [newCodeRequested, setNewCodeRequested] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [form, setForm] = useState({
    email: '',
    password: '',
    given_name: '',
    gender: 'none',
    birthdate: '2000-01-01',
    authenticationCode: '',
    genderToRate: 'both'
  })
  const inputLabel = useRef(null)
  const { setTempUser, setUser } = React.useContext(UserContext)


  const errors = {
    NotAuthorizedException: I18n.get('login_wrong_email'),
    UserNotFoundException: I18n.get('login_no_user'),
    UsernameExistsException: I18n.get('login_email_exists'),
    InvalidParameterException: I18n.get('login_bad_password'),
    CodeMismatchException: I18n.get('login_wrong_code'),
    InvalidPasswordException:  I18n.get('login_bad_password'),
    UserNotConfirmedException: I18n.get('form_get_new_code'),
    LimitExceededException: I18n.get('form_get_new_code_limit')
  }


  useEffect(() => {
    if (type === 'signup') setSignUpStep(1)
  }, [])

  const handleChange = event => {
    const name = event.target.name
    const value = event.target.value
    setForm(oldForm => ({ ...oldForm, [name]: value }))
  }

  const handleChangeEmail = event => {
    const value = event.target.value.toLowerCase()
    setForm(oldForm => ({ ...oldForm, 'email': value }))
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
      birthdate
    } = form

    try {
      await Auth.signUp({
        username,
        password,
        attributes: { given_name, gender, birthdate }
      })

      setLoginError(null)
      setSubmitting(false)
      setNewCodeRequested(true)
      setSignUpStep(3)
    }

    catch (error) {
      setSubmitting(false)
      setLoginError(errors[error.code])
    }
  }


  const handleLogin = async event => {
    event.preventDefault()
    setLoginError(null)
    setSubmitting(true)

    const {
      email: username,
      password
    } = form

    try {
      const user = await Auth.signIn(username, password)
      setTempUser(user.attributes)
    } catch (error) {
      setSubmitting(false)
      setLoginError(errors[error.code])

      if (error.code === 'UserNotConfirmedException') {
        setNotVerified(true)
      }
    }
  }


  const getNewCode = async event => {
    event.preventDefault()
    setLoginError(null)
    setNewCodeRequested(true)
    const { email: username } = form

    try {
      await Auth.resendSignUp(username)
    }

    catch (error) {
      setLoginError(errors[error.code])
    }
  }


  const handleCodeVerification = async event => {
    event.preventDefault()
    setLoginError(null)
    setSubmitting(true)

    const {
      password,
      email: username,
      authenticationCode: code
    } = form

    try {
      await Auth.confirmSignUp(username, code)
      const _user = await Auth.signIn(username, password)
      await setUserInDB(_user.attributes.sub)
      const user = {
        ..._user.attributes,
        points: 0
      }

      setUser(user)
    }

    catch (error) {
      console.log(error)
      setSubmitting(false)
      setLoginError(errors[error.code])
    }
  }


  function setUserInDB(id) {
    return new Promise((resolve, reject) => {
      let birthdate = new Date(form.birthdate).getFullYear()
      let today = new Date().getFullYear()
      let age = today - birthdate

      const input = {
        id,
        name: form.given_name,
        age,
        points: '0',
      }

      API.graphql(operation(createUser, { input }))
        .then(resolve)
        .catch(reject)
    })
  }


  const goToLogin = () => {
    setLoginError(null)
    setSignUpStep(0)
  }
  const goToSignup1 = () => {
    setLoginError(null)
    setSignUpStep(1)
  }
  const goToSignup2 = event => {
    event.preventDefault()
    setLoginError(null)
    setSignUpStep(2)
  }
  const goToVerify = () => {
    setLoginError(null)
    setSignUpStep(3)
  }



  const formFields = {
    email: <TextField
      required
      fullWidth
      label={I18n.get('form_email')}
      name='email'
      value={form.email}
      onChange={handleChangeEmail}
      margin='normal'
      variant='outlined'
      className={c.ltr}
    />
  }


  const loginForm = (
    <>
      <Typography variant='h3' className={c.title}>
        {I18n.get('login_title')}
      </Typography>
      <Typography variant='h6' className={c.title}>
        {I18n.get('main_title')}
      </Typography>
      <Button
        onClick={goToSignup1}
        fullWidth
        className={c.signupLinkButton}
        variant='contained'
        color='primary'
        size='large'
      >
        {I18n.get('form_not_signed')}
      </Button>

      <form onSubmit={handleLogin}>
        {formFields.email}
        <TextField
          required
          fullWidth
          label={I18n.get('form_password')}
          type='password'
          name='password'
          value={form.password}
          onChange={handleChange}
          margin='normal'
          variant='outlined'
          className={c.ltr}
        />
        {(loginError && !notVerified) && (
          <Typography variant='body1' className={c.error}>
            {loginError}
          </Typography>
        )}

        {notVerified && <Button
          fullWidth
          className={c.button}
          variant='contained'
          color='secondary'
          size='large'
          onClick={goToVerify}
        >
          {errors.UserNotConfirmedException}
        </Button>}

        <Button
          disabled={submitting || notVerified}
          fullWidth
          className={c.button}
          type='submit'
          variant='contained'
          color='secondary'
          size='large'
        >
          {I18n.get('form_login')}
          {submitting && <SyncIcon className={c.uploadingIcon}/>}
        </Button>
      </form>
    </>
  )


  const signUpForm1 = (
    <>
      <Typography variant='h3' className={c.title}>
        {I18n.get('signup_title')}
      </Typography>
      <Typography variant='h6' className={c.title}>
        {I18n.get('main_title')}
      </Typography>
      <form onSubmit={goToSignup2}>

        {formFields.email}
        <TextField
          required
          fullWidth
          label={I18n.get('form_name')}
          name='given_name'
          value={form.given_name}
          onChange={handleChange}
          margin='normal'
          variant='outlined'
          className={c.ltr}
        />
        <Button
          disabled={submitting}
          fullWidth
          className={c.button}
          type='submit'
          variant='contained'
          color='primary'
          size='large'
        >
          {I18n.get('signup_next')}
          {submitting && <SyncIcon className={c.uploadingIcon}/>}
        </Button>
      </form>
      <Link
        className={c.link}
        component='button'
        variant='body2'
        onClick={goToLogin}
      >
        {I18n.get('form_already_registered')}
      </Link>
    </>
  )


  const signUpForm2 = (
    <>
      <Typography variant='h3' className={c.title}>
        {I18n.get('signup_title')}
      </Typography>
      <Typography variant='h6' className={c.title}>
        {I18n.get('signup_last')}
      </Typography>
      <form onSubmit={handleSignUp}>

        <FormControl
          required
          variant='outlined'
          margin='normal'
          className={c.select}
        >
          <InputLabel ref={inputLabel} htmlFor='gender'>
            {I18n.get('form_sex')}
          </InputLabel>
          <Select
            required
            value={form.gender}
            onChange={handleChange}
            input={
              <OutlinedInput
                labelWidth={30}
                name='gender'
                id='gender'
              />
            }
          >
            <MenuItem value={'man'}>{I18n.get('form_man')}</MenuItem>
            <MenuItem value={'woman'}>{I18n.get('form_woman')}</MenuItem>
          </Select>
        </FormControl>

        <TextField
          required
          fullWidth
          label={I18n.get('form_age')}
          type='date'
          name='birthdate'
          value={form.birthdate}
          onChange={handleChange}
          margin='normal'
          variant='outlined'
        />

        <TextField
          required
          fullWidth
          label={I18n.get('form_new_password')}
          type='password'
          name='password'
          value={form.password}
          onChange={handleChange}
          margin='normal'
          variant='outlined'
          className={c.ltr}
        />
        {loginError && (
          <Typography variant='body1' className={c.error}>
            {loginError}
          </Typography>
        )}

        <div className={c.buttons}>
          <Button
            fullWidth
            disabled={submitting}
            className={c.button}
            type='submit'
            variant='contained'
            color='primary'
            size='large'
          >
            {I18n.get('signup_title')}
          </Button>
          <div className={c.spacer}></div>
          <Button
            fullWidth
            disabled={submitting}
            className={c.button}
            type='submit'
            variant='contained'
            color='default'
            size='large'
            onClick={() => {setSignUpStep(1)}}
          >
            {I18n.get('back')}
          </Button>
        </div>
      </form>
      <Link
        className={c.link}
        component='button'
        variant='body2'
        onClick={goToLogin}
      >
        {I18n.get('form_already_registered')}
      </Link>
    </>
  )


  const codeConfirmForm = (
    <>
      <Typography variant='h3' className={c.title}>
        {I18n.get('signup_confirm')}
      </Typography>
      <form onSubmit={newCodeRequested ? handleCodeVerification : getNewCode}>
        <TextField
          required
          fullWidth
          label={newCodeRequested ? I18n.get('form_code') : I18n.get('form_email')}
          name={newCodeRequested ?'authenticationCode' : 'email'}
          value={newCodeRequested ? form.authenticationCode : form.email}
          onChange={handleChange}
          margin='normal'
          variant='outlined'
          className={c.ltr}
          helperText={newCodeRequested && I18n.get('form_check_mail_for_code')}
        />

        {loginError && (
          <Typography variant='body1' className={c.error}>
            {loginError}
          </Typography>
        )}

        <Button
          disabled={submitting}
          fullWidth
          className={c.button}
          type='submit'
          variant='contained'
          color='primary'
          size='large'
        >
          {newCodeRequested ? <>
            {I18n.get('signup_confirm')}
            {submitting && <SyncIcon className={c.uploadingIcon}/>}
          </> : <>
            {I18n.get('signup_confirm_request')}
          </>}
        </Button>
      </form>
    </>
  )



  return (
    <Container maxWidth='xs' className={c.container}>
      {signUpStep === 0 && loginForm}
      {signUpStep === 1 && signUpForm1}
      {signUpStep === 2 && signUpForm2}
      {signUpStep === 3 && codeConfirmForm}
    </Container>
  )
}
