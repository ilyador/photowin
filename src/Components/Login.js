import React, { Component } from 'react'
import { Auth } from 'aws-amplify'
import { Form, Button } from 'react-bootstrap'


class Login extends Component {

  state = {
    email: '',
    password: '',
    given_name: '',
    gender: 'none',
    birthdate: '2000-01-01',
    authenticationCode: '',
    signUpStep: 2
  }

  validateForm () {
    return this.state.email.length > 0 && this.state.password.length > 0
  }

  handleChange = event => {
    this.setState({
      [event.target.name]: event.target.value
    })
  }

  handleSignUp = async event => {
    event.preventDefault()

    const {
      given_name,
      password,
      email: username,
      gender,
      birthdate
    } = this.state

    try {
      await Auth.signUp({
        username,
        password,
        attributes: { given_name, gender, birthdate }
      })
      console.log('Successfully signed up!')
      this.setState({ signUpStep: 1 })
    } catch (err) { console.log('error signing up: ', err) }
  }

  handleSignIn = async event => {
    event.preventDefault()

    try {
      let user = await Auth.signIn(this.state.email, this.state.password)
      this.props.updateUserState(user)
      console.log(user)
    } catch (error) {
      console.log(error.message)
    }
  }

  handleAuthentication = async event => {
    event.preventDefault()

    const { email: username, authenticationCode } = this.state
    try {
      await Auth.confirmSignUp(username, authenticationCode)
      console.log('user successfully signed up!')
    } catch (error) {
      console.log('error confirming sign up: ', error)
    }
  }

  render () {
    const { classes: c } = this.props

    const signUpForm = (
      <Form
        className='login-form'
        onSubmit={this.handleSignUp}>
        <Form.Group controlId="email">
          <Form.Label>Email address</Form.Label>
          <Form.Control
            type="email"
            name="email"
            placeholder="Enter email"
            value={this.state.email}
            onChange={this.handleChange}
          />
          <Form.Text className="text-muted">
            We'll never share your email with anyone else.
          </Form.Text>
        </Form.Group>
        <Form.Group controlId="name">
          <Form.Label>Your name</Form.Label>
          <Form.Control
            type="text"
            name="given_name"
            placeholder="Enter your name"
            value={this.state.given_name}
            onChange={this.handleChange}
          />
        </Form.Group>
        <Form.Group controlId="birthdate">
          <Form.Label>Your date of birth</Form.Label>
          <Form.Control
            type="date"
            name="date"
            value={this.state.birthdate}
            onChange={this.handleChange}
          />
        </Form.Group>
        <Form.Group controlId="gender">
          <Form.Label>I am a</Form.Label>
          <Form.Control
            as='select'
            name='gender'
            value={this.state.gender}
            onChange={this.handleChange}
          >
            <option value='none' hidden>Select Gender</option>
            <option value='male'>Man</option>
            <option value='female'>Woman</option>
          </Form.Control>
        </Form.Group>
        <Form.Group controlId="password">
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="password"
            name="password"
            placeholder="Password"
            value={this.state.password}
            onChange={this.handleChange}/>
        </Form.Group>
        <Button
          variant="primary"
          type="submit"
        >
          Sign Up
        </Button>
      </Form>
    )

    const confirmForm = (
      <Form
        className={c.form}
        onSubmit={this.handleAuthentication}>
        <Form.Group controlId="email">
          <Form.Label>Email address</Form.Label>
          <Form.Control
            type="email"
            name="email"
            placeholder="Enter email"
            value={this.state.email}
            onChange={this.handleChange}
          />
        </Form.Group>
        <Form.Group controlId="code">
          <Form.Label>Authentication code</Form.Label>
          <Form.Control
            type="text"
            name="authenticationCode"
            placeholder="Enter confirmation code"
            value={this.state.authenticationCode}
            onChange={this.handleChange}
          />
          <Form.Text className="text-muted">
            Check your email for one-time authentication code
          </Form.Text>
        </Form.Group>
        <Button
          variant="primary"
          type="submit"
        >
          Submit
        </Button>
      </Form>
    )

    const loginForm = (
      <Form
        className={c.form}
        onSubmit={this.handleSignIn}>
        <Form.Group controlId="email">
          <Form.Label>Email address</Form.Label>
          <Form.Control
            type="email"
            name="email"
            placeholder="Enter email"
            value={this.state.email}
            onChange={this.handleChange}
          />
        </Form.Group>
        <Form.Group controlId="password">
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="password"
            name="password"
            placeholder="Password"
            value={this.state.password}
            onChange={this.handleChange}/>
        </Form.Group>
        <Button
          variant="primary"
          type="submit"
        >
          Log In
        </Button>
      </Form>
    )

    return (
      <div className='login'>
        {this.state.signUpStep === 0 && signUpForm}
        {this.state.signUpStep === 1 && confirmForm}
        {this.state.signUpStep === 2 && loginForm}
      </div>
    )
  }
}


export default Login
