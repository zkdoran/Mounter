import React, { Component } from 'react';
import Mounts from '@src/mounts';
import { handleErrors } from '@utils/fetchHelper';


class Filters extends Component {
  state = {
    mounts: [],
    classes: [],
    characterData: this.props.characterData,
    listChoice: '',
    factionFilter: '',
    sourceFilter: '',
    classFilter: '',
    isUseable: false,
    buttonDisabled: true,
    mountDisplay: [],
    collectedMounts: [],
    uncollectedMounts: [],
    source: ['Achievement', 'Discovery', 'Drop', 'In-Game Shop', 'Profession', 'Promotion', 'Quest', 'Trading Card Game', 'Vendor', 'World Event'],
  }

  componentDidMount() {
    this.getMounts();
    this.getClasses();
  }

  // This function is to get the mounts for the mount list
  getMounts = () => {
    fetch('/api/calls/mounts')
      .then(handleErrors)
      .then(data => {
        this.setState({
          mounts: data,
        })
      })
      .then(() => {
        this.mountListMaker()
      })
  }

  // This function is to get the playable classes for the classes list
  getClasses = () => {
    fetch('/api/calls/classes')
      .then(handleErrors)
      .then(data => {
        this.setState({
          classes: data,
        })
      })
  }

  // Combined handleChange for checkboxes and inputs
  handleChange = (e) => {
    const { name, value, type, checked } = e.target;
  
    if (type === 'checkbox') {
      this.setState({
        [name]: checked,
      });
    } else {
      this.setState({
        [name]: value,
      }); 
    }

    if (name === 'listChoice') {
      this.mountListMaker();
    }
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
  
    this.mountListMaker();
  }

  // I combined both the filter and list switch into one function since I wanted to reduce setState calls
  // I was having issues with state syncing up with the DOM, so I decided to combine them into one function
  mountListMaker = () => {
    const { mounts, collectedMounts, uncollectedMounts, listChoice, sourceFilter, classFilter, factionFilter, isUseable, characterData } = this.state;
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
    if (sourceFilter === '' && classFilter === '' && factionFilter === '') {
      this.setState({
        mountDisplay: subMountDisplay,
      })
      return;
    }
  
    // If filters are selected, filter mounts based on filters
    const filteredMounts = subMountDisplay.filter(mount => {
      let sourceCondition = true;
      let classCondition = true;
      let factionCondition = true;
  
      // Every mount has a source, so no need to check if source exists
      if (sourceFilter !== '') {
        sourceCondition = mount.mount_detail.source === sourceFilter;
      }
  
      // Not all mounts have requirements, so check if requirements exists
      // There are three possible keys under requirements, so check if each key exists then filter if they exist. Removed race since it's a low amount of race specific mounts.  
      if (classFilter !== '') {
        if ('requirements' in mount.mount_detail && 'classes' in mount.mount_detail.requirements) {
          classCondition = mount.mount_detail.requirements.classes === classFilter;
        } else {
          classCondition = false;
        }
      }

      if (factionFilter !== '') {
        if ('requirements' in mount.mount_detail && 'faction' in mount.mount_detail.requirements) {
          factionCondition = mount.mount_detail.requirements.faction === factionFilter;
        } else {
          factionCondition = false;
        }
      }
  
      // Since some mounts can have multiple requirements, the mount must fulfill them all or it will not be displayed
      return sourceCondition && classCondition && factionCondition;
    });

    subMountDisplay = filteredMounts;

    this.setState({
      mountDisplay: subMountDisplay,
    })
    
    return;
  }

  render() {
    const { mountDisplay, buttonDisabled, source, races, classes, isUseable } = this.state;

    return (
      <React.Fragment>
        <div className="filters dropdowns flex space-x-4 justify-center py-5">
          <div className="join">
            <input 
              className="join-item btn" 
              onChange={this.handleChange} 
              type="radio" name="listChoice" 
              value="all" 
              aria-label="List All" 
            />
            <input 
              className="join-item btn" 
              onChange={this.handleChange} 
              disabled={buttonDisabled} 
              type="radio" 
              name="listChoice" 
              value="collected" 
              aria-label="List Collected" 
            />
            <input 
              className="join-item btn" 
              onChange={this.handleChange} 
              disabled={buttonDisabled} 
              type="radio" 
              name="listChoice" 
              value="uncollected" 
              aria-label="List Uncollected" 
            />
          </div>
            <select className="faction select select-accent" name="factionFilter" onChange={this.handleChange}>
              <option value="">Select a Faction</option>
              <option value="Alliance">Alliance</option>
              <option value="Horde">Horde</option>
            </select>
            <select className="source select select-accent" name="sourceFilter" onChange={this.handleChange}>
              <option value="">Select a Source</option>
              {source.map(source => {
                return (
                  <option key={source} value={source}>{source}</option>
                )
              })}
            </select>
            <select className="classes select select-accent" name="classFilter" onChange={this.handleChange}>
              <option value="">Select a Class</option>
              {classes.map(playableClass => {
                return (
                  <option key={playableClass.id} value={playableClass.name}>{playableClass.name}</option>
                )
              })}
            </select>
          <div className="form-control">
            <label className="cursor-pointer label">
              <span className="label-text mr-2">Is Usable?</span>
              <input type="checkbox"
                name="isUseable"
                onChange={this.handleChange} 
                checked={isUseable} 
                className="checkbox checkbox-accent" />
            </label>
          </div>
          <button className="btn btn-primary rounded-lg" onClick={this.mountListMaker}>
          <svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 512 512">{/* <!--! Font Awesome Free 6.4.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2023 Fonticons, Inc. --> */}<path d="M3.9 54.9C10.5 40.9 24.5 32 40 32H472c15.5 0 29.5 8.9 36.1 22.9s4.6 30.5-5.2 42.5L320 320.9V448c0 12.1-6.8 23.2-17.7 28.6s-23.8 4.3-33.5-3l-64-48c-8.1-6-12.8-15.5-12.8-25.6V320.9L9 97.3C-.7 85.4-2.8 68.8 3.9 54.9z"/></svg>
            Filter
          </button>
        </div>
        <Mounts mountDisplay={mountDisplay} />
      </React.Fragment>
    )
  }
}

export default Filters;