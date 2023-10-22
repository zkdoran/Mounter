// layout.js
import React, { Component } from 'react';
import { handleErrors, safeCredentials } from '@utils/fetchHelper';
import LoginWidget from '@comps/layout/widgets/loginWidget';
import SignupWidget from '@comps/layout/widgets/signupWidget';
import LogoutWidget from '@comps/layout/widgets/logoutWidget';
import Toast from '@comps/toast/toast';

class Layout extends Component {
  state = {  
    username: '',
    errors: {},
    loggedIn: false,
    userRoster: [],
    authError: {},
    show_login: true,
    logoutSuccess: false,
    loginSuccess: false,
    showToast: false,
    deleteSuccess: false,
  }

  componentDidMount() {
    this.authenicate();
  }

  componentDidUpdate(prevProps) {
    if (this.props.userRoster !== prevProps.userRoster) {
      this.setState({
        userRoster: this.props.userRoster,
      });
    }
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

  handleLogin = (roster, username) => {
    this.setState({
      loggedIn: true,
      loginSuccess: true,
      logoutSuccess: false,
      userRoster: roster,
      username: username,
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
      userRoster: [],
      username: '',
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
            username: response.username,
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

  deleteCharacter = (id) => {
    fetch(`/api/characters/${id}`, safeCredentials({
      method: 'DELETE',
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
            deleteSuccess: true,
          }, () => {
            this.showToast();
          })
        }
      })
      .catch(error => {
        console.log(error);
      })
  }

  render() {
    const { loggedIn, userRoster, show_login, loginSuccess, logoutSuccess, showToast, deleteSuccess } = this.state;

    return (
      <React.Fragment>
        <div className="navbar bg-secondary-content rounded-box">
          <div className="flex-1 px-2 lg:flex-none">
            <a href="/" className="text-lg font-bold flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 640 512" className="mr-2">{/* <!--! Font Awesome Free 6.4.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2023 Fonticons, Inc. --> */}<path d="M352 124.5l-51.9-13c-6.5-1.6-11.3-7.1-12-13.8s2.8-13.1 8.7-16.1l40.8-20.4L294.4 28.8c-5.5-4.1-7.8-11.3-5.6-17.9S297.1 0 304 0H416h32 16c30.2 0 58.7 14.2 76.8 38.4l57.6 76.8c6.2 8.3 9.6 18.4 9.6 28.8c0 26.5-21.5 48-48 48H538.5c-17 0-33.3-6.7-45.3-18.7L480 160H448v21.5c0 24.8 12.8 47.9 33.8 61.1l106.6 66.6c32.1 20.1 51.6 55.2 51.6 93.1C640 462.9 590.9 512 530.2 512H496 432 32.3c-3.3 0-6.6-.4-9.6-1.4C13.5 507.8 6 501 2.4 492.1C1 488.7 .2 485.2 0 481.4c-.2-3.7 .3-7.3 1.3-10.7c2.8-9.2 9.6-16.7 18.6-20.4c3-1.2 6.2-2 9.5-2.2L433.3 412c8.3-.7 14.7-7.7 14.7-16.1c0-4.3-1.7-8.4-4.7-11.4l-44.4-44.4c-30-30-46.9-70.7-46.9-113.1V181.5v-57zM512 72.3c0-.1 0-.2 0-.3s0-.2 0-.3v.6zm-1.3 7.4L464.3 68.1c-.2 1.3-.3 2.6-.3 3.9c0 13.3 10.7 24 24 24c10.6 0 19.5-6.8 22.7-16.3zM130.9 116.5c16.3-14.5 40.4-16.2 58.5-4.1l130.6 87V227c0 32.8 8.4 64.8 24 93H112c-6.7 0-12.7-4.2-15-10.4s-.5-13.3 4.6-17.7L171 232.3 18.4 255.8c-7 1.1-13.9-2.6-16.9-9s-1.5-14.1 3.8-18.8L130.9 116.5z"/></svg> 
              Mounter
            </a>
          </div>
          {loggedIn ?
            <div className="flex justify-end flex-1 px-2">
              <div className="flex items-stretch">
                <h3 className="italic flex items-center">
                  Welcome, {this.state.username}!
                </h3>
                <button className="btn btn-ghost ms-3" onClick={()=>document.getElementById('my_modal_3').showModal()}>Log Out</button>
                <dialog id="my_modal_3" className="modal">
                  <div className="modal-box flex flex-col items-center justify-center rounded-lg">
                    <form method="dialog">
                      <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
                    </form>
                    <LogoutWidget onLogout={this.handleLogout} />
                  </div>
                </dialog>
                <div className="dropdown dropdown-bottom dropdown-end">
                  <label tabIndex={0} className="btn btn-ghost rounded-btn">Roster</label>
                  <ul tabIndex={0} className="menu dropdown-content z-[1] p-2 shadow bg-base-300 rounded-box w-auto mt-4">
                    {userRoster.length === 0 &&
                      <li>
                        <p>No characters added</p>
                      </li>
                    }
                    {userRoster.map((character) => {
                        return (
                          <li key={character.id} className="flex items-end justify-between">
                            <div className="flex">
                              <span>
                                {character.region.toUpperCase()}
                              </span>
                              <span>
                                -
                              </span>
                              <span>
                                 {character.realm.charAt(0).toUpperCase() + character.realm.slice(1)}:
                              </span>
                              <span>
                                {character.name.charAt(0).toUpperCase() + character.name.slice(1)}
                              </span>
                              <button className="btn btn-primary btn-xs" onClick={() => this.props.updateSelectedCharacter(character)}>
                                Search
                              </button>
                              <button className="btn btn-secondary btn-xs" onClick={() => this.deleteCharacter(character.id)}>
                                Delete
                              </button>
                            </div>
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
        {deleteSuccess && showToast && (
          <Toast message="Removed from Roster" type="success" />
        )}
        {this.props.children}
        <footer className="footer items-center p-4 bg-neutral text-neutral-content">
          <aside className="items-center grid-flow-col">
            <svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 640 512">{/* <!--! Font Awesome Free 6.4.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2023 Fonticons, Inc. --> */}<path d="M352 124.5l-51.9-13c-6.5-1.6-11.3-7.1-12-13.8s2.8-13.1 8.7-16.1l40.8-20.4L294.4 28.8c-5.5-4.1-7.8-11.3-5.6-17.9S297.1 0 304 0H416h32 16c30.2 0 58.7 14.2 76.8 38.4l57.6 76.8c6.2 8.3 9.6 18.4 9.6 28.8c0 26.5-21.5 48-48 48H538.5c-17 0-33.3-6.7-45.3-18.7L480 160H448v21.5c0 24.8 12.8 47.9 33.8 61.1l106.6 66.6c32.1 20.1 51.6 55.2 51.6 93.1C640 462.9 590.9 512 530.2 512H496 432 32.3c-3.3 0-6.6-.4-9.6-1.4C13.5 507.8 6 501 2.4 492.1C1 488.7 .2 485.2 0 481.4c-.2-3.7 .3-7.3 1.3-10.7c2.8-9.2 9.6-16.7 18.6-20.4c3-1.2 6.2-2 9.5-2.2L433.3 412c8.3-.7 14.7-7.7 14.7-16.1c0-4.3-1.7-8.4-4.7-11.4l-44.4-44.4c-30-30-46.9-70.7-46.9-113.1V181.5v-57zM512 72.3c0-.1 0-.2 0-.3s0-.2 0-.3v.6zm-1.3 7.4L464.3 68.1c-.2 1.3-.3 2.6-.3 3.9c0 13.3 10.7 24 24 24c10.6 0 19.5-6.8 22.7-16.3zM130.9 116.5c16.3-14.5 40.4-16.2 58.5-4.1l130.6 87V227c0 32.8 8.4 64.8 24 93H112c-6.7 0-12.7-4.2-15-10.4s-.5-13.3 4.6-17.7L171 232.3 18.4 255.8c-7 1.1-13.9-2.6-16.9-9s-1.5-14.1 3.8-18.8L130.9 116.5z"/></svg>   
            <p>Mounter is not affiliated with Blizzard Entertainment® or World of Warcraft®.</p>
          </aside> 
          <nav className="grid-flow-col gap-4 md:place-self-center md:justify-self-end">
            <a href="https://twitter.com/AtomicCow" target="_blank" rel="noopener noreferrer"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" className="fill-current"><path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"></path></svg>
            </a> 
            <a href="https://github.com/AtomicCow87/Mounter" target="_blank" rel="noopener noreferrer"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg></a>
          </nav>
        </footer>
      </React.Fragment>
    );
  }
}

export default Layout;