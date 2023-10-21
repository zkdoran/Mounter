import React, { Component } from 'react';

class Skeleton extends Component {
  render() {
    const numberOfSkeletons = 20;

    return (
      <React.Fragment>
        {Array.from({ length: numberOfSkeletons }, (_, index) => (
          <div key={index} className="card w-96 h-96 bg-base-100 shadow-xl image-full animate-pulse">
            <figure>
              <div className="skeleton w-full h-40"></div>
            </figure>
            <div className="card-body">
              <h2 className="card-title">Loading...</h2>
              <div className="absolute bottom-0 flex justify-between items-center left-0 right-0 p-3">
                <div>
                  <div className="skeleton w-20 h-5"></div>
                  <div className="skeleton w-16 h-5"></div>
                </div>
                <div className="skeleton w-8 h-8 rounded-full"></div>
              </div>
            </div>
          </div>
        ))}
      </React.Fragment>
    );
  }
}

export default Skeleton;
