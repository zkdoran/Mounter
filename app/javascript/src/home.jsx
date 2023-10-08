import React from 'react';
import ReactDOM from 'react-dom';
import { handleErrors, safeCredentials } from '@utils/fetchHelper';
import 'dotenv/config';
import myImg from '../../assets/images/no-image-icon-23500.jpg';

import './home.scss';
import { Dropdown } from 'bootstrap';

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
    source: ['Achievement', 'Discovery', 'Drop', 'In-Game Shop', 'Profession', 'Promotion', 'Quest', 'Trading Card Game', 'Vendor', 'World Event'],
    searchError: '',
    listChoice: '',
    mountDisplay: [],
    sourceFilter: '',
    raceFilter: '',
    classFilter: '',
    factionFilter: '',
    isUseable: false,
    userRoster: [],
    username: '',
    password: '',
    email: '',
    error: '',
    loggedIn: false,
  }

  componentDidMount() {
    this.getRealms();
    this.getMounts();
    this.getRaces();
    this.getClasses();
  }

  // This function is to get the realms for the realm list
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

  // This function is to get the mounts for the mount list
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

  // This function is to get the playable races for the races list
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

  // This function is to get the playable classes for the classes list
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

  // This function is to get the character's profile
  getProfile = () => {
    // Reset searchError so it doesn't persist
    this.setState({
      searchError: '',
    })

    // If any of the fields are blank, display an error
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
      .then(() => this.mountListSplit())
      .catch(error => {
        console.log(error)
        this.setState({
          searchError: 'Character not found',
        })
      })
  }

  // This function is to split the mounts into two additional lists: collected and uncollected
  mountListSplit = () => {
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

  handleSourceChange = (e) => {
    this.setState({
      sourceFilter: e.target.value,
    })
  }

  handleRaceChange = (e) => {
    this.setState({
      raceFilter: e.target.value,
    })
  }

  handleClassChange = (e) => {
    this.setState({
      classFilter: e.target.value,
    })
  }

  handleFactionChange = (e) => {
    this.setState({
      factionFilter: e.target.value,
    })
  }

  handleIsUseableChange = (event) => {
    const { checked } = event.target;
    this.setState({ 
      isUseable: checked 
    });
  };

  handleChange = (e) => {
    this.setState({
      [e.target.name]: e.target.value,
    })
  }

  listChoice = (e) => {
    this.setState({
      listChoice: e.target.value,
    }, () => this.mountSwitch());
  }
  
  // This function is to switch the realm list based on the user's region
  // The default is blank so there is no realm list until the user selects a region
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

  // I combined both the filter and list switch into one function since I wanted to reduce setState calls
  // I was having issues with state syncing up with the DOM, so I decided to combine them into one function
  mountSwitch = () => {
    const { mounts, collectedMounts, uncollectedMounts, listChoice, sourceFilter, raceFilter, classFilter, factionFilter, isUseable, characterData } = this.state;
    let subMountDisplay = [];

    // If no listChoice is selected, default to all
    // If listChoice is selected, filter mounts based on listChoice
    switch(listChoice) {
      case 'all':
        subMountDisplay = mounts;
        break;
      case 'collected':
        subMountDisplay = collectedMounts;
        break;
      case 'uncollected':
        subMountDisplay = uncollectedMounts;
        break;
      default:
        subMountDisplay = mounts;
    }

    // If isUseable is true, filter mounts based on characterData
    if (isUseable) {
      const useableMounts = subMountDisplay.filter(mount => {
        let raceCondition = true;
        let classCondition = true;
        let factionCondition = true;

        if ('requirements' in mount.mount_detail) {
          if ('races' in mount.mount_detail.requirements) {
            raceCondition = mount.mount_detail.requirements.races === characterData.race
          } else {
            raceCondition = false;
          }
          
          if ('classes' in mount.mount_detail.requirements) {
            classCondition = mount.mount_detail.requirements.classes === characterData.character_class
          } else {
            classCondition = false;
          }

          if ('faction' in mount.mount_detail.requirements) {
            factionCondition = mount.mount_detail.requirements.faction === characterData.faction
          } else {
            factionCondition = false;
          }
        }

        return raceCondition && classCondition && factionCondition;
      });

      subMountDisplay = useableMounts;
    }

    // If no filters are selected, display mounts based on switch and isUseable
    if (sourceFilter === '' && raceFilter === '' && classFilter === '' && factionFilter === '') {
      this.setState({
        mountDisplay: subMountDisplay,
      })
      return;
    }
  
    // If filters are selected, filter mounts based on filters
    const filteredMounts = subMountDisplay.filter(mount => {
      let sourceCondition = true;
      let raceCondition = true;
      let classCondition = true;
      let factionCondition = true;
  
      // Every mount has a source, so no need to check if source exists
      if (sourceFilter !== '') {
        sourceCondition = mount.mount_detail.source === sourceFilter;
      }
  
      // Not all mounts have requirements, so check if requirements exists
      // There are three possible keys under requirements, so check if each key exists then filter if they exist
      if (raceFilter !== '') {
        if ('requirements' in mount.mount_detail && 'races' in mount.mount_detail.requirements) {
          raceCondition = mount.mount_detail.requirements.races === raceFilter;
        } else {
          raceCondition = false;
        }
      } else {
        if ('requirements' in mount.mount_detail && 'races' in mount.mount_detail.requirements) {
          raceCondition = false;
        }
      }
  
      if (classFilter !== '') {
        if ('requirements' in mount.mount_detail && 'classes' in mount.mount_detail.requirements) {
          classCondition = mount.mount_detail.requirements.classes === classFilter;
        } else {
          classCondition = false;
        }
      } else {
        if ('requirements' in mount.mount_detail && 'classes' in mount.mount_detail.requirements) {
          classCondition = false;
        }
      }

      if (factionFilter !== '') {
        if ('requirements' in mount.mount_detail && 'faction' in mount.mount_detail.requirements) {
          factionCondition = mount.mount_detail.requirements.faction === factionFilter;
        } else {
          factionCondition = false;
        }
      } else {
        if ('requirements' in mount.mount_detail && 'faction' in mount.mount_detail.requirements) {
          factionCondition = false;
        }
      }
  
      // Since some mounts can have multiple requirements, the mount must fulfill them all or it will not be displayed
      return sourceCondition && raceCondition && classCondition && factionCondition;
    });

    subMountDisplay = filteredMounts;

    this.setState({
      mountDisplay: subMountDisplay,
    })
    
    return;
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
          error: 'Error authenticating',
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

  addCharacter = () => {
    const { userRegion, userRealm, userCharacter } = this.state;

    fetch('/api/characters', safeCredentials({
      method: 'POST',
      body: JSON.stringify({
        character: {
          region: userRegion,
          realm: userRealm,
          name: userCharacter,
        }
      })
    }))
      .then(handleErrors)
      .then(response => {
        if (response.success) {
          this.setState({
            userRoster: response.characters,
          })
        }
      })
      .catch(error => {
        console.log(error);
        this.setState({
          error: 'Error adding character',
        })
      })
  }

  render() {
    const { region, races, classes, mountDisplay, buttonDisabled, realmList, searchError, source, isUseable, loggedIn, error, username, email, password, userRoster } = this.state;
    
    return (
      <div className="home">
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
            <button className="col" onClick={this.addCharacter}>Add to Roster</button>
          </div>
          <div className="row">
            {searchError ?
              <div className="alert alert-danger" role="alert">
                {searchError}
              </div>
              : <br />
            }
          </div>
          <div className="row filters">
            <div className="col">
              <button className="btn btn-primary" onClick={this.listChoice} value="all">All</button>
              <button className="btn btn-primary" disabled={buttonDisabled} onClick={this.listChoice} value="collected">Collected</button>
              <button className="btn btn-primary" disabled={buttonDisabled} onClick={this.listChoice} value="uncollected">Not Collected</button>
            </div>
            <div className="col">
              <select className="col faction" onChange={this.handleFactionChange}>
                <option>Select a Faction</option>
                <option value="Alliance">Alliance</option>
                <option value="Horde">Horde</option>
              </select>
            </div>
            <div className="col">
              <select className="col source" onChange={this.handleSourceChange}>
                <option>Select a Source</option>
                {source.map(source => {
                  return (
                    <option key={source} value={source}>{source}</option>
                  )
                })}
              </select>
            </div>
            <div className="col">
              <select className="col races" onChange={this.handleRaceChange}>
                <option>Select a Race</option>
                {races.map(race => {
                  return (
                    <option key={race.id} value={race.name}>{race.name}</option>
                  )
                })}
              </select>
            </div>
            <div className="col">
              <select className="col classes" onChange={this.handleClassChange}>
                <option>Select a Class</option>
                {classes.map(playableClass => {
                  return (
                    <option key={playableClass.id} value={playableClass.name}>{playableClass.name}</option>
                  )
                })}
              </select>
            </div>
            <div className="col">
              <input type="checkbox" disabled={buttonDisabled} checked={isUseable} onChange={this.handleIsUseableChange} />
              <label className="useablecheck" htmlFor="useable">Is Usable?</label>
            </div>
            <button className="col" onClick={this.mountSwitch}>Filter</button>
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
                          {mount.mount_detail.source ? <p className="card-text">Source: {mount.mount_detail.source}</p> : <p className="card-text">Source: Unknown</p>}
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