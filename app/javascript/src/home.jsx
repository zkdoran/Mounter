import React from 'react';
import ReactDOM from 'react-dom';
import { handleErrors, safeCredentials } from '@utils/fetchHelper';
import 'dotenv/config';
import myImg from '../../assets/images/no-image-icon-23500.jpg';

import './home.scss';

class Home extends React.Component {
  state = {
    realms: {},
    region: ['us', 'eu', 'kr', 'tw'],
    mounts: [],
    races: [],
    classes: [],
    characterData: {},
    collectedMounts: [],
    uncollectedMounts: [],
    buttonDisabled: true,
    realmList: [],
    userRegion: '',
    userRealm: '',
    userCharacter: '',
    source: ['ACHIEVEMENT', 'DISCOVERY', 'DROP', 'PETSTORE', 'PROFESSION', 'PROMOTION', 'QUEST', 'TCG', 'VENDOR', 'WORLDEVENT'],
    searchError: '',
    listChoice: '',
    mountDisplay: [],
  }

  componentDidMount() {
    this.getRealms();
    this.getMounts();
    this.getRaces();
    this.getClasses();
  }

  getRealms = () => {
    fetch('/api/calls/realms/')
      .then(handleErrors)
      .then(data => {
        console.log(data)
        this.setState({
          realms: data,
        })
      })
  }

  getMounts = () => {
    fetch('/api/calls/mounts')
      .then(handleErrors)
      .then(data => {
        console.log(data)
        this.setState({
          mounts: data,
        })
      })
      .then(() => this.mountSwitch())
  }

  getRaces = () => {
    fetch('/api/calls/races')
      .then(handleErrors)
      .then(data => {
        console.log(data)
        this.setState({
          races: data,
        })
      })
  }

  getClasses = () => {
    fetch('/api/calls/classes')
      .then(handleErrors)
      .then(data => {
        console.log(data)
        this.setState({
          classes: data,
        })
      })
  }

  getProfile = () => {
    this.setState({
      searchError: '',
    })

    if (this.state.userRegion === '' || this.state.userRealm === '' || this.state.userCharacter === '') {
      this.setState({
        searchError: 'Please fill out all fields',
      })
      return;
    }

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
      .catch(error => {
        console.log(error)
        this.setState({
          searchError: 'Character not found',
        })
      })
  }

  mountFilter = () => {
    const { characterData, mounts } = this.state;
    const characterMounts = characterData.mounts.map(mount => mount.id);
  
    const collectedMounts = mounts.filter(mount => characterMounts.includes(mount.id));
  
    // Update should_exclude_if_uncollected to false for collected mounts
    const updatedCollectedMounts = collectedMounts.map(mount => ({
      ...mount,
      mount_detail: {
        ...mount.mount_detail,
        should_exclude_if_uncollected: false,
      },
    }));
  
    const uncollectedMounts = mounts.filter(mount => !characterMounts.includes(mount.id));
  
    this.setState({
      collectedMounts: updatedCollectedMounts,
      uncollectedMounts: uncollectedMounts,
    });
  
    this.mountSwitch();
  }
  

  handleRegionChange = (e) => {
    this.setState({
      userRegion: e.target.value,
    }, () => this.realmSwitch())
  }

  handleRealmChange = (e) => {
    this.setState({
      userRealm: e.target.value,
    })
  }

  handleCharacterChange = (e) => {
    this.setState({
      userCharacter: e.target.value,
    })
  }

  realmSwitch = () => {
    const { realms, userRegion } = this.state;

    const us_realms = realms.us;
    const eu_realms = realms.eu;
    const kr_realms = realms.kr;
    const tw_realms = realms.tw;

    switch(userRegion) {
      case 'us':
        this.setState({
          realmList: us_realms,
        })
        break;
      case 'eu':
        this.setState({
          realmList: eu_realms,
        })
        break;
      case 'kr':
        this.setState({
          realmList: kr_realms,
        })
        break;
      case 'tw':
        this.setState({
          realmList: tw_realms,
        })
        break;
      default:
        this.setState({
          realmList: [],
        })
    }
  }

  listChoice = (e) => {
    this.setState({
      listChoice: e.target.value,
    }, () => this.mountSwitch())
  }

  mountSwitch = () => {
    const { mounts, collectedMounts, uncollectedMounts, listChoice} = this.state;

    switch(listChoice) {
      case 'all':
        this.setState({
          mountDisplay: mounts,
        })
        break;
      case 'collected':
        this.setState({
          mountDisplay: collectedMounts,
        })
        break;
      case 'uncollected':
        this.setState({
          mountDisplay: uncollectedMounts,
        })
        break;
      default:
        this.setState({
          mountDisplay: mounts,
        })
    }
  }

  render() {
    const { region, races, classes, mountDisplay, buttonDisabled, realmList, searchError } = this.state;
    
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
            <select className="col region" onChange={this.handleRegionChange}>
              <option>Select a Region</option>
              {region.map(region => {
                return (
                  <option key={region} value={region}>{region.toUpperCase()}</option>
                )
              })}
            </select>
            <select className="col realm" onChange={this.handleRealmChange}>
              <option>Select a Realm</option>
              {realmList.map(realm => {
                return (
                  <option key={realm.id} value={realm.slug}>{realm.name}</option>
                )
              })}
            </select>
            <input className="col characterM" type="text" placeholder="Character Name" onChange={this.handleCharacterChange}/>
            <button className="col" onClick={this.getProfile}>Search</button>
          </div>
          <div className="row">
            {searchError ?
              <div className="alert alert-danger" role="alert">
                {searchError}
              </div>
              : null
            }
          </div>
          <div className="row filters">
            <div className="col">
              <button className="btn btn-primary" onClick={this.listChoice} value="all">All</button>
              <button className="btn btn-primary" disabled={buttonDisabled} onClick={this.listChoice} value="collected">Collected</button>
              <button className="btn btn-primary" disabled={buttonDisabled} onClick={this.listChoice} value="uncollected">Not Collected</button>
            </div>
          </div>
          <div className="row mounts">
            <h1 className="source">Mounts</h1>
            {mountDisplay.map(mount => {
                  if (mount.mount_detail.should_exclude_if_uncollected) {
                    return null;
                  }

                  return (
                    <div key={mount.id} className="col mb-3">                           
                      <div className="card" style={{width: 14 + 'rem'}}>
                        <img src={`https://render.worldofwarcraft.com/us/npcs/zoom/creature-display-${mount.mount_detail.creature_displays}.jpg`} className="card-img-top" alt="Oooo Pretty" onError={(e) => {
                          e.target.src = myImg
                          e.target.alt = 'No Image Found'
                        }} />
                        <div className="card-body">
                          <h5 className="card-title">{mount.name}</h5>
                          {mount.mount_detail.source ? <p className="card-text">Source: {mount.mount_detail.source.name.en_US}</p> : <p className="card-text">Source: Unknown</p>}
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