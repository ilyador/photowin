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


const useStyles = makeStyles(theme => ({
  login: {
    padding: [60, 0]
  },
  loginForm: {
    margin: [0, 'auto'],
    maxWidth: 320
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


  const handleChange = name => event => {
    setForm({ ...form, [name]: event.target.value })
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
      setSignUpStep(1)
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
      await Auth.confirmSignUp(username, authenticationCode)
      console.log('user successfully signed up!')
    } catch (error) {
      console.log('error confirming sign up: ', error)
    }
  }


  const signUpForm = (
    <form
      className={c.loginForm}
      onSubmit={handleSignUp}>

      <TextField
        label="Email address"
        name="email"
        value={form.email}
        onChange={handleChange}
        margin="normal"
        variant="outlined"
      />
      <TextField
        label="Your name"
        name="given_name"
        value={form.given_name}
        onChange={handleChange}
        margin="normal"
        variant="outlined"
      />
      <TextField
        label="Birthday"
        type="date"
        name="birthdate"
        value={form.birthdate}
        onChange={handleChange}
        InputLabelProps={{ shrink: true }}
      />

      <FormControl variant="outlined">
        <InputLabel ref={inputLabel} htmlFor="gender">
          Select Gender
        </InputLabel>
        <Select
          value={form.gender}
          onChange={handleChange}
          input={
            <OutlinedInput
              labelWidth={100}
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
        label="Choose password"
        type="password"
        name="password"
        value={form.password}
        onChange={handleChange}
        margin="normal"
        variant="outlined"
      />

      <Button variant="outlined" size="large" color="primary">
        Sign Up
      </Button>
    </form>
  )



  const confirmForm = (
    <form
      className={c.loginForm}
      onSubmit={handleAuthentication}>

      <TextField
        label="Email address"
        name="email"
        value={form.email}
        onChange={handleChange}
        margin="normal"
        variant="outlined"
      />
      <TextField
        label="Authentication code"
        name="authenticationCode"
        value={form.authenticationCode}
        onChange={handleChange}
        margin="normal"
        variant="outlined"
        helperText="Check your email for one-time authentication code"
      />

      <Button variant="outlined" size="large" color="primary">
        Submit
      </Button>
    </form>
  )



  const loginForm = (
    <form
      className={c.loginForm}
      onSubmit={handleSignIn}>

      <TextField
        label="Email address"
        name="email"
        value={form.email}
        onChange={handleChange}
        margin="normal"
        variant="outlined"
      />
      <TextField
        label="Password"
        type="password"
        name="password"
        value={form.password}
        onChange={handleChange}
        margin="normal"
        variant="outlined"
      />
      <Button variant="outlined" size="large" color="primary">
        Log In
      </Button>
    </form>
  )

  return (
    <div className={c.login}>
      {signUpStep === 0 && signUpForm}
      {signUpStep === 1 && confirmForm}
      {signUpStep === 2 && loginForm}
    </div>
  )
}


export default Login
