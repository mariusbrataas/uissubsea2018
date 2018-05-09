import React from 'react';
import './App.css';
import Dropdown from 'react-dropdown'
import 'react-dropdown/style.css'

export function emptyXboxConfig (index, id) {
  return {
    axes: {
      designators: {
        LLR: {current:'Roll', reverse:false, engage:true},
        LUD: {current:'Pitch', reverse:false, engage:true},
        RLR: {current:'Lateral', reverse:false, engage:true},
        RUD: {current:'Longitudinal', reverse:false, engage:true},
        LT:  {current:'Yaw', reverse:true, engage:true},
        RT:  {current:'Yaw', reverse:false, engage:true}
      },
      options: ['Pitch','Roll','Yaw','Longitudinal','Lateral', 'Vertical'],
      title: 'Axis designations'
    },
    buttons: {
      designators: {
        A:        {current:'Grab', engage:true},
        B:        {current:'Release', engage:true},
        X:        {current:'Rotate manip clockwise', engage:true},
        Y:        {current:'Rotate manip counterclockwise', engage:true},
        LS:       {current:'Lights on', engage:true},
        RS:       {current:'Lights off', engage:true},
        UP:       {current:'Go up', engage:true},
        DOWN:     {current:'Go down', engage:true},
        LEFT:     {current:'Engage auto depth', engage:true},
        RIGHT:    {current:'Disengage auto depth', engage:true},
        LB:       {current:'Go left', engage:true},
        RB:       {current:'Go right', engage:true},
        SELECT:   {current:'Engage auto level', engage:true},
        MENU:     {current:'Disengage auto level', engage:true},
      },
      options: [
        'Nothing',
        'Grab',
        'Release',
        'Rotate manip clockwise',
        'Rotate manip counterclockwise',
        'Toggle lights',
        'Lights on',
        'Lights off',
        'Engage auto depth',
        'Disengage auto depth',
        'Engage auto level',
        'Disengage auto level',
        'Go up',
        'Go down',
        'Go left',
        'Go right'
      ],
      title: 'Button designations'
    },
    engage: false,
    index: index,
    id: id ? id : 'Xbox Controller'
  };
};

const Designator = (props) => {
  return (
    <div style={{display: 'table-row'}}>
      <div style={{display: 'table-cell', padding:'0px 10px'}}><p>{props.designator}</p></div>
      <div style={{display: 'table-cell'}}>
        <Dropdown
          options={props.lib[props.category].options}
          onChange={(option) => {
            props.lib[props.category].designators[props.designator].current = option.value;
            props.updateController(props.lib)
          }}
          value={props.lib[props.category].designators[props.designator].current}
          placeholder="Select an option"
        />
      </div>
      <div style={{display: 'table-cell', padding:'0px 10px'}}><p>Engage</p></div>
      <div style={{display: 'table-cell', padding:'0px 1px'}}>
        <input
          name="isGoing"
          type="checkbox"
          onChange={(option) => {
            props.lib[props.category].designators[props.designator].engage ^= true;
            props.updateController(props.lib)
          }}
          checked={props.lib[props.category].designators[props.designator].engage}
        />
      </div>
      {(props.lib[props.category].designators[props.designator].reverse != null) ?
        <div style={{display: 'table-row'}}>
          <div style={{display: 'table-cell', padding:'0px 10px'}}><p>Reverse</p></div>
          <div style={{display: 'table-cell', padding:'0px 1px'}}>
            <input
              name="isGoing"
              type="checkbox"
              onChange={(option) => {
                props.lib[props.category].designators[props.designator].reverse ^= true;
                props.updateController(props.lib)
              }}
              checked={props.lib[props.category].designators[props.designator].reverse}
            />
          </div>
        </div>
        : null
      }
    </div>
  )
}

const Designations = (props) => {
  return (
    <div className='designationsColumn'>
      <h3>{props.lib[props.category].title ? props.lib[props.category].title : 'Designations'}</h3>
      {
        Object.keys(props.lib[props.category].designators).map((designator) => {
          return(
            <Designator
              designator={designator}
              updateController={props.updateController}
              lib={props.lib}
              category={props.category}
            />
          );
        })
      }
    </div>
  );
};

const ControllerViews = (props) => {
  return (
    <div style={{display: 'table-row'}}>
      {
        Object.keys(props.conts).map((key) => {
          return (
            <div style={{display: 'table-row'}}>
              <div className='designationsColumn' style={{paddingRight: '20px'}}>
                <h2>{props.conts[key].id}</h2>
                <p>Index: {props.conts[key].index}</p>
                <p>Engage</p>
                <input
                  name="isGoing"
                  type="checkbox"
                  onChange={(option) => {
                    props.conts[key].engage ^= true;
                    props.updateController(props.conts[key])
                  }}
                  checked={props.conts.engage}
                />
              </div>
              {
                props.conts[key].engage ?
                <div>
                <Designations lib={props.conts[key]} category={'axes'} updateController={props.updateController} />
                <Designations lib={props.conts[key]} category={'buttons'} updateController={props.updateController} />
                </div>
                : null
              }
            </div>
          )
        })
      }
    </div>
  );
};

export default ControllerViews;
