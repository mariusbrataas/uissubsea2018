import React from 'react';
import 'bootstrap/dist/css/bootstrap.css';

export function DefaultFrontcenterConfig(updateState) {
  return {
    updateState: updateState,
  }
};

export const FrontcenterView = (props) => {
  const data = props.data;
  return (
    <div style={{padding:'20px'}}>
      <h1 className="display-3">{"Front center view"}</h1>
    </div>
  )
}
