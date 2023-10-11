// layout.js
import React, { Component } from 'react';
import { handleErrors, safeCredentials } from '@utils/fetchHelper';

class Layout extends Component {
  state = {  
    username: '',
    password: '',
    email: '',
    errors: {},
    loggedIn: false,
    userRoster: [],
    authError: {},
    logoutError: '',
  }

  componentDidMount() {
    this.authenicate();
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
            userRoster: response.characters,
            loggedIn: true,
            username: '',
            password: '',
            email: '',
          })
        }
      })
      .catch(error => {
        console.log(error);
        this.setState({
          error: 'Error logging in',
        })
      })
  }

  // Signup call, auto runs the login call if successful
  signup = (e) => {
    const { username, password, email } = this.state;
    e.preventDefault();

    fetch('/api/users', safeCredentials({
      method: 'POST',
      body: JSON.stringify({
        user: {
          username,
          password,
          email,
        }
      })
    }))
      .then(handleErrors)
      .then(response => {
        if (response.success) {
          this.login();
        }
      })
      .catch(error => {
        console.log(error);
        this.setState({
          error: 'Error signing up',
        })
      })
  }

  // Authenticate call to check if user is logged in
  authenicate = () => {
    fetch('/api/sessions/authenticate', safeCredentials({
      method: 'GET',
    }))
      .then(response => {
        if (!response.ok) {
          throw response.json();
        }
        return response.json();
      })
      .then(response => {
        if (response.success) {
          this.setState({
            userRoster: response.characters,
            loggedIn: true,
          })
        }
      })
      .catch(error => {
        this.setState({
          authError: error,
        })
      })
  }

  // Logout call
  endSession = () => {
    fetch('/api/sessions/logout', safeCredentials({
      method: 'DELETE',
    }))
      .then(handleErrors)
      .then(response => {
        if (response.success) {
          this.setState({
            userRoster: [],
            loggedIn: false,
            username: '',
            password: '',
            email: '',
          })
        }
      })
      .catch(error => {
        console.log(error);
        this.setState({
          logoutError: 'Error logging out',
        })
      })
  }

  render() {
    const { username, password, email, error, loggedIn, userRoster } = this.state;

    return (
      <React.Fragment>
        <nav className="">
          <div className="">
            <a className="" href="#">Mounter</a>
            <button className="" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
              <span className=""></span>
            </button> 
            {loggedIn ?  (
              <div className="" id="navbarNav">
                <ul className="">
                  <li className="">
                    <div className="">
                      <button className="" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                        Roster
                      </button>
                      <ul className="">
                        {userRoster.map(character => {
                          return (
                            <li><a className="" href="#" name={character.name} realm={character.realm} region={character.region}>{character.name}</a></li>
                          )
                        })}
                      </ul>
                    </div>
                  </li>
                  <li className="">
                    <button className="" onClick={this.endSession}>Logout</button>
                  </li>
                  {error && 
                    <li className=""> 
                      <p className="">{error}</p>
                    </li>
                  }
                </ul>
              </div>
              ) : (
              <div className="" id="">            
                <form onSubmit={this.login}>
                  <input name="username" type="text" className="" placeholder="Username" value={username} onChange={this.handleChange} required />
                  <input name="password" type="password" className="" placeholder="Password" value={password} onChange={this.handleChange} required />
                  <button type="submit" className="">Log in</button>
                  {error && <p className="text-danger mt-2">{error}</p>}
                </form>
                <form className="d-flex" onSubmit={this.signup}>
                  <input name="username" type="text" className="" placeholder="Username" value={username} onChange={this.handleChange} required />
                  <input name="email" type="text" className="" placeholder="Email" value={email} onChange={this.handleChange} required />
                  <input name="password" type="password" className="" placeholder="Password" value={password} onChange={this.handleChange} required />
                  <button type="submit" className="">Sign up</button>
                  {error && <p className="">{error}</p>}
                </form>
              </div>
              )}         
          </div>
        </nav>
        {this.props.children}
        <footer className="">
          <div className="">
            <div className="">
              <div className="">
                <p>Mounter is not affiliated with Blizzard Entertainment® or World of Warcraft®.</p>
              </div>
            </div>
          </div>
        </footer>
      </React.Fragment>
    );
  }
}

export default Layout;