import React from 'react';
import { safeCredentials, handleErrors } from '@utils/fetchHelper';

class LogoutWidget extends React.Component {
  state = {
    logoutError: '',
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
            loggedIn: false,
          })
        }
      })
      .then(() => {
        this.props.onLogout();
      })
      .catch(error => {
        console.log(error);
        this.setState({
          logoutError: 'Error logging out',
        })
      })
  }

  render () {
    const { logoutError } = this.state;
    return (
      <React.Fragment>
        <p className="mb-4">Are you sure you want to log out?</p>
        <button className="btn btn-active btn-error mb-4" onClick={this.endSession}>Log Out</button>
        {logoutError && 
          <div className="alert alert-error mt-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            <span>{logoutError}</span>
          </div>
        }
      </React.Fragment>
    )
  }
}

export default LogoutWidget;