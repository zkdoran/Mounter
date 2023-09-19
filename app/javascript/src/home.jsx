import React from 'react';
import ReactDOM from 'react-dom';
import { handleErrors, safeCredentials } from '@utils/fetchHelper';
import 'dotenv/config';

import './home.scss';

class Home extends React.Component {
  state = {
    mounts: [],
    realms: [],
    region: ['us', 'eu', 'kr', 'tw'],
    characterData: {},
    characterMounts: [],
    userRegion: 'us',
    userRealm: '',
    userCharacter: '',
  }

  componentDidMount() {
    fetch(`/api/calls/realms/${this.state.userRegion}`)
      .then(handleErrors)
      .then(data => {
        console.log(data)
        this.setState({
          realms: data.realms,
        })
      })
      .then(() => this.getMounts())
  }

  getMounts = () => {
    fetch('/api/calls/mounts')
      .then(handleErrors)
      .then(data => {
        console.log(data)
        this.setState({
          mounts: data.mounts,
        })
      })
  }

  getProfile = () => {
    fetch(`/api/calls/profile/${this.state.userRegion}/${this.state.userRealm}/${this.state.userCharacter}`)
      .then(handleErrors)
      .then(data => {
        console.log(data)
        this.setState({
          characterData: data,
        })
      })
  }

  render() {
    const { realms, region, mounts, userRegion } = this.state;
    
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
            <select className="col" onChange={(e) => {
              this.setState({
                userRegion: e.target.value,
              })
            }}>
              <option>Select a Region</option>
              {region.map(region => {
                return (
                  <option key={region} value={region}>{region.toUpperCase()}</option>
                )
              })}
            </select>
            <select className="col" onChange={(e) => {
              this.setState({
                userRealm: e.target.value,
              })
            }}>
              <option>Select a Realm</option>
              {realms.map(realm => {
                return (
                  <option key={realm.id} value={realm.slug}>{realm.name.en_US}</option>
                )
              })}
            </select>
            <input className="col" type="text" placeholder="Character Name" onChange={(e) => {
              this.setState({
                userCharacter: e.target.value,
              })
            }}/>
            <button className="col" onClick={this.getProfile}>Search</button>
          </div>
          <div className="row filters">
            <div className="col">
              <button className="btn btn-primary">Collected</button>
              <button className="btn btn-primary">Not Collected</button>
            </div>
          </div>
          <div className="row mounts">
            <h1 className="source">Mounts</h1>
            {mounts.map(mount => {
                  return (
                    <div key={mount.id} className="col mb-3">                           
                      <div className="card" style={{width: 14 + 'rem'}}>
                        <img src={`https://render.worldofwarcraft.com/us/npcs/zoom/creature-display-${mount.mount_detail.creature_displays[0].id}.jpg`} className="card-img-top" alt="No Image Available. Blame Blizzard." />
                        <div className="card-body">
                          <h5 className="card-title">{mount.name.en_US}</h5>
                          <a href={`https://www.wowhead.com/mount/${mount.id}`} target="_blank">Wowhead</a>
                        </div>
                      </div>
                    </div>
                  )
                })}          
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