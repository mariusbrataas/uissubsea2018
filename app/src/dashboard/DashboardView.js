// Importing dependencies
import React, {Component} from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import {
  ButtonGroup,
  Card,
  CardDeck,
  CardBody,
  CardTitle,
  Button
} from 'reactstrap';
import ReactSimpleRange from 'react-simple-range';
import JoyStick from 'react-joystick'
import ThrustersLoad from './ThrustersLoad.js';

/*
CONTENTS
- Helper
  - DefaultDashboardConfig
- Main export
  - DashboardView
*/

// Helper: DefaultDashboardConfig
export function DefaultDashboardConfig(sendThrusts, camPosListener, leftStickListener, rightStickListener, centerStickListener) {
  return {
    title: 'Dashboard',
    subtitle: 'Not finished.',
    camPosListener: camPosListener,
    leftStickListener: leftStickListener,
    rightStickListener: rightStickListener,
    centerStickListener: centerStickListener,
    loads: {
      flv: 0.0,
      frv: 0.0,
      alv: 0.0,
      arv: 0.0,
      flh: 0.0,
      frh: 0.0,
      alh: 0.0,
      arh: 0.0
    },
    sendThrusts: sendThrusts,
  }
};

// Main export: DashboardView
export const DashboardView = (props) => {
  const data = props.data;
  const loads = props.data.loads;
  return (
    <div style={{padding:'20px'}}>
      <h1 className="display-3">Dashboard</h1>
      <CardDeck>
        <Card>
          <ThrustersLoad
            sendThrusts={data.sendThrusts}
            flv={loads.flv}
            frv={loads.frv}
            alv={loads.alv}
            arv={loads.arv}
            flh={loads.flh}
            frh={loads.frh}
            alh={loads.alh}
            arh={loads.arh}
          />
        </Card>
        <Card style={{minHeight:'60vh'}}>
          <JoyStick
            options={
              {
                mode: 'static',
                catchDistance: 1000,
                color: 'gray',
                position: {left: '50%', top: '50%'},
                lockX: true
              }
            }
            containerStyle={
              {
                position: 'absolute',
                height: '100%',
                width: '100%',
              }
            }
            managerListener={data.camPosListener} />
        </Card>
        <Card>
          <CardBody>
            <CardTitle>Quick access</CardTitle>
            <div style={{padding:'2px 2px'}}>
              <ButtonGroup>
                <Button
                  color='danger'
                  onClick={() => {props.serverdata.sock.emit('Lights off', true)}}
                >Lights off</Button>
                <Button
                  color='primary'
                  onClick={() => {props.serverdata.sock.emit('Lights on', true)}}
                >Lights on</Button>
              </ButtonGroup>
            </div>
            <div style={{padding:'2px 2px'}}>
              <ButtonGroup>
                <Button
                  color='danger'
                  onClick={() => {props.serverdata.sock.emit('Toggle motorcontrollers', true)}}
                >Thrusters off</Button>
                <Button
                  color='primary'
                  onClick={() => {props.serverdata.sock.emit('Toggle motorcontrollers', false)}}
                >Thrusters on</Button>
              </ButtonGroup>
            </div>
            <div style={{padding:'2px 2px'}}>
              <ButtonGroup>
                <Button
                  color='danger'
                  onClick={() => {props.serverdata.sock.emit('Soundbox off')}}
                >Nicolai off</Button>
                <Button
                  color='primary'
                  onClick={() => {props.serverdata.sock.emit('Soundbox on')}}
                >Nicolai on</Button>
              </ButtonGroup>
            </div>
            <div style={{padding:'2px 2px'}}>
              <ButtonGroup>
                <Button
                  color='danger'
                  onClick={() => {props.serverdata.sock.emit('Precision off')}}
                >Precision off</Button>
                <Button
                  color='primary'
                  onClick={() => {props.serverdata.sock.emit('Precision on')}}
                >Precision on</Button>
              </ButtonGroup>
            </div>
            <div style={{padding:'2px 2px', marginTop:'30px'}}>
              <p>Precision: {props.serverdata.configs.canbus.multiplier}</p>
              <ButtonGroup>
                {
                  [0.1,0.2,0.3,0.4,0.5,0.6].map((mult) => {
                    return (
                      <Button
                        color='primary'
                        onClick={() => {
                          var newdata = props.serverdata.getState()
                          newdata.configs.canbus.normalMult = mult;
                          newdata.sock.emit('upstreamConfigs', newdata.configs);
                        }}
                      >{mult}</Button>
                    )
                  })
                }
              </ButtonGroup>
            </div>
          </CardBody>
        </Card>
      </CardDeck>
    </div>
  )
}
