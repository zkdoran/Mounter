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
    authError: '',
  }

  componentDidMount() {
    this.authenicate();
  }

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

  authenicate = () => {
    fetch('/api/sessions/authenticate', safeCredentials({
      method: 'GET',
    }))
      .then(handleErrors)
      .then(response => {
        if (response.success) {
          this.setState({
            userRoster: response.characters,
            loggedIn: true,
          })
        }
      })
      .catch(error => {
        console.log(error);
        this.setState({
          authError: 'Error authenticating',
        })
      })
  }

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
          error: 'Error logging out',
        })
      })
  }

  handleChange = (e) => {
    this.setState({
      [e.target.name]: e.target.value,
    })
  }

  render() {
    const { username, password, email, error, loggedIn, userRoster } = this.state;

    return (
      <React.Fragment>
        <nav className="navbar navbar-expand-lg bg-body-tertiary">
          <div className="container-fluid">
            <a className="navbar-brand" href="#">Mounter</a>
            <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
              <span className="navbar-toggler-icon"></span>
            </button> 
            {loggedIn ?  (
              <div className="collapse navbar-collapse" id="navbarNav">
                <ul className="navbar-nav">
                  <li className="nav-item">
                    <div class="dropdown">
                      <button class="btn btn-secondary dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                        Roster
                      </button>
                      <ul class="dropdown-menu">
                        {userRoster.map(character => {
                          return (
                            <li><a class="dropdown-item" href="#" name={character.name} realm={character.realm} region={character.region}>{character.name}</a></li>
                          )
                        })}
                      </ul>
                    </div>
                  </li>
                  <li className="nav-item">
                    <button className="btn btn-danger" onClick={this.endSession}>Logout</button>
                  </li>
                  {error && 
                    <li className="nav-item"> 
                      <p className="text-danger mt-2">{error}</p>
                    </li>
                  }
                </ul>
              </div>
              ) : (
              <div className="collapse navbar-collapse" id="navbarNav">            
                <form onSubmit={this.login}>
                  <input name="username" type="text" className="form-control form-control-lg mb-3" placeholder="Username" value={username} onChange={this.handleChange} required />
                  <input name="password" type="password" className="form-control form-control-lg mb-3" placeholder="Password" value={password} onChange={this.handleChange} required />
                  <button type="submit" className="btn btn-danger btn-block btn-lg">Log in</button>
                  {error && <p className="text-danger mt-2">{error}</p>}
                </form>
                <form className="d-flex" onSubmit={this.signup}>
                  <input name="username" type="text" className="form-control form-control-lg mb-3" placeholder="Username" value={username} onChange={this.handleChange} required />
                  <input name="email" type="text" className="form-control form-control-lg mb-3" placeholder="Email" value={email} onChange={this.handleChange} required />
                  <input name="password" type="password" className="form-control form-control-lg mb-3" placeholder="Password" value={password} onChange={this.handleChange} required />
                  <button type="submit" className="btn btn-danger btn-block btn-lg">Sign up</button>
                  {error && <p className="text-danger mt-2">{error}</p>}
                </form>
              </div>
              )}         
          </div>
        </nav>
        {this.props.children}
        <footer className="p-3 bg-light">
          <div className="container">
            <div className="row">
              <div className="col text-center">
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