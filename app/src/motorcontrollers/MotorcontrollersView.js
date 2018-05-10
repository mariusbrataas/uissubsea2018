import React from 'react';
import 'bootstrap/dist/css/bootstrap.css';

export function DefaultMotorcontrollersConfig(updateState) {
  return {
    updateState: updateState,
  }
};

export const MotorcontrollersView = (props) => {
  const data = props.data;
  return (
    <div style={{padding:'20px'}}>
      <h1 className="display-3">{"Motor controllers view"}</h1>
    </div>
  )
}
