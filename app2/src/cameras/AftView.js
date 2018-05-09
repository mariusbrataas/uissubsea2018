import React from 'react';
import 'bootstrap/dist/css/bootstrap.css';

export function DefaultAftConfig(updateState) {
  return {
    updateState: updateState,
  }
};

export const AftView = (props) => {
  const data = props.data;
  return (
    <div style={{padding:'20px'}}>
      <h1 className="display-3">{"Aft view"}</h1>
    </div>
  )
}
