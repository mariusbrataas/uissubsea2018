import React from 'react';
import '../App.css';

import CircularProgressbar from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';

function calcColors(percentage) {
  if (percentage == 0) {return 'rgba(0,100,100,1)'}
  const f = Math.pow(Math.abs(percentage), 1/2);
  const r = Math.round((percentage >= 0) * f * 230) + 25;
  const g = Math.round((1 - f) * 155) + 100;
  const b = Math.round((percentage < 0) * f * 230) + 25;
  return `rgba(${r},${g},${b},1)`
}

const CircleLoad = (props) => {
  const loadColor = calcColors(props.percentage);
  return(
    <CircularProgressbar
      percentage={Math.abs(props.percentage)*100}
      textForPercentage={(percentage) => {
        if (props.label && percentage == 0) {return props.label}
        return `${Math.round(props.percentage*100)}%`
      }}
      counterClockwise={props.percentage < 0 ? true : false}
      styles={{
        path: {stroke: loadColor, transition:'0.0s'},
        text: {fill: loadColor}
      }}
      strokeWidth={8}
    />
  )
}

function testThrust(sendThrusts, thruster) {
  var thrusts = {
    flv:0,
    frv:0,
    alv:0,
    arv:0,
    flh:0,
    frh:0,
    alh:0,
    arh:0,
  }
  thrusts[thruster] = 1;
  sendThrusts(thrusts)
  setTimeout(() => {
    thrusts[thruster] = 0
    sendThrusts(thrusts)
  }, 300)
}

export const ThrustersLoad = (props) => {
  return (
    <div>
      <div style={{width:'100%', overflow:'hidden'}}>
        <div style={{width:'25%', float:'left'}} onClick={(e) => {testThrust(props.sendThrusts, 'flh')}}><div style={{padding:'1px'}}><CircleLoad percentage={props.flh} label='FLH'/></div></div>
        <div style={{width:'25%', float:'left'}}><div style={{padding:'1px'}}></div></div>
        <div style={{width:'25%', float:'left'}}><div style={{padding:'1px'}}></div></div>
        <div style={{width:'25%', float:'left'}} onClick={(e) => {testThrust(props.sendThrusts, 'frh')}}><div style={{padding:'1px'}}><CircleLoad percentage={props.frh} label='FRH'/></div></div>
      </div>
      <div style={{width:'100%', overflow:'hidden'}}>
        <div style={{width:'25%', float:'left'}}><div style={{padding:'1px'}}></div></div>
        <div style={{width:'25%', float:'left'}} onClick={(e) => {testThrust(props.sendThrusts, 'flv')}}><div style={{padding:'1px'}}><CircleLoad percentage={props.flv} label='FLV'/></div></div>
        <div style={{width:'25%', float:'left'}} onClick={(e) => {testThrust(props.sendThrusts, 'frv')}}><div style={{padding:'1px'}}><CircleLoad percentage={props.frv} label='FRV'/></div></div>
        <div style={{width:'25%', float:'left'}}><div style={{padding:'1px'}}></div></div>
      </div>
      <div style={{width:'100%', overflow:'hidden'}}>
        <div style={{width:'25%', float:'left'}}><div style={{padding:'1px'}}></div></div>
        <div style={{width:'25%', float:'left'}} onClick={(e) => {testThrust(props.sendThrusts, 'alv')}}><div style={{padding:'1px'}}><CircleLoad percentage={props.alv} label='ALV'/></div></div>
        <div style={{width:'25%', float:'left'}} onClick={(e) => {testThrust(props.sendThrusts, 'arv')}}><div style={{padding:'1px'}}><CircleLoad percentage={props.arv} label='ARV'/></div></div>
        <div style={{width:'25%', float:'left'}}><div style={{padding:'1px'}}></div></div>
      </div>
      <div style={{width:'100%', overflow:'hidden'}}>
        <div style={{width:'25%', float:'left'}} onClick={(e) => {testThrust(props.sendThrusts, 'alh')}}><div style={{padding:'1px'}}><CircleLoad percentage={props.alh} label='ALH'/></div></div>
        <div style={{width:'25%', float:'left'}}><div style={{padding:'1px'}}></div></div>
        <div style={{width:'25%', float:'left'}}><div style={{padding:'1px'}}></div></div>
        <div style={{width:'25%', float:'left'}} onClick={(e) => {testThrust(props.sendThrusts, 'arh')}}><div style={{padding:'1px'}}><CircleLoad percentage={props.arh} label='ARH'/></div></div>
      </div>
    </div>
  )
}

export default ThrustersLoad
