import React from 'react';
import ReactDOM from 'react-dom';
import { handleErrors, safeCredentials } from '@utils/fetchHelper';
import Layout from '@comps/layout/layout';
import Filters from '@comps/filters/filters';
import Toast from '@comps/toast/toast';
import Mounts from '@comps/mounts/mounts';

import '@src/home.scss';

class Home extends React.Component {
  state = {
    realms: {},
    region: ['us', 'eu', 'kr', 'tw'],
    characterData: {},
    realmList: [],
    userRegion: '',
    userRealm: '',
    userCharacter: '',
    profileError: '',
    characterError: '',
    showToast: false,
    profileSuccess: false,
    characterSuccess: false,
    successMessage: '',
    loadedCharacter: {
      region: '',
      realm: '',
      name: '',
    },
    mountDisplay: [],
    skeleton: true,
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
    const { userRegion, userRealm, userCharacter } = this.state;

    // Reset the error and success messages
    this.setState({
      profileError: '',
      profileSuccess: false,
      characterError: '',
      characterSuccess: false,
      successMessage: '',     
    })

    // If any of the fields are blank, display an error
    if (userRegion === '' || userRealm === '' || userCharacter === '') {
      this.setState({
        profileError: 'Please fill out all fields',
      }, () => {
        this.showToast();
      })
      return;
    }

    fetch(`/api/calls/profile/${userRegion}/${userRealm}/${userCharacter}`)
      .then(response => {
        if (!response.ok) {
          return response.json().then(error => {
            throw error;
          })
        }
        return response.json();
      })
      .then(data => {
        this.setState({
          characterData: data,
          successMessage: "Character found!",
          loadedCharacter: {
            region: userRegion,
            realm: userRealm,
            name: userCharacter,
          }
        })
      })
      .then(() => {
        this.setState({
          profileSuccess: true,
          userRegion: '',
          userRealm: '',
          userCharacter: '',
        }, () => {
          this.showToast();
          document.getElementById("userRegion").value = ""; // Reset the select input
          document.getElementById("userRealm").value = "";  // Reset the select input
          document.getElementById("userCharacter").value = "";  // Reset the select input
        })
      })
      .catch(error => {
        this.setState({
          profileError: error.error,
        }, () => {
          this.showToast();
        })
      })
  }

  // Add a character to the user's roster
  addCharacter = () => {
    const { userRegion, userRealm, userCharacter } = this.state;

    // Reset the error and success messages
    this.setState({
      characterError: '',
      characterSuccess: false,
      profileError: '',
      profileSuccess: false,
    })

    // If any of the fields are blank, display an error
    if (userRegion === '' || userRealm === '' || userCharacter === '') {
      this.setState({
        characterError: 'Please fill out all fields',
      }, () => {
        this.showToast();
      })
      return;
    }

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
      .then(response => {
        if (!response.ok) {
          return response.json().then(error => {
            throw error;
          })
        }
        return response.json();
      })
      .then(response => {
        if (response.success) {
          this.setState({
            successMessage: response.message,
            userRoster: response.characters,
          })
        }
      })
      .then(() => {
        this.setState({
          characterSuccess: true,
        }, () => {
          this.showToast();
        })
      })
      .catch(error => {
        this.setState({
          characterError: error.error,
        }, () => {
          this.showToast();
        })
      })
  }

  // Combined handleChange for inputs
  handleChange = (e) => {
    const { name, value } = e.target;
     
    this.setState({
      [name]: value,
    }, () => {
      if (name === 'userRegion') {
        this.realmSwitch();
      }
    })
  }

  // Function to search for a character from the user's roster
  updateSelectedCharacter = (character) => {
    console.log(character);
    this.setState({
      userRegion: character.region,
      userRealm: character.realm,
      userCharacter: character.name,
    }, () => {
      this.getProfile();
    })
  }

