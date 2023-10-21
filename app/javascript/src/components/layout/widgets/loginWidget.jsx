import React from 'react';
import { handleErrors, safeCredentials } from '@utils/fetchHelper';

class LoginWidget extends React.Component {
  state = {
    username: '',
    password: '',
    error: '',
  }

  handleChange = (e) => {
    this.setState({
      [e.target.name]: e.target.value,
    })
  }

  // Login call
  login = (e) => {
    const { username, password } = this.state;
    e.preventDefault();

    fetch('/api/sessions', safeCredentials({
      method: 'POST',
      body: JSON.stringify({
        user: {
          username,
          password,
        }
      })
    }))
      .then(handleErrors)
      .then(response => {
        if (response.success) {
          this.setState({
            username: '',
            password: '',
            email: '',
          }, () => {
            this.props.onLogin(response.characters);
          })
        }
      })
      .catch(error => {
        this.setState({
          error: 'Error logging in',
        })
      })
  }
  
  render () {
    const { username, password, error } = this.state;
    return (
      <React.Fragment>
        <h1 className="text-2xl font-bold mb-4">Log In</h1>
        <form onSubmit={this.login}>
          <div className="mb-4">
            <label>Username</label>
            <input
              type="text"
              name="username"
              className="input input-bordered input-secondary w-full max-w-xs"
              value={username}
              onChange={this.handleChange}
              required
            />
          </div>
          <div className="mb-4">
            <label>Password</label>
            <input
              name="password"
              type="password"
              className="input input-bordered input-secondary w-full max-w-xs"
              value={password}
              onChange={this.handleChange}
              required
            />
          </div>
          <button type="submit" className="btn btn-active btn-primary w-full my-4">Login</button>
          {error && 
            <div className="alert alert-error mt-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              <span>{error}</span>
            </div>
          }
        </form>
        <hr />
        <p className="mt-4">Don't have an account? <a className="text-blue-500 hover:underline cursor-pointer" onClick={this.props.toggle}>Sign up</a></p>
      </React.Fragment>
    )
  }
}

export default LoginWidget;