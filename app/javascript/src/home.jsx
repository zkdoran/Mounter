import React from 'react';
import ReactDOM from 'react-dom';
import { handleErrors } from '@utils/fetchHelper';
import 'dotenv/config';

import './home.scss';

class Home extends React.Component {
  state = {
    characterMounts: [],
    detailedMounts: [],
  }

  componentDidMount() {
    this.setState({ options: [
      { value: 'Achievement', label: 'Achievement' },
      { value: 'Quest', label: 'Quest' },
      { value: 'Vendor', label: 'Vendor' },
      { value: 'Drop', label: 'Drop' },
    ]});
  }

  render() {
    const { characterMounts } = this.state;
    
    return (
      <React.Fragment>
        <nav className="navbar navbar-expand-lg bg-body-tertiary">
          <div className="container-fluid">
            <a className="navbar-brand" href="#">Mounter</a>
            <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
              <span className="navbar-toggler-icon"></span>
            </button>
            <div className="collapse navbar-collapse" id="navbarNav">
              <ul className="navbar-nav">
                <li className="nav-item">
                  <a className="nav-link active" aria-current="page" href="#">Home</a>
                </li>
                <li className="nav-item">
                  <a className="nav-link" href="#">Features</a>
                </li>
                <li className="nav-item">
                  <a className="nav-link" href="#">Pricing</a>
                </li>
                <li className="nav-item">
                  <a className="nav-link disabled" aria-disabled="true">Disabled</a>
                </li>
              </ul>
            </div>
          </div>
        </nav>
        <div className="container">
          <div className="row">
            <div className="col text-center banner py-5">
              <h1>Mounter</h1>
              <p>Mounter is a web application that allows you to track your mounts in World of Warcraft.</p>
            </div>
          </div>
          <div className="row dropdowns">
            <select>
              <option value="Character">Character</option>
              <option value={"words"}>words</option>
            </select>
          </div>
          <div className="row mounts">
            <div className="col m-3 p-3 g-3">
              <h1 className="source">Achievements</h1>
            </div>
            <div className="col m-3 p-3 g-3">
              <h1 className="source">Quests</h1>
            </div>
          </div>
          <div className="row mounts">
            <div className="col m-3 p-3 g-3">
              <h1 className="source">Vendor</h1>
            </div>
            <div className="col m-3 p-3 g-3">
              <h1 className="source">Drops</h1>
            </div>
          </div>
        </div>
        <footer className="p-3 bg-light">
          <div className="container">
            <div className="row">
              <div className="col text-center">
                <p>Mounter is not affiliated with Blizzard Entertainment® or World of Warcraft®.</p>
                <p>Background photo by <a href="https://unsplash.com/@malikskyds?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Malik Skydsgaard</a> on <a href="https://unsplash.com/photos/ylGcmefqE_I?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Unsplash</a></p>
              </div>
            </div>
          </div>
        </footer>
      </React.Fragment>
    )
  }
}

document.addEventListener('DOMContentLoaded', () => {
  ReactDOM.render(
    <Home />,
    document.body.appendChild(document.createElement('div')),
  )
})