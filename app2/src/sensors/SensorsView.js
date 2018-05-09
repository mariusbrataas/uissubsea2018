import React from 'react';
import 'bootstrap/dist/css/bootstrap.css';

export function DefaultSensorsConfig(updateState) {
  return {
    updateState: updateState,
  }
};

export const SensorsView = (props) => {
  const data = props.data;
  return (
    <div style={{padding:'20px'}}>
      <h1 className="display-3">{"Sensors view"}</h1>
    </div>
  )
}
