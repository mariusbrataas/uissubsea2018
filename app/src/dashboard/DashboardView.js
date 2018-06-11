import React from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import {
  Card,
  CardDeck
} from 'reactstrap';
import ReactSimpleRange from 'react-simple-range';

import ThrustersLoad from './ThrustersLoad.js';

export function DefaultDashboardConfig(sendThrusts) {
  return {
    title: 'Dashboard',
    subtitle: 'Not finished.',
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
    sendThrusts: sendThrusts
  }
};

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
        <Card>
          <div style={{width:'300px',height:'300px', padding:'10px'}}>
            <div style={{width:'100%', height:'100%', padding:'50% 0px'}}>
              <ReactSimpleRange
                min={0}
                max={100}
                label={true}
                trackColor={'#00abff'}
                thumbColor={'#004fff'}
                value={props.serverdata.campan*100}
                onChange={(data) => {
                  var serverdata = props.serverdata.getState()
                  serverdata.campan = data.value/100;
                  serverdata.updateState(serverdata)
                  props.serverdata.sock.emit('gpio',{cmd:'pan',data:serverdata.campan})}
                }/>
            </div>
            <div style={{width:'100%', height:'100%', marginTop:'-100%'}}>
              <ReactSimpleRange
                min={0}
                max={100}
                label={true}
                trackColor={'#00abff'}
                thumbColor={'#004fff'}
                vertical={true}
                verticalSliderHeight={'100%'}
                value={props.serverdata.camtilt*100}
                onChange={(data) => {
                  var serverdata = props.serverdata.getState()
                  serverdata.camtilt = data.value/100;
                  serverdata.updateState(serverdata)
                  serverdata.sock.emit('gpio',{cmd:'tilt',data:serverdata.camtilt})}
                }/>
            </div>
          </div>
        </Card>
        <Card>
        </Card>
      </CardDeck>
    </div>
  )
}
