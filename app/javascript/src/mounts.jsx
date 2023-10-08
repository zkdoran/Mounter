import React, { Component } from 'react';
import myImg from '../../assets/images/no-image-icon-23500.jpg';

class Mounts extends Component {

  render () {
    const { mountDisplay } = this.props;

    return (
      <React.Fragment>
        <div className="row mounts">
          <h1 className="source">Mounts</h1>
          {mountDisplay.map(mount => {
                // Some mounts are no longer collectible, so exclude them from the list
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
      </React.Fragment>
    )
  }
}

export default Mounts;