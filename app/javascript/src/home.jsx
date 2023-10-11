import React from 'react';
import ReactDOM from 'react-dom';
import { handleErrors, safeCredentials } from '@utils/fetchHelper';
import 'dotenv/config';
import Layout from '@src/layout';
import Filters from '@src/filters';

import './home.scss';

class Home extends React.Component {
  state = {
    realms: {},
    region: ['us', 'eu', 'kr', 'tw'],
    characterData: {},
    buttonDisabled: true,
    realmList: [],
    userRegion: '',
    userRealm: '',
    userCharacter: '',
    profileError: '',
  }

  componentDidMount() {
    this.getRealms();
  }

  // This function is to get the realms for the realm list
  getRealms = () => {
    fetch('/api/calls/realms/')
      .then(handleErrors)
      .then(data => {
        this.setState({
          realms: data,
        })
      })
  }

  // This function is to get the character's profile
  getProfile = () => {
    // Reset profileError so it doesn't persist
    this.setState({
      profileError: '',
    })

    // If any of the fields are blank, display an error
    if (this.state.userRegion === '' || this.state.userRealm === '' || this.state.userCharacter === '') {
      this.setState({
        profileError: 'Please fill out all fields',
      })
      return;
    }

    fetch(`/api/calls/profile/${this.state.userRegion}/${this.state.userRealm}/${this.state.userCharacter}`)
      .then(handleErrors)
      .then(data => {
        this.setState({
          characterData: data,
          buttonDisabled: false,
        })
      })
      .then(() => this.mountListSplit())
      .catch(error => {
        console.log(error)
        this.setState({
          profileError: 'Character not found',
        })
      })
  }

  // Add a character to the user's roster
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

  // Combined handleChange for inputs
  handleChange = (e) => {
    const { name, value } = e.target;
     
    this.setState({
      [name]: value,
    }); 
  
    if (name === 'userRegion') {
      this.realmSwitch();
    }
  }
  
  // This function is to switch the realm list based on the user's region
  // The default is blank so there is no realm list until the user selects a region
  realmSwitch = () => {
    const { realms, userRegion } = this.state;

    const us_realms = realms.us;
    const eu_realms = realms.eu;
    const kr_realms = realms.kr;
    const tw_realms = realms.tw;
    let subRealmList = [];

    switch(userRegion) {
      case 'us':
        subRealmList = us_realms;
        break;
      case 'eu':
        subRealmList = eu_realms;
        break;
      case 'kr':
        subRealmList = kr_realms;
        break;
      case 'tw':
        subRealmList = tw_realms;
        break;
      default:
        subRealmList;
    }

    this.setState({
      realmList: subRealmList,
    })
  }

  render() {
    const { region, characterData, realmList, profileError } = this.state;
    
    return (
      <div className="home">
        <Layout>
          <div className="">
            <div className="">
              <div className="banner">
                <h1>Mounter</h1>
                <p>Mounter is a web application that allows you to track your mounts in World of Warcraft.</p>
              </div>
            </div>
            <div className="dropdowns">
              <select className="region" onChange={this.handleChange}>
                <option>Select a Region</option>
                {region.map(region => {
                  return (
                    <option key={region} name="userRegion" value={region}>{region.toUpperCase()}</option>
                  )
                })}
              </select>
              <select className="realm" onChange={this.handleChange}>
                <option>Select a Realm</option>
                {realmList.map(realm => {
                  return (
                    <option key={realm.id} name="userRealm" value={realm.slug}>{realm.name}</option>
                  )
                })}
              </select>
              <input className="character" type="text" placeholder="Character Name" name="userCharacter" onChange={this.handleChange}/>
              <button className="" onClick={this.getProfile}>Search</button>
              <button className="" onClick={this.addCharacter}>Add to Roster</button>
            </div>
            <div className="">
              {profileError ?
                <div className="" role="alert">
                  {profileError}
                </div>
                : <br />
              }
            </div>
            <Filters characterData={characterData} />
          </div>
        </Layout>
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