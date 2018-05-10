import React from 'react';
import 'bootstrap/dist/css/bootstrap.css';

export function DefaultFrontrightConfig(updateState) {
  return {
    updateState: updateState,
  }
};

export const FrontrightView = (props) => {
  const data = props.data;
  return (
    <div style={{padding:'20px'}}>
      <h1 className="display-3">{"Front right view"}</h1>
    </div>
  )
}
