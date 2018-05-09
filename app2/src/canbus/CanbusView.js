import React from 'react';
import 'bootstrap/dist/css/bootstrap.css';

export function DefaultCanbusConfig(updateState) {
  return {
    updateState: updateState,
  }
};

export const CanbusView = (props) => {
  const data = props.data;
  return (
    <div style={{padding:'20px'}}>
      <h1 className="display-3">{"CANbus view"}</h1>
    </div>
  )
}
