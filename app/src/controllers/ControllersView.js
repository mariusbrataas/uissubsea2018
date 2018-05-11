// Basic imports
import React from 'react';

// 3rd party libraries
import 'bootstrap/dist/css/bootstrap.css';
import { Card, Button, Jumbotron, CardTitle, CardSubtitle, CardGroup, ButtonGroup, ButtonDropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';

// Local libraries
import TranslateXboxAxis from './TranslateXbox.js';
import TransferToThrusters from './TransferToThrusters.js';

export function DefaultControllerConfig (index, id) {
  return {
    axes: {
      designators: {
        LLR: {current:'Roll', reverse:false, engage:true, isOpen:false},
        LUD: {current:'Pitch', reverse:false, engage:true, isOpen:false},
        RLR: {current:'Lateral', reverse:false, engage:true, isOpen:false},
        RUD: {current:'Longitudinal', reverse:false, engage:true, isOpen:false},
        LT:  {current:'Yaw', reverse:true, engage:true, isOpen:false},
        RT:  {current:'Yaw', reverse:false, engage:true, isOpen:false}
      },
      options: ['Pitch','Roll','Yaw','Longitudinal','Lateral','Vertical'],
      title: 'Axis designations'
    },
    buttons: {
      designators: {
        A:        {current:'Grab', engage:true, isOpen:false},
        B:        {current:'Release', engage:true, isOpen:false},
        X:        {current:'Rotate manip right', engage:true, isOpen:false},
        Y:        {current:'Rotate manip left', engage:true, isOpen:false},
        LS:       {current:'Lights on', engage:true, isOpen:false},
        RS:       {current:'Lights off', engage:true, isOpen:false},
        UP:       {current:'Go up', engage:true, isOpen:false},
        DOWN:     {current:'Go down', engage:true, isOpen:false},
        LEFT:     {current:'Engage auto depth', engage:true, isOpen:false},
        RIGHT:    {current:'Disengage auto depth', engage:true, isOpen:false},
        LB:       {current:'Go left', engage:true, isOpen:false},
        RB:       {current:'Go right', engage:true, isOpen:false},
        SELECT:   {current:'Engage auto level', engage:true, isOpen:false},
        MENU:     {current:'Disengage auto level', engage:true, isOpen:false},
      },
      options: [
        'Nothing',
        'Grab',
        'Release',
        'Rotate manip right',
        'Rotate manip left',
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
        'Go right',
        'Camera up',
        'Camera down',
        'Camera left',
        'Camera right'
      ],
      title: 'Button designations'
    },
    engage: false,
    index: index,
    designation: null,
    id: id ? id : 'XBOX Controller',
    translator: TranslateXboxAxis,
    transfer: TransferToThrusters
  };
};

export function DefaultControllersConfig(updateState) {
  return {
    controllers: {
      0:DefaultControllerConfig(0)
    },
    updateState: updateState,
  }
}


export const ControllerSettingsCard = (props) => {
  const contData = props.data.controllers[props.contKey];
  return (
    <CardGroup>
      <Card body outline color={contData.engage ? 'primary' : 'secondary'}>
        <CardTitle>{contData.id}</CardTitle>
        <CardSubtitle>Controller index: {contData.index}</CardSubtitle>
        <div style={{padding: '20px 0px'}}>
          <Button color={contData.engage ? 'primary' : 'secondary'} onClick={(e) => {
            props.data.controllers[props.contKey].engage ^= true;
            props.data.updateState(props.data)
          }}>{contData.engage ? 'Disengage' : 'Engage'}</Button>
        </div>
      </Card>
      <Card body outline color={contData.engage ? 'primary' : 'secondary'}>
        <CardSubtitle>Axis designations</CardSubtitle>
        {
          Object.keys(contData.axes.designators).map((designator) => {
            return (
              <div style={{padding:'7px 0px', margin:'0px'}}>
                <h6>{designator}</h6>
                <ButtonGroup size='sm'>
                  <ButtonDropdown
                    size='sm'
                    isOpen={contData.axes.designators[designator].isOpen}
                    toggle={() => {
                      props.data.controllers[props.contKey].axes.designators[designator].isOpen ^= true;
                      props.data.updateState(props.data);
                    }}
                    >
                    <DropdownToggle caret size='sm'>
                      {props.data.controllers[props.contKey].axes.designators[designator].current}
                    </DropdownToggle>
                    <DropdownMenu right size='sm' style={{overflowY:'hidden'}}>
                      {
                        contData.axes.options.map((option) => {
                          return (
                            <DropdownItem onClick={() => {
                              props.data.controllers[props.contKey].axes.designators[designator].current = option;
                              props.data.updateState(props.data)
                            }}>
                            {option}</DropdownItem>
                          )
                        })
                      }
                    </DropdownMenu>
                  </ButtonDropdown>
                  <Button size='sm' color={contData.axes.designators[designator].engage ? 'primary' : 'danger'} onClick={(e) => {
                    props.data.controllers[props.contKey].axes.designators[designator].engage ^= true;
                    props.data.updateState(props.data)
                  }}>{contData.axes.designators[designator].engage ? 'Disengage' : 'Engage'}</Button>
                  <Button size='sm' color={contData.axes.designators[designator].reverse ? 'danger' : 'primary'} onClick={(e) => {
                    props.data.controllers[props.contKey].axes.designators[designator].reverse ^= true;
                    props.data.updateState(props.data)
                  }}>{contData.axes.designators[designator].reverse ? 'Reversed' : 'Straight'}</Button>
                </ButtonGroup>
              </div>
            )
          })
        }
      </Card>
      <Card body outline color={contData.engage ? 'primary' : 'secondary'} style={{height:'65vh', overflow:'scroll'}}>
        <CardSubtitle>Button designations</CardSubtitle>
        {
          Object.keys(contData.buttons.designators).map((designator) => {
            return (
              <div style={{padding:'7px 0px', margin:'0px', fontSize:'1.0em'}}>
                <h6>{designator}</h6>
                <ButtonGroup size='sm'>
                  <ButtonDropdown
                    size='sm'
                    isOpen={contData.buttons.designators[designator].isOpen}
                    toggle={() => {
                      props.data.controllers[props.contKey].buttons.designators[designator].isOpen ^= true;
                      props.data.updateState(props.data);
                    }}
                    >
                    <DropdownToggle caret  size='sm'>
                      {props.data.controllers[props.contKey].buttons.designators[designator].current}
                    </DropdownToggle>
                    <DropdownMenu right style={{height:'300px', overflowY:'scroll'}}>
                      {
                        contData.buttons.options.map((option) => {
                          return (
                            <DropdownItem onClick={() => {
                              props.data.controllers[props.contKey].buttons.designators[designator].current = option;
                              props.data.updateState(props.data)
                            }}>
                            {option}</DropdownItem>
                          )
                        })
                      }
                    </DropdownMenu>
                  </ButtonDropdown>
                  <Button size='sm' color={contData.buttons.designators[designator].engage ? 'primary' : 'danger'} onClick={(e) => {
                    props.data.controllers[props.contKey].buttons.designators[designator].engage ^= true;
                    props.data.updateState(props.data)
                  }}>{contData.buttons.designators[designator].engage ? 'Disengage' : 'Engage'}</Button>
                </ButtonGroup>
              </div>
            )
          })
        }
      </Card>
    </CardGroup>
  )
}


export const ControllersView = (props) => {
  return (
    <div style={{padding:'20px', width:'auto'}}>
      <h1 className="display-3">Controllers</h1>
      {
        Object.keys(props.data.controllers).map((key) => {
          return (
            <div style={{padding:'10px'}}>
              <ControllerSettingsCard
                contKey={key}
                data={props.data}
              />
            </div>
          )
        })
      }
    </div>
  )
}
