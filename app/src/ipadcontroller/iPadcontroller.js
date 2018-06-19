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
import JoyStick from 'react-joystick'
import ThrustersLoad from '../dashboard/ThrustersLoad.js';

export const TouchStickView = (props) => {
  const data = props.data;
  const loads = props.data.loads;
  return (
    <div style={{padding:'20px', marginTop:'60px'}}>
      <CardDeck style={{maxHeight:'60vh'}}>
        <Card style={{minHeight:'60vh'}}>
          <JoyStick
            options={
              {
                mode: 'static',
                catchDistance: 1000,
                color: 'blue',
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
            managerListener={data.leftStickListener} />
        </Card>
        <Card style={{minHeight:'60vh', maxWidth:'200px'}}>
          <div>
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
            <Card style={{minHeight:'30vh', marginTop:'20px'}}>
              <JoyStick
                options={
                  {
                    mode: 'static',
                    catchDistance: 1000,
                    color: 'black',
                    position: {left: '50%', top: '50%'},
                  }
                }
                containerStyle={
                  {
                    position: 'absolute',
                    height: '100%',
                    width: '100%',
                  }
                }
                managerListener={data.centerStickListener} />
            </Card>
          </div>
        </Card>
        <Card style={{minHeight:'60vh'}}>
          <JoyStick
            options={
              {
                mode: 'static',
                catchDistance: 1000,
                color: 'red',
                position: {left: '50%', top: '50%'},
              }
            }
            containerStyle={
              {
                position: 'absolute',
                height: '100%',
                width: '100%',
              }
            }
            managerListener={data.rightStickListener} />
        </Card>
      </CardDeck>
    </div>
  )
}
