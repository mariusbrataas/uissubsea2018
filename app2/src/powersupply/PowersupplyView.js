import React from 'react';
import 'bootstrap/dist/css/bootstrap.css';

export function DefaultPowersupplyConfig(updateState) {
  return {
    updateState: updateState,
  }
};

export const PowersupplyView = (props) => {
  const data = props.data;
  return (
    <div style={{padding:'20px'}}>
      <h1 className="display-3">{"Power supply view"}</h1>
    </div>
  )
}
