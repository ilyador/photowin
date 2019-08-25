import React, { useState, useEffect, useRef } from 'react'
import { Auth } from 'aws-amplify'
import { makeStyles } from '@material-ui/core/styles'
import MenuItem from '@material-ui/core/MenuItem'
import TextField from '@material-ui/core/TextField'
import OutlinedInput from '@material-ui/core/OutlinedInput'
import InputLabel from '@material-ui/core/InputLabel'
import FormControl from '@material-ui/core/FormControl'
import Select from '@material-ui/core/Select'
import Button from '@material-ui/core/Button'
import Link from '@material-ui/core/Link';


const useStyles = makeStyles(theme => ({
  login: {
    padding: [60, 0]
  },
  loginForm: {
    margin: [0, 'auto'],
    maxWidth: 320
  },
  formControl: {
    minWidth: 120,
  },
  '.select, .link': {
    width: '100%'
  }
}))


function Login ({ updateUserState }) {
  const c = useStyles()
  const [signUpStep, setSignUpStep] = useState(0)
  const [form, setForm] = useState({
    email: '',
    password: '',
    given_name: '',
    gender: 'none',
    birthdate: '2000-01-01',
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
      console.log('Successfully signed up!')
      setSignUpStep(2)
    } catch (err) { console.log('error signing up: ', err) }
  }

  const handleSignIn = async event => {
    event.preventDefault()

    try {
      let user = await Auth.signIn(form.email, form.password)
      updateUserState(user)
    } catch (error) {
      console.log(error.message)
    }
  }

  const handleAuthentication = async event => {
    event.preventDefault()

    const { email: username, authenticationCode } = form
    try {
      let user = await Auth.confirmSignUp(username, authenticationCode)
      updateUserState(user)
      console.log('user successfully signed up!')

    } catch (error) {
      console.log('error confirming sign up: ', error)
    }
  }

  const gotToSignup = () => {setSignUpStep(1)}


  const signUpForm = (
    <form
      className={c.loginForm}
      onSubmit={handleSignUp}>

      <Link
        className={c.link}
        component="button"
        variant="body2"
        onClick={gotToSignup}
      >
        Already registered? Login up here.
      </Link>

      <TextField
        fullWidth
        label="Email address"
        name="email"
        value={form.email}
        onChange={handleChange}
        margin="normal"
        variant="outlined"
      />
      <TextField
        fullWidth
        label="Your name"
        name="given_name"
        value={form.given_name}
        onChange={handleChange}
        margin="normal"
        variant="outlined"
      />
      <TextField
        fullWidth
        label="Birthday"
        type="date"
        name="birthdate"
        value={form.birthdate}
        onChange={handleChange}
        margin="normal"
        variant="outlined"
      />

      <FormControl
        variant="outlined"
        margin="normal"
        className={c.select}
      >
        <InputLabel ref={inputLabel} htmlFor="gender">
          Select Gender
        </InputLabel>
        <Select
          value={form.gender}
          onChange={handleChange}
          input={
            <OutlinedInput
              labelWidth={105}
              name="gender"
              id='gender'
            />
          }
        >
          <MenuItem value={'male'}>Man</MenuItem>
          <MenuItem value={'female'}>Woman</MenuItem>
        </Select>
      </FormControl>

      <TextField
        fullWidth
        label="Choose password"
        type="password"
        name="password"
        value={form.password}
        onChange={handleChange}
        margin="normal"
        variant="outlined"
      />

      <Button
        type="submit"
        variant="outlined"
        size="large"
        color="primary"
      >
        Sign Up
      </Button>
    </form>
  )



  const confirmForm = (
    <form
      className={c.loginForm}
      onSubmit={handleAuthentication}>

      <TextField
        fullWidth
        label="Email address"
        name="email"
        value={form.email}
        onChange={handleChange}
        margin="normal"
        variant="outlined"
      />
      <TextField
        fullWidth
        label="Authentication code"
        name="authenticationCode"
        value={form.authenticationCode}
        onChange={handleChange}
        margin="normal"
        variant="outlined"
        helperText="Check your email for one-time authentication code"
      />

      <Button
        type="submit"
        variant="outlined"
        size="large"
        color="primary"
      >
        Submit
      </Button>
    </form>
  )



  const loginForm = (
    <form
      className={c.loginForm}
      onSubmit={handleSignIn}>

      <TextField
        fullWidth
        label="Email address"
        name="email"
        value={form.email}
        onChange={handleChange}
        margin="normal"
        variant="outlined"
      />
      <TextField
        fullWidth
        label="Password"
        type="password"
        name="password"
        value={form.password}
        onChange={handleChange}
        margin="normal"
        variant="outlined"
      />

      <Link
        className={c.link}
        component="button"
        variant="body2"
        onClick={gotToSignup}
      >
        Not registered? Sign up here.
      </Link>

      <Button
        type="submit"
        variant="outlined"
        size="large"
        color="primary"
      >
        Log In
      </Button>
    </form>
  )


  return (
    <div className={c.login}>
      {signUpStep === 0 && loginForm}
      {signUpStep === 1 && signUpForm}
      {signUpStep === 2 && confirmForm}
    </div>
  )
}


export default Login
