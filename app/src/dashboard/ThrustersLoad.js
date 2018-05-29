import React from 'react';
import '../App.css';

import CircularProgressbar from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';

function calcColors(percentage) {
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
      textForPercentage={(percentage) => {return `${Math.round(props.percentage*100)}%`}}
      counterClockwise={props.percentage < 0 ? true : false}
      styles={{
        path: {stroke: loadColor, transition:'0.0s'},
        text: {fill: loadColor}
      }}
      strokeWidth={8}
    />
  )
}

export const ThrustersLoad = (props) => {
  return (
    <div>
      <div style={{width:'100%', overflow:'hidden'}}>
        <div style={{width:'25%', float:'left'}}><div style={{padding:'1px'}}><CircleLoad percentage={props.flh}/></div></div>
        <div style={{width:'25%', float:'left'}}><div style={{padding:'1px'}}></div></div>
        <div style={{width:'25%', float:'left'}}><div style={{padding:'1px'}}></div></div>
        <div style={{width:'25%', float:'left'}}><div style={{padding:'1px'}}><CircleLoad percentage={props.frh}/></div></div>
      </div>
      <div style={{width:'100%', overflow:'hidden'}}>
        <div style={{width:'25%', float:'left'}}><div style={{padding:'1px'}}></div></div>
        <div style={{width:'25%', float:'left'}}><div style={{padding:'1px'}}><CircleLoad percentage={props.flv}/></div></div>
        <div style={{width:'25%', float:'left'}}><div style={{padding:'1px'}}><CircleLoad percentage={props.frv}/></div></div>
        <div style={{width:'25%', float:'left'}}><div style={{padding:'1px'}}></div></div>
      </div>
      <div style={{width:'100%', overflow:'hidden'}}>
        <div style={{width:'25%', float:'left'}}><div style={{padding:'1px'}}></div></div>
        <div style={{width:'25%', float:'left'}}><div style={{padding:'1px'}}><CircleLoad percentage={props.alv}/></div></div>
        <div style={{width:'25%', float:'left'}}><div style={{padding:'1px'}}><CircleLoad percentage={props.arv}/></div></div>
        <div style={{width:'25%', float:'left'}}><div style={{padding:'1px'}}></div></div>
      </div>
      <div style={{width:'100%', overflow:'hidden'}}>
        <div style={{width:'25%', float:'left'}}><div style={{padding:'1px'}}><CircleLoad percentage={props.alh}/></div></div>
        <div style={{width:'25%', float:'left'}}><div style={{padding:'1px'}}></div></div>
        <div style={{width:'25%', float:'left'}}><div style={{padding:'1px'}}></div></div>
        <div style={{width:'25%', float:'left'}}><div style={{padding:'1px'}}><CircleLoad percentage={props.arh}/></div></div>
      </div>
    </div>
  )
}

export default ThrustersLoad
