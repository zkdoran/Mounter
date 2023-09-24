import React from 'react';
import ReactDOM from 'react-dom';
import { handleErrors, safeCredentials } from '@utils/fetchHelper';
import 'dotenv/config';
import myImg from '../../assets/images/no-image-icon-23500.jpg';

import './home.scss';

class Home extends React.Component {
  state = {
    mounts: [],
    realms: [],
    region: ['us', 'eu', 'kr', 'tw'],
    races: [],
    classes: [],
    characterData: {},
    collectedMounts: [],
    uncollectedMounts: [],
    buttonDisabled: true,
    userRegion: 'us',
    userRealm: '',
    userCharacter: '',
    source: ['ACHIEVEMENT', 'DISCOVERY', 'DROP', 'PETSTORE', 'PROFESSION', 'PROMOTION', 'QUEST', 'TCG', 'VENDOR', 'WORLDEVENT'],
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
      .then(() => this.getRaces())
      .then(() => this.getClasses())
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

  getRaces = () => {
    fetch('/api/calls/races')
      .then(handleErrors)
      .then(data => {
        console.log(data)
        this.setState({
          races: data.races,
        })
      })
  }

  getClasses = () => {
    fetch('/api/calls/classes')
      .then(handleErrors)
      .then(data => {
        console.log(data)
        this.setState({
          classes: data.classes,
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
          buttonDisabled: false,
        })
      })
      .then(() => this.mountFilter())
  }

  mountFilter = () => {
    const { characterData, mounts } = this.state;
    const characterMounts = characterData.mounts.mounts.map(mount => {
      return mount.mount.id
    })

    const collectedMounts = mounts.filter(mount => {
      return characterMounts.includes(mount.id)
    })

    const uncollectedMounts = mounts.filter(mount => {
      return !characterMounts.includes(mount.id)
    })

    this.setState({
      collectedMounts: collectedMounts,
      uncollectedMounts: uncollectedMounts,
    })
  }


  render() {
    const { realms, region, races, classes, mounts, collectedMounts, uncollectedMounts, buttonDisabled } = this.state;
    
    return (
      <div className="home">
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
              <button className="btn btn-primary">All</button>
              <button className="btn btn-primary" disabled={buttonDisabled}>Collected</button>
              <button className="btn btn-primary" disabled={buttonDisabled}>Not Collected</button>
            </div>
          </div>
          <div className="row mounts">
            <h1 className="source">Mounts</h1>
            {mounts.map(mount => {
                  return (
                    <div key={mount.id} className="col mb-3">                           
                      <div className="card" style={{width: 14 + 'rem'}}>
                        <img src={`https://render.worldofwarcraft.com/us/npcs/zoom/creature-display-${mount.mount_detail.creature_displays[0].id}.jpg`} className="card-img-top" alt="Oooo Pretty" onError={(e) => {
                          e.target.src = myImg
                          e.target.alt = 'No Image Found'
                        }} />
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
              </div>
            </div>
          </div>
        </footer>
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