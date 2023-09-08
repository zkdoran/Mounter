import React from 'react';
import ReactDOM from 'react-dom';
import { handleErrors } from '@utils/fetchHelper';

import './home.scss';

class Home extends React.Component {
  state = {
    temp: 'STARTING',
  }

  componentDidMount() {
    
  }

  render() {
    const { temp } = this.state;
    return (
      <div className="home">
        <h1>Home</h1>
        <p>{temp}</p>
      </div>
    )
  }
}

document.addEventListener('DOMContentLoaded', () => {
  ReactDOM.render(
    <Home />,
    document.body.appendChild(document.createElement('div')),
  )
})