  updateSkeletonAndMountDisplay = (skeleton, mountDisplay) => {
    this.setState({
      skeleton: skeleton,
      mountDisplay: mountDisplay,
    })
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
  
  showToast = () => {
    this.setState({
      showToast: true,
    })

    setTimeout(this.hideToast, 5000);
  }

  hideToast = () => {
    this.setState({
      showToast: false,
    })
  }

  scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  render() {
    const { region, characterData, realmList, profileSuccess, profileError, characterSuccess, characterError, showToast, successMessage, userRoster, loadedCharacter, mountDisplay, skeleton } = this.state;
    
    return (
        <Layout userRoster={userRoster} updateSelectedCharacter={this.updateSelectedCharacter}>
          <div className="container mx-auto px-4">
            <div className="hero min-h-[50%] bg-base-200 py-4 mb-5">
              <div className="hero-content text-center">
                <div className="max-w-md">
                  <h1 className="text-5xl font-bold">Welcome to Mounter!</h1>
                  <p className="py-6">World of Warcraft® mount finder and filter site.</p>
                </div>
              </div>
            </div>
            <div className="flex space-x-4 justify-between py-5">
              <div className="dropdowns flex space-x-4 justify-start py-5">
                <div className="join">
                  <select id="userRegion" className="region select select-secondary" name="userRegion" onChange={this.handleChange}>
                    <option value="">Select a Region</option>
                    {region.map(region => {
                      return (
                        <option key={region} value={region}>{region.toUpperCase()}</option>
                      )
                    })}
                  </select>
                  <select id="userRealm" className="realm select select-secondary w-44" name="userRealm" onChange={this.handleChange}>
                    <option value="">Select a Realm</option>
                    {realmList.map(realm => {
                      return (
                        <option key={realm.id} value={realm.slug}>{realm.name}</option>
                      )
                    })}
                  </select>
                  <input id="userCharacter" type="text" placeholder="Character Name" className="input input-bordered input-secondary w-52 max-w-xs" name="userCharacter" onChange={this.handleChange} />
                </div>
                <button className="btn btn-primary rounded-lg" onClick={this.getProfile}>
                  <svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 512 512">{/* <!--! Font Awesome Free 6.4.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2023 Fonticons, Inc. --> */}<path d="M416 208c0 45.9-14.9 88.3-40 122.7L502.6 457.4c12.5 12.5 12.5 32.8 0 45.3s-32.8 12.5-45.3 0L330.7 376c-34.4 25.2-76.8 40-122.7 40C93.1 416 0 322.9 0 208S93.1 0 208 0S416 93.1 416 208zM208 352a144 144 0 1 0 0-288 144 144 0 1 0 0 288z"/></svg>  
                  Search
                </button>
                <button className="btn btn-secondary rounded-lg" onClick={this.addCharacter}>Add to Roster</button>
              </div>           
              <div className="divider divider-horizontal"></div>
              <Filters characterData={characterData} updateSkeletonAndMountDisplay={this.updateSkeletonAndMountDisplay} />
            </div>
            <Mounts mountDisplay={mountDisplay} skeleton={skeleton} />
          </div>
          {profileError !== "" && showToast && (
            <Toast message={profileError} type="error" />
          )}
          {profileSuccess && showToast && (
            <Toast message={successMessage} type="success" />
          )}
          {characterError !== "" && showToast && (
            <Toast message={characterError} type="error" />
          )}
          {characterSuccess && showToast && (
            <Toast message={successMessage} type="success" />
          )}
          {profileSuccess && showToast && (
            <div className="toast toast-start z-50">
              <div className="alert alert-info">
                <span>Character Loaded</span>
                <span>Region: {loadedCharacter.region.toUpperCase()}</span>
                <span>Realm: {loadedCharacter.realm.charAt(0).toUpperCase() + loadedCharacter.realm.slice(1)}</span>
                <span>Name: {loadedCharacter.name.charAt(0).toUpperCase() + loadedCharacter.name.slice(1)}</span>
              </div>
            </div>
          )}
          <button
            ref={this.scrollToTopButtonRef}
            className="fixed bottom-12 right-4 p-2 bg-secondary text-white rounded-full cursor-pointer hover:bg-blue-600"
            onClick={this.scrollToTop}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M5 10l7-7m0 0l7 7m-7-7v18"
              />
            </svg>
          </button>
        </Layout>
    )
  }
}

document.addEventListener('DOMContentLoaded', () => {
  ReactDOM.render(
    <Home />,
    document.body.appendChild(document.createElement('div')),
  )
})