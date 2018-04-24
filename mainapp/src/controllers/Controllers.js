// Basic imports
import React from 'react';

// 3rd part libraries
import Dropdown from 'react-dropdown'
import 'react-dropdown/style.css'

// Main controllers view handler
const Controllers = (props) => {
  return (
    <div>
      <h2>Controllers</h2>
        <Rendercontrollers
          data = {props.data}
          mets = {props.mets}
        />
      <p></p>
    </div>
  )
}

// Single controller renderer
const Controller = (props) => {
  return (
    <div className='controllersSection'>
      <h3>{props.contId}</h3>
      <p>Index: {props.contIndex}</p>
      <Dropdown
        options={Object.keys(props.data.designations)}
        onChange={(option) => {
          props.data.indexDesignations[props.contIndex] = option.label;
          Object.keys(props.data.indexDesignations).map((index) => {
            if ((index != props.contIndex) && (props.data.indexDesignations[index] == option.label)) {
              props.data.indexDesignations[index] = null;
            }
          })
          props.mets.updateState(props.data);
        }}
        value={props.data.indexDesignations[props.contIndex]}
        placeholder="Select an option"
      />
    </div>
  )
}

// All controllers renderer
const Rendercontrollers = (props) => {
  return (
    props.data.gamepadIds.map((padId, index) => (
      <Controller
        data = {props.data}
        mets = {props.mets}
        contId = {padId}
        contIndex = {index}
      />
    ))
  )
};

export default Controllers
