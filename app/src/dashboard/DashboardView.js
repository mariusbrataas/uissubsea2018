// Importing dependencies
import React, {Component} from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import {
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
export function DefaultDashboardConfig(sendThrusts, camPosListener, leftStickListener, rightStickListener) {
  return {
    title: 'Dashboard',
    subtitle: 'Not finished.',
    camPosListener: camPosListener,
    leftStickListener: leftStickListener,
    rightStickListener: rightStickListener,
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
                catchDistance: 4,
                color: 'gray',
                position: {left: '50%', top: '50%'}
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
              <Button
                onClick={() => {props.serverdata.sock.emit('Toggle lights', true)}}
              >Toggle lights</Button>
            </div>
            <div style={{padding:'2px 2px'}}>
              <Button
                onClick={() => {props.serverdata.sock.emit('Toggle Alex', true)}}
              >Toggle Alex</Button>
            </div>
          </CardBody>
        </Card>
      </CardDeck>
    </div>
  )
}
