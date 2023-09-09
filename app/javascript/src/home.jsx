import React from 'react';
import ReactDOM from 'react-dom';
import { handleErrors } from '@utils/fetchHelper';

import './home.scss';

class Home extends React.Component {
  state = {
    characterMounts: [],
  }

  componentDidMount() {
    fetch('https://us.api.blizzard.com/profile/wow/character/illidan/ralegna/collections/mounts?namespace=profile-us&locale=en_US&access_token=USMXsBRyA5TSqH0xQ6YMPYYDjuYZCUetC2')
      .then(handleErrors)
      .then(data => {
        console.log(data);
        this.setState({
          characterMounts: data.mounts,
        })
      })
  }

  render() {
    const { characterMounts } = this.state;

    return (
      <div className="home">
        <h1>Home</h1>
        <ul>
          {characterMounts.map(mount => (
            <li key={mount.mount.id}>
              <img src={mount.mount.icon} alt="image" />
              <p>{mount.mount.name}</p>
            </li>
          ))}
        </ul>
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