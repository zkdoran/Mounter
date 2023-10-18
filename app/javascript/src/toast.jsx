import React, { Component } from 'react';

class Toast extends Component {
  render () {
    const { message, type } = this.props;

    return (
      <div className="toast toast-end z-50">
        <div className={`alert ${type === "error" ? "alert-error" : "alert-success"}`}>
          <span>{message}</span>
        </div>
      </div>
    );
  }
}

export default Toast;