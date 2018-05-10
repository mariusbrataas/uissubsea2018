import React from 'react';
import 'bootstrap/dist/css/bootstrap.css';

export function DefaultFrontleftConfig(updateState) {
  return {
    updateState: updateState,
  }
};

export const FrontleftView = (props) => {
  const data = props.data;
  return (
    <div style={{padding:'20px'}}>
      <h1 className="display-3">{"Front left view"}</h1>
    </div>
  )
}
