// layout.js
import React, { Component } from 'react';
import { handleErrors, safeCredentials } from '@utils/fetchHelper';
import LoginWidget from './loginWidget';
import SignupWidget from './signupWidget';
import LogoutWidget from './logoutWidget';
import Toast from './toast';

class Layout extends Component {
  state = {  
    username: '',
    password: '',
    email: '',
    errors: {},
    loggedIn: false,
    userRoster: [],
    authError: {},
    show_login: true,
    logoutSuccess: false,
    loginSuccess: false,
    showToast: false,
  }

  componentDidMount() {
    this.authenicate();
  }

  handleChange = (e) => {
    this.setState({
      [e.target.name]: e.target.value,
    })
  }

  toggle = () => {
    this.setState({
      show_login: !this.state.show_login,
    })
  }

  handleLogin = () => {
    this.setState({
      loggedIn: true,
      loginSuccess: true,
      logoutSuccess: false,
    }, () => {
      this.showToast();
    })

    document.getElementById('my_modal_3').close();
  }

  handleLogout = () => {
    this.setState({
      loggedIn: false,
      logoutSuccess: true,
      loginSuccess: false,
    }, () => {
      this.showToast();
    })

    document.getElementById('my_modal_3').close();
  }

  showToast = () => {
    this.setState({
      showToast: true,
    })

    setTimeout(this.hideToast, 3000);
  }

  hideToast = () => {
    this.setState({
      showToast: false,
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

  render() {
    const { loggedIn, userRoster, show_login, loginSuccess, logoutSuccess, showToast } = this.state;

    return (
      <React.Fragment>
        <div className="navbar bg-base-300 rounded-box">
          <div className="flex-1 px-2 lg:flex-none">
            <a className="text-lg font-bold">Mounter</a>
          </div>
          {loggedIn ?
            <div className="flex justify-end flex-1 px-2">
              <div className="flex items-stretch">
                <button className="btn btn-ghost" onClick={()=>document.getElementById('my_modal_3').showModal()}>Log Out</button>
                <dialog id="my_modal_3" className="modal">
                  <div className="modal-box flex flex-col items-center justify-center rounded-lg">
                    <form method="dialog">
                      <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
                    </form>
                    <LogoutWidget onLogout={this.handleLogout} />
                  </div>
                </dialog>
                <div className="dropdown dropdown-end">
                  <label tabIndex={0} className="btn btn-ghost rounded-btn">Roster</label>
                  <ul tabIndex={0} className="menu dropdown-content z-[1] p-2 shadow bg-base-300 rounded-box w-52 mt-4">
                    {userRoster.length === 0 &&
                      <li>
                        <p>No characters added</p>
                      </li>
                    }
                    {userRoster.map((character) => {
                        return (
                          <li>
                            <p>{character.name}</p>
                            <button className="btn btn-ghost">Delete</button>
                            <button className="btn btn-ghost">
                              <svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 512 512">{/* <!--! Font Awesome Free 6.4.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2023 Fonticons, Inc. --> */}<path d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM232 344V280H168c-13.3 0-24-10.7-24-24s10.7-24 24-24h64V168c0-13.3 10.7-24 24-24s24 10.7 24 24v64h64c13.3 0 24 10.7 24 24s-10.7 24-24 24H280v64c0 13.3-10.7 24-24 24s-24-10.7-24-24z"/></svg>
                            </button>
                          </li>
                        )
                      }
                    )}
                  </ul>
                </div>
              </div>
            </div>
          :
            <div className="flex justify-end flex-1 px-2">
              <div className="flex items-stretch">
                <button className="btn btn-ghost" onClick={()=>document.getElementById('my_modal_3').showModal()}>Log In</button>
                <dialog id="my_modal_3" className="modal">
                  <div className="modal-box flex flex-col items-center rounded-lg">
                    <form method="dialog">
                      <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
                    </form>
                    {show_login ?  <LoginWidget toggle={this.toggle} onLogin={this.handleLogin} /> : <SignupWidget toggle={this.toggle} onLogin={this.handleLogin} />}
                  </div>
                </dialog>
              </div>
            </div>          
          }
        </div>
        {logoutSuccess && showToast && (
          <Toast message="Successfully logged out" type="success" />
        )}
        {loginSuccess && showToast && (
          <Toast message="Successfully logged in" type="success" />
        )}
        {this.props.children}
        <footer className="footer footer-center p-4 bg-base-300 text-base-content">
          <aside>
            <p>Mounter is not affiliated with Blizzard Entertainment® or World of Warcraft®.</p>
          </aside>
        </footer>
      </React.Fragment>
    );
  }
}

export default Layout;