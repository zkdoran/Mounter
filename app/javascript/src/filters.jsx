import React, { Component } from 'react';
import Mounts from '@src/mounts';
import { handleErrors } from '@utils/fetchHelper';


class Filters extends Component {
  state = {
    mounts: [],
    classes: [],
    races: [],
    characterData: this.props.characterData,
    listChoice: '',
    factionFilter: '',
    sourceFilter: '',
    raceFilter: '',
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
    this.getRaces();
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

  // This function is to get the playable races for the races list
  getRaces = () => {
    fetch('/api/calls/races')
      .then(handleErrors)
      .then(data => {
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

  render() {
    const { mountDisplay, buttonDisabled, source, races, classes, isUseable } = this.state;

    return (
      <React.Fragment>
        <div className="row filters">
          <div className="col">
            <button className="btn btn-primary" onClick={this.listChoice} name="listChoice" value="all">All</button>
            <button className="btn btn-primary" disabled={buttonDisabled} onClick={this.handleChange} name="listChoice" value="collected">Collected</button>
            <button className="btn btn-primary" disabled={buttonDisabled} onClick={this.handleChange} name="listChoice" value="uncollected">Not Collected</button>
          </div>
          <div className="col">
            <select className="col faction" onChange={this.handleChange}>
              <option>Select a Faction</option>
              <option name="factionFilter" value="Alliance">Alliance</option>
              <option name="factionFilter" value="Horde">Horde</option>
            </select>
          </div>
          <div className="col">
            <select className="col source" onChange={this.handleChange}>
              <option>Select a Source</option>
              {source.map(source => {
                return (
                  <option key={source} name="sourceFilter" value={source}>{source}</option>
                )
              })}
            </select>
          </div>
          <div className="col">
            <select className="col races" onChange={this.handleChange}>
              <option>Select a Race</option>
              {races.map(race => {
                return (
                  <option key={race.id} name="raceFilter" value={race.name}>{race.name}</option>
                )
              })}
            </select>
          </div>
          <div className="col">
            <select className="col classes" onChange={this.handleChange}>
              <option>Select a Class</option>
              {classes.map(playableClass => {
                return (
                  <option key={playableClass.id} name="classFilter" value={playableClass.name}>{playableClass.name}</option>
                )
              })}
            </select>
          </div>
          <div className="col">
            <input type="checkbox" disabled={buttonDisabled} checked={isUseable} onChange={this.handleIsUseableChange} />
            <label className="useablecheck" htmlFor="useable">Is Usable?</label>
          </div>
          <button className="col" onClick={this.mountListMaker}>Filter</button>
        </div>
        <Mounts mountDisplay={mountDisplay} />
      </React.Fragment>
    )
  }
}

export default Filters;