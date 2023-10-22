import React, { Component } from 'react';
import myImg from '@images/no-image-icon-23500.jpg';
import wowheadIcon from '@images/wowhead-icon.png';
import Skeleton from '@comps/skeleton/skeleton';

class Mounts extends Component {

  render () {
    const { mountDisplay, skeleton } = this.props;

    return (
      <React.Fragment>
        <div className="mounts mb-5">
          <h1 className="text-4xl font-bold mb-4">
            Displaying {mountDisplay.filter(mount => !mount.mount_detail.should_exclude_if_uncollected).length} Mounts
          </h1>
          <div className="grid lg:grid-cols-4 gap-12">
            {skeleton &&
              <Skeleton />
            }
            {!skeleton && mountDisplay.length === 0 &&
              <div className="card w-96 h-50 bg-base-100 shadow-xl image-full">
                <figure>
                  <img src={myImg} className="object-fill" alt="Oooo Pretty" />
                </figure>                           
                <div className="card-body">
                  <h2 className="card-title">No Mounts Found</h2>                     
                </div>
              </div>
            }
            {mountDisplay.map(mount => {
              if (mount.mount_detail.should_exclude_if_uncollected) {
                return null;
              }

              return (
                <div key={mount.id} className="card w-96 h-50 bg-base-100 shadow-xl image-full">
                  <figure>
                    <img src={`https://render.worldofwarcraft.com/us/npcs/zoom/creature-display-${mount.mount_detail.creature_displays}.jpg`} className="object-fill" alt="Oooo Pretty" onError={(e) => {
                      e.target.src = myImg
                      e.target.alt = 'No Image Found'
                    }} />
                  </figure>                           
                  <div className="card-body">
                    <h2 className="card-title">{mount.name}</h2>                     
                    <div className="absolute bottom-0 flex justify-between items-center left-0 right-0 p-3">
                      <div>
                        {mount.mount_detail.source ? 
                          <div className="badge badge-secondary mr-2">{mount.mount_detail.source}</div>
                          : 
                          <p className="badge badge-ghost mr-2">Source: Unknown</p>
                        }
                        {mount.mount_detail.faction && mount.mount_detail.faction === 'Alliance' &&
                          <div className="badge badge-info">{mount.mount_detail.faction}</div>
                        }
                        {mount.mount_detail.faction && mount.mount_detail.faction === 'Horde' &&
                          <div className="badge badge-error">{mount.mount_detail.faction}</div>
                        } 
                      </div>
                      <a 
                        className="bg-neutral-focus text-neutral-content rounded-full w-8" 
                        href={`https://www.wowhead.com/mount/${mount.id}`} 
                        target="_blank"
                      >
                        <img src={wowheadIcon} className="wowhead-icon" alt="Wowhead Icon" />
                      </a>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>          
        </div>
      </React.Fragment>
    )
  }
}

export default Mounts;