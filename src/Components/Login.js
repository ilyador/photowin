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
import Container from '@material-ui/core/Container';
import Typography from '@material-ui/core/Typography';


const useStyles = makeStyles(theme => ({
  loginForm: {
    marginTop: theme.spacing(4)
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
    marginTop: theme.spacing(4)
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
      updateUserState(user.attributes)
    } catch (error) {
      console.log(error.message)
    }
  }

  const handleAuthentication = async event => {
    event.preventDefault()

    const { email: username, authenticationCode } = form
    try {
      let user = await Auth.confirmSignUp(username, authenticationCode)
      updateUserState(user.attributes)
      console.log('user successfully signed up!')

    } catch (error) {
      console.log('error confirming sign up: ', error)
    }
  }

  const gotToSignup = () => {setSignUpStep(1)}
  const gotToLogin = () => {setSignUpStep(0)}


  const signUpForm = (
    <>
      <Typography variant="h3">
        Sign Up
      </Typography>
      <form
        className={c.loginForm}
        onSubmit={handleSignUp}>

        <Link
          className={c.link}
          component="button"
          variant="body2"
          onClick={gotToLogin}
        >
          Already registered? Login up here.
        </Link>

        <TextField
          required
          fullWidth
          label="Email address"
          name="email"
          value={form.email}
          onChange={handleChange}
          margin="normal"
          variant="outlined"
        />
        <TextField
          required
          fullWidth
          label="Your name"
          name="given_name"
          value={form.given_name}
          onChange={handleChange}
          margin="normal"
          variant="outlined"
        />
        <TextField
          required
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
          required
          variant="outlined"
          margin="normal"
          className={c.select}
        >
          <InputLabel ref={inputLabel} htmlFor="gender">
            Select Gender
          </InputLabel>
          <Select
            required
            value={form.gender}
            onChange={handleChange}
            input={
              <OutlinedInput
                labelWidth={112}
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
          required
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
          fullWidth
          className={c.button}
          type="submit"
          variant="contained"
          color="primary"
          size="large"
        >
          Sign Up
        </Button>
      </form>
    </>
  )


  const confirmForm = (
    <>
      <Typography variant="h4">
        Confirm signup
      </Typography>
      <form
        className={c.loginForm}
        onSubmit={handleAuthentication}>

        <TextField
          required
          fullWidth
          label="Email address"
          name="email"
          value={form.email}
          onChange={handleChange}
          margin="normal"
          variant="outlined"
        />
        <TextField
          required
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
          fullWidth
          className={c.button}
          type="submit"
          variant="contained"
          color="primary"
          size="large"
        >
          Submit
        </Button>
      </form>
    </>
  )


  const loginForm = (
    <>
      <Typography variant="h3">
        Login
      </Typography>
      <form
        className={c.loginForm}
        onSubmit={handleSignIn}>

        <TextField
          required
          fullWidth
          label="Email address"
          name="email"
          value={form.email}
          onChange={handleChange}
          margin="normal"
          variant="outlined"
        />
        <TextField
          required
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
          fullWidth
          className={c.button}
          type="submit"
          variant="contained"
          color="primary"
          size="large"
        >
          Log In
        </Button>
      </form>
    </>
  )


  return (
    <Container maxWidth="xs" className={c.container}>
      {signUpStep === 0 && loginForm}
      {signUpStep === 1 && signUpForm}
      {signUpStep === 2 && confirmForm}
    </Container>
  )
}


export default Login